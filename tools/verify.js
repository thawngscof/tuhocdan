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
  script[1] + '\n;return { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo, DURATIONS };'
)();
const { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo, DURATIONS } = page;

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
        push(attr(tag, 'y'));
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

/* ---- summary ----------------------------------------------------------- */

console.log(`\n${drawn} note renders checked (${accidentals} carrying accidentals)`);
if (failures) {
  console.log(`${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('all checks passed');
