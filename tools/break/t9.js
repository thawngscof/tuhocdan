/* Deliberate breakage: T9 - the C major scale.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['a sharp smuggled into C major',
   p => p.replace("keys:    ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'],", "keys:    ['c/4', 'd/4', 'e/4', 'f#/4', 'g/4', 'a/4', 'b/4', 'c/5'],")],
  ['a scale degree skipped',
   p => p.replace("keys:    ['c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3', 'c/4'],", "keys:    ['c/3', 'd/3', 'e/3', 'g/3', 'a/3', 'b/3', 'c/4', 'd/4'],")],
  ['the thumb turn removed, so the hand must stretch an octave',
   p => p.replace('fingers: [1, 2, 3, 1, 2, 3, 4, 5],', 'fingers: [1, 2, 3, 4, 5, 6, 7, 8],')],
  ['the turn moved to the wrong note',
   p => p.replace('fingers: [1, 2, 3, 1, 2, 3, 4, 5],', 'fingers: [1, 2, 3, 4, 1, 2, 3, 4],')],
  ['the same finger used twice in a row',
   p => p.replace('fingers: [5, 4, 3, 2, 1, 3, 2, 1],', 'fingers: [5, 4, 3, 2, 2, 3, 2, 1],')],
  ['turn.index no longer matches where the fingering actually turns',
   p => p.replace("turn: { index: 3, up: 'Luồn ngón cái", "turn: { index: 4, up: 'Luồn ngón cái")],
  ['the two hands given the same fingering instead of mirrored',
   p => p.replace('fingers: [5, 4, 3, 2, 1, 3, 2, 1],', 'fingers: [1, 2, 3, 1, 2, 3, 4, 5],')],
  ['the top note struck twice',
   p => p.replace('const down = up.slice(0, -1).reverse().map(item => ({ ...item }));', 'const down = up.slice().reverse().map(item => ({ ...item }));')],
  ['the scale never comes back down',
   p => p.replace('return up.concat(down);', 'return up;')],
  ['coming down keeps going up',
   p => p.replace('const down = up.slice(0, -1).reverse().map(item => ({ ...item }));', 'const down = up.slice(0, -1).map(item => ({ ...item }));')],
  ['the final note left short, so the scale does not fill its bars',
   p => p.replace("down[down.length - 1].dur = 'h';", '')],
  ['the descending fingering rewritten by hand and wrong',
   p => p.replace('const down = up.slice(0, -1).reverse().map(item => ({ ...item }));',
              'const down = up.slice(0, -1).reverse().map((item, i) => ({ ...item, finger: (i % 5) + 1 }));')],
  ['a hand that does not exist is accepted',
   p => p.replace('  if (!scale) {\n    console.error(`scalePassage: there is no "${hand}" scale.`);\n    return null;\n  }', '  if (!scale) { return []; }')],
  ['setScaleHand accepts anything',
   p => p.replace('  if (!SCALES[hand]) {\n    console.error(`setScaleHand: there is no "${hand}" scale.`);\n    return false;\n  }', '  if (!SCALES[hand]) { return true; }')],
  ['playing the scale no longer marks the keys',
   p => p.replace('setKeyFingering(fingering);', '')],
  ['the keys are marked with the wrong fingers',
   p => p.replace('scale.keys.forEach((key, i) => { fingering[key] = scale.fingers[i]; });', 'scale.keys.forEach((key, i) => { fingering[key] = (i % 5) + 1; });')],
  ['the turn is explained the same way up and down',
   p => p.replace("down: 'Bắc ngón 3 qua ngón cái để đi tiếp xuống.' },", "down: 'Luồn ngón cái xuống dưới bàn tay để bấm nốt Fa.' },")],
];

const { missed } = run('T9 - the C major scale', MUTATIONS);
process.exit(missed ? 1 : 0);
