#!/usr/bin/env node
/*
 * Headless checks for index.html.
 *
 *   node tools/verify.js
 *
 * The page is a single self-contained file with no build step and no test
 * runner, so this script loads the page's <script> block into a stubbed DOM
 * and exercises the real renderScoreSVG against the real note data. It exists
 * because a wrong notehead is silent: the page renders something plausible
 * either way, and only arithmetic catches a note drawn on the wrong line.
 *
 * Exits non-zero on the first failing check so it can gate a commit.
 */

const fs = require('fs');
const path = require('path');

const PAGE = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(PAGE, 'utf8');

/* ---- load the page script under a stub DOM ---------------------------- */

const rendered = {};
const stubEl = (id) => ({
  set innerHTML(v) { rendered[id] = v; },
  get innerHTML() { return rendered[id]; },
  set innerText(v) {},
  classList: { add() {}, remove() {} },
  style: {}, offsetLeft: 0, scrollTo() {},
});

global.document = {
  getElementById: stubEl,
  querySelectorAll: () => [],
  createElement: () => ({ classList: {}, style: {} }),
};
global.window = {};

const script = html.match(/<script>\n([\s\S]*?)\n  <\/script>/);
if (!script) fail('could not find the page <script> block in index.html');

const page = new Function(
  script[1] + '\n;return { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo };'
)();
const { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo } = page;

/* ---- harness ---------------------------------------------------------- */

let failures = 0;
function check(label, ok, detail) {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label}${ok || !detail ? '' : '\n        ' + detail}`);
  if (!ok) failures++;
}
function fail(msg) { console.error('verify.js: ' + msg); process.exit(2); }

/* geometry constants mirrored from renderScoreSVG */
const LINE_SPACING = 10;
const TOP_MARGIN = 50;
const LINE_Y1 = TOP_MARGIN + 4 * LINE_SPACING;

const CLEFS = ['treble', 'bass'];

/* ---- 1. every physical key is teachable in both clefs ------------------ */

for (const clef of CLEFS) {
  const missing = keyboardKeys.filter(k => !notesData[clef].some(n => n.key === k.key));
  check(
    `${clef}: all ${keyboardKeys.length} keyboard keys have staff data`,
    missing.length === 0,
    missing.length ? 'missing: ' + missing.map(m => m.noteName).join(' ') : ''
  );
}

/* ---- an independent oracle ---------------------------------------------
 * Derived from the note NAME and music theory alone. It must never consult
 * note.step or note.acc: checking the renderer against the same field that
 * feeds it proves nothing, since a wrong value changes both sides together.
 */

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const STAFF_BOTTOM = { treble: { letter: 'E', octave: 4 }, bass: { letter: 'G', octave: 2 } };

const diatonic = (letter, octave) => LETTERS.indexOf(letter) + 7 * octave;

function expectedStep(noteName, clef) {
  const [, letter, sharp, octave] = noteName.match(/^([A-G])(#?)(\d)$/);
  const base = STAFF_BOTTOM[clef];
  return diatonic(letter, Number(octave)) - diatonic(base.letter, base.octave);
}
const expectedSharp = (noteName) => noteName.includes('#');

function expectedLedgerCount(step) {
  if (step <= -2) return Math.floor(-step / 2);
  if (step >= 10) return Math.floor((step - 10) / 2) + 1;
  return 0;
}

/* ---- 2. each key renders where music theory says it should ------------- */

let drawn = 0, accidentals = 0;
for (const clef of CLEFS) {
  const wrongY = [], wrongAcc = [], clipped = [], wrongLedgers = [];

  for (const k of keyboardKeys) {
    const note = notesData[clef].find(n => n.key === k.key);
    if (!note) continue;

    renderScoreSVG('probe', [{ key: k.key }], clef, 340, 160);
    const svg = rendered.probe;

    const head = svg.match(/translate\(([-\d.]+), ([-\d.]+)\) rotate/);
    if (!head) { wrongY.push(note.noteName + ' (no notehead)'); continue; }

    const step = expectedStep(note.noteName, clef);
    const wantY = LINE_Y1 - step * (LINE_SPACING / 2);
    if (Math.abs(parseFloat(head[2]) - wantY) > 0.01) {
      wrongY.push(`${note.noteName}: drawn y=${head[2]}, theory says ${wantY} (step ${step})`);
    }

    const hasGlyph = svg.includes('♯');
    if (expectedSharp(note.noteName) !== hasGlyph) {
      wrongAcc.push(`${note.noteName}: glyph drawn=${hasGlyph}, name says sharp=${expectedSharp(note.noteName)}`);
    }
    if (expectedSharp(note.noteName)) accidentals++;

    // count what was actually drawn: ledgers use a different stroke to staff lines
    const ledgersDrawn = (svg.match(/stroke="#334155"/g) || []).length;
    const wantLedgers = expectedLedgerCount(step);
    if (ledgersDrawn !== wantLedgers) {
      wrongLedgers.push(`${note.noteName} (step ${step}): drew ${ledgersDrawn} ledger line(s), theory says ${wantLedgers}`);
    }

    const vb = svg.match(/viewBox="0 ([-\d.]+) \d+ ([-\d.]+)"/);
    if (vb) {
      const top = parseFloat(vb[1]);
      const bottom = top + parseFloat(vb[2]);
      const ys = [...svg.matchAll(/y1?="([-\d.]+)"/g)]
        .map(m => parseFloat(m[1]))
        .concat(parseFloat(head[2]));
      if (Math.min(...ys) < top || Math.max(...ys) > bottom) {
        clipped.push(`${note.noteName}: content [${Math.min(...ys)}, ${Math.max(...ys)}] vs viewBox [${top}, ${bottom}]`);
      }
    }
    drawn++;
  }

  check(`${clef}: noteheads land where music theory puts them`, wrongY.length === 0, wrongY.join('\n        '));
  check(`${clef}: sharp glyph matches the note name`, wrongAcc.length === 0, wrongAcc.join('\n        '));
  check(`${clef}: ledger line count matches theory`, wrongLedgers.length === 0, wrongLedgers.join('\n        '));
  check(`${clef}: fitted viewBox contains every drawn element`, clipped.length === 0, clipped.join('\n        '));
}

/* ---- 3. the stored step agrees with theory ----------------------------- */

for (const clef of CLEFS) {
  const bad = notesData[clef]
    .filter(n => n.step !== expectedStep(n.noteName, clef))
    .map(n => `${n.noteName}: step=${n.step}, theory says ${expectedStep(n.noteName, clef)}`);
  check(`${clef}: stored step agrees with the diatonic formula`, bad.length === 0, bad.join('\n        '));

  const accBad = notesData[clef]
    .filter(n => Boolean(n.acc) !== expectedSharp(n.noteName))
    .map(n => `${n.noteName}: acc=${n.acc}`);
  check(`${clef}: stored accidental agrees with the note name`, accBad.length === 0, accBad.join('\n        '));
}

/* ---- 4. an unknown key must refuse to draw, not guess ------------------ */

let logged = 0;
const realError = console.error;
console.error = () => logged++;
renderScoreSVG('probe', [{ key: 'zz/9' }], 'treble', 340, 160);
console.error = realError;
check('unknown key logs an error and draws nothing', logged === 1,
      logged === 0 ? 'it drew something silently - the step-0 fallback is back' : `console.error called ${logged}x`);

/* ---- 5. scrollKeyboardTo asks for an id the keyboard actually renders --
 * Call the real function and record which ids it looks up, rather than
 * rebuilding the id string here - that is what let the `key-c4_4` bug hide.
 */

const keyIds = new Set(keyboardKeys.map(k => 'key-' + k.key.replace('/', '_')));
const realGetById = global.document.getElementById;

for (const anchor of ['C2', 'C3', 'C4', 'C5']) {
  const lookups = [];
  global.document.getElementById = (id) => { lookups.push(id); return stubEl(id); };
  scrollKeyboardTo(anchor);
  global.document.getElementById = realGetById;

  const keyLookups = lookups.filter(id => id.startsWith('key-'));
  const hit = keyLookups.find(id => keyIds.has(id));
  check(`scrollKeyboardTo('${anchor}') targets a key that exists`, Boolean(hit),
        `looked up ${keyLookups.length ? keyLookups.join(', ') : '(no key id at all)'} - none of which the keyboard renders`);
}

/* ---- 6. every quiz range can fill a 4-option question ------------------ */

for (const clef of CLEFS) {
  const count = t => notesData[clef].filter(n => n.tag === t).length;
  const pools = {
    'Cơ Bản': count('normal'),
    'Toàn Bộ': count('normal') + count('ledger'),
    'Nốt Thăng': count('accidental'),
  };
  const thin = Object.entries(pools).filter(([, n]) => n < 4);
  check(`${clef}: every quiz range has >= 4 notes (${Object.entries(pools).map(([k, v]) => k + '=' + v).join(', ')})`,
        thin.length === 0, thin.map(([k, v]) => `${k} has only ${v}`).join(', '));
}

/* ---- 7. spelling stays consistent with the sharp labels on the keys ---- */

const flats = keyboardKeys.filter(k => /eb\/|bb\//.test(k.key));
check('keyboard uses sharp spelling throughout', flats.length === 0,
      'flat-spelled keys: ' + flats.map(k => k.key).join(' '));

/* ---- summary ----------------------------------------------------------- */

console.log(`\n${drawn} note renders checked (${accidentals} carrying accidentals)`);
if (failures) {
  console.log(`${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('all checks passed');
