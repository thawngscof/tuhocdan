/* Deliberate breakage: T4 - fingering.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['fingering hugs each notehead again, landing in the ledger lines',
   p => p.replace('fingerY = Math.min(topMargin - 8, noteY - 13);', 'fingerY = noteY - 13;')],

  ['the number is drawn below the note instead of above it',
   p => p.replace('fingerY = Math.min(topMargin - 8, noteY - 13);', 'fingerY = noteY + 20;')],

  ['a note above the row no longer pushes the number up',
   p => p.replace('fingerY = Math.min(topMargin - 8, noteY - 13);', 'fingerY = topMargin - 8;')],

  ['the row drops down into the staff',
   p => p.replace('fingerY = Math.min(topMargin - 8, noteY - 13);', 'fingerY = Math.min(topMargin + 8, noteY - 13);')],

  ['the number sits right on the notehead with no clearance',
   p => p.replace('fingerY = Math.min(topMargin - 8, noteY - 13);', 'fingerY = Math.min(topMargin - 8, noteY);')],

  ['the number drifts off its own note horizontally',
   p => p.replace('svg += `<text x="${noteX}" y="${fingerY}" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#7c3aed"',
              'svg += `<text x="${noteX + 14}" y="${fingerY}" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#7c3aed"')],

  ['a finger outside 1-5 is drawn anyway',
   p => p.replace('const isFingerNumber = (n) => Number.isInteger(n) && n >= 1 && n <= 5;', 'const isFingerNumber = (n) => true;')],

  ['a bad finger is dropped without a word',
   p => p.replace('console.error(`renderScoreSVG: finger "${item.finger}" on "${item.key}" is not 1-5 - skipped.`);', '')],

  ['the number never reaches the viewBox fitter',
   p => p.replace('        seen(fingerY - 9);\n', '')],

  ['a finger on a rest is accepted quietly',
   p => p.replace("console.error('renderScoreSVG: a rest has no finger - the number was dropped.');", '')],

  ['the label no longer steps out of the way',
   p => p.replace('const y = fingerY === null ? LABEL_Y : Math.min(LABEL_Y, fingerY - 14);', 'const y = LABEL_Y;')],

  ['the label moves even when there is no finger',
   p => p.replace('const y = fingerY === null ? LABEL_Y : Math.min(LABEL_Y, fingerY - 14);', 'const y = LABEL_Y - 30;')],

  ['setKeyFingering marks every key, not just the ones asked for',
   p => p.replace('const fingerBadge = (k) => keyFingering[k.key]', 'const fingerBadge = (k) => keyFingering[k.key] || Object.keys(keyFingering).length')],

  ['setKeyFingering piles new marks on top of the old ones',
   p => p.replace('  keyFingering = next;', '  keyFingering = Object.assign({}, keyFingering, next);')],

  ['setKeyFingering accepts a key the keyboard does not have',
   p => p.replace('if (!keyboardKeys.some((k) => k.key === key)) {', 'if (false) {')],

  ['setKeyFingering stores the map but never redraws',
   p => p.replace('  keyFingering = next;\n  buildPianoKeyboard();', '  keyFingering = next;')],
];

const { missed } = run('T4 - fingering', MUTATIONS);
process.exit(missed ? 1 : 0);
