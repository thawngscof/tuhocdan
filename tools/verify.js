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
  script[1] + '\n;return { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo, DURATIONS, buildPianoKeyboard, setKeyFingering, clearKeyFingering, playTone, ENVELOPE, VOICE_PEAK, activeVoices, metronome, metronomeQueue, startMetronome, stopMetronome, setMetronomeBpm, setMetronomeBeatsPerBar, metronomeScheduler, metronomeBeatAt, METRONOME_BPM, player, sequenceSchedule, playSequence, pauseSequence, resumeSequence, stopSequence, setPlaybackBpm, playerTick };'
)();
const { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo, DURATIONS, buildPianoKeyboard, setKeyFingering, clearKeyFingering, playTone, ENVELOPE, VOICE_PEAK, activeVoices, metronome, metronomeQueue, startMetronome, stopMetronome, setMetronomeBpm, setMetronomeBeatsPerBar, metronomeScheduler, metronomeBeatAt, METRONOME_BPM, player, sequenceSchedule, playSequence, pauseSequence, resumeSequence, stopSequence, setPlaybackBpm, playerTick } = page;

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

/* ---- 0. the markup and the script agree --------------------------------
 * Everything above this point loads the page's <script> block and never looks
 * at the HTML around it, so a button wired to a function that does not exist,
 * or a lookup for an element nobody renders, would go unnoticed until someone
 * clicked it. These two halves are only joined by name, so check the names.
 */

const markup = html.replace(/<script>[\s\S]*?<\/script>/g, '');
const pageScript = script[1];

// Ids written literally in the markup. Ones built in JS carry a ${...} and
// belong to the keyboard, which section 5 already covers.
const markupIds = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]).filter(id => !id.includes('${'))
);

const declaredFns = new Set([...pageScript.matchAll(/function\s+([A-Za-z_$][\w$]*)/g)].map(m => m[1]));
const BUILTINS = new Set(['Number', 'Boolean', 'String', 'parseInt', 'parseFloat']);

const calledFromMarkup = new Set();
for (const attr of markup.matchAll(/\bon(?:click|input|change|submit|keydown)="([^"]+)"/g)) {
  for (const call of attr[1].matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)) {
    if (!BUILTINS.has(call[1])) calledFromMarkup.add(call[1]);
  }
}
const undefinedHandlers = [...calledFromMarkup].filter(fn => !declaredFns.has(fn));
check(`every handler in the markup exists in the script (${calledFromMarkup.size} checked)`,
      undefinedHandlers.length === 0,
      'the markup calls: ' + undefinedHandlers.join(', '));

const literalIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]).filter(id => !id.includes('${'));
const duplicateIds = [...new Set(literalIds.filter((id, i) => literalIds.indexOf(id) !== i))];
check('no id is used twice', duplicateIds.length === 0, duplicateIds.join(', '));

// Lookups for ids built at runtime (beat-dot-${i}, key-${...}) are covered by
// their own checks; only fixed names can be matched up here.
const lookedUp = new Set(
  [...pageScript.matchAll(/getElementById\((["'`])([a-zA-Z][\w-]*)\1\)/g)].map(m => m[2])
);
const absentIds = [...lookedUp].filter(id => !markupIds.has(id));
check(`every element the script looks up by name is in the markup (${lookedUp.size} checked)`,
      absentIds.length === 0,
      'the script looks for: ' + absentIds.join(', '));

check('the markup really was searched', calledFromMarkup.size >= 10 && lookedUp.size >= 10,
      `${calledFromMarkup.size} handler(s), ${lookedUp.size} lookup(s) - the patterns stopped matching`);

/* ---- 1. every physical key is teachable in both clefs ------------------ */

for (const clef of CLEFS) {
  const missing = keyboardKeys.filter(k => !notesData[clef].some(n => n.key === k.key));
  check(
    `${clef}: all ${keyboardKeys.length} keyboard keys have staff data`,
    missing.length === 0,
    missing.length ? 'missing: ' + missing.map(m => m.noteName).join(' ') : ''
  );
}

/* Y coordinates touched by one SVG path's "d", honouring absolute and
 * relative M/L/H/V/C commands. Control points bound a cubic, so pushing them
 * is a safe over-estimate of where the curve actually goes. An unrecognised
 * command aborts rather than misreading the numbers that follow it. */
function pathYs(d) {
  const ys = [];
  const tokens = d.match(/[a-zA-Z]|-?[\d.]+/g) || [];
  let i = 0, cmd = null, x = 0, y = 0;
  const num = () => parseFloat(tokens[i++]);

  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    if (!cmd) return ys;
    const rel = cmd === cmd.toLowerCase();
    const letter = cmd.toUpperCase();

    if (letter === 'Z') continue;
    if (i >= tokens.length) break;

    if (letter === 'M' || letter === 'L') {
      const nx = num(), ny = num();
      x = rel ? x + nx : nx;
      y = rel ? y + ny : ny;
      ys.push(y);
    } else if (letter === 'H') {
      const nx = num();
      x = rel ? x + nx : nx;
    } else if (letter === 'V') {
      const ny = num();
      y = rel ? y + ny : ny;
      ys.push(y);
    } else if (letter === 'C') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), ex = num(), ey = num();
      ys.push(rel ? y + y1 : y1, rel ? y + y2 : y2, rel ? y + ey : ey);
      x = rel ? x + ex : ex;
      y = rel ? y + ey : ey;
    } else {
      return ys;                      // unknown command: stop, do not guess
    }
  }
  return ys;
}

/* Vertical extent of everything an SVG actually draws.
 *
 * Scraping y1?="..." was not enough on three counts: it missed y2 (stem
 * tips), it read <path> flags not at all, and it ignored the radius on a
 * circle/ellipse and the height on a rect - so a rest drawn half outside the
 * viewBox would have measured as comfortably inside it. Elements inside a
 * <g transform="translate(dx, dy)"> are shifted by dy before being counted;
 * a rotate() alongside it is ignored, which understates a rotated ellipse by
 * under a pixel at the angle this page uses. */
function verticalExtent(svg) {
  const ys = [];

  // Split into (body, dy) segments so grouped elements carry their offset.
  // Groups are never nested here, so one non-greedy pass is enough.
  const segments = [];
  const groupRe = /<g transform="translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)[^"]*"[^>]*>([\s\S]*?)<\/g>/g;
  let last = 0, g;
  while ((g = groupRe.exec(svg))) {
    segments.push({ dy: 0, body: svg.slice(last, g.index) });
    segments.push({ dy: parseFloat(g[2]), body: g[3] });
    last = g.index + g[0].length;
  }
  segments.push({ dy: 0, body: svg.slice(last) });

  const attr = (tag, name) => {
    const m = tag.match(new RegExp(`\\b${name}="(-?[\\d.]+)"`));
    return m ? parseFloat(m[1]) : null;
  };

  for (const { dy, body } of segments) {
    const push = (v) => { if (v !== null && !Number.isNaN(v)) ys.push(v + dy); };

    for (const [tag] of body.matchAll(/<(?:line|rect|circle|ellipse|text)\b[^>]*>/g)) {
      if (/^<line/.test(tag)) {
        push(attr(tag, 'y1')); push(attr(tag, 'y2'));
      } else if (/^<rect/.test(tag)) {
        const y = attr(tag, 'y'), h = attr(tag, 'height');
        push(y); if (y !== null && h !== null) push(y + h);
      } else if (/^<circle/.test(tag)) {
        const cy = attr(tag, 'cy'), r = attr(tag, 'r') || 0;
        if (cy !== null) { push(cy - r); push(cy + r); }
      } else if (/^<ellipse/.test(tag)) {
        const cy = attr(tag, 'cy'), ry = attr(tag, 'ry') || 0;
        if (cy !== null) { push(cy - ry); push(cy + ry); }
      } else {
        // <text>: the baseline is the anchor, but the glyphs stand above it.
        // Treating the baseline as the whole extent let a number sit with its
        // digits outside the viewBox and still measure as inside.
        const y = attr(tag, 'y'), size = attr(tag, 'font-size') || 0;
        push(y);
        if (y !== null) push(y - size * 0.75);
      }
    }

    for (const p of body.matchAll(/<path[^>]*\bd="([^"]+)"/g)) {
      for (const v of pathYs(p[1])) push(v);
    }
  }

  return ys.length ? { top: Math.min(...ys), bottom: Math.max(...ys) } : null;
}

function viewBoxOf(svg) {
  const m = svg.match(/viewBox="0 ([-\d.]+) \d+ ([-\d.]+)"/);
  return m ? { top: parseFloat(m[1]), bottom: parseFloat(m[1]) + parseFloat(m[2]) } : null;
}

function clipReport(svg) {
  const drawn = verticalExtent(svg), box = viewBoxOf(svg);
  if (!drawn || !box) return null;
  if (drawn.top < box.top - 0.01 || drawn.bottom > box.bottom + 0.01) {
    return `drawn [${drawn.top.toFixed(1)}, ${drawn.bottom.toFixed(1)}] vs viewBox [${box.top.toFixed(1)}, ${box.bottom.toFixed(1)}]`;
  }
  return null;
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

    const clip = clipReport(svg);
    if (clip) clipped.push(`${note.noteName}: ${clip}`);
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

/* ---- 8. note durations draw the right shape ---------------------------
 * Counted off the emitted SVG. Staff lines are #64748b and ledger lines
 * #334155, so anything stroked #0f172a is a stem, and the only filled
 * <path> is a flag - the bass clef path is stroked, not filled.
 */

const countFilledHeads = (svg) => (svg.match(/<ellipse[^>]*fill="#0f172a"/g) || []).length;
const countHollowHeads = (svg) => (svg.match(/<ellipse[^>]*fill="none"/g) || []).length;
const countStems = (svg) => (svg.match(/stroke="#0f172a" stroke-width="1\.5"/g) || []).length;
const countFlags = (svg) => (svg.match(/<path d="M [^"]*" fill="#0f172a"/g) || []).length;

const SHAPES = [
  { dur: 'w', beats: 4,   heads: 'hollow', stems: 0, flags: 0, label: 'nốt tròn' },
  { dur: 'h', beats: 2,   heads: 'hollow', stems: 1, flags: 0, label: 'nốt trắng' },
  { dur: 'q', beats: 1,   heads: 'filled', stems: 1, flags: 0, label: 'nốt đen' },
  { dur: 'e', beats: 0.5, heads: 'filled', stems: 1, flags: 1, label: 'nốt móc đơn' },
];

for (const spec of SHAPES) {
  const wrong = [];
  // g/4 sits low (stem up), e/5 sits high (stem down): exercise both directions
  for (const key of ['g/4', 'e/5']) {
    renderScoreSVG('probe', [{ key, dur: spec.dur }], 'treble', 340, 160);
    const svg = rendered.probe;

    const filled = countFilledHeads(svg), hollow = countHollowHeads(svg);
    const wantFilled = spec.heads === 'filled' ? 1 : 0;
    const wantHollow = spec.heads === 'hollow' ? 1 : 0;
    if (filled !== wantFilled || hollow !== wantHollow) {
      wrong.push(`${key}: ${filled} filled / ${hollow} hollow head(s), want ${wantFilled}/${wantHollow}`);
    }
    if (countStems(svg) !== spec.stems) wrong.push(`${key}: ${countStems(svg)} stem(s), want ${spec.stems}`);
    if (countFlags(svg) !== spec.flags) wrong.push(`${key}: ${countFlags(svg)} flag(s), want ${spec.flags}`);
  }
  check(`duration '${spec.dur}' draws a ${spec.label}`, wrong.length === 0, wrong.join('\n        '));

  if (DURATIONS) {
    check(`duration '${spec.dur}' is worth ${spec.beats} beat(s)`,
          DURATIONS[spec.dur] && DURATIONS[spec.dur].beats === spec.beats,
          `table says ${DURATIONS[spec.dur] && DURATIONS[spec.dur].beats}`);
  }
}

/* ---- 9. omitting dur must not change any existing call ----------------- */

const changed = [];
for (const clef of CLEFS) {
  for (const k of keyboardKeys) {
    if (!notesData[clef].some(n => n.key === k.key)) continue;
    renderScoreSVG('probe', [{ key: k.key }], clef, 340, 160);
    const bare = rendered.probe;
    renderScoreSVG('probe', [{ key: k.key, dur: 'q' }], clef, 340, 160);
    if (bare !== rendered.probe) changed.push(`${clef} ${k.noteName}`);
  }
}
check('omitting dur renders exactly like a quarter note', changed.length === 0,
      'differs for: ' + changed.slice(0, 5).join(', '));

/* ---- 10. stems point away from the middle of the staff ----------------- */

const stemDir = (svg) => {
  const m = svg.match(/<line x1="[-\d.]+" y1="([-\d.]+)" x2="[-\d.]+" y2="([-\d.]+)" stroke="#0f172a"/);
  return m ? (parseFloat(m[2]) < parseFloat(m[1]) ? 'up' : 'down') : null;
};
const badDir = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    renderScoreSVG('probe', [{ key: note.key, dur: 'q' }], clef, 340, 160);
    const want = note.step <= 4 ? 'up' : 'down';
    const got = stemDir(rendered.probe);
    if (got !== want) badDir.push(`${clef} ${note.noteName} (step ${note.step}): stem ${got}, want ${want}`);
  }
}
check('stems point up below the middle line and down above it', badDir.length === 0,
      badDir.slice(0, 5).join('\n        '));

/* ---- 11. stems and flags stay inside the fitted viewBox ---------------- */

const escaped = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    for (const d of ['w', 'h', 'q', 'e']) {
      renderScoreSVG('probe', [{ key: note.key, dur: d }], clef, 340, 160);
      const clip = clipReport(rendered.probe);
      if (clip) escaped.push(`${clef} ${note.noteName} dur=${d}: ${clip}`);
    }
  }
}
check('every duration stays inside the fitted viewBox', escaped.length === 0,
      escaped.slice(0, 5).join(', '));

/* ---- 11b. a flag sweeps back toward the notehead ----------------------
 * A flag hangs off the stem tip and curves back alongside the stem. Drawing
 * it in the stem's own direction pushes it out past the tip, which both
 * looks wrong and is what made the stem/flag clipping checks load-bearing.
 */

const strayFlags = [];
for (const key of ['g/4', 'e/5']) {           // stem up, then stem down
  renderScoreSVG('probe', [{ key, dur: 'e' }], 'treble', 340, 160);
  const svg = rendered.probe;

  const stem = svg.match(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="[-\d.]+" y2="([-\d.]+)" stroke="#0f172a"/);
  const flag = svg.match(/<path d="([^"]+)" fill="#0f172a"/);
  if (!stem || !flag) { strayFlags.push(`${key}: stem or flag missing`); continue; }

  const headY = parseFloat(stem[2]), tipY = parseFloat(stem[3]);
  const nums = flag[1].match(/-?[\d.]+/g).map(Number);
  let y = nums[1];
  const flagYs = [y];
  for (let i = 2; i + 5 < nums.length; i += 6) {
    flagYs.push(y + nums[i + 1], y + nums[i + 3], y + nums[i + 5]);
    y += nums[i + 5];
  }
  const lo = Math.min(...flagYs), hi = Math.max(...flagYs);
  const spanLo = Math.min(headY, tipY) - 0.01, spanHi = Math.max(headY, tipY) + 0.01;
  if (lo < spanLo || hi > spanHi) {
    strayFlags.push(`${key}: flag spans [${lo.toFixed(1)}, ${hi.toFixed(1)}], stem runs [${spanLo.toFixed(1)}, ${spanHi.toFixed(1)}]`);
  }
}
check('eighth-note flags stay within the stem, curving back to the head',
      strayFlags.length === 0, strayFlags.join('\n        '));

/* ---- 12. an unknown duration must complain, not guess quietly ---------- */

let durLogged = 0;
const prevError = console.error;
console.error = () => durLogged++;
renderScoreSVG('probe', [{ key: 'g/4', dur: 'zzz' }], 'treble', 340, 160);
console.error = prevError;
check('unknown duration logs an error', durLogged === 1, `console.error called ${durLogged}x`);
check('unknown duration falls back to a quarter note',
      countFilledHeads(rendered.probe) === 1 && countStems(rendered.probe) === 1 && countFlags(rendered.probe) === 0);

/* ---- 13. rests ---------------------------------------------------------
 * A rest carries a duration but no pitch, so nothing here may consult a note
 * name. The positions are checked against the engraving convention stated in
 * staff steps - whole hangs under line 4, half sits on line 3 - recomputed
 * from the mirrored geometry constants rather than read back out of the page.
 */

const yAtStep = (s) => LINE_Y1 - s * (LINE_SPACING / 2);
const rectsIn = (svg) => [...svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
  .map(m => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }));

const renderRest = (dur) => {
  renderScoreSVG('probe', [dur === undefined ? { rest: true } : { rest: true, dur }], 'treble', 340, 160);
  return rendered.probe;
};

/* 13a. the two bar-shaped rests hang on the lines convention puts them on */

const BAR_RESTS = [
  { dur: 'w', label: 'lặng tròn hangs below line 4', top: yAtStep(6) },
  { dur: 'h', label: 'lặng trắng sits on top of line 3', top: yAtStep(4) - LINE_SPACING / 2 },
];

for (const spec of BAR_RESTS) {
  const svg = renderRest(spec.dur);
  const bars = rectsIn(svg);
  if (bars.length !== 1) {
    check(spec.label, false, `drew ${bars.length} rect(s), want exactly 1`);
    continue;
  }
  const bar = bars[0];
  check(spec.label,
        Math.abs(bar.y - spec.top) < 0.01 && Math.abs(bar.h - LINE_SPACING / 2) < 0.01,
        `top y=${bar.y} height=${bar.h}, convention says y=${spec.top} height=${LINE_SPACING / 2}`);
}

/* 13b. whole and half must not render identically - the classic confusion */

check('lặng tròn and lặng trắng are drawn in different places',
      renderRest('w') !== renderRest('h'),
      'both durations produced byte-identical SVG');

/* 13c. the squiggle rests straddle the middle line.
 * Isolate the rest by diffing against an empty staff rather than filtering
 * tags out: an earlier version stripped the staff lines by hand and ended up
 * measuring the treble clef glyph, which straddles the middle line all by
 * itself and so passed no matter where the rest was drawn. */

const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

const restInk = (dur) => {
  const withRest = inner(renderRest(dur));
  renderScoreSVG('probe', [], 'treble', 340, 160);
  const bare = inner(rendered.probe);
  let a = 0;
  while (a < bare.length && bare[a] === withRest[a]) a++;
  let b = 0;
  while (b < bare.length - a && bare[bare.length - 1 - b] === withRest[withRest.length - 1 - b]) b++;
  return withRest.slice(a, withRest.length - b);
};

for (const dur of ['q', 'e']) {
  const ink = restInk(dur);
  const ext = verticalExtent(ink);
  const mid = yAtStep(4);
  const ok = ext && ext.top < mid && ext.bottom > mid;
  check(`rest '${dur}' straddles the middle line`, ok,
        ext ? `rest ink spans [${ext.top}, ${ext.bottom}], middle line is ${mid}` : 'the rest drew nothing at all');
}

/* 13d. a rest is silence: no head, no stem, no flag, no ledger, no accidental */

const contaminated = [];
for (const dur of ['w', 'h', 'q', 'e']) {
  const svg = renderRest(dur);
  if (countFilledHeads(svg) || countHollowHeads(svg)) contaminated.push(`${dur}: drew a notehead`);
  if (countStems(svg)) contaminated.push(`${dur}: drew a stem`);
  if (countFlags(svg)) contaminated.push(`${dur}: drew a flag`);
  if ((svg.match(/stroke="#334155"/g) || []).length) contaminated.push(`${dur}: drew a ledger line`);
  if (svg.includes('♯')) contaminated.push(`${dur}: drew an accidental`);
}
check('a rest draws no notehead, stem, flag, ledger line or accidental',
      contaminated.length === 0, contaminated.join('\n        '));

/* 13e. a rest has no key, and must not be reported as a missing one */

let restLogged = 0;
const errBeforeRest = console.error;
console.error = () => restLogged++;
for (const dur of ['w', 'h', 'q', 'e']) renderRest(dur);
renderRest(undefined);                       // dur omitted, like the note path
console.error = errBeforeRest;
check('a rest needs no key and logs nothing', restLogged === 0,
      `console.error called ${restLogged}x - the pitch lookup is still running for rests`);

/* 13f. omitting dur on a rest means a quarter rest, matching the note path */

check("omitting dur on a rest draws a lặng đen", renderRest(undefined) === renderRest('q'));

/* 13g. every rest stays inside the fitted viewBox */

const restClipped = [];
for (const clef of CLEFS) {
  for (const dur of ['w', 'h', 'q', 'e']) {
    renderScoreSVG('probe', [{ rest: true, dur }], clef, 340, 160);
    const clip = clipReport(rendered.probe);
    if (clip) restClipped.push(`${clef} rest dur=${dur}: ${clip}`);
  }
}
check('every rest stays inside the fitted viewBox', restClipped.length === 0,
      restClipped.join('\n        '));

/* 13h. a rest takes up a slot in the bar, exactly like a note */

const xsOf = (svg) => [...svg.matchAll(/translate\(([-\d.]+), [-\d.]+\) rotate/g)].map(m => +m[1]);
renderScoreSVG('probe', [{ key: 'c/4' }, { key: 'd/4' }, { key: 'e/4' }], 'treble', 340, 160);
const allNotes = xsOf(rendered.probe);
renderScoreSVG('probe', [{ key: 'c/4' }, { rest: true }, { key: 'e/4' }], 'treble', 340, 160);
const withRest = xsOf(rendered.probe);
check('a rest occupies its slot, leaving the notes around it in place',
      withRest.length === 2 && allNotes.length === 3
        && Math.abs(withRest[0] - allNotes[0]) < 0.01
        && Math.abs(withRest[1] - allNotes[2]) < 0.01,
      `notes at ${allNotes.join(', ')} moved to ${withRest.join(', ')}`);

/* 13i. every duration can name its rest in Vietnamese */

const unnamed = Object.entries(DURATIONS)
  .filter(([, d]) => !d.restName || !/^lặng /.test(d.restName))
  .map(([k, d]) => `${k}: restName=${d.restName}`);
check('every duration carries a Vietnamese rest name', unnamed.length === 0, unnamed.join(', '));

/* 13j. an unknown duration on a rest must complain, not guess quietly */

let badRestLogged = 0;
const errBeforeBadRest = console.error;
console.error = () => badRestLogged++;
renderScoreSVG('probe', [{ rest: true, dur: 'zzz' }], 'treble', 340, 160);
console.error = errBeforeBadRest;
const fellBack = rendered.probe;
check('unknown duration on a rest logs an error', badRestLogged === 1,
      `console.error called ${badRestLogged}x`);
check('unknown duration on a rest falls back to a lặng đen', fellBack === renderRest('q'));

/* ---- 14. time signature, bar lines and bars ----------------------------
 * Bar boundaries are asserted against hand-written expectations rather than
 * against a second copy of the fill-the-bar loop: reimplementing the
 * algorithm in the test would make the two agree on the same mistake.
 */

const W = 340;
const meterRender = (items, sig, clef = 'treble') => {
  renderScoreSVG('probe', items, clef, W, 160, sig);
  return rendered.probe;
};

/* every full-height vertical rule, tagged by weight */
const vRules = (svg) =>
  [...svg.matchAll(new RegExp(`<line x1="([-\\d.]+)" y1="${TOP_MARGIN}" x2="[-\\d.]+" y2="${LINE_Y1}" stroke="#64748b" stroke-width="([\\d.]+)"`, 'g'))]
    .map(m => ({ x: +m[1], w: +m[2] }));

// interior bar lines = the full-height rules that are neither the opening
// rule nor either half of the closing double bar
const interiorBars = (svg) =>
  vRules(svg).filter(r => Math.abs(r.x - 15) > 0.01 && Math.abs(r.x - (W - 21)) > 0.01 && Math.abs(r.x - (W - 15)) > 0.01)
             .map(r => r.x).sort((a, b) => a - b);

const noteXs = (svg) => [...svg.matchAll(/translate\(([-\d.]+), [-\d.]+\) rotate/g)].map(m => +m[1]);
const quiet = (fn) => { const w = console.warn; console.warn = () => {}; try { return fn(); } finally { console.warn = w; } };
const warnings = (fn) => { const w = console.warn; const out = []; console.warn = (m) => out.push(m); try { fn(); } finally { console.warn = w; } return out; };

const q = (n) => Array.from({ length: n }, () => ({ key: 'c/4' }));

/* 14a. the numerals stack where convention puts them */

for (const [sig, top, bottom] of [['4/4', '4', '4'], ['3/4', '3', '4'], ['2/4', '2', '4'], ['6/8', '6', '8']]) {
  const svg = quiet(() => meterRender(q(1), sig));
  const nums = [...svg.matchAll(/<text x="66" y="([-\d.]+)"[^>]*>(\d+)<\/text>/g)].map(m => ({ y: +m[1], n: m[2] }));
  const ok = nums.length === 2
    && nums[0].n === top && Math.abs(nums[0].y - yAtStep(6)) < 0.01
    && nums[1].n === bottom && Math.abs(nums[1].y - yAtStep(2)) < 0.01;
  check(`time signature ${sig} is written as ${top} over ${bottom}`, ok,
        `drew ${JSON.stringify(nums)}, want ${top}@${yAtStep(6)} over ${bottom}@${yAtStep(2)}`);
}

/* 14b. leaving the signature out must change nothing at all */

renderScoreSVG('probe', q(3), 'treble', W, 160);
const unmetered = rendered.probe;
renderScoreSVG('probe', q(3), 'treble', W, 160, null);
check('passing no time signature renders exactly like omitting it', rendered.probe === unmetered);
check('an unmetered staff draws no numerals and no bar lines',
      !unmetered.includes('<text x="66"') && interiorBars(unmetered).length === 0
        && vRules(unmetered).length === 2,
      `${vRules(unmetered).length} vertical rule(s), want 2`);

/* 14c. bars fill to capacity, then break */

const BAR_CASES = [
  { sig: '4/4', items: q(4),  breaks: [],        why: 'four quarters exactly fill 4/4' },
  { sig: '4/4', items: q(8),  breaks: [4],       why: 'eight quarters make two bars of 4/4' },
  { sig: '3/4', items: q(9),  breaks: [3, 6],    why: 'nine quarters make three bars of 3/4' },
  { sig: '2/4', items: q(6),  breaks: [2, 4],    why: 'six quarters make three bars of 2/4' },
  { sig: '4/4', items: [{ key: 'c/4', dur: 'h' }, { key: 'c/4', dur: 'h' }, { key: 'c/4' }, { key: 'c/4' }, { key: 'c/4', dur: 'h' }],
    breaks: [2], why: 'two halves fill a bar, then two quarters and a half fill the next' },
  { sig: '6/8', items: Array.from({ length: 6 }, () => ({ key: 'c/4', dur: 'e' })), breaks: [], why: 'six eighths are one bar of 6/8, not six' },
  { sig: '6/8', items: Array.from({ length: 12 }, () => ({ key: 'c/4', dur: 'e' })), breaks: [6], why: 'twelve eighths are two bars of 6/8' },
];

for (const c of BAR_CASES) {
  const svg = quiet(() => meterRender(c.items, c.sig));
  const bars = interiorBars(svg);
  const xs = noteXs(svg);
  const want = c.breaks.map(i => (xs[i - 1] + xs[i]) / 2);
  const ok = bars.length === want.length && bars.every((x, i) => Math.abs(x - want[i]) < 0.01);
  check(`${c.sig}: ${c.why}`, ok,
        `bar lines at [${bars.map(n => n.toFixed(1))}], want [${want.map(n => n.toFixed(1))}] (before note ${c.breaks.join(', ') || 'none'})`);
}

/* 14d. a rest fills its share of the bar like any note */

const withRests = quiet(() => meterRender(
  [{ key: 'c/4' }, { rest: true }, { key: 'c/4' }, { key: 'c/4' },
   { key: 'c/4' }, { rest: true }, { key: 'c/4' }, { key: 'c/4' }], '4/4'));
check('rests count toward the bar', interiorBars(withRests).length === 1,
      `${interiorBars(withRests).length} interior bar line(s), want 1 - rests are not being counted`);

const restsOnly = quiet(() => meterRender(
  [{ rest: true, dur: 'h' }, { rest: true, dur: 'h' }, { rest: true, dur: 'h' }, { rest: true, dur: 'h' }], '4/4'));
check('a bar of nothing but rests still divides', interiorBars(restsOnly).length === 1,
      `${interiorBars(restsOnly).length} interior bar line(s), want 1`);

/* 14e. a bar that does not add up says so */

check('a short bar is reported',
      warnings(() => meterRender(q(3), '4/4')).length === 1);
check('an overfull bar is reported',
      warnings(() => meterRender([{ key: 'c/4', dur: 'w' }, { key: 'c/4' }], '3/4')).length === 2,
      'want one complaint per bad bar: 4 beats then a leftover 1');
check('a bar that adds up is not reported',
      warnings(() => meterRender(q(8), '4/4')).length === 0);
check('the complaint names the bar, its beats and the meter',
      /ô nhịp 1 có 3 phách, nhịp 4\/4 cần 4/.test(warnings(() => meterRender(q(3), '4/4'))[0] || ''),
      warnings(() => meterRender(q(3), '4/4'))[0]);

/* 14f. an unreadable signature is refused, not guessed at */

for (const bad of ['4/x', '4', '0/4', '4/0', 'bốn bốn', '']) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  const svg = meterRender(q(3), bad);
  console.error = realErr;
  check(`time signature "${bad}" is refused`, logged === 1 && svg === unmetered,
        `console.error called ${logged}x; layout ${svg === unmetered ? 'unchanged' : 'CHANGED'}`);
}

/* 14g. a metered passage closes on a double bar */

const metered = quiet(() => meterRender(q(4), '4/4'));
const closing = vRules(metered).filter(r => r.x > W - 30);
check('a metered passage ends on a thin-then-thick double bar',
      closing.length === 2 && closing.some(r => r.w === 2) && closing.some(r => r.w === 5)
        && Math.min(...closing.map(r => r.x)) < Math.max(...closing.map(r => r.x)),
      `closing rules: ${JSON.stringify(closing)}`);
check('an unmetered passage keeps its single closing bar',
      vRules(unmetered).filter(r => r.x > W - 30).length === 1);

/* 14h. a bar line separates the notes on either side of it */

const eight = quiet(() => meterRender(q(8), '4/4'));
const eightXs = noteXs(eight);
const [split] = interiorBars(eight);
check('the bar line falls between the notes it separates',
      split > eightXs[3] && split < eightXs[4],
      `bar line at ${split}, notes at ${eightXs[3]} and ${eightXs[4]}`);

/* 14i. an empty passage is not a broken bar */

check('an empty metered staff draws no bar line and makes no complaint',
      warnings(() => { const svg = meterRender([], '4/4'); return svg; }).length === 0
        && interiorBars(quiet(() => meterRender([], '4/4'))).length === 0);

/* 14j. the meter applies in both clefs */

for (const clef of CLEFS) {
  const svg = quiet(() => meterRender(q(8), '4/4', clef));
  check(`${clef}: bars divide the same way`, interiorBars(svg).length === 1,
        `${interiorBars(svg).length} interior bar line(s), want 1`);
}

/* 14k. the meter buys its own room instead of taking the notes' -----------
 * T1 promised that a call with no duration draws exactly what it drew
 * before; T3 owes the same promise horizontally. Nothing else pins the
 * unmetered note position, so widening startX for every staff - not just
 * metered ones - would silently shift all 98 existing renders sideways.
 * 85 is where the pre-T3 layout put the first note (startX 65 plus the
 * 20pt lead-in) and is what the guide and quiz screens are built around.
 */

renderScoreSVG('probe', q(4), 'treble', W, 160);
const bareFirstX = noteXs(rendered.probe)[0];
check('an unmetered staff still starts its notes at x=85',
      Math.abs(bareFirstX - 85) < 0.01,
      `first note at x=${bareFirstX} - every pre-T3 render just moved`);

const meteredFirstX = noteXs(quiet(() => meterRender(q(4), '4/4')))[0];
check('a meter pushes the notes clear of its own numerals',
      meteredFirstX > 66 + 11,          // numeral centre x=66, half a 22pt glyph
      `numerals centred at x=66 but the first note sits at x=${meteredFirstX}`);

/* ---- 15. fingering ------------------------------------------------------
 * "Above the note" is checked against the note's own ink, isolated by
 * diffing the render against an empty staff, rather than against the
 * formula the renderer uses to place the number.
 */

const inkOf = (items, clef = 'treble') => {
  renderScoreSVG('probe', items, clef, 340, 160);
  const full = inner(rendered.probe);
  renderScoreSVG('probe', [], clef, 340, 160);
  const bare = inner(rendered.probe);
  let a = 0;
  while (a < bare.length && bare[a] === full[a]) a++;
  let b = 0;
  while (b < bare.length - a && bare[bare.length - 1 - b] === full[full.length - 1 - b]) b++;
  return full.slice(a, full.length - b);
};

const FINGER_RE = /<text x="([-\d.]+)" y="([-\d.]+)"[^>]*fill="#7c3aed"[^>]*>(\d)<\/text>/;
const fingerIn = (svg) => { const m = FINGER_RE.exec(svg); return m ? { x: +m[1], y: +m[2], n: m[3] } : null; };

/* 15a. every finger number reaches the staff */

const unwritten = [];
for (let n = 1; n <= 5; n++) {
  renderScoreSVG('probe', [{ key: 'g/4', finger: n }], 'treble', 340, 160);
  const f = fingerIn(rendered.probe);
  if (!f || f.n !== String(n)) unwritten.push(`finger ${n}: drew ${f ? f.n : 'nothing'}`);
}
check('fingers 1 to 5 are written on the staff', unwritten.length === 0, unwritten.join(', '));

/* 15b. the number clears the note, stem and all, in both directions */

const buried = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    for (const dur of ['w', 'h', 'q', 'e']) {
      const plain = verticalExtent(inkOf([{ key: note.key, dur }], clef));
      renderScoreSVG('probe', [{ key: note.key, dur, finger: 3 }], clef, 340, 160);
      const f = fingerIn(rendered.probe);
      if (!f) { buried.push(`${clef} ${note.noteName} ${dur}: no number drawn`); continue; }
      if (!plain || f.y >= plain.top) {
        buried.push(`${clef} ${note.noteName} ${dur}: number at y=${f.y}, note ink starts at y=${plain && plain.top}`);
      }
    }
  }
}
check('the finger number sits clear above the note and its stem', buried.length === 0,
      buried.slice(0, 5).join('\n        '));

/* 15c. the number is centred on the note it belongs to */

renderScoreSVG('probe', [{ key: 'c/4' }, { key: 'e/4', finger: 2 }, { key: 'g/4' }], 'treble', 340, 160);
const midX = noteXs(rendered.probe)[1];
check('the finger number is centred over its own note',
      Math.abs(fingerIn(rendered.probe).x - midX) < 0.01,
      `number at x=${fingerIn(rendered.probe).x}, note at x=${midX}`);

/* 15d. anything that is not a finger is refused */

for (const bad of [0, 6, -1, 2.5, '3', null, true]) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  renderScoreSVG('probe', [{ key: 'g/4', finger: bad }], 'treble', 340, 160);
  console.error = realErr;
  check(`finger ${JSON.stringify(bad)} is refused`, logged === 1 && fingerIn(rendered.probe) === null,
        `console.error called ${logged}x; number ${fingerIn(rendered.probe) ? 'DRAWN' : 'not drawn'}`);
}

/* 15e. a finger adds a number and moves nothing else */

const moved = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    renderScoreSVG('probe', [{ key: note.key }], clef, 340, 160);
    const plain = inner(rendered.probe);
    renderScoreSVG('probe', [{ key: note.key, finger: 4 }], clef, 340, 160);
    if (inner(rendered.probe).replace(FINGER_RE, '') !== plain) moved.push(`${clef} ${note.noteName}`);
  }
}
check('adding a finger changes nothing but the number', moved.length === 0,
      'the note itself moved for: ' + moved.slice(0, 5).join(', '));

/* 15f. the number stays inside the fitted viewBox */

const fingerClipped = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    for (const dur of ['w', 'h', 'q', 'e']) {
      renderScoreSVG('probe', [{ key: note.key, dur, finger: 5 }], clef, 340, 160);
      const clip = clipReport(rendered.probe);
      if (clip) fingerClipped.push(`${clef} ${note.noteName} ${dur}: ${clip}`);
    }
  }
}
check('the finger number stays inside the fitted viewBox', fingerClipped.length === 0,
      fingerClipped.slice(0, 5).join('\n        '));

/* 15g. a rest has no finger */

let restFingerLogged = 0;
const errBeforeRestFinger = console.error;
console.error = () => restFingerLogged++;
renderScoreSVG('probe', [{ rest: true, finger: 2 }], 'treble', 340, 160);
console.error = errBeforeRestFinger;
check('a finger on a rest is refused', restFingerLogged === 1 && fingerIn(rendered.probe) === null,
      `console.error called ${restFingerLogged}x; number ${fingerIn(rendered.probe) ? 'DRAWN' : 'not drawn'}`);

/* 15g. the numbers line up in one row above the staff -------------------
 * Method books print fingering as a row, not as a number chasing each
 * notehead up and down. Only a note already above that row may push it
 * higher, and nothing may drop it into the staff or the ledger lines.
 */

const BAND_Y = TOP_MARGIN - 8;
const strayBand = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    for (const dur of ['w', 'h', 'q', 'e']) {
      renderScoreSVG('probe', [{ key: note.key, dur, finger: 1 }], clef, 340, 160);
      const f = fingerIn(rendered.probe);
      if (!f || f.y > BAND_Y + 0.01) {
        strayBand.push(`${clef} ${note.noteName} ${dur}: number at y=${f && f.y}, row sits at y=${BAND_Y}`);
      }
    }
  }
}
check('every finger number sits in the row above the staff or higher',
      strayBand.length === 0, strayBand.slice(0, 5).join('\n        '));

const onStaff = notesData.treble.find(n => n.step === 0);
renderScoreSVG('probe', [{ key: onStaff.key, finger: 1 }], 'treble', 340, 160);
const bandY = fingerIn(rendered.probe).y;
const lowest = notesData.treble.reduce((a, b) => (a.step < b.step ? a : b));
renderScoreSVG('probe', [{ key: lowest.key, finger: 1 }], 'treble', 340, 160);
check('a note far below the staff keeps its number in the same row',
      Math.abs(fingerIn(rendered.probe).y - bandY) < 0.01,
      `${lowest.noteName} put its number at y=${fingerIn(rendered.probe).y}, the row is at y=${bandY}`);

const highest = notesData.treble.reduce((a, b) => (a.step > b.step ? a : b));
renderScoreSVG('probe', [{ key: highest.key, finger: 1 }], 'treble', 340, 160);
check('a note above the row pushes its number higher still',
      fingerIn(rendered.probe).y < bandY,
      `${highest.noteName} put its number at y=${fingerIn(rendered.probe).y}, no higher than the row at y=${bandY}`);

/* 15h. a label and a finger share a column without landing on each other */

// The accidental glyph is drawn in the same blue, so match the label by its own
// type settings rather than by colour alone - matching on colour picked up the
// sharp sign instead and reported every sharp note as a collision.
const LABEL_RE = /<text x="[-\d.]+" y="([-\d.]+)" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2563eb" text-anchor="middle">([^<]*)<\/text>/;
const collided = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    renderScoreSVG('probe', [{ key: note.key, finger: 3, label: 'Đô' }], clef, 340, 160);
    const f = fingerIn(rendered.probe), l = LABEL_RE.exec(rendered.probe);
    if (!f || !l) { collided.push(`${clef} ${note.noteName}: finger or label missing`); continue; }
    if (+l[1] > f.y - 13) collided.push(`${clef} ${note.noteName}: label at y=${l[1]}, finger at y=${f.y}`);
  }
}
check('a label steps clear of a finger number on the same note', collided.length === 0,
      collided.slice(0, 5).join('\n        '));

renderScoreSVG('probe', [{ key: 'g/4', label: 'Sol' }], 'treble', 340, 160);
check('a label on its own still sits where it always did',
      Math.abs(+LABEL_RE.exec(rendered.probe)[1] - 22) < 0.01);

/* ---- fingering on the keys themselves ---------------------------------- */

const KEYBOARD = 'keyboard-element';
const keyDivs = (html) => {
  const out = {};
  for (const m of html.matchAll(/<div class="(?:white|black)-key" id="key-([^"]+)"[\s\S]*?<\/div>/g)) out[m[1]] = m[0];
  return out;
};
// Capture whatever the badge holds, not just a digit: a narrower pattern read
// a badge of "undefined" as no badge at all, and a mutation that marked every
// key on the keyboard sailed straight through.
const badgeIn = (div) => {
  const m = /<span class="key-finger[^"]*">([^<]*)<\/span>/.exec(div);
  return m ? m[1] : null;
};

buildPianoKeyboard();
const bareKeyboard = rendered[KEYBOARD];
check('the keyboard shows no fingering until it is asked for',
      Object.values(keyDivs(bareKeyboard)).every(d => badgeIn(d) === null));

/* 15h. the number lands on the right key, and only there */

setKeyFingering({ 'c/4': 1, 'e/4': 3, 'c#/4': 2 });
const marked = keyDivs(rendered[KEYBOARD]);
const wrongBadge = [];
const want = { 'c_4': '1', 'e_4': '3', 'c#_4': '2' };
for (const [id, div] of Object.entries(marked)) {
  const got = badgeIn(div), expected = want[id] || null;
  if (got !== expected) wrongBadge.push(`${id}: badge ${got}, want ${expected}`);
}
check('setKeyFingering marks exactly the keys it was given', wrongBadge.length === 0,
      wrongBadge.slice(0, 5).join(', '));
check('a black key can carry fingering too', badgeIn(marked['c#_4']) === '2');

/* 15i. a second call replaces the first rather than piling up */

setKeyFingering({ 'g/4': 5 });
const replaced = keyDivs(rendered[KEYBOARD]);
check('setKeyFingering replaces the previous marks',
      badgeIn(replaced['g_4']) === '5' && badgeIn(replaced['c_4']) === null && badgeIn(replaced['e_4']) === null,
      'the earlier fingering is still on the keyboard');

/* 15j. clearing puts the keyboard back exactly as it was */

clearKeyFingering();
check('clearKeyFingering restores the keyboard byte for byte',
      rendered[KEYBOARD] === bareKeyboard);

/* 15k. a key or a number that makes no sense is refused */

for (const [label, map] of [
  ['an unknown key', { 'zz/9': 1 }],
  ['a finger of 0', { 'c/4': 0 }],
  ['a finger of 6', { 'c/4': 6 }],
  ['a finger written as text', { 'c/4': '2' }],
]) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  setKeyFingering(map);
  console.error = realErr;
  const after = rendered[KEYBOARD];
  check(`setKeyFingering refuses ${label}`, logged === 1 && after === bareKeyboard,
        `console.error called ${logged}x; keyboard ${after === bareKeyboard ? 'unchanged' : 'CHANGED'}`);
}
clearKeyFingering();

/* ---- 16. the audio engine ----------------------------------------------
 * None of this can prove a sound comes out - that still needs a browser and
 * a pair of ears, and the backlog says so. What it does prove is the shape
 * of the graph and the schedule: that voices meet a limiter instead of the
 * speakers, that an envelope rises and falls in order, that a re-struck key
 * cuts the note it left ringing, and that nothing is left running.
 */

function fakeAudio() {
  const events = [];
  const nodes = [];
  let idSeq = 0;

  const mkParam = (node, name) => {
    const p = {
      value: 0,
      setValueAtTime(v, t) { events.push({ id: node.id, kind: node.kind, param: name, op: 'set', v, t }); p.value = v; return p; },
      exponentialRampToValueAtTime(v, t) { events.push({ id: node.id, kind: node.kind, param: name, op: 'ramp', v, t }); p.value = v; return p; },
      linearRampToValueAtTime(v, t) { events.push({ id: node.id, kind: node.kind, param: name, op: 'linear', v, t }); p.value = v; return p; },
      cancelScheduledValues(t) { events.push({ id: node.id, kind: node.kind, param: name, op: 'cancel', t }); return p; },
    };
    return p;
  };

  const mkNode = (kind, extra) => {
    const node = Object.assign({ id: ++idSeq, kind, out: [] }, extra || {});
    node.connect = (dest) => { node.out.push(dest); return dest; };
    node.disconnect = () => {};
    nodes.push(node);
    return node;
  };

  const ctx = {
    currentTime: 0,
    state: 'suspended',
    resumed: 0,
    resume() { ctx.resumed++; ctx.state = 'running'; },
    createOscillator() {
      const n = mkNode('oscillator', { started: [], stopped: [], type: null, onended: null });
      n.frequency = mkParam(n, 'frequency');
      n.start = (t) => n.started.push(t === undefined ? ctx.currentTime : t);
      n.stop = (t) => n.stopped.push(t === undefined ? ctx.currentTime : t);
      return n;
    },
    createGain() { const n = mkNode('gain'); n.gain = mkParam(n, 'gain'); return n; },
    createDynamicsCompressor() {
      const n = mkNode('compressor');
      for (const p of ['threshold', 'ratio', 'knee', 'attack', 'release']) n[p] = mkParam(n, p);
      return n;
    },
  };
  ctx.destination = mkNode('destination');
  return { ctx, events, nodes };
}

const audio = fakeAudio();
global.window.AudioContext = function () { return audio.ctx; };

/* Count the metronome's wake-up timers, and unref them.
 *
 * Without this a metronome that forgets to clear its interval does not fail
 * anything - the suite finishes and node simply never exits, which reads as a
 * hang rather than as a failed check. Counting turns "the timer was left
 * running" into something a check can state, and unref stops one stray timer
 * from holding the whole run open. */
let intervalsOpen = 0;
const realSetInterval = global.setInterval, realClearInterval = global.clearInterval;
global.setInterval = (fn, ms) => {
  intervalsOpen++;
  const handle = realSetInterval(fn, ms);
  if (handle && typeof handle.unref === 'function') handle.unref();
  return handle;
};
global.clearInterval = (handle) => { intervalsOpen--; return realClearInterval(handle); };

// Run one scenario and hand back only what it did, with a guard: playTone
// swallows exceptions, so a fake missing a method would otherwise look like
// a pass with a stack trace scrolling past.
function scenario(fn) {
  const from = audio.events.length, nodesFrom = audio.nodes.length;
  let errors = 0;
  const realErr = console.error;
  console.error = () => errors++;
  let result;
  try { result = fn(); } finally { console.error = realErr; }
  return { result, errors, events: audio.events.slice(from), nodes: audio.nodes.slice(nodesFrom) };
}

const gainCurve = (events, id) => events.filter(e => e.id === id && e.param === 'gain');

/* 16a. the first note builds the shared output chain */

const first = scenario(() => playTone(440));
check('playing a note raises no error', first.errors === 0, `${first.errors} error(s) logged`);
check('a suspended context is resumed before playing', audio.ctx.resumed >= 1);

const limiter = audio.nodes.find(n => n.kind === 'compressor');
const master = audio.nodes.find(n => n.kind === 'gain' && n.out.includes(audio.ctx.destination));
check('a limiter sits in the chain', Boolean(limiter));
check('exactly one node reaches the speakers',
      audio.nodes.filter(n => n.out.includes(audio.ctx.destination)).length === 1,
      'a voice is wired straight to ctx.destination, bypassing the limiter');
check('the limiter feeds the master gain, which feeds the speakers',
      Boolean(limiter && master && limiter.out.includes(master)));

/* 16b. the envelope rises and falls, in order, and never exceeds the peak */

const one = scenario(() => playTone(440, { at: 10, hold: 1 }));
const voiceGain = one.nodes.find(n => n.kind === 'gain');
const curve = gainCurve(one.events, voiceGain.id);

check('a note is shaped by an envelope, not a flat level', curve.length >= 4,
      `${curve.length} gain event(s) - a bare on/off is back`);
check('the envelope is scheduled in time order',
      curve.every((e, i) => i === 0 || e.t >= curve[i - 1].t - 1e-9),
      JSON.stringify(curve.map(e => e.t)));
check('the envelope starts silent and ends silent',
      curve[0].v <= 0.001 && curve[curve.length - 1].v <= 0.001,
      `starts at ${curve[0].v}, ends at ${curve[curve.length - 1].v}`);
check('the envelope peaks once, at the voice peak',
      Math.max(...curve.map(e => e.v)) === VOICE_PEAK,
      `peak ${Math.max(...curve.map(e => e.v))}, VOICE_PEAK is ${VOICE_PEAK}`);
check('the attack rises before the decay falls',
      curve[1].v > curve[2].v && curve[1].t < curve[2].t,
      'attack and decay are the wrong way round');
check('no ramp targets zero, which an exponential ramp cannot reach',
      curve.filter(e => e.op === 'ramp').every(e => e.v > 0),
      'an exponential ramp to 0 makes the whole envelope silently do nothing');

/* 16c. a scheduled note schedules everything from the given time */

const sched = scenario(() => playTone(440, { at: 25, hold: 0.5 }));
const schedOsc = sched.nodes.find(n => n.kind === 'oscillator');
const schedCurve = gainCurve(sched.events, sched.nodes.find(n => n.kind === 'gain').id);
check('a scheduled note starts at the time it was given',
      schedOsc.started.length === 1 && Math.abs(schedOsc.started[0] - 25) < 1e-9,
      `started at ${schedOsc.started}`);
check('a scheduled note schedules its whole envelope from that time',
      schedCurve.every(e => e.t >= 25 - 1e-9),
      'part of the envelope was scheduled in the past, which fires immediately');
check('a scheduled note sets its pitch at that time too',
      sched.events.some(e => e.param === 'frequency' && Math.abs(e.t - 25) < 1e-9));

/* 16d. a hold shorter than the attack and decay still releases last */

const short = scenario(() => playTone(440, { at: 40, hold: 0.001 }));
const shortCurve = gainCurve(short.events, short.nodes.find(n => n.kind === 'gain').id);
check('a hold shorter than the attack and decay does not fold the envelope backwards',
      shortCurve.every((e, i) => i === 0 || e.t >= shortCurve[i - 1].t - 1e-9),
      JSON.stringify(shortCurve.map(e => e.t)));

/* 16e. every oscillator that starts is also stopped */

const leaked = audio.nodes.filter(n => n.kind === 'oscillator' && n.started.length && !n.stopped.length);
check('no oscillator is left running', leaked.length === 0, `${leaked.length} oscillator(s) never stopped`);
const backwards = audio.nodes.filter(n => n.kind === 'oscillator' && n.started.length && n.stopped.length
                                          && n.stopped[0] <= n.started[0]);
check('no oscillator is told to stop before it starts', backwards.length === 0);

/* 16f. striking the same key again cuts the note it left ringing */

const strike1 = scenario(() => playTone(440, { at: 50, voice: 'c/4' }));
const ringing = strike1.nodes.find(n => n.kind === 'gain');
const strike2 = scenario(() => playTone(440, { at: 51, voice: 'c/4' }));
const cut = strike2.events.filter(e => e.id === ringing.id);
check('re-striking a key cancels what the old note had scheduled',
      cut.some(e => e.op === 'cancel'),
      'the old note plays on underneath the new one');
check('re-striking a key fades the old note out rather than snapping it off',
      cut.some(e => e.op === 'ramp' && e.v <= 0.001),
      'cutting the gain instantly clicks');
check('re-striking a key stops the old oscillator',
      strike1.nodes.find(n => n.kind === 'oscillator').stopped.length >= 1);

/* 16g. different keys do not cut each other - that is what a chord is */

// Fresh voice ids: reusing one still ringing from an earlier scenario would
// make the engine cut it, and the cut would look like a chord tearing itself up.
const chord = scenario(() => {
  ['chord-c', 'chord-e', 'chord-g'].forEach((k, i) => playTone(440 + i * 100, { at: 60, voice: k }));
});
const chordGains = chord.nodes.filter(n => n.kind === 'gain');
check('a chord sounds three separate voices', chordGains.length === 3, `${chordGains.length} voice(s)`);
check('no voice in a chord cancels another',
      chord.events.filter(e => e.op === 'cancel').length === 0,
      'the notes of a chord are cutting each other off');
check('every voice in a chord goes through the limiter',
      chordGains.every(g => g.out.includes(limiter)),
      'a voice bypasses the limiter and adds straight into the output');
check('a chord of voices cannot sum past full scale',
      chordGains.length * VOICE_PEAK <= 1,
      `${chordGains.length} voices at ${VOICE_PEAK} peak to ${(chordGains.length * VOICE_PEAK).toFixed(2)}`);

/* 16h. a note with no pitch makes no sound and no node */

const silent = scenario(() => playTone(0));
check('a note with no pitch is ignored', silent.result === null && silent.nodes.length === 0,
      `${silent.nodes.length} node(s) created for a note with no frequency`);

/* 16i. the key remembers the note now sounding, not the one it just cut */

const soloA = scenario(() => playTone(440, { at: 70, voice: 'solo' }));
const soloB = scenario(() => playTone(550, { at: 71, voice: 'solo' }));
const nowRinging = activeVoices.get('solo');
check('a re-struck key tracks the new note, not the one it replaced',
      Boolean(nowRinging) && nowRinging.gain === soloB.nodes.find(n => n.kind === 'gain')
        && nowRinging.gain !== soloA.nodes.find(n => n.kind === 'gain'),
      'the key is still pointing at the note that was just cut');

const trackedBefore = activeVoices.size;
scenario(() => playTone(440, { at: 80 }));
check('a note played without a voice id is not tracked at all',
      activeVoices.size === trackedBefore,
      'untracked notes are piling up in the live set and will never be cleared');

/* ---- 17. the metronome --------------------------------------------------
 * The scheduler is driven directly here rather than through its timer: what
 * matters is that click times come off the audio clock, and a real interval
 * would only add jitter and keep the process alive.
 */

// Put the metronome in a known state without starting its timer.
const SCHEDULE_AHEAD_MAX = 0.12 + 1e-9;   // mirrors SCHEDULE_AHEAD in the page

function armMetronome(bpm, beatsPerBar, from) {
  metronome.running = true;
  metronome.bpm = bpm;
  metronome.beatsPerBar = beatsPerBar;
  metronome.beat = 0;
  metronome.nextBeatTime = from;
  metronomeQueue.length = 0;
}

// Pair each click's oscillator with the gain that follows it.
function clicksIn(nodes, events) {
  const out = [];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].kind !== 'oscillator') continue;
    const osc = nodes[i], gain = nodes[i + 1];
    const freq = events.find(e => e.id === osc.id && e.param === 'frequency');
    const gains = events.filter(e => gain && e.id === gain.id && e.param === 'gain');
    out.push({ osc, gain, freq: freq && freq.v, at: freq && freq.t, peak: Math.max(...gains.map(e => e.v)) });
  }
  return out;
}

/* 17a. the tempo range is enforced at both ends */

for (const bpm of [40, 90, 208]) {
  check(`${bpm} BPM is accepted`, setMetronomeBpm(bpm) === true && metronome.bpm === bpm);
}
for (const bpm of [39, 209, 0, -90, NaN, Infinity, '90', null]) {
  const shown = typeof bpm === 'string' ? `"${bpm}"` : String(bpm);
  const before = metronome.bpm;
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  const took = setMetronomeBpm(bpm);
  console.error = realErr;
  check(`${shown} BPM is refused`, took === false && logged === 1 && metronome.bpm === before,
        `returned ${took}, logged ${logged}x, bpm now ${metronome.bpm}`);
}

/* 17b. so is the bar length */

check('a bar of 3 beats is accepted', setMetronomeBeatsPerBar(3) === true && metronome.beatsPerBar === 3);
for (const beats of [1, 13, 2.5, '4']) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  const took = setMetronomeBeatsPerBar(beats);
  console.error = realErr;
  check(`a bar of ${JSON.stringify(beats)} beats is refused`, took === false && logged === 1 && metronome.beatsPerBar === 3);
}
setMetronomeBeatsPerBar(4);

/* 17c. beats land one tempo apart, off the audio clock ------------------
 * A lookahead scheduler only ever places the beats inside its own short
 * window, so the clock has to be walked forward the way its timer would.
 * Calling it once and expecting a run of beats measures nothing.
 */

function runScheduler(from, seconds, stepMs) {
  // Any step finer than the lookahead window works; the wake-up rate itself
  // is not what is under test.
  const step = (stepMs || 20) / 1000;
  for (let t = from; t <= from + seconds + 1e-9; t += step) {
    audio.ctx.currentTime = t;
    metronomeScheduler();
  }
}

audio.ctx.currentTime = 100;
const sched120 = scenario(() => { armMetronome(120, 4, 100); runScheduler(100, 2); });
const clicks120 = clicksIn(sched120.nodes, sched120.events);
check('the scheduler raises no error', sched120.errors === 0);
check('at 120 BPM the beats fall half a second apart',
      clicks120.length >= 4 && clicks120.every((c, i) => i === 0 || Math.abs((c.at - clicks120[i - 1].at) - 0.5) < 1e-9),
      `click times ${clicks120.map(c => c.at).join(', ')}`);

const sched60 = scenario(() => { armMetronome(60, 4, 200); runScheduler(200, 3); });
const clicks60 = clicksIn(sched60.nodes, sched60.events);
check('halving the tempo doubles the gap between beats',
      clicks60.length >= 2 && Math.abs((clicks60[1].at - clicks60[0].at) - 1) < 1e-9,
      `gap ${clicks60.length >= 2 ? clicks60[1].at - clicks60[0].at : 'n/a'}`);
check('a slower tempo means fewer beats over the same stretch',
      clicks60.length < clicks120.length,
      `60 BPM gave ${clicks60.length} beats, 120 BPM gave ${clicks120.length}`);

/* 17d. nothing is scheduled in the past, nor further out than the window */

const windowBreaches = [];
const oneCall = scenario(() => {
  armMetronome(600, 4, 300);
  audio.ctx.currentTime = 300;
  metronomeScheduler();
});
for (const c of clicksIn(oneCall.nodes, oneCall.events)) {
  if (c.at < 300 - 1e-9) windowBreaches.push(`${c.at} is in the past`);
  if (c.at >= 300 + SCHEDULE_AHEAD_MAX) windowBreaches.push(`${c.at} is beyond the lookahead window`);
}
check('one pass schedules only what falls inside the lookahead window',
      windowBreaches.length === 0 && clicksIn(oneCall.nodes, oneCall.events).length > 0,
      windowBreaches.join(', '));
check('every click is scheduled at or after the time it was placed',
      clicks120.every(c => c.at >= 100 - 1e-9),
      'a click was scheduled in the past, which fires the moment it is queued');

/* 17e. the first beat of the bar is the one you can hear */

audio.ctx.currentTime = 400;
const bar = scenario(() => { armMetronome(180, 3, 400); runScheduler(400, 2); });
const barClicks = clicksIn(bar.nodes, bar.events);
check('a bar of 3 gives at least one full cycle', barClicks.length >= 4, `${barClicks.length} click(s)`);
check('the downbeat is pitched above the other beats',
      barClicks[0].freq > barClicks[1].freq && barClicks[1].freq === barClicks[2].freq,
      `pitches ${barClicks.slice(0, 4).map(c => c.freq).join(', ')}`);
check('the downbeat is louder than the other beats',
      barClicks[0].peak > barClicks[1].peak,
      `peaks ${barClicks.slice(0, 3).map(c => c.peak).join(', ')}`);
check('the accent comes back round at the top of the next bar',
      Math.abs(barClicks[3].freq - barClicks[0].freq) < 1e-9 && Math.abs(barClicks[3].peak - barClicks[0].peak) < 1e-9,
      `beat 4 of a 3-beat bar is pitched ${barClicks[3].freq}, the downbeat is ${barClicks[0].freq}`);
check('a 4-beat bar accents one beat in four, not one in three',
      (() => {
        const four = scenario(() => { armMetronome(180, 4, 500); runScheduler(500, 2); });
        const cs = clicksIn(four.nodes, four.events);
        const top = cs[0].freq;
        return cs.length >= 5 && cs[4].freq === top && cs[1].freq !== top && cs[3].freq !== top;
      })());

/* 17f. clicks share the same output chain as the notes */

check('every click goes through the limiter, not straight to the speakers',
      barClicks.every(c => c.gain && c.gain.out.includes(limiter)),
      'a click bypasses the limiter');
check('every click oscillator is stopped',
      barClicks.every(c => c.osc.stopped.length === 1));

/* 17g. the beat light follows the audio clock, and skips a backlog */

armMetronome(120, 4, 600);
scenario(() => runScheduler(600, 2));
check('no beat is lit before its time has come', metronomeBeatAt(599.9) === null);
check('the beat that has just passed is the one lit', metronomeBeatAt(600.0) === 0);
check('a beat is only lit once', metronomeBeatAt(600.0) === null);
check('a late frame lights the most recent beat, not a backlog of old ones',
      metronomeBeatAt(601.6) === 3 && metronomeBeatAt(601.6) === null,
      'the light is replaying beats it missed instead of catching up');

/* 17h. starting and stopping */

// The checks above armed the metronome by hand and left it marked as running,
// which would make startMetronome return straight away and the whole lifecycle
// pass on stale state. Put it back to a stopped metronome first.
stopMetronome();
audio.ctx.currentTime = 700;
const started = scenario(() => startMetronome());
check('starting the metronome raises no error', started.errors === 0);
check('starting the metronome schedules its first clicks', metronomeQueue.length > 0);
check('the first click is a downbeat', metronomeQueue[0].beat === 0);
check('the first click is not scheduled in the past', metronomeQueue[0].at >= 700);
check('starting sets a timer to keep looking ahead', metronome.timer !== null);

const queuedBefore = metronomeQueue.length;
startMetronome();
check('starting an already running metronome changes nothing',
      metronomeQueue.length === queuedBefore);

stopMetronome();
check('stopping clears the timer, the queue and the running flag',
      metronome.timer === null && metronomeQueue.length === 0 && metronome.running === false);
check('stopping leaves no wake-up timer behind', intervalsOpen === 0,
      `${intervalsOpen} interval(s) still running - the metronome keeps ticking after Dừng`);

// Walk the clock past the beat that was pending, or the scheduler would find
// nothing due and look well-behaved whether or not it checks the running flag.
audio.ctx.currentTime = 720;
check('the scheduler does nothing once stopped',
      scenario(() => metronomeScheduler()).nodes.length === 0,
      'it is still laying down clicks after being stopped');

/* 17i. the beat lights match the bar length */

setMetronomeBeatsPerBar(3);
const dots = (rendered['metronome-beats'] || '').match(/class="beat-dot[^"]*"/g) || [];
check('the beat lights are rebuilt to match the bar length', dots.length === 3, `${dots.length} light(s)`);
check('only the downbeat light is marked as the accent',
      dots.filter(d => d.includes('beat-dot-accent')).length === 1 && dots[0].includes('beat-dot-accent'),
      dots.join(' '));
setMetronomeBeatsPerBar(4);
stopMetronome();

/* ---- 18. playing a passage in time --------------------------------------
 * sequenceSchedule is pure, so the timing is checked directly against
 * arithmetic on beats and tempo rather than by watching the audio graph.
 */

const beatsOfDur = { w: 4, h: 2, q: 1, e: 0.5 };   // the test's own copy
const PASSAGE = [
  { key: 'c/4', dur: 'q' }, { key: 'd/4', dur: 'e' }, { rest: true, dur: 'h' },
  { key: 'e/4', dur: 'w' }, { key: 'f/4' },
];

/* 18a. every item starts when the ones before it have finished */

const plan = sequenceSchedule(PASSAGE, 120, 10);
const secPerBeat = 0.5;                            // 120 BPM
let wantAt = 10;
const timing = [];
for (const item of PASSAGE) {
  timing.push(wantAt);
  wantAt += beatsOfDur[item.dur || 'q'] * secPerBeat;
}
check('a passage is laid out end to end, each item after the last',
      plan.every((e, i) => Math.abs(e.at - timing[i]) < 1e-9),
      `times ${plan.map(e => e.at).join(', ')}, want ${timing.join(', ')}`);
check('each item lasts as long as its note is worth',
      plan.every((e, i) => Math.abs(e.seconds - beatsOfDur[PASSAGE[i].dur || 'q'] * secPerBeat) < 1e-9),
      plan.map(e => e.seconds).join(', '));
check('a rest takes up its time like anything else',
      Math.abs(plan[2].seconds - 2 * secPerBeat) < 1e-9,
      `the half rest lasts ${plan[2].seconds}s, want ${2 * secPerBeat}s`);
check('an item with no duration is a quarter note, as everywhere else',
      Math.abs(plan[4].seconds - secPerBeat) < 1e-9);

/* 18b. tempo scales the whole passage and nothing else */

const slow = sequenceSchedule(PASSAGE, 60, 0);
const fast = sequenceSchedule(PASSAGE, 120, 0);
check('halving the tempo doubles every duration',
      slow.every((e, i) => Math.abs(e.seconds - fast[i].seconds * 2) < 1e-9));
check('halving the tempo doubles the length of the passage',
      Math.abs((slow[4].at + slow[4].seconds) - 2 * (fast[4].at + fast[4].seconds)) < 1e-9);
check('the passage starts where it was told to, whatever the tempo',
      sequenceSchedule(PASSAGE, 77, 42)[0].at === 42);

/* 18c. the tempo range is enforced */

for (const bpm of [30, 90, 200]) check(`playback at ${bpm} BPM is accepted`, setPlaybackBpm(bpm) === true);
for (const bpm of [29, 201, NaN, '90']) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  const took = setPlaybackBpm(bpm);
  console.error = realErr;
  check(`playback at ${typeof bpm === 'string' ? `"${bpm}"` : String(bpm)} BPM is refused`, took === false && logged === 1);
}
setPlaybackBpm(120);

/* 18d. playing a passage schedules a note per pitch and silence per rest */

audio.ctx.currentTime = 1000;
const played = scenario(() => playSequence(PASSAGE, { clef: 'treble', bpm: 120 }));
check('playing a passage raises no error', played.errors === 0);
const voices = played.nodes.filter(n => n.kind === 'oscillator');
check('a rest schedules no sound', voices.length === 4, `${voices.length} note(s) sounded, want 4 for 5 items with one rest`);
check('every note in a passage is scheduled in the future',
      voices.every(o => o.started[0] >= 1000),
      'a note was scheduled in the past and sounded the moment it was queued');
check('the notes are scheduled in the order they are written',
      voices.every((o, i) => i === 0 || o.started[0] > voices[i - 1].started[0]),
      voices.map(o => o.started[0]).join(', '));
// The sustain is held until a setValueAtTime late in the envelope; that is
// where the release begins, and it has to fall before the next item starts.
const releaseStarts = voices.map(osc => {
  const gain = played.nodes.find(n => n.kind === 'gain' && n.id === osc.id + 1);
  const sets = played.events.filter(e => e.id === gain.id && e.param === 'gain' && e.op === 'set');
  return { at: osc.started[0], releaseAt: sets[sets.length - 1].t };
});
const overrun = releaseStarts.filter((v, i) => {
  const next = releaseStarts[i + 1];
  return next && v.releaseAt >= next.at;
});
check('a note begins releasing before the next one starts, so a repeat re-articulates',
      releaseStarts.every(v => v.releaseAt > v.at) && overrun.length === 0,
      overrun.length ? `${overrun.length} note(s) still at full sustain when the next one begins`
                     : 'a note never reaches its release');
stopSequence();

/* 18e. a phrase can be played on its own */

audio.ctx.currentTime = 1100;
const phrase = scenario(() => playSequence(PASSAGE, { clef: 'treble', bpm: 120, from: 1, to: 3 }));
check('a phrase plays only the items inside it',
      phrase.nodes.filter(n => n.kind === 'oscillator').length === 2,
      'want 2 sounding notes from items 1-3, one of which is a rest');
check('a phrase starts its clock at the first item of the phrase',
      player.schedule.length === 3 && player.schedule[0].index === 1,
      `schedule covers ${player.schedule.map(e => e.index).join(', ')}`);
stopSequence();

for (const [from, to] of [[-1, 2], [0, 99], [3, 1], [1.5, 2]]) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  const took = playSequence(PASSAGE, { from, to });
  console.error = realErr;
  check(`a phrase of ${from}-${to} is refused`, took === false && logged === 1 && player.playing === false);
}

/* 18f. an empty passage, and a note the clef does not have */

// The range guard below would also reject an empty passage, so what this
// check is really for is the message: every other refusal in this file says
// plainly what was wrong, and "0--1 is not a phrase inside a passage of 0" is
// not that. Assert the wording, since that is the only thing the guard buys.
const emptySaid = [];
let realErr = console.error;
console.error = (m) => emptySaid.push(String(m));
const emptyTook = playSequence([]);
console.error = realErr;
check('an empty passage is refused',
      emptyTook === false && emptySaid.length === 1 && player.playing === false);
check('an empty passage is refused in plain words, not as a bad phrase range',
      emptySaid.length === 1 && /nothing to play/.test(emptySaid[0]),
      emptySaid[0]);

audio.ctx.currentTime = 1200;
let unknownLogged = 0;
realErr = console.error;
console.error = () => unknownLogged++;
playSequence([{ key: 'c/4' }, { key: 'zz/9' }, { key: 'd/4' }], { clef: 'treble', bpm: 120 });
console.error = realErr;
check('a note the clef does not have is reported and left silent',
      unknownLogged === 1 && player.schedule.length === 3,
      `logged ${unknownLogged}x, schedule covers ${player.schedule.length} item(s)`);
check('the silence still takes up its time, so the rest of the passage keeps its place',
      Math.abs(player.schedule[2].at - (player.schedule[0].at + 1.0)) < 1e-9,
      'the passage closed up over the missing note');
stopSequence();

/* 18g. pause remembers where it was, and silences what was already scheduled */

audio.ctx.currentTime = 1300;
playSequence(PASSAGE, { clef: 'treble', bpm: 120 });
audio.ctx.currentTime = 1300 + 0.1 + 0.5 + 0.25 + 0.1;    // part-way through the rest
const stillSounding = Array.from(activeVoices.keys()).filter(k => String(k).startsWith('seq-'));
check('playing leaves notes scheduled ahead of the moment', stillSounding.length > 0);

const paused = scenario(() => pauseSequence());
check('pausing reports that it paused', paused.result === true && player.playing === false);
check('pausing silences the notes already sitting in the audio clock',
      Array.from(activeVoices.keys()).filter(k => String(k).startsWith('seq-')).length === 0,
      'scheduled notes will keep sounding after the pause');
check('pausing leaves no wake-up timer behind', player.timer === null);
check('pausing remembers the item it had reached', player.cursor === 2,
      `cursor at ${player.cursor}, want 2 - the rest that was sounding`);

const resumed = scenario(() => resumeSequence());
check('resuming reports that it resumed', resumed.result === true && player.playing === true);
check('resuming picks up from where it paused rather than the top',
      player.schedule.length === 3 && player.schedule[0].index === 2,
      `resumed at item ${player.schedule.length ? player.schedule[0].index : 'none'}, want 2`);
stopSequence();
check('stopping rewinds to the start of the phrase', player.cursor === player.from);
check('pausing a passage that is not playing does nothing', pauseSequence() === false);

/* 18h. looping goes back round instead of stopping */

audio.ctx.currentTime = 1400;
playSequence(PASSAGE, { clef: 'treble', bpm: 120, loop: true });
const firstEnd = player.endsAt;
audio.ctx.currentTime = firstEnd + 0.01;
scenario(() => playerTick());
check('a looping passage carries on past its end',
      player.playing === true && player.endsAt > firstEnd,
      'the loop stopped at the end of the first time through');
check('a loop starts again from the top of the phrase',
      player.schedule[0].index === player.from);
stopSequence();

audio.ctx.currentTime = 1500;
playSequence(PASSAGE, { clef: 'treble', bpm: 120, loop: false });
audio.ctx.currentTime = player.endsAt + 0.01;
scenario(() => playerTick());
check('a passage that is not looping stops at the end',
      player.playing === false && player.timer === null);

check('playback leaves no wake-up timer behind', intervalsOpen === 0,
      `${intervalsOpen} interval(s) still running`);

/* ---- summary ----------------------------------------------------------- */

console.log(`\n${drawn} note renders checked (${accidentals} carrying accidentals)`);
if (failures) {
  console.log(`${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('all checks passed');
