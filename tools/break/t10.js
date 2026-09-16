/* Deliberate breakage: T10 - songs.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['a bar with a beat too many',
   p => p.replace("      { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4', dur: 'h' },\n      { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4', dur: 'h' },",
              "      { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4', dur: 'h' }, { key: 'e/4' },\n      { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4', dur: 'h' },")],
  ['a note that is not on the keyboard',
   p => p.replace("{ key: 'e/4' }, { key: 'd/4' }, { key: 'c/4' }, { key: 'd/4' },", "{ key: 'e/9' }, { key: 'd/4' }, { key: 'c/4' }, { key: 'd/4' },")],
  ['a duration the renderer does not know',
   p => p.replace("{ key: 'c/4', dur: 'w' },", "{ key: 'c/4', dur: 'x' },")],
  ['a song stripped of its public-domain note',
   p => p.replace("origin: 'Giai điệu dân ca Pháp \"Frère Jacques\" — phạm vi công cộng',", "origin: 'Bài hát thiếu nhi quen thuộc',")],
  ['the Ode to Joy cadence flattened again, without saying so',
   p => p.replace("      { key: 'e/4', dot: true }, { key: 'd/4', dur: 'e' }, { key: 'd/4', dur: 'h' },",
              "      { key: 'e/4' }, { key: 'd/4' }, { key: 'd/4', dur: 'h' },")],
  ['two songs sharing an id',
   p => p.replace("id: 'chu-cuu-nho',", "id: 'buom-vang',")],
  ['a song that leaps far beyond a beginner reach',
   p => p.replace("{ key: 'e/4' }, { key: 'g/4' }, { key: 'g/4', dur: 'h' },", "{ key: 'e/4' }, { key: 'g/6' }, { key: 'g/4', dur: 'h' },")],
  ['phrases that start mid-bar',
   p => p.replace('    const from = starts[bar];', '    const from = starts[bar] + 1;')],
  ['phrases that leave the tail of the song out',
   p => p.replace('const to = (nextBar < starts.length ? starts[nextBar] : song.notes.length) - 1;',
              'const to = (nextBar < starts.length ? starts[nextBar] : song.notes.length - 2) - 1;')],
  ['phrases that overlap one another',
   p => p.replace('  for (let bar = 0; bar < starts.length; bar += song.barsPerPhrase) {',
              '  for (let bar = 0; bar < starts.length; bar += song.barsPerPhrase - 1) {')],
  ['a song id that does not exist is accepted',
   p => p.replace('  if (!song) {\n    console.error(`setSong: there is no song called "${songId}".`);\n    return false;\n  }', '  if (!song) { return true; }')],
  ['choosing a missing song wipes the current one',
   p => p.replace('  const song = SONGS.find(s => s.id === songId);\n  if (!song) {', '  const song = SONGS.find(s => s.id === songId);\n  currentSong = song;\n  if (!song) {')],
  ['a phrase out of range is accepted',
   p => p.replace('  if (!phrase) {\n    console.error(`playSongPhrase: "${currentSong.title}" has no phrase ${index}.`);\n    return false;\n  }', '  if (!phrase) { return true; }')],
  ['a phrase no longer loops, so it cannot be drilled',
   p => p.replace('clef: currentSong.clef, from: phrase.from, to: phrase.to, loop: true,', 'clef: currentSong.clef, from: phrase.from, to: phrase.to,')],
  ['playing a phrase plays the whole song',
   p => p.replace('    clef: currentSong.clef, from: phrase.from, to: phrase.to, loop: true,', '    clef: currentSong.clef, loop: true,')],
];

const { missed } = run('T10 - songs', MUTATIONS);
process.exit(missed ? 1 : 0);
