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
  script[1] + '\n;return { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo, DURATIONS, buildPianoKeyboard, setKeyFingering, clearKeyFingering, playTone, ENVELOPE, VOICE_PEAK, activeVoices, metronome, metronomeQueue, startMetronome, stopMetronome, setMetronomeBpm, setMetronomeBeatsPerBar, metronomeScheduler, metronomeBeatAt, METRONOME_BPM, player, sequenceSchedule, playSequence, pauseSequence, resumeSequence, stopSequence, setPlaybackBpm, playerTick, CHORDS, PROGRESSIONS, chordVoicing, playChord, playProgression, setChordInversion, raiseOctave, SCALES, scalePassage, setScaleHand, playScale, showScale, currentSongNow: () => currentSong, SONGS, songBarStarts, songPhrases, setSong, playSong, playSongPhrase, showSong, LESSONS, LESSON_STORAGE_KEY, loadProgress, saveProgress, markLessonDone, resetProgress, openLessonCard, answerLessonQuiz, renderLessonList, renderLessonDetail, itemBeats, intervalBetween, INTERVAL_STEPS, INTERVAL_ROOT, showInterval, EAR_MODES, EAR_POOL, earTraining, setEarMode, newEarQuestion, playEarQuestion, answerEar, renderEarTraining };'
)();
const { renderScoreSVG, notesData, keyboardKeys, scrollKeyboardTo, DURATIONS, buildPianoKeyboard, setKeyFingering, clearKeyFingering, playTone, ENVELOPE, VOICE_PEAK, activeVoices, metronome, metronomeQueue, startMetronome, stopMetronome, setMetronomeBpm, setMetronomeBeatsPerBar, metronomeScheduler, metronomeBeatAt, METRONOME_BPM, player, sequenceSchedule, playSequence, pauseSequence, resumeSequence, stopSequence, setPlaybackBpm, playerTick, CHORDS, PROGRESSIONS, chordVoicing, playChord, playProgression, setChordInversion, raiseOctave, SCALES, scalePassage, setScaleHand, playScale, showScale, currentSongNow, SONGS, songBarStarts, songPhrases, setSong, playSong, playSongPhrase, showSong, LESSONS, LESSON_STORAGE_KEY, loadProgress, saveProgress, markLessonDone, resetProgress, openLessonCard, answerLessonQuiz, renderLessonList, renderLessonDetail, itemBeats, intervalBetween, INTERVAL_STEPS, INTERVAL_ROOT, showInterval, EAR_MODES, EAR_POOL, earTraining, setEarMode, newEarQuestion, playEarQuestion, answerEar, renderEarTraining } = page;

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
    } else if (letter === 'Q') {
      const x1 = num(), y1 = num(), ex = num(), ey = num();
      ys.push(rel ? y + y1 : y1, rel ? y + ey : ey);
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

/* ---- 20. left-hand chords -----------------------------------------------
 * The chords are checked against intervals derived from the chord's NAME,
 * not against the note list that feeds the page. Comparing the data to
 * itself would pass just as happily with a wrong third in it.
 */

const PITCH_CLASS = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
const pitchOf = (key) => {
  const m = /^([a-g])(#?)\/(\d)$/.exec(key);
  if (!m) return null;
  return { pc: (PITCH_CLASS[m[1]] + (m[2] ? 1 : 0)) % 12, octave: Number(m[3]) };
};
const absolutePitch = (key) => { const p = pitchOf(key); return p.pc + 12 * p.octave; };

// A chord's name says what it is: trailing m is minor, trailing 7 is a
// dominant seventh, anything else is major.
const QUALITY = { major: [0, 4, 7], minor: [0, 3, 7], seventh: [0, 4, 7, 10] };
function expectedChord(chordId) {
  const m = /^([A-G]#?)(m|7)?$/.exec(chordId);
  const rootPc = PITCH_CLASS[m[1][0].toLowerCase()] + (m[1].includes('#') ? 1 : 0);
  const quality = m[2] === 'm' ? 'minor' : m[2] === '7' ? 'seventh' : 'major';
  return { rootPc: rootPc % 12, want: QUALITY[quality].map(i => (rootPc + i) % 12).sort((a, b) => a - b) };
}

/* 20a. every chord is the chord its name claims */

const wrongChords = [];
for (const chordId of Object.keys(CHORDS)) {
  const notes = CHORDS[chordId].notes;
  const got = [...new Set(notes.map(k => pitchOf(k).pc))].sort((a, b) => a - b);
  const { rootPc, want } = expectedChord(chordId);
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    wrongChords.push(`${chordId}: notes ${notes.join(' ')} give pitches ${got.join(',')}, theory says ${want.join(',')}`);
  }
  if (pitchOf(notes[0]).pc !== rootPc) {
    wrongChords.push(`${chordId}: root position should start on the root, starts on ${notes[0]}`);
  }
}
check(`every chord matches the intervals its name implies (${Object.keys(CHORDS).length} chords)`,
      wrongChords.length === 0, wrongChords.join('\n        '));

const offKeyboard = [];
for (const [chordId, chord] of Object.entries(CHORDS)) {
  for (const key of chord.notes) {
    if (!keyboardKeys.some(k => k.key === key)) offKeyboard.push(`${chordId}: ${key}`);
    if (!notesData.bass.some(n => n.key === key)) offKeyboard.push(`${chordId}: ${key} has no bass-clef position`);
  }
}
check('every chord note is a key the bass clef can show', offKeyboard.length === 0, offKeyboard.join(', '));

const unnamedChords = Object.entries(CHORDS).filter(([, c]) => !c.label || !/[à-ỹ]/i.test(c.label + 'a'));
check('every chord has a Vietnamese name', unnamedChords.length === 0,
      unnamedChords.map(([id]) => id).join(', '));

/* 20b. an inversion reorders a chord without changing it */

const badInversions = [];
for (const chordId of Object.keys(CHORDS)) {
  const root = chordVoicing(chordId, 0);
  for (let inv = 1; inv < CHORDS[chordId].notes.length; inv++) {
    const voicing = chordVoicing(chordId, inv);
    if (!voicing) { badInversions.push(`${chordId} inversion ${inv}: refused`); continue; }

    const rootSet = [...new Set(root.map(k => pitchOf(k).pc))].sort((a, b) => a - b);
    const invSet = [...new Set(voicing.map(k => pitchOf(k).pc))].sort((a, b) => a - b);
    if (JSON.stringify(rootSet) !== JSON.stringify(invSet)) {
      badInversions.push(`${chordId} inversion ${inv}: ${voicing.join(' ')} is a different chord`);
    }
    if (pitchOf(voicing[0]).pc !== pitchOf(root[inv]).pc) {
      badInversions.push(`${chordId} inversion ${inv}: bass note is ${voicing[0]}, want the pitch of ${root[inv]}`);
    }
    const rising = voicing.every((k, i) => i === 0 || absolutePitch(k) > absolutePitch(voicing[i - 1]));
    if (!rising) badInversions.push(`${chordId} inversion ${inv}: ${voicing.join(' ')} is not in rising order`);
    if (voicing.length !== root.length) badInversions.push(`${chordId} inversion ${inv}: lost or gained a note`);
  }
}
check('an inversion reorders a chord without changing which chord it is',
      badInversions.length === 0, badInversions.join('\n        '));

check('root position is the chord as written',
      JSON.stringify(chordVoicing('C', 0)) === JSON.stringify(CHORDS.C.notes));
check('an omitted inversion means root position',
      JSON.stringify(chordVoicing('C')) === JSON.stringify(chordVoicing('C', 0)));

for (const [chordId, inv] of [['C', 3], ['C', -1], ['C', 1.5], ['G7', 4], ['H', 0], ['', 0]]) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  const got = chordVoicing(chordId, inv);
  console.error = realErr;
  check(`chordVoicing("${chordId}", ${inv}) is refused`, got === null && logged === 1,
        `returned ${JSON.stringify(got)}, logged ${logged}x`);
}

check('raising a note by an octave keeps its pitch class',
      pitchOf(raiseOctave('c#/3')).pc === pitchOf('c#/3').pc
        && pitchOf(raiseOctave('c#/3')).octave === 4);

/* 20c. a chord draws as one stack on one stem */

const chordSvg = (keys, dur) => {
  renderScoreSVG('probe', [{ keys, dur: dur || 'q' }], 'bass', 360, 170);
  return rendered.probe;
};

const cMajor = chordSvg(CHORDS.C.notes);
check('a three-note chord draws three noteheads',
      countFilledHeads(cMajor) === 3, `${countFilledHeads(cMajor)} notehead(s)`);
check('a chord draws one stem, not one per note',
      countStems(cMajor) === 1, `${countStems(cMajor)} stem(s)`);

const headXs = [...cMajor.matchAll(/translate\(([-\d.]+), ([-\d.]+)\) rotate/g)].map(m => ({ x: +m[1], y: +m[2] }));
check('the noteheads of a chord share one column',
      new Set(headXs.map(h => h.x)).size === 1,
      `noteheads at x ${headXs.map(h => h.x).join(', ')}`);
check('the noteheads of a chord are stacked at different heights',
      new Set(headXs.map(h => h.y)).size === 3,
      `noteheads at y ${headXs.map(h => h.y).join(', ')}`);

const stemLine = /<line x1="([-\d.]+)" y1="([-\d.]+)" x2="[-\d.]+" y2="([-\d.]+)" stroke="#0f172a"/.exec(cMajor);
const ys = headXs.map(h => h.y);
// Either direction is correct; which one depends on where the stack sits.
// An up stem is anchored at the lowest notehead and runs past the highest, a
// down stem the other way about.
const stemAnchor = +stemLine[2], stemTip = +stemLine[3];
const stackTop = Math.min(...ys), stackBottom = Math.max(...ys);
check('the stem reaches from one end of the stack past the other',
      (Math.abs(stemAnchor - stackBottom) < 0.01 && stemTip < stackTop)
        || (Math.abs(stemAnchor - stackTop) < 0.01 && stemTip > stackBottom),
      `stem runs ${stemAnchor} to ${stemTip}, heads span ${stackTop}-${stackBottom}`);

// The stack as a whole picks the direction, so a chord sitting high gets a
// down stem and one sitting low gets an up stem.
const stemDirOf = (keys) => {
  const svg = chordSvg(keys);
  const m = /<line x1="[-\d.]+" y1="([-\d.]+)" x2="[-\d.]+" y2="([-\d.]+)" stroke="#0f172a"/.exec(svg);
  return +m[2] < +m[1] ? 'up' : 'down';
};
check('a chord high on the staff hangs its stem downwards',
      stemDirOf(['e/3', 'g/3', 'b/3']) === 'down');
check('a chord low on the staff points its stem upwards',
      stemDirOf(['c/2', 'e/2', 'g/2']) === 'up');

// Dm in root position spans steps 4 to 8: its lowest note is on the up-stem
// side of the middle line while the stack as a whole sits above it. That is
// what tells "look at the whole stack" apart from "look at the bottom note".
check('stem direction follows the whole stack, not just its lowest note',
      stemDirOf(CHORDS.Dm.notes) === 'down',
      'as a stack Dm sits above the middle line; only its bottom note is below');

// 26 is the stem length a single note gets, mirrored from the renderer. A
// stem that merely passes the far notehead by a few pixels looks broken, and
// "somewhere beyond the far end" was loose enough to accept exactly that.
check('the stem clears the far end of the stack by a full stem length',
      Math.abs(Math.abs(stemTip - stemAnchor) - ((stackBottom - stackTop) + 26)) < 0.01,
      `stem is ${Math.abs(stemTip - stemAnchor)} long for a stack spanning ${stackBottom - stackTop}, want ${(stackBottom - stackTop) + 26}`);

/* 20d. one note given as a stack is still just a note */

const asStack = [];
for (const note of notesData.bass) {
  renderScoreSVG('probe', [{ key: note.key }], 'bass', 360, 170);
  const single = rendered.probe;
  renderScoreSVG('probe', [{ keys: [note.key] }], 'bass', 360, 170);
  if (rendered.probe !== single) asStack.push(note.noteName);
}
check('a one-note stack renders exactly like a plain note', asStack.length === 0,
      'differs for: ' + asStack.slice(0, 5).join(', '));

/* 20e. two notes a second apart step aside instead of overlapping */

const seconds = chordSvg(chordVoicing('G7', 1));    // ends f/4, g/4 - a second
const secondXs = [...seconds.matchAll(/translate\(([-\d.]+), [-\d.]+\) rotate/g)].map(m => +m[1]);
check('a second in a chord shifts one notehead off the column',
      new Set(secondXs).size === 2,
      `all four noteheads sit at x ${[...new Set(secondXs)].join(', ')} - two of them overlap`);
check('only the one note of the pair steps aside',
      secondXs.filter(x => x === secondXs[0]).length === 3,
      `${secondXs.filter(x => x === secondXs[0]).length} notehead(s) left in the column, want 3`);

/* 20f. ledger lines belong to the stack, not to each note */

const lowChord = chordSvg(['c/2', 'e/2', 'g/2']);
const ledgerYs = [...lowChord.matchAll(/<line x1="[-\d.]+" y1="([-\d.]+)"[^>]*stroke="#334155"/g)].map(m => m[1]);
check('a chord below the staff draws each ledger line once',
      ledgerYs.length === new Set(ledgerYs).size,
      `ledger lines at ${ledgerYs.join(', ')} - some are drawn twice`);

/* 20g. a chord in the stack that the clef cannot show */

let missingLogged = 0;
let chordErr = console.error;
console.error = () => missingLogged++;
renderScoreSVG('probe', [{ keys: ['c/3', 'zz/9', 'g/3'] }], 'bass', 360, 170);
console.error = chordErr;
check('a note the clef cannot show is reported and the rest of the chord still draws',
      missingLogged === 1 && countFilledHeads(rendered.probe) === 2,
      `logged ${missingLogged}x, drew ${countFilledHeads(rendered.probe)} notehead(s)`);

/* 20h. playing a chord */

audio.ctx.currentTime = 2000;
const block = scenario(() => playChord('C'));
check('playing a chord raises no error', block.errors === 0 && block.result === true);
const blockOsc = block.nodes.filter(n => n.kind === 'oscillator');
check('a block chord sounds every note', blockOsc.length === 3, `${blockOsc.length} note(s)`);
check('a block chord sounds its notes together',
      new Set(blockOsc.map(o => o.started[0])).size === 1,
      `starts at ${blockOsc.map(o => o.started[0]).join(', ')}`);
check('every note of a chord goes through the limiter',
      block.nodes.filter(n => n.kind === 'gain').every(g => g.out.includes(limiter)));

audio.ctx.currentTime = 2100;
const broken = scenario(() => playChord('C', { broken: true }));
const brokenOsc = broken.nodes.filter(n => n.kind === 'oscillator');
check('a broken chord spreads its notes out in time',
      new Set(brokenOsc.map(o => o.started[0])).size === 3
        && brokenOsc.every((o, i) => i === 0 || o.started[0] > brokenOsc[i - 1].started[0]),
      `starts at ${brokenOsc.map(o => o.started[0]).join(', ')}`);

audio.ctx.currentTime = 2200;
const seventh = scenario(() => playChord('G7', { inversion: 2 }));
check('an inverted seventh chord sounds all four notes',
      seventh.nodes.filter(n => n.kind === 'oscillator').length === 4);

let badChordLogged = 0;
chordErr = console.error;
console.error = () => badChordLogged++;
const refusedChord = playChord('Bdim');
console.error = chordErr;
check('playing a chord that does not exist is refused',
      refusedChord === false && badChordLogged === 1);

/* 20i. the three basic positions are the only ones offered */

check('the three basic positions are accepted', [0, 1, 2].every(i => setChordInversion(i) === true));
for (const bad of [3, -1, 1.5, '1']) {
  let logged = 0;
  chordErr = console.error;
  console.error = () => logged++;
  const took = setChordInversion(bad);
  console.error = chordErr;
  check(`inversion ${typeof bad === 'string' ? `"${bad}"` : bad} is refused`, took === false && logged === 1);
}
setChordInversion(0);

/* 20j. progressions */

const badProgressions = [];
for (const progression of PROGRESSIONS) {
  if (progression.chords.length !== 4) badProgressions.push(`${progression.name}: ${progression.chords.length} chords`);
  for (const id of progression.chords) if (!CHORDS[id]) badProgressions.push(`${progression.name}: no chord "${id}"`);
  const named = progression.name.split('–').map(s => s.trim());
  if (JSON.stringify(named) !== JSON.stringify(progression.chords)) {
    badProgressions.push(`${progression.name}: the name does not match ${progression.chords.join(' ')}`);
  }
}
check('every progression is four real chords, named after what it plays',
      badProgressions.length === 0, badProgressions.join('\n        '));

audio.ctx.currentTime = 2300;
setPlaybackBpm(120);
const prog = scenario(() => playProgression(0));
const progOsc = prog.nodes.filter(n => n.kind === 'oscillator');
check('a progression sounds every note of every chord',
      progOsc.length === PROGRESSIONS[0].chords.reduce((n, id) => n + CHORDS[id].notes.length, 0),
      `${progOsc.length} note(s)`);
const chordStarts = [...new Set(progOsc.map(o => o.started[0]))].sort((a, b) => a - b);
check('a progression puts one chord to the bar',
      chordStarts.length === 4 && chordStarts.every((t, i) => i === 0 || Math.abs((t - chordStarts[i - 1]) - 2) < 1e-9),
      `chords start at ${chordStarts.join(', ')} - at 120 BPM a bar of 4 is 2s`);

let badProgLogged = 0;
chordErr = console.error;
console.error = () => badProgLogged++;
const refusedProg = playProgression(9);
console.error = chordErr;
check('a progression that does not exist is refused', refusedProg === false && badProgLogged === 1);

/* ---- 21. the C major scale ----------------------------------------------
 * The notes are checked against the major scale's own interval pattern, and
 * the fingering against what a hand can physically do: five fingers, no
 * finger twice in a row, and exactly one place where the thumb turns.
 */

const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11, 12];   // tone tone semitone tone tone tone semitone

for (const [hand, scale] of Object.entries(SCALES)) {
  const pitches = scale.keys.map(absolutePitch);
  const fromRoot = pitches.map(p => p - pitches[0]);
  check(`${hand}: the notes spell a major scale`,
        JSON.stringify(fromRoot) === JSON.stringify(MAJOR_STEPS),
        `semitones from the root: ${fromRoot.join(', ')}, want ${MAJOR_STEPS.join(', ')}`);

  check(`${hand}: the scale starts and ends on C, an octave apart`,
        /^c\//.test(scale.keys[0]) && /^c\//.test(scale.keys[7])
          && pitches[7] - pitches[0] === 12);

  const letters = scale.keys.map(k => k[0]);
  check(`${hand}: the scale steps through every letter in turn`,
        new Set(letters.slice(0, 7)).size === 7,
        `letters ${letters.join(' ')} - a scale uses each once`);

  check(`${hand}: every note is on the keyboard and in this hand's clef`,
        scale.keys.every(k => keyboardKeys.some(kk => kk.key === k))
          && scale.keys.every(k => notesData[scale.clef].some(n => n.key === k)));

  /* the fingering has to be playable by a hand */

  const f = scale.fingers;
  check(`${hand}: the fingering names one finger per note, 1 to 5`,
        f.length === scale.keys.length && f.every(n => Number.isInteger(n) && n >= 1 && n <= 5),
        f.join(', '));
  check(`${hand}: no finger plays twice in a row`,
        f.every((n, i) => i === 0 || n !== f[i - 1]), f.join(', '));

  // Everywhere but the turn, the hand moves one finger to the next note. The
  // one place it does not is where the thumb passes under, or a finger crosses
  // back over the thumb - and it has to involve the thumb either way.
  const jumps = f.map((n, i) => (i === 0 ? null : n - f[i - 1])).slice(1);
  const irregular = jumps.map((d, i) => ({ at: i + 1, d })).filter(j => Math.abs(j.d) !== 1);
  check(`${hand}: the hand changes position exactly once going up`,
        irregular.length === 1,
        `position changes at ${irregular.map(j => `note ${j.at}`).join(', ') || 'nowhere'}`);
  check(`${hand}: the position change is a thumb turn`,
        irregular.length === 1 && (f[irregular[0].at] === 1 || f[irregular[0].at - 1] === 1),
        irregular.length === 1 ? `fingers ${f[irregular[0].at - 1]} then ${f[irregular[0].at]} - neither is the thumb` : '');
  check(`${hand}: the turn is where the scale says it is`,
        irregular.length === 1 && irregular[0].at === scale.turn.index,
        irregular.length === 1 ? `the fingering turns at note ${irregular[0].at}, turn.index says ${scale.turn.index}` : '');

  check(`${hand}: the turn is explained both going up and coming down`,
        Boolean(scale.turn.up) && Boolean(scale.turn.down) && scale.turn.up !== scale.turn.down);
}

/* 21b. going up and coming down mirror each other */

check('the two hands finger the scale as mirror images of one another',
      JSON.stringify(SCALES.right.fingers) === JSON.stringify(SCALES.left.fingers.slice().reverse()),
      `right ${SCALES.right.fingers.join('')}, left reversed ${SCALES.left.fingers.slice().reverse().join('')}`);

/* 21c. the passage runs up and back down */

for (const hand of Object.keys(SCALES)) {
  const scale = SCALES[hand];
  const passage = scalePassage(hand);

  check(`${hand}: the passage runs up and back down without striking the top note twice`,
        passage.length === 15,
        `${passage.length} notes, want 8 up plus 7 down`);
  check(`${hand}: it goes up to the top and back to the bottom`,
        passage[0].key === scale.keys[0] && passage[7].key === scale.keys[7]
          && passage[14].key === scale.keys[0]);

  const rising = passage.slice(0, 8).every((it, i) => i === 0 || absolutePitch(it.key) > absolutePitch(passage[i - 1].key));
  const falling = passage.slice(8).every((it, i) => i === 0 ? absolutePitch(it.key) < absolutePitch(passage[7].key)
                                                            : absolutePitch(it.key) < absolutePitch(passage[i + 7].key));
  check(`${hand}: it rises to the top then falls all the way back`, rising && falling);

  check(`${hand}: coming down uses the same finger on each note as going up`,
        passage.slice(8).every(it => {
          const i = scale.keys.indexOf(it.key);
          return it.finger === scale.fingers[i];
        }),
        'the descending fingering has drifted from the ascending one');

  const beats = passage.reduce((n, it) => n + DURATIONS[it.dur || 'q'].beats, 0);
  check(`${hand}: the passage fills whole bars of 4/4 (${beats} beats)`, beats % 4 === 0, `${beats} beats`);
  check(`${hand}: the last note is held`, passage[14].dur === 'h');
}

let scaleLogged = 0;
let scaleErr = console.error;
console.error = () => scaleLogged++;
const noScale = scalePassage('third');
console.error = scaleErr;
check('a hand with no scale is refused', noScale === null && scaleLogged === 1);

/* 21d. the scale draws, and every note carries its finger */

for (const hand of Object.keys(SCALES)) {
  const scale = SCALES[hand];
  renderScoreSVG('probe', scalePassage(hand), scale.clef, 760, 180, '4/4');
  const fingers = [...rendered.probe.matchAll(/<text[^>]*fill="#7c3aed"[^>]*>(\d)<\/text>/g)].map(m => Number(m[1]));
  check(`${hand}: every note of the drawn scale carries its finger`,
        fingers.length === 15, `${fingers.length} finger number(s) for 15 notes`);
  check(`${hand}: the drawn fingering matches the scale`,
        JSON.stringify(fingers.slice(0, 8)) === JSON.stringify(scale.fingers),
        `drew ${fingers.slice(0, 8).join('')}, want ${scale.fingers.join('')}`);
  check(`${hand}: the scale divides into whole bars with no complaint`,
        (() => {
          const said = [];
          const realWarn = console.warn;
          console.warn = (m) => said.push(m);
          renderScoreSVG('probe', scalePassage(hand), scale.clef, 760, 180, '4/4');
          console.warn = realWarn;
          return said.length === 0;
        })());
}

/* 21e. choosing a hand, and playing */

check('the right hand is offered', setScaleHand('right') === true);
check('the left hand is offered', setScaleHand('left') === true);
let handLogged = 0;
scaleErr = console.error;
console.error = () => handLogged++;
const badHand = setScaleHand('foot');
console.error = scaleErr;
check('a hand that does not exist is refused', badHand === false && handLogged === 1);

setScaleHand('right');
audio.ctx.currentTime = 3000;
const scalePlay = scenario(() => playScale());
check('playing the scale raises no error', scalePlay.errors === 0 && scalePlay.result === true);
check('playing the scale sounds all fifteen notes',
      scalePlay.nodes.filter(n => n.kind === 'oscillator').length === 15,
      `${scalePlay.nodes.filter(n => n.kind === 'oscillator').length} note(s)`);
check('playing the scale puts the fingering on the keys',
      (() => {
        const divs = keyDivs(rendered[KEYBOARD]);
        return SCALES.right.keys.every((key, i) =>
          badgeIn(divs[key.replace('/', '_')]) === String(SCALES.right.fingers[i]));
      })(),
      'the keys are not showing the scale fingering');
stopSequence();
clearKeyFingering();

/* ---- 22. songs ----------------------------------------------------------
 * The melodies themselves cannot be checked by arithmetic - only an ear
 * knows whether they are the right tune. What is checkable is everything
 * around them: that the bars add up, that every note is playable, that each
 * song says where it came from, and that the phrases cover the whole song.
 */

check(`there are between four and six songs (${SONGS.length})`,
      SONGS.length >= 4 && SONGS.length <= 6);
check('every song has its own id', new Set(SONGS.map(s => s.id)).size === SONGS.length);
check('every song has a title and says where it came from',
      SONGS.every(s => s.title && s.origin));
check('every song records why it is free to use',
      SONGS.every(s => /phạm vi công cộng/.test(s.origin)),
      SONGS.filter(s => !/phạm vi công cộng/.test(s.origin)).map(s => s.title).join(', '));

for (const song of SONGS) {
  // Ask this first: songBarStarts reads DURATIONS[...].beats, so an unknown
  // duration crashes the run before the check can name the problem.
  check(`${song.title}: every duration is one the renderer knows`,
        song.notes.every(n => DURATIONS[n.dur || 'q']),
        song.notes.filter(n => !DURATIONS[n.dur || 'q']).map(n => `${n.key} dur=${n.dur}`).join(', '));

  const { starts, capacity, beats } = songBarStarts(song);

  check(`${song.title}: the bars add up (${beats} beats of ${song.timeSig})`,
        Math.abs(beats % capacity) < 1e-9,
        `${beats} beats does not divide by ${capacity}`);

  // The renderer has its own opinion about bars; borrow it rather than trust
  // the arithmetic above on its own.
  const complaints = [];
  const realWarn = console.warn;
  console.warn = (m) => complaints.push(m);
  renderScoreSVG('probe', song.notes, song.clef, 1120, 190, song.timeSig);
  console.warn = realWarn;
  check(`${song.title}: the staff draws it without complaint`, complaints.length === 0,
        complaints.slice(0, 3).join('\n        '));

  check(`${song.title}: every note is on the keyboard and in its clef`,
        song.notes.every(n => n.rest || (keyboardKeys.some(k => k.key === n.key)
                                         && notesData[song.clef].some(d => d.key === n.key))),
        song.notes.filter(n => !n.rest && !notesData[song.clef].some(d => d.key === n.key))
                  .map(n => n.key).join(', '));

  // A beginner piece should stay within reach of one hand position plus a
  // little: an octave and a half is already generous.
  const pitches = song.notes.filter(n => !n.rest).map(n => absolutePitch(n.key));
  check(`${song.title}: it stays inside a beginner's reach (${Math.max(...pitches) - Math.min(...pitches)} semitones)`,
        Math.max(...pitches) - Math.min(...pitches) <= 18);

  /* phrases */

  const phrases = songPhrases(song);
  check(`${song.title}: it divides into phrases`, phrases.length >= 2, `${phrases.length} phrase(s)`);
  check(`${song.title}: the phrases cover the song with no gap and no overlap`,
        phrases[0].from === 0
          && phrases[phrases.length - 1].to === song.notes.length - 1
          && phrases.every((p, i) => i === 0 || p.from === phrases[i - 1].to + 1),
        phrases.map(p => `${p.from}-${p.to}`).join(' '));
  check(`${song.title}: every phrase starts on a downbeat`,
        phrases.every(p => starts.includes(p.from)),
        phrases.map(p => p.from).join(', ') + ' vs bar starts ' + starts.join(', '));
  check(`${song.title}: every phrase is a phrase the player will accept`,
        phrases.every(p => Number.isInteger(p.from) && Number.isInteger(p.to)
                           && p.from >= 0 && p.to < song.notes.length && p.from <= p.to));
}

/* 22b. a song that simplifies the original says so */

const simplified = SONGS.filter(s => s.simplified);
check('any song that departs from the original admits it in writing',
      simplified.every(s => s.simplified.length > 20),
      'a `simplified` note is too thin to be useful');
// T15 brought dotted notes, so the Ode to Joy cadence no longer has to be
// flattened and no longer carries a `simplified` note.
const ode = SONGS.find(s => s.id === 'khuc-hoan-ca');
check('Khúc Hoan Ca no longer needs a simplification note', !ode.simplified);
check("Khúc Hoan Ca uses Beethoven's dotted cadence",
      ode.notes.filter(n => n.dot).length === 2 && ode.notes.filter(n => n.dur === 'e').length === 2,
      `${ode.notes.filter(n => n.dot).length} dotted note(s), ${ode.notes.filter(n => n.dur === 'e').length} eighth(s)`);

/* 22c. choosing and playing */

check('a song can be chosen by id', setSong('anh-sao-nho') === true && currentSongNow().id === 'anh-sao-nho');
let songLogged = 0;
let songErr = console.error;
console.error = () => songLogged++;
const noSong = setSong('bai-khong-co');
console.error = songErr;
check('a song that does not exist is refused', noSong === false && songLogged === 1);
const stillCurrent = currentSongNow();
check('a refused song leaves the current one alone',
      Boolean(stillCurrent) && stillCurrent.id === 'anh-sao-nho',
      stillCurrent ? `now on "${stillCurrent.id}"` : 'the refused lookup cleared the current song');

setSong('chu-cuu-nho');
audio.ctx.currentTime = 4000;
const songPlay = scenario(() => playSong());
check('playing a song raises no error', songPlay.errors === 0 && songPlay.result === true);
check('playing a song sounds every note',
      songPlay.nodes.filter(n => n.kind === 'oscillator').length
        === SONGS.find(s => s.id === 'chu-cuu-nho').notes.filter(n => !n.rest).length);
stopSequence();

audio.ctx.currentTime = 4100;
const phrasePlay = scenario(() => playSongPhrase(0));
const wantPhrase = songPhrases(SONGS.find(s => s.id === 'chu-cuu-nho'))[0];
check('playing a phrase sounds only that phrase',
      phrasePlay.result === true
        && phrasePlay.nodes.filter(n => n.kind === 'oscillator').length === (wantPhrase.to - wantPhrase.from + 1),
      `${phrasePlay.nodes.filter(n => n.kind === 'oscillator').length} note(s) for a phrase of ${wantPhrase.to - wantPhrase.from + 1}`);
check('a phrase is set to loop, so it can be practised', player.loop === true);

let phraseLogged = 0;
songErr = console.error;
console.error = () => phraseLogged++;
const noPhrase = playSongPhrase(99);
console.error = songErr;
check('a phrase that does not exist is refused', noPhrase === false && phraseLogged === 1);
stopSequence();
setSong('buom-vang');

/* ---- 23. the lesson path -------------------------------------------------
 * A lesson is a route through the app, so the practice step is checked
 * against the functions the page actually declares - the same trap as a
 * button wired to a misspelled handler, and just as invisible until clicked.
 */

check(`there are ten lessons (${LESSONS.length})`, LESSONS.length === 10);
check('the lessons are numbered 1 to 10 with no gaps',
      LESSONS.every((l, i) => l.id === i + 1),
      LESSONS.map(l => l.id).join(', '));

// The order the backlog set out, by the subject each lesson covers.
const LESSON_SUBJECTS = [
  /bàn phím/i, /khuông nhạc|khóa Sol/i, /đọc nốt/i, /khóa Fa/i, /trường độ/i,
  /nhịp/i, /dấu lặng/i, /gam|ngón/i, /hợp âm/i, /hai tay|bài hát/i,
];
check('the lessons run in the order the backlog laid out',
      LESSONS.every((l, i) => LESSON_SUBJECTS[i].test(l.title)),
      LESSONS.map((l, i) => LESSON_SUBJECTS[i].test(l.title) ? '' : `${l.id}: "${l.title}"`).filter(Boolean).join(', '));

const declaredPageFns = new Set([...script[1].matchAll(/function\s+([A-Za-z_$][\w$]*)/g)].map(m => m[1]));

for (const lesson of LESSONS) {
  const where = `lesson ${lesson.id}`;
  check(`${where}: has a title and a goal`, Boolean(lesson.title) && Boolean(lesson.goal));
  check(`${where}: explains itself in at least two paragraphs`,
        Array.isArray(lesson.theory) && lesson.theory.length >= 2
          && lesson.theory.every(t => typeof t === 'string' && t.length > 40),
        `${lesson.theory.length} paragraph(s)`);

  check(`${where}: sends the learner somewhere in the app`,
        Boolean(lesson.practice && lesson.practice.label && lesson.practice.action));
  const called = [...lesson.practice.action.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].map(m => m[1]);
  check(`${where}: its practice step calls a function that exists (${called.join(', ')})`,
        called.length > 0 && called.every(fn => declaredPageFns.has(fn)),
        called.filter(fn => !declaredPageFns.has(fn)).join(', '));

  check(`${where}: ends with a check of at least three questions`,
        Array.isArray(lesson.quiz) && lesson.quiz.length >= 3);

  const badQuiz = [];
  lesson.quiz.forEach((item, qi) => {
    if (!item.q || item.q.length < 10) badQuiz.push(`q${qi}: question too thin`);
    if (!Array.isArray(item.options) || item.options.length < 3) badQuiz.push(`q${qi}: fewer than three options`);
    if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) {
      badQuiz.push(`q${qi}: answer ${item.answer} is not one of the options`);
    }
    if (new Set(item.options).size !== item.options.length) badQuiz.push(`q${qi}: two options are the same`);
  });
  check(`${where}: every question has options and one real answer among them`,
        badQuiz.length === 0, badQuiz.join('; '));
}

// The right answer must not always be the first option, or the check can be
// passed without reading anything.
const answerSpread = new Set(LESSONS.flatMap(l => l.quiz.map(q => q.answer)));
check('the right answer is not always in the same place',
      answerSpread.size >= 2,
      `every answer is option ${[...answerSpread][0]}`);

/* 23b. progress survives a round trip, and distrusts what it reads */

const store = {};
global.window.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

resetProgress();
check('progress starts empty', loadProgress().done.length === 0);

check('finishing a lesson is recorded', markLessonDone(3) === true && loadProgress().done.includes(3));
markLessonDone(1);
check('progress comes back in order', JSON.stringify(loadProgress().done) === '[1,3]',
      JSON.stringify(loadProgress().done));
markLessonDone(3);
check('finishing the same lesson twice records it once',
      JSON.stringify(loadProgress().done) === '[1,3]', JSON.stringify(loadProgress().done));
// loadProgress removes duplicates as it reads, so checking through it would
// hide a duplicate that really was written. Look at the stored text itself.
check('finishing the same lesson twice stores it once',
      JSON.parse(store[LESSON_STORAGE_KEY]).done.length === 2,
      `stored ${store[LESSON_STORAGE_KEY]}`);

let lessonLogged = 0;
let lessonErr = console.error;
console.error = () => lessonLogged++;
const noLesson = markLessonDone(99);
console.error = lessonErr;
check('finishing a lesson that does not exist is refused',
      noLesson === false && lessonLogged === 1 && !loadProgress().done.includes(99));

check('resetting clears the record', resetProgress() === true && loadProgress().done.length === 0);

// Anything at all can be sitting in localStorage - an older version of this
// page, another tab, a person with the dev tools open.
for (const [label, raw] of [
  ['junk that is not JSON', 'not json at all'],
  ['JSON that is not an object', '"hello"'],
  ['an object with no done list', '{"foo":1}'],
  ['a done list that is not a list', '{"done":"1,2,3"}'],
  ['lesson numbers that do not exist', '{"done":[1,99,-5,"3"]}'],
  ['the same lesson twice', '{"done":[2,2,2]}'],
]) {
  store[LESSON_STORAGE_KEY] = raw;
  const errs = [];
  lessonErr = console.error;
  console.error = (m) => errs.push(m);
  // "Survives" means exactly that: it must not throw. Letting the exception
  // out would end the run rather than fail this check, which reads as a crash
  // in whatever ran next instead of as the storage bug it is.
  let got = null, threw = null;
  try { got = loadProgress(); } catch (e) { threw = e; }
  console.error = lessonErr;
  check(`saved progress survives ${label}`,
        !threw && got && Array.isArray(got.done)
          && got.done.every(id => LESSONS.some(l => l.id === id))
          && new Set(got.done).size === got.done.length,
        threw ? `it threw instead: ${threw.message}` : `read back ${JSON.stringify(got.done)}`);
}
store[LESSON_STORAGE_KEY] = '{"done":[1,99,-5,"3"]}';
check('a saved lesson number that does not exist is thrown away',
      JSON.stringify(loadProgress().done) === '[1]', JSON.stringify(loadProgress().done));

// Storage that throws - a private window, or site data blocked.
const workingStorage = global.window.localStorage;
global.window.localStorage = {
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('denied'); },
};
const thrownErrs = [];
lessonErr = console.error;
console.error = (m) => thrownErrs.push(m);
let fallback = null, fallbackThrew = null, saved = null, saveThrew = null;
try { fallback = loadProgress(); } catch (e) { fallbackThrew = e; }
try { saved = saveProgress(); } catch (e) { saveThrew = e; }
console.error = lessonErr;
check('storage that refuses to be read starts the learner fresh rather than breaking',
      !fallbackThrew && fallback && fallback.done.length === 0 && thrownErrs.length >= 1,
      fallbackThrew ? `it threw instead: ${fallbackThrew.message}` : '');
check('storage that refuses to be written reports it and carries on',
      !saveThrew && saved === false,
      saveThrew ? `it threw instead: ${saveThrew.message}` : '');
global.window.localStorage = workingStorage;
resetProgress();

/* 23c. working through a lesson */

check('a lesson can be opened', openLessonCard(5) === true);
let openLogged = 0;
lessonErr = console.error;
console.error = () => openLogged++;
const noCard = openLessonCard(42);
console.error = lessonErr;
check('a lesson that does not exist cannot be opened', noCard === false && openLogged === 1);

openLessonCard(1);
const lesson1 = LESSONS[0];
check('a right answer is reported as right',
      answerLessonQuiz(1, 0, lesson1.quiz[0].answer) === true);
check('a wrong answer is reported as wrong',
      answerLessonQuiz(1, 1, (lesson1.quiz[1].answer + 1) % lesson1.quiz[1].options.length) === false);

let quizLogged = 0;
lessonErr = console.error;
console.error = () => quizLogged++;
let noQuestion = null, quizThrew = null;
try { noQuestion = answerLessonQuiz(1, 99, 0); } catch (e) { quizThrew = e; }
console.error = lessonErr;
check('answering a question that does not exist is refused',
      !quizThrew && noQuestion === false && quizLogged === 1,
      quizThrew ? `it threw instead: ${quizThrew.message}` : '');

resetProgress();
openLessonCard(2);
const lesson2 = LESSONS[1];
lesson2.quiz.forEach((item, qi) => answerLessonQuiz(2, qi, item.answer));
check('getting every question right finishes the lesson',
      loadProgress().done.includes(2), 'the lesson was not marked done');

resetProgress();
openLessonCard(2);
lesson2.quiz.forEach((item, qi) =>
  answerLessonQuiz(2, qi, qi === 0 ? (item.answer + 1) % item.options.length : item.answer));
check('getting one question wrong does not finish the lesson',
      !loadProgress().done.includes(2), 'the lesson was marked done on a wrong answer');
resetProgress();

/* ---- 24. dotted notes and ties ------------------------------------------
 * A dot means one thing - half again - and everything that counts beats has
 * to agree about it, or a passage divides into bars one way and sounds
 * another.
 */

const DOTTED = [['w', 6], ['h', 3], ['q', 1.5], ['e', 0.75]];
for (const [dur, want] of DOTTED) {
  check(`a dotted ${DURATIONS[dur].name} is worth ${want} beats`,
        itemBeats({ dur, dot: true }) === want, `${itemBeats({ dur, dot: true })}`);
  check(`an undotted ${DURATIONS[dur].name} is unaffected`,
        itemBeats({ dur }) === DURATIONS[dur].beats);
}
check('a dot on an item with no duration dots a quarter note', itemBeats({ dot: true }) === 1.5);
check('a dotted rest is worth the same as a dotted note',
      itemBeats({ rest: true, dur: 'h', dot: true }) === 3);

/* 24a. the dot is drawn, and only when asked for */

const dotsIn = (svg) => (svg.match(/<circle cx="[-\d.]+" cy="[-\d.]+" r="2\.2"/g) || []).length;
renderScoreSVG('probe', [{ key: 'g/4' }], 'treble', 340, 160);
check('a plain note draws no dot', dotsIn(rendered.probe) === 0);
renderScoreSVG('probe', [{ key: 'g/4', dot: true }], 'treble', 340, 160);
check('a dotted note draws one dot', dotsIn(rendered.probe) === 1);
renderScoreSVG('probe', [{ keys: ['c/3', 'e/3', 'g/3'], dot: true }], 'bass', 340, 160);
check('a dotted chord dots every note in the stack', dotsIn(rendered.probe) === 3);

const dotAt = (svg) => {
  const m = /<circle cx="([-\d.]+)" cy="([-\d.]+)" r="2\.2"/.exec(svg);
  return m ? { x: +m[1], y: +m[2] } : null;
};
const headAt = (svg) => {
  const m = /translate\(([-\d.]+), ([-\d.]+)\) rotate/.exec(svg);
  return m ? { x: +m[1], y: +m[2] } : null;
};

// b/4 sits on a line in the treble clef, a/4 in a space.
const onLine = notesData.treble.find(n => n.step % 2 === 0 && n.step >= 0 && n.step <= 8);
const inSpace = notesData.treble.find(n => n.step % 2 === 1 && n.step >= 0 && n.step <= 8);

renderScoreSVG('probe', [{ key: inSpace.key, dot: true }], 'treble', 340, 160);
const spaceDot = dotAt(rendered.probe), spaceHead = headAt(rendered.probe);
check('a note in a space keeps its dot level with the notehead',
      Math.abs(spaceDot.y - spaceHead.y) < 0.01 && spaceDot.x > spaceHead.x,
      `dot at ${JSON.stringify(spaceDot)}, notehead at ${JSON.stringify(spaceHead)}`);

renderScoreSVG('probe', [{ key: onLine.key, dot: true }], 'treble', 340, 160);
const lineDot = dotAt(rendered.probe), lineHead = headAt(rendered.probe);
check('a note on a line lifts its dot into the space above',
      Math.abs(lineDot.y - (lineHead.y - 5)) < 0.01 && lineDot.x > lineHead.x,
      `dot at y=${lineDot.y}, notehead at y=${lineHead.y}`);

const dotClipped = [];
for (const clef of CLEFS) {
  for (const note of notesData[clef]) {
    for (const dur of ['w', 'h', 'q', 'e']) {
      renderScoreSVG('probe', [{ key: note.key, dur, dot: true }], clef, 340, 160);
      const clip = clipReport(rendered.probe);
      if (clip) dotClipped.push(`${clef} ${note.noteName} ${dur}: ${clip}`);
    }
  }
}
check('a dot never falls outside the fitted viewBox', dotClipped.length === 0,
      dotClipped.slice(0, 3).join('\n        '));

/* 24b. bars count a dotted note as what it is worth */

const dottedBar = [{ key: 'c/4', dur: 'h', dot: true }, { key: 'c/4' }];   // 3 + 1 = 4
const dottedComplaints = [];
let realWarn = console.warn;
console.warn = (m) => dottedComplaints.push(m);
renderScoreSVG('probe', dottedBar, 'treble', 340, 160, '4/4');
console.warn = realWarn;
check('a dotted half and a quarter fill a bar of 4/4', dottedComplaints.length === 0,
      dottedComplaints.join('; '));

const wrongBar = [];
console.warn = (m) => wrongBar.push(m);
renderScoreSVG('probe', [{ key: 'c/4', dur: 'h' }, { key: 'c/4' }], 'treble', 340, 160, '4/4');
console.warn = realWarn;
check('without the dot the same bar comes up short', wrongBar.length === 1);

/* 24c. a tie joins two notes of the same pitch */

const tiesIn = (svg) => (svg.match(/<path d="M [^"]*Q [^"]*" fill="none" stroke="#0f172a" stroke-width="1\.6"/g) || []).length;

renderScoreSVG('probe', [{ key: 'g/4', tie: true }, { key: 'g/4' }], 'treble', 340, 160);
check('a tie draws one curve between the two notes', tiesIn(rendered.probe) === 1);
renderScoreSVG('probe', [{ key: 'g/4' }, { key: 'g/4' }], 'treble', 340, 160);
check('two notes with no tie draw no curve', tiesIn(rendered.probe) === 0);

renderScoreSVG('probe', [{ key: 'g/4', tie: true }, { key: 'g/4' }], 'treble', 340, 160);
const tieCurve = /<path d="M ([-\d.]+) [-\d.]+ Q ([-\d.]+) [-\d.]+, ([-\d.]+) [-\d.]+"/.exec(rendered.probe);
const tieHeads = [...rendered.probe.matchAll(/translate\(([-\d.]+), [-\d.]+\) rotate/g)].map(m => +m[1]);
check('the tie runs from the first notehead to the second',
      +tieCurve[1] > tieHeads[0] && +tieCurve[3] < tieHeads[1]
        && +tieCurve[2] > tieHeads[0] && +tieCurve[2] < tieHeads[1],
      `curve ${tieCurve[1]} → ${tieCurve[3]}, noteheads at ${tieHeads.join(', ')}`);

for (const [label, items] of [
  ['a tie on the last note', [{ key: 'g/4', tie: true }]],
  ['a note tied to a rest', [{ key: 'g/4', tie: true }, { rest: true }]],
  ['a tie between two different pitches', [{ key: 'g/4', tie: true }, { key: 'a/4' }]],
]) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  renderScoreSVG('probe', items, 'treble', 340, 160);
  console.error = realErr;
  check(`${label} is refused`, logged === 1 && tiesIn(rendered.probe) === 0,
        `console.error called ${logged}x, ${tiesIn(rendered.probe)} curve(s) drawn`);
}

/* 24d. tied notes sound as one */

const TIED = [{ key: 'c/4', dur: 'h', tie: true }, { key: 'c/4', dur: 'h' }, { key: 'd/4' }];
audio.ctx.currentTime = 5000;
setPlaybackBpm(120);
const tiedPlay = scenario(() => playSequence(TIED, { clef: 'treble', bpm: 120 }));
const tiedVoices = tiedPlay.nodes.filter(n => n.kind === 'oscillator');
check('a tied pair is struck once, not twice',
      tiedVoices.length === 2, `${tiedVoices.length} note(s) for a tied pair plus one more`);
check('the tied note is held for both halves',
      Math.abs(player.schedule[0].seconds - 2) < 1e-9,
      `the tied note lasts ${player.schedule[0].seconds}s, want 2s for two half notes at 120 BPM`);
check('the note after a tie still starts on time',
      Math.abs(player.schedule[2].at - (player.schedule[0].at + 2)) < 1e-9,
      'the passage closed up over the tie');
stopSequence();

// A dot has to be worth its half in the ears as well as in the bars.
audio.ctx.currentTime = 5050;
const dottedPlay = scenario(() => playSequence([{ key: 'c/4', dot: true }, { key: 'd/4' }], { clef: 'treble', bpm: 120 }));
check('a dotted note sounds for half again as long',
      Math.abs(player.schedule[0].seconds - 0.75) < 1e-9,
      `the dotted quarter lasts ${player.schedule[0].seconds}s, want 0.75s at 120 BPM`);
check('the note after a dotted one starts when the dot has run out',
      Math.abs(player.schedule[1].at - (player.schedule[0].at + 0.75)) < 1e-9);
stopSequence();

// Playback must apply the same rule the staff does: a tie joins one pitch to
// itself, and two different pitches are not tied at all.
audio.ctx.currentTime = 5060;
const crossTie = scenario(() => playSequence([{ key: 'c/4', tie: true }, { key: 'd/4' }], { clef: 'treble', bpm: 120 }));
check('a tie between different pitches sounds as two notes, not one',
      crossTie.nodes.filter(n => n.kind === 'oscillator').length === 2,
      `${crossTie.nodes.filter(n => n.kind === 'oscillator').length} note(s) - playback merged two different pitches`);
stopSequence();

// Three notes tied together are one sound, not a held note with another
// struck in the middle of it.
audio.ctx.currentTime = 5070;
const chainTie = scenario(() => playSequence(
  [{ key: 'c/4', tie: true }, { key: 'c/4', tie: true }, { key: 'c/4' }, { key: 'd/4' }],
  { clef: 'treble', bpm: 120 }));
check('a chain of ties is struck once, however long the chain',
      chainTie.nodes.filter(n => n.kind === 'oscillator').length === 2,
      `${chainTie.nodes.filter(n => n.kind === 'oscillator').length} note(s) for three tied plus one more`);
check('a chain of ties is held for the whole chain',
      Math.abs(player.schedule[0].seconds - 1.5) < 1e-9,
      `held ${player.schedule[0].seconds}s, want 1.5s for three quarters at 120 BPM`);
stopSequence();

const untied = [{ key: 'c/4', dur: 'h' }, { key: 'c/4', dur: 'h' }, { key: 'd/4' }];
audio.ctx.currentTime = 5100;
const untiedPlay = scenario(() => playSequence(untied, { clef: 'treble', bpm: 120 }));
check('without the tie the same pitch is struck twice',
      untiedPlay.nodes.filter(n => n.kind === 'oscillator').length === 3);
stopSequence();

/* ---- 25. intervals ------------------------------------------------------
 * The two halves of an interval are counted differently, and that is where
 * the mistakes live. The number counts letter names and ignores sharps
 * entirely; the quality comes from the semitones. Both are derived here from
 * the note names, independently of the page's own tables.
 */

const LETTERS_ASC = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
const letterDistance = (a, b) => {
  const pa = /^([a-g])#?\/(\d)$/.exec(a), pb = /^([a-g])#?\/(\d)$/.exec(b);
  return (LETTERS_ASC.indexOf(pb[1]) + 7 * +pb[2]) - (LETTERS_ASC.indexOf(pa[1]) + 7 * +pa[2]);
};

/* 25a. the number counts letter names, inclusively */

const wrongNumber = [], wrongSemitones = [];
for (const low of notesData.treble.slice(0, 30)) {
  for (const high of notesData.treble.slice(0, 30)) {
    if (absolutePitch(high.key) < absolutePitch(low.key)) continue;
    const got = intervalBetween(low.key, high.key);
    if (!got) { wrongNumber.push(`${low.key}-${high.key}: refused`); continue; }
    const wantNumber = letterDistance(low.key, high.key) + 1;
    const wantSemitones = absolutePitch(high.key) - absolutePitch(low.key);
    if (got.number !== wantNumber) wrongNumber.push(`${low.key}-${high.key}: ${got.number}, want ${wantNumber}`);
    if (got.semitones !== wantSemitones) wrongSemitones.push(`${low.key}-${high.key}: ${got.semitones}, want ${wantSemitones}`);
  }
}
check('the interval number counts letter names inclusively', wrongNumber.length === 0,
      wrongNumber.slice(0, 3).join('; '));
check('the interval size in semitones matches the pitches', wrongSemitones.length === 0,
      wrongSemitones.slice(0, 3).join('; '));

/* 25b. the seven intervals up from C, by name */

const FROM_C = [
  ['d/4', 2, 2, 'trưởng'], ['e/4', 3, 4, 'trưởng'], ['f/4', 4, 5, 'đúng'],
  ['g/4', 5, 7, 'đúng'], ['a/4', 6, 9, 'trưởng'], ['b/4', 7, 11, 'trưởng'],
  ['c/5', 8, 12, 'đúng'],
];
for (const [key, number, semitones, quality] of FROM_C) {
  const got = intervalBetween('c/4', key);
  check(`c/4 up to ${key} is a ${quality} ${number}${number === 8 ? 've' : 'th'} (${semitones} semitones)`,
        got.number === number && got.semitones === semitones && got.quality === quality,
        `got ${got.name}, ${got.semitones} semitones`);
}

/* 25c. a sharp changes the quality but never the number */

// The number follows the letters, so C up to D# is a second, not a third -
// three semitones or not. Spelling it E flat would make it a third, and flats
// are T14.
const augSecond = intervalBetween('c/4', 'd#/4');
check('C up to D sharp is an augmented second, not a minor third',
      augSecond.number === 2 && augSecond.quality === 'tăng' && augSecond.semitones === 3,
      augSecond.name);

// Sharpening the bottom note keeps the letters, so the number holds and only
// the quality moves.
const majorThird = intervalBetween('c/4', 'e/4');
const minorThird = intervalBetween('c#/4', 'e/4');
check('sharpening the lower note leaves the number alone',
      minorThird.number === 3 && majorThird.number === 3,
      `${minorThird.name} vs ${majorThird.name}`);
check('but turns the major third into a minor one',
      majorThird.quality === 'trưởng' && minorThird.quality === 'thứ',
      `${majorThird.quality} then ${minorThird.quality}`);
check('a sharpened fourth is called augmented, not a fifth',
      intervalBetween('c/4', 'f#/4').number === 4 && intervalBetween('c/4', 'f#/4').quality === 'tăng',
      intervalBetween('c/4', 'f#/4').name);
check('the same six semitones spelled as a fifth is called diminished',
      intervalBetween('c#/4', 'g/4').number === 5 && intervalBetween('c#/4', 'g/4').quality === 'giảm',
      intervalBetween('c#/4', 'g/4').name);

/* 25d. order, unison and anything wider than an octave */

check('the two notes may be given either way round',
      intervalBetween('g/4', 'c/4').name === intervalBetween('c/4', 'g/4').name,
      `${intervalBetween('g/4', 'c/4').name} vs ${intervalBetween('c/4', 'g/4').name}`);
check('a note against itself is not called an interval',
      intervalBetween('c/4', 'c/4').unison === true && intervalBetween('c/4', 'c/4').number === 1);
check('anything wider than an octave says so rather than being named wrongly',
      intervalBetween('c/4', 'd/5').wide === true && intervalBetween('c/4', 'd/5').number === 9,
      intervalBetween('c/4', 'd/5').name);

for (const [a, b] of [['zz/9', 'c/4'], ['c/4', 'zz/9'], ['c4', 'd4'], ['', 'c/4']]) {
  let logged = 0;
  const realErr = console.error;
  console.error = () => logged++;
  const got = intervalBetween(a, b);
  console.error = realErr;
  check(`intervalBetween("${a}", "${b}") is refused`, got === null && logged === 1);
}

/* 25e. every interval the page offers is a real one, and reaches the keyboard */

check('the page offers the seven intervals from a second to an octave',
      INTERVAL_STEPS.length === 7 && INTERVAL_STEPS.every((s, i) => s.number === i + 2),
      INTERVAL_STEPS.map(s => s.number).join(', '));
check('every interval button names the interval it actually shows',
      INTERVAL_STEPS.every(s => intervalBetween(INTERVAL_ROOT, s.key).number === s.number),
      INTERVAL_STEPS.filter(s => intervalBetween(INTERVAL_ROOT, s.key).number !== s.number)
                    .map(s => `${s.key} is not a ${s.number}`).join(', '));
check('every interval note is on the keyboard and in the treble clef',
      [INTERVAL_ROOT, ...INTERVAL_STEPS.map(s => s.key)].every(
        k => keyboardKeys.some(kk => kk.key === k) && notesData.treble.some(n => n.key === k)));

/* 25f. showing an interval draws both notes and sounds them */

audio.ctx.currentTime = 6000;
const shown = scenario(() => showInterval('g/4'));
check('showing an interval raises no error', shown.errors === 0 && shown.result === true);
check('an interval is drawn as two noteheads on one stem',
      countHollowHeads(rendered['interval-score']) === 2
        && countStems(rendered['interval-score']) === 1,
      `${countHollowHeads(rendered['interval-score'])} notehead(s), ${countStems(rendered['interval-score'])} stem(s)`);

const intervalOsc = shown.nodes.filter(n => n.kind === 'oscillator');
check('an interval is sounded together and then one note after the other',
      intervalOsc.length === 4, `${intervalOsc.length} note(s), want 2 together then 2 apart`);
const starts = intervalOsc.map(o => o.started[0]);
check('the first two sound together', Math.abs(starts[0] - starts[1]) < 1e-9);
check('the last two sound one after the other', starts[3] > starts[2] && starts[2] > starts[1]);

let intervalLogged = 0;
const realIntervalErr = console.error;
console.error = () => intervalLogged++;
const badInterval = showInterval('zz/9');
console.error = realIntervalErr;
check('showing an interval to a key that does not exist is refused',
      badInterval === false && intervalLogged === 1);

/* ---- 26. ear training ----------------------------------------------------
 * The questions are random, so the checks assert what must hold of every
 * question rather than of one particular draw - and draw enough of them that
 * a rare bad case cannot hide.
 */

const EAR_DRAWS = 200;

for (const mode of ['note', 'interval']) {
  check(`ear training offers "${mode}"`, setEarMode(mode) === true && earTraining.mode === mode);

  const faults = [];
  const seenAnswers = new Set(), answerSlots = new Set();
  audio.ctx.currentTime = 7000;

  for (let i = 0; i < EAR_DRAWS; i++) {
    const drawn = scenario(() => newEarQuestion());
    const q = drawn.result;
    if (drawn.errors) faults.push('an error was logged while drawing a question');
    if (!q) { faults.push('no question was drawn'); break; }

    if (q.options.length !== 4) faults.push(`${q.answer}: ${q.options.length} options`);
    if (new Set(q.options).size !== q.options.length) faults.push(`${q.answer}: duplicate options`);
    if (!q.options.includes(q.answer)) faults.push(`${q.answer}: the answer is not among the options`);
    if (!q.keys.length) faults.push(`${q.answer}: nothing to listen to`);
    if (mode === 'note' && q.keys.length !== 1) faults.push('a note question played more than one note');
    if (mode === 'interval' && q.keys.length !== 2) faults.push('an interval question did not play two notes');
    if (!q.keys.every(k => notesData.treble.some(n => n.key === k))) faults.push(`${q.answer}: an unplayable key`);

    const sounded = drawn.nodes.filter(n => n.kind === 'oscillator');
    if (sounded.length !== q.keys.length) faults.push(`${q.answer}: ${sounded.length} note(s) sounded for ${q.keys.length} key(s)`);

    seenAnswers.add(q.answer);
    answerSlots.add(q.options.indexOf(q.answer));
  }

  check(`${mode}: every question is well formed over ${EAR_DRAWS} draws`, faults.length === 0,
        [...new Set(faults)].slice(0, 3).join('; '));
  check(`${mode}: the questions vary rather than repeating one`, seenAnswers.size >= 3,
        `only ${seenAnswers.size} distinct question(s) in ${EAR_DRAWS} draws`);
  check(`${mode}: the right answer moves around the options`, answerSlots.size === 4,
        `the answer only ever appeared in slot(s) ${[...answerSlots].join(', ')}`);
}

/* 26b. a question is heard, not seen */

setEarMode('note');
audio.ctx.currentTime = 7500;
const heard = scenario(() => newEarQuestion());
const earQ = heard.result;
check('the question sounds the pitch it is asking about',
      heard.nodes.filter(n => n.kind === 'oscillator').length === 1);
check('nothing is drawn on the staff to give the answer away',
      !(rendered['ear-panel'] || '').includes('<svg')
        && !(rendered['ear-panel'] || '').includes(earQ.keys[0]),
      'the panel is showing the note it is asking the ear to name');

/* 26c. the interval question really plays two different pitches, in turn */

setEarMode('interval');
audio.ctx.currentTime = 7600;
const heardInterval = scenario(() => newEarQuestion());
const intervalOscs = heardInterval.nodes.filter(n => n.kind === 'oscillator');
check('an interval question plays two notes one after the other',
      intervalOscs.length === 2 && intervalOscs[1].started[0] > intervalOscs[0].started[0],
      intervalOscs.map(o => o.started[0]).join(', '));

/* 26d. replaying plays the same question again */

audio.ctx.currentTime = 7700;
const before = earTraining.question;
const replayed = scenario(() => playEarQuestion());
check('the question can be heard again', replayed.result === true);
check('replaying does not change the question', earTraining.question === before);
check('replaying sounds the same notes',
      replayed.nodes.filter(n => n.kind === 'oscillator').length === before.keys.length);

/* 26e. scoring */

setEarMode('note');
earTraining.score = 0;
earTraining.streak = 0;
audio.ctx.currentTime = 7800;

let earAsk = newEarQuestion();
check('a right answer is reported as right',
      answerEar(earAsk.options.indexOf(earAsk.answer)) === true);
check('a right answer counts', earTraining.score === 1 && earTraining.streak === 1);
check('a question can only be answered once', answerEar(0) === null,
      'the same question was scored twice');

earAsk = newEarQuestion();
check('a right answer lengthens the streak',
      answerEar(earAsk.options.indexOf(earAsk.answer)) === true && earTraining.streak === 2);

earAsk = newEarQuestion();
const wrongIndex = earAsk.options.findIndex(o => o !== earAsk.answer);
check('a wrong answer is reported as wrong', answerEar(wrongIndex) === false);
check('a wrong answer breaks the streak but keeps the score',
      earTraining.streak === 0 && earTraining.score === 2,
      `score ${earTraining.score}, streak ${earTraining.streak}`);

/* 26f. what cannot be asked for */

let earLogged = 0;
let earErr = console.error;
console.error = () => earLogged++;
const badMode = setEarMode('màu sắc');
console.error = earErr;
check('a mode that does not exist is refused', badMode === false && earLogged === 1);
check('a refused mode leaves the current one alone', earTraining.mode === 'note');

newEarQuestion();
earLogged = 0;
earErr = console.error;
console.error = () => earLogged++;
const badOption = answerEar(99);
console.error = earErr;
check('choosing an option that is not there is refused', badOption === null && earLogged === 1);

earTraining.question = null;
earLogged = 0;
earErr = console.error;
console.error = () => earLogged++;
const nothingToPlay = playEarQuestion();
console.error = earErr;
check('replaying with no question is refused', nothingToPlay === false && earLogged === 1);

/* ---- summary ----------------------------------------------------------- */

console.log(`\n${drawn} note renders checked (${accidentals} carrying accidentals)`);
if (failures) {
  console.log(`${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('all checks passed');
