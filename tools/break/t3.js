/* Deliberate breakage: T3 - time signatures and bars.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['bar capacity ignores the denominator',
   p => p.replace('meter = { top, bottom, capacity: top * 4 / bottom };',
              'meter = { top, bottom, capacity: top };')],

  ['bar fills one beat past capacity (>= becomes >)',
   p => p.replace('if (bar.beats >= meter.capacity - 1e-9)', 'if (bar.beats > meter.capacity + 1e-9)')],

  ['bar line drawn on the note instead of between notes',
   p => p.replace('const bx = (xOf(idx - 1) + xOf(idx)) / 2;', 'const bx = xOf(idx);')],

  ['a short bar is no longer reported',
   p => p.replace('if (Math.abs(b.beats - meter.capacity) > 1e-9) {', 'if (b.beats > meter.capacity + 1e-9) {')],

  ['rests contribute no beats',
   p => p.replace('  return item.dot ? shape.beats * 1.5 : shape.beats;',
              '  return item.rest ? 0 : (item.dot ? shape.beats * 1.5 : shape.beats);')],

  ['numerals stacked upside down',
   p => p.replace('svg += `<text x="${66 + keyWidth}" y="${yAtStep(6)}" ${sigAttrs}>${meter.top}</text>`;\n    svg += `<text x="${66 + keyWidth}" y="${yAtStep(2)}" ${sigAttrs}>${meter.bottom}</text>`;',
              'svg += `<text x="${66 + keyWidth}" y="${yAtStep(6)}" ${sigAttrs}>${meter.bottom}</text>`;\n    svg += `<text x="${66 + keyWidth}" y="${yAtStep(2)}" ${sigAttrs}>${meter.top}</text>`;')],

  ['numerals drifted off their conventional lines',
   p => p.replace('y="${yAtStep(6)}" ${sigAttrs}', 'y="${yAtStep(7)}" ${sigAttrs}')],

  ['an unreadable signature is swallowed silently',
   p => p.replace('console.error(`renderScoreSVG: unreadable time signature "${timeSig}" - drawing without one.`);', '')],

  ['an unreadable signature falls back to 4/4 instead of no meter',
   p => p.replace('console.error(`renderScoreSVG: unreadable time signature "${timeSig}" - drawing without one.`);',
              'meter = { top: 4, bottom: 4, capacity: 4 };')],

  ['every passage gets the double bar, metered or not',
   p => p.replace('  if (meter) {\n    // A metered passage ends on a double bar: thin, then thick.',
              '  if (true) {\n    // A metered passage ends on a double bar: thin, then thick.')],

  ['the closing double bar collapses to a single rule',
   p => p.replace('svg += `<line x1="${width - 21}" y1="${topMargin}" x2="${width - 21}" y2="${lineY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;\n    ', '')],

  ['a bar line is also drawn before the first note',
   p => p.replace('if (i > 0) barlineBefore.add(b.start);', 'barlineBefore.add(b.start);')],

  ['the meter shifts the notes even when absent',
   p => p.replace('  const startX = (showMeterNumerals ? 92 : 65) + keyWidth;', '  const startX = 92 + keyWidth;')],
];

const { missed } = run('T3 - time signatures and bars', MUTATIONS);
process.exit(missed ? 1 : 0);
