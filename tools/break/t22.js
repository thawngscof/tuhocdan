/* Deliberate breakage: T22 - grading what the learner plays.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['a wrong note judged right',
   p => p.replace('  if (!expected.includes(key) || practice.pressed.includes(key)) {', '  if (false) {')],
  ['a right note judged wrong',
   p => p.replace('  if (!expected.includes(key) || practice.pressed.includes(key)) {', '  if (expected.includes(key)) {')],
  ['a wrong note moves the passage on anyway',
   p => p.replace(`    practice.wrong++;
    practice.mistakes.push({ index: practice.index, expected: expected.slice(), got: key });`,
     `    practice.wrong++;
    practice.index++;
    practice.mistakes.push({ index: practice.index, expected: expected.slice(), got: key });`)],
  ['a wrong note is not counted',
   p => p.replace('    practice.wrong++;\n    practice.mistakes.push(', '    practice.mistakes.push(')],
  ['a right note is not counted',
   p => p.replace('  practice.correct++;\n  practice.pressed = [];', '  practice.pressed = [];')],
  ['a wrong note is forgotten instead of recorded',
   p => p.replace('    practice.mistakes.push({ index: practice.index, expected: expected.slice(), got: key });\n', '')],
  ['accuracy counts wrong notes as right',
   p => p.replace('  return tried === 0 ? null : practice.correct / tried;', '  return tried === 0 ? null : 1;')],
  ['accuracy divides by the right notes instead of every try',
   p => p.replace('  const tried = practice.correct + practice.wrong;', '  const tried = practice.correct;')],
  ['the passage never moves on, however right the note',
   p => p.replace('  practice.index++;\n  skipPracticeRests();', '  skipPracticeRests();')],
  ['rests are waited for like notes',
   p => p.replace('  while (practice.items[practice.index] && practice.items[practice.index].rest) practice.index++;', '')],
  ['a chord is finished by its first note',
   p => p.replace('  if (practice.pressed.length < expected.length) {     // a chord, still incomplete', '  if (false) {')],
  ['the same note twice finishes a chord',
   p => p.replace('  if (!expected.includes(key) || practice.pressed.includes(key)) {', '  if (!expected.includes(key)) {')],
  ['a chord counts as one note per key pressed',
   p => p.replace(`  if (practice.pressed.length < expected.length) {     // a chord, still incomplete
    renderPractice();
    return 'correct';
  }`, `  if (practice.pressed.length < expected.length) {     // a chord, still incomplete
    practice.correct++;
    renderPractice();
    return 'correct';
  }`)],
  ['finishing the passage is never reported',
   p => p.replace("  return done ? 'complete' : 'correct';", "  return 'correct';")],
  ['grading runs even when nothing is being practised',
   p => p.replace('  if (!practice.active) return null;\n  const item = practice.items[practice.index];',
                  '  const item = practice.items[practice.index];')],
  ['a key press is never graded at all',
   p => p.replace('  gradeKeyPress(key);\n}', '}')],
  ['an empty passage is accepted',
   p => p.replace("  if (!Array.isArray(items) || items.length === 0) {\n    console.error('startPractice: there is nothing to practise.');\n    return false;\n  }", '  if (false) { return false; }')],
  ['a note the clef cannot show is accepted',
   p => p.replace('  if (missing.length) {', '  if (false) {')],
  ['the note being waited for is not marked on the staff',
   p => p.replace('    i === practice.index ? { ...item, highlight: true } : item);', '    item);')],
  ['every note is marked, so none of them is',
   p => p.replace('    i === practice.index ? { ...item, highlight: true } : item);', '    ({ ...item, highlight: true }));')],
  ['the highlight is drawn in the same ink as everything else',
   p => p.replace("      const headInk = item.highlight ? '#2563eb' : '#0f172a';", "      const headInk = '#0f172a';")],
  ['a source is practised in the wrong meter',
   p => p.replace('  practice.timeSig = opts.timeSig || null;', "  practice.timeSig = '3/4';")],
  ['a source that does not exist is accepted',
   p => p.replace('  if (!source) {\n    console.error(`startPracticeSource: there is nothing called "${id}" to practise.`);\n    return false;\n  }', '  if (!source) { return true; }')],
  ['stopping leaves the exercise running',
   p => p.replace('  practice.active = false;\n  practice.pressed = [];\n  showNextKeys([]);', '  practice.pressed = [];\n  showNextKeys([]);')],
];

const { missed } = run('T22 - grading what the learner plays', MUTATIONS);
process.exit(missed ? 1 : 0);
