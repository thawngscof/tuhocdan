/* Deliberate breakage: T14 - flats and key signatures.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['a flat spelling left on the same line as the sharp',
   p => p.replace('function flatSpelledStep(step) { return step + 1; }', 'function flatSpelledStep(step) { return step; }')],
  ['a flat spelling moved down a letter instead of up',
   p => p.replace('function flatSpelledStep(step) { return step + 1; }', 'function flatSpelledStep(step) { return step - 1; }')],
  ['a flat spelling moved a whole space instead of one letter',
   p => p.replace('function flatSpelledStep(step) { return step + 1; }', 'function flatSpelledStep(step) { return step + 2; }')],
  ['a flat spelling still drawn with a sharp',
   p => p.replace("const accChar = useFlat ? '♭' : ((stack.length === 1 ? item.acc : null) || stack[i].acc);",
              "const accChar = (stack.length === 1 ? item.acc : null) || stack[i].acc;")],
  ['every note drawn with a flat, asked for or not',
   p => p.replace("const useFlat = spellFlat && stack.every(n => n.acc);", "const useFlat = true;")],
  ['respelling a natural note accepted silently',
   p => p.replace("      console.error(`renderScoreSVG: \"${item.key}\" has no sharp to respell as a flat.`);", '')],
  ['the flat name given the same letter as the sharp',
   p => p.replace("const FLAT_SPELLING = { 'c#': 'd♭', 'd#': 'e♭', 'f#': 'g♭', 'g#': 'a♭', 'a#': 'b♭' };",
              "const FLAT_SPELLING = { 'c#': 'c♭', 'd#': 'd♭', 'f#': 'f♭', 'g#': 'g♭', 'a#': 'a♭' };")],
  ['the sharps in the wrong order',
   p => p.replace("{ letter: 'F', step: 8 }, { letter: 'C', step: 5 }, { letter: 'G', step: 9 },",
              "{ letter: 'C', step: 5 }, { letter: 'F', step: 8 }, { letter: 'G', step: 9 },")],
  ['the flats given the sharps\' order',
   p => p.replace("  { letter: 'B', step: 4 }, { letter: 'E', step: 7 }, { letter: 'A', step: 3 },",
              "  { letter: 'F', step: 1 }, { letter: 'C', step: 5 }, { letter: 'G', step: 2 },")],
  ['a key signature given both sharps and flats',
   p => p.replace("  'G':  { sharps: 1, flats: 0, label: 'Sol trưởng' },", "  'G':  { sharps: 1, flats: 1, label: 'Sol trưởng' },")],
  ['the wrong number of accidentals drawn',
   p => p.replace('  return order.slice(0, sig.sharps || sig.flats)', '  return order.slice(0, (sig.sharps || sig.flats) + 1)')],
  ['sharps drawn where flats belong',
   p => p.replace("  const glyph = sig.sharps ? '♯' : '♭';", "  const glyph = '♯';")],
  ['the bass clef given the treble clef\'s positions',
   p => p.replace("  const shift = clef === 'bass' ? -2 : 0;", '  const shift = 0;')],
  ['a key signature nobody defined is accepted',
   p => p.replace('  if (!sig) {\n    console.error(`keySignatureMarks: there is no key signature for "${keyName}".`);\n    return null;\n  }', '  if (!sig) { return []; }')],
  ['the signature drawn on top of the notes instead of before them',
   p => p.replace('  const startX = (meter ? 92 : 65) + keyWidth;', '  const startX = meter ? 92 : 65;')],
  ['the time signature left sitting under the key signature',
   p => p.replace('svg += `<text x="${66 + keyWidth}" y="${yAtStep(6)}" ${sigAttrs}>${meter.top}</text>`;',
              'svg += `<text x="66" y="${yAtStep(6)}" ${sigAttrs}>${meter.top}</text>`;')],
  ['the key signature never drawn at all',
   p => p.replace('  keyMarks.forEach((mark, i) => {', '  [].forEach((mark, i) => {')],
  ['the signature accidentals never measured for the viewBox',
   p => p.replace('    seen(y - 6); seen(y + 6);\n', '')
     .replace("svg += `<text x=\"${50 + i * 9}\" y=\"${y + 4}\"", "svg += `<text x=\"${50 + i * 9}\" y=\"${y - 300}\"")],
];

const { missed } = run('T14 - flats and key signatures', MUTATIONS);
process.exit(missed ? 1 : 0);
