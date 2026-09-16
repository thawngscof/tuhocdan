/* Deliberate breakage: T13 - intervals.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['the interval number counted exclusively, so a third comes out as a second',
   p => p.replace('const number = diatonicIndex(hi) - diatonicIndex(lo) + 1;', 'const number = diatonicIndex(hi) - diatonicIndex(lo);')],
  ['the number counted in semitones instead of letter names',
   p => p.replace('const number = diatonicIndex(hi) - diatonicIndex(lo) + 1;', 'const number = semitoneIndex(hi) - semitoneIndex(lo) + 1;')],
  ['a sharp allowed to change the interval number',
   p => p.replace('const diatonicIndex = (p) => LETTER_ORDER.indexOf(p.letter) + 7 * p.octave;',
              'const diatonicIndex = (p) => LETTER_ORDER.indexOf(p.letter) + (p.sharp ? 1 : 0) + 7 * p.octave;')],
  ['sharps ignored when measuring semitones',
   p => p.replace('const semitoneIndex = (p) => SEMITONE_OF[p.letter] + (p.sharp ? 1 : 0) + 12 * p.octave;',
              'const semitoneIndex = (p) => SEMITONE_OF[p.letter] + 12 * p.octave;')],
  ['the notes not put in order, so a descending pair measures backwards',
   p => p.replace('const [lo, hi] = semitoneIndex(a) <= semitoneIndex(b) ? [a, b] : [b, a];', 'const [lo, hi] = [a, b];')],
  ['a fourth and a fifth given each other\'s quality',
   p => p.replace("  4: { 4: 'giảm', 5: 'đúng', 6: 'tăng' },", "  4: { 4: 'giảm', 5: 'tăng', 6: 'đúng' },")],
  ['a major third called minor',
   p => p.replace("  3: { 2: 'giảm', 3: 'thứ', 4: 'trưởng', 5: 'tăng' },", "  3: { 2: 'giảm', 3: 'trưởng', 4: 'thứ', 5: 'tăng' },")],
  ['a unison reported as an interval',
   p => p.replace("  if (number === 1) return { number: 1, semitones, quality: null, name: 'Cùng một nốt', unison: true };", '')],
  ['anything past an octave named as if it fitted inside one',
   p => p.replace("  if (number > 8) {\n    return { number, semitones, quality: null, name: `Quãng ${number} (rộng hơn một quãng tám)`, wide: true };\n  }", '')],
  ['a key that is not a key is accepted',
   p => p.replace("  if (!a || !b) {\n    console.error(`intervalBetween: \"${lowKey}\" and \"${highKey}\" are not both keys on this keyboard.`);\n    return null;\n  }", '  if (!a || !b) { return { number: 1, semitones: 0 }; }')],
  ['an interval button labelled with the wrong number',
   p => p.replace("{ number: 5, key: 'g/4' },", "{ number: 5, key: 'a/4' },")],
  ['the interval drawn as two separate notes rather than a stack',
   p => p.replace("renderScoreSVG('interval-score', [{ keys: [INTERVAL_ROOT, highKey], dur: 'h' }], 'treble', 340, 180);",
              "renderScoreSVG('interval-score', [{ key: INTERVAL_ROOT, dur: 'h' }, { key: highKey, dur: 'h' }], 'treble', 340, 180);")],
  ['the two notes never sounded together',
   p => p.replace("playTone(high.freq, { at: ctx.currentTime + 0.05, hold: 1.1, voice: 'interval-high' });",
              "playTone(high.freq, { at: ctx.currentTime + 0.6, hold: 1.1, voice: 'interval-high' });")],
  ['the notes never sounded one after the other',
   p => p.replace("    playTone(high.freq, { at: ctx.currentTime + 2.0, hold: 0.7, voice: 'interval-high-2' });", '')],
];

const { missed } = run('T13 - intervals', MUTATIONS);
process.exit(missed ? 1 : 0);
