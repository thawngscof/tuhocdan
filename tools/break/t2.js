/* Deliberate breakage: T2 - rests.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['whole rest moved onto the middle line',
   p => p.replace('const top = durKey === "w" ? lineY1 - 6 * (lineSpacing / 2) : mid - half;',
                  'const top = durKey === "w" ? mid : mid - half;')],
  ['half rest drawn exactly like the whole rest',
   p => p.replace('const top = durKey === "w" ? lineY1 - 6 * (lineSpacing / 2) : mid - half;',
                  'const top = lineY1 - 6 * (lineSpacing / 2);')],
  ['rest also emits a stem',
   p => p.replace('return `<rect x="${x - 6}" y="${top}" width="12" height="${half}" fill="${INK}"/>`;',
              'return `<rect x="${x - 6}" y="${top}" width="12" height="${half}" fill="${INK}"/>` + `<line x1="${x}" y1="${top}" x2="${x}" y2="${top + 20}" stroke="#0f172a" stroke-width="1.5"/>`;')],

  ['rest branch removed, so rests fall through to the pitch lookup',
   p => p.replace('if (item.rest) {', 'if (false) {')],

  ['quarter rest pushed entirely above the middle line',
   p => p.replace('return `<path d="M ${x - 4} ${mid - 10} L ${x + 3} ${mid - 3} L ${x - 3} ${mid + 2.5} L ${x + 3} ${mid + 10}" `',
              'return `<path d="M ${x - 4} ${mid - 30} L ${x + 3} ${mid - 25} L ${x - 3} ${mid - 20} L ${x + 3} ${mid - 15}" `')],

  ['rests filtered out instead of taking up a slot',
   p => p.replace('notesArray.forEach((item, idx) => {',
              'notesArray = notesArray.filter(it => !it.rest);\n  notesArray.forEach((item, idx) => {')],

  ['Vietnamese rest names dropped from the duration table',
   p => p.replace(/, restName: "[^"]+"/g, '')],

  ['unknown rest duration falls back silently',
   p => p.replace('console.error(`renderScoreSVG: unknown duration "${restDur}" on a rest - drawing a lặng đen.`);', '')],

  ['rest drawn far below the staff, outside the fitted viewBox',
   p => p.replace('const mid = lineY1 - 4 * (lineSpacing / 2);                      // the middle line',
                  'const mid = lineY1 - 4 * (lineSpacing / 2) + 400;')],
];

const { missed } = run('T2 - rests', MUTATIONS);
process.exit(missed ? 1 : 0);
