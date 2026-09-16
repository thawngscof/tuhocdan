/* Deliberate breakage: T16 - the computer keyboard.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['two home-row letters swapped, so the scale is out of order',
   p => p.replace("{ code: 'KeyS', offset: 2,  colour: 'white' },   // D", "{ code: 'KeyS', offset: 4,  colour: 'white' },   // D")],
  ['a black key put on the home row',
   p => p.replace("{ code: 'KeyW', offset: 1,  colour: 'black' },   // C#", "{ code: 'KeyW', offset: 1,  colour: 'white' },   // C#")],
  ['a semitone missing from the octave',
   p => p.replace("  { code: 'KeyT', offset: 6,  colour: 'black' },   // F#\n", '')],
  ['a letter bound twice',
   p => p.replace("{ code: 'KeyE', offset: 3,  colour: 'black' },   // D#", "{ code: 'KeyW', offset: 3,  colour: 'black' },   // D#")],
  ['the semitone names in the wrong order',
   p => p.replace("const SEMITONE_KEYS = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];",
              "const SEMITONE_KEYS = ['c', 'd', 'd#', 'e', 'c#', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];")],
  ['the top C wrapping back to the same octave',
   p => p.replace('const key = `${letter}/${octave + Math.floor(mapped.offset / 12)}`;', 'const key = `${letter}/${octave}`;')],
  ['keys off the end of the keyboard handed back anyway',
   p => p.replace('return keyboardKeys.some(k => k.key === key) ? key : null;', 'return key;')],
  ['a held key re-struck over and over',
   p => p.replace('  if (event.repeat) return false;                     // holding a key is one note\n', '')],
  ['typing into a text box plays notes',
   p => p.replace('  if (isTypingIntoSomething(event.target)) return false;\n', '')],
  ['only text inputs spared, not dropdowns or editable areas',
   p => p.replace("  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable === true;",
              "  return tag === 'INPUT';")],
  ['browser shortcuts swallowed',
   p => p.replace('  if (event.ctrlKey || event.metaKey || event.altKey) return false;\n', '')],
  ['Z and X moving the octave the wrong way',
   p => p.replace("  if (event.code === 'KeyZ') { setTypingOctave(TYPING_OCTAVE.current - 1); return true; }\n  if (event.code === 'KeyX') { setTypingOctave(TYPING_OCTAVE.current + 1); return true; }",
              "  if (event.code === 'KeyZ') { setTypingOctave(TYPING_OCTAVE.current + 1); return true; }\n  if (event.code === 'KeyX') { setTypingOctave(TYPING_OCTAVE.current - 1); return true; }")],
  ['the octave allowed to wander off the keyboard',
   p => p.replace('if (!Number.isInteger(octave) || octave < TYPING_OCTAVE.min || octave > TYPING_OCTAVE.max) {', 'if (false) {')],
  ['the keys left as unlabelled divs',
   p => p.replace('const aria = (k) => `role="button" tabindex="0" aria-label="Nốt ${k.noteName}"`;', "const aria = () => '';")],
  ['the keys labelled but not reachable by tab',
   p => p.replace('const aria = (k) => `role="button" tabindex="0" aria-label="Nốt ${k.noteName}"`;',
              'const aria = (k) => `role="button" aria-label="Nốt ${k.noteName}"`;')],
  ['every key given the same label',
   p => p.replace('const aria = (k) => `role="button" tabindex="0" aria-label="Nốt ${k.noteName}"`;',
              'const aria = () => `role="button" tabindex="0" aria-label="Nốt"`;')],
];

const { missed } = run('T16 - the computer keyboard', MUTATIONS);
process.exit(missed ? 1 : 0);
