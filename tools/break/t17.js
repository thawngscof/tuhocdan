/* Deliberate breakage: T17 - the keyboard on a small screen.
 * The responsive stylesheet itself moved to T25 when the target changed from
 * phones to tablets; what stays here is the keyboard's own layout.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['black keys stacked on the white key they follow',
   p => p.replace('style="left: calc(var(--white-key-w) * ${whitesSoFar});"', 'style="left: calc(var(--white-key-w) * ${whitesSoFar - 1});"')],
  ['black keys counted from the whole keyboard, not what is on screen',
   p => p.replace('    if (k.type === \'white\') whitesSoFar++;\n', '    whitesSoFar++;\n')],
  ['black keys all piled at the left edge',
   p => p.replace('style="left: calc(var(--white-key-w) * ${whitesSoFar});"', 'style="left: 0px;"')],
  ['black key positions frozen at one key width again',
   p => p.replace('style="left: calc(var(--white-key-w) * ${whitesSoFar});"', 'style="left: ${whitesSoFar * 44}px;"')],
  ['the short keyboard still draws every key',
   p => p.replace('  visibleKeyboardKeys().forEach((k) => {', '  keyboardKeys.forEach((k) => {')],
  ['the short range set to the wrong octaves',
   p => p.replace("  two:  { label: '2 quãng tám · C3–C5', from: 'c/3', to: 'c/5' },", "  two:  { label: '2 quãng tám · C3–C5', from: 'c/2', to: 'c/4' },")],
  ['the short range made three octaves wide',
   p => p.replace("from: 'c/3', to: 'c/5' },", "from: 'c/3', to: 'c/6' },")],
  ['the full range no longer reaching the top of the keyboard',
   p => p.replace("full: { label: 'Toàn bộ · C2–C6', from: 'c/2', to: 'c/6' },", "full: { label: 'Toàn bộ · C2–C6', from: 'c/2', to: 'c/5' },")],
  ['a range that does not exist is accepted',
   p => p.replace('  if (!KEYBOARD_RANGES[range]) {\n    console.error(`setKeyboardRange: there is no keyboard range called "${range}".`);\n    return false;\n  }', '  if (!KEYBOARD_RANGES[range]) { return true; }')],
  ['the key width hard-coded in the stylesheet again',
   p => p.replace('.white-key {\n  width: var(--white-key-w);', '.white-key {\n  width: 44px;')],
  ['pixel positions put back into the note data',
   p => p.replace('{ key: "c#/2", name: "Đô thăng", noteName: "C#2", type: "black", freq: 69.30 }',
              '{ key: "c#/2", name: "Đô thăng", noteName: "C#2", type: "black", freq: 69.30, pos: 28 }')],
];

const { missed } = run('T17 - the keyboard on a small screen', MUTATIONS);
process.exit(missed ? 1 : 0);
