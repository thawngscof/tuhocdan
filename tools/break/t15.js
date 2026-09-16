/* Deliberate breakage: T15 - dotted notes and ties.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['a dot doubles the note instead of adding half again',
   p => p.replace('return item.dot ? shape.beats * 1.5 : shape.beats;', 'return item.dot ? shape.beats * 2 : shape.beats;')],
  ['a dot changes nothing',
   p => p.replace('return item.dot ? shape.beats * 1.5 : shape.beats;', 'return shape.beats;')],
  ['every note treated as dotted',
   p => p.replace('return item.dot ? shape.beats * 1.5 : shape.beats;', 'return shape.beats * 1.5;')],
  ['the dot is worth its half only when counting, not when sounding',
   p => p.replace('    const beats = itemBeats(item);', '    const beats = (DURATIONS[item.dur || DEFAULT_DUR] || DURATIONS[DEFAULT_DUR]).beats;')],
  ['the dot is worth its half only when sounding, not when counting bars',
   p => p.replace('      bar.beats += itemBeats(item);', '      bar.beats += (DURATIONS[item.dur || DEFAULT_DUR] || DURATIONS[DEFAULT_DUR]).beats;')],
  ['the dot is never drawn',
   p => p.replace('  if (item.dot) {\n    for (let i = 0; i < stack.length; i++) {', '  if (false) {\n    for (let i = 0; i < stack.length; i++) {')],
  ['a dot is drawn on every note, dotted or not',
   p => p.replace('  if (item.dot) {\n    for (let i = 0; i < stack.length; i++) {', '  if (true) {\n    for (let i = 0; i < stack.length; i++) {')],
  ['the dot sits on the line instead of lifting into the space',
   p => p.replace('const dotY = yOfStep(steps[i]) - (onLine ? lineSpacing / 2 : 0);', 'const dotY = yOfStep(steps[i]);')],
  ['the dot lifts for space notes instead of line notes',
   p => p.replace('const onLine = steps[i] % 2 === 0;', 'const onLine = steps[i] % 2 === 1;')],
  ['the dot is drawn to the left of the notehead',
   p => p.replace('svg += `<circle cx="${noteX + 12}"', 'svg += `<circle cx="${noteX - 12}"')],
  ['a dot drawn well away from its note, and never measured',
   p => p.replace('        seen(dotY);\n', '')
     .replace('const dotY = yOfStep(steps[i]) - (onLine ? lineSpacing / 2 : 0);', 'const dotY = yOfStep(steps[i]) - 200;')],
  ['a tie is never drawn',
   p => p.replace('  if (item.tie) {', '  if (false) {')],
  ['a tie to a different pitch is allowed',
   p => p.replace("    } else if ((next.key || (next.keys || [])[0]) !== (item.key || stackKeys[0])) {\n      console.error(`renderScoreSVG: \"${item.key}\" is tied to \"${next.key}\" - a tie joins the same pitch, a curve between different ones is a slur.`);\n    } else {", '    } else {')],
  ['a tie on the last note is allowed',
   p => p.replace("    if (!next) {\n      console.error('renderScoreSVG: the last note is tied to nothing.');\n    } else if", '    if (false) {\n    } else if')],
  ['a tied pair is struck twice',
   p => p.replace('    if (entry.item.rest || tiedInto.has(entry.index)) {', '    if (entry.item.rest) {')],
  ['a tie does not lengthen the note it joins',
   p => p.replace('      entry.seconds += next.seconds;', '')],
  ['a tie swallows the note after it, closing up the passage',
   p => p.replace('      entry.seconds += next.seconds;\n      tiedInto.add(next.index);',
              '      tiedInto.add(next.index);')],
  ['a tie joins any two notes, not only ones at the same pitch',
   p => p.replace('      if (!next || next.item.rest || next.item.key !== player.schedule[j].item.key) break;',
              '      if (!next || next.item.rest) break;')],
  ['a chain of ties joins only the first pair',
   p => p.replace('    while (player.schedule[j].item.tie) {', '    while (player.schedule[j].item.tie && j === i) {')],
];

const { missed } = run('T15 - dotted notes and ties', MUTATIONS);
process.exit(missed ? 1 : 0);
