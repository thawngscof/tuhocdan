/* Deliberate breakage: T6 - playing a passage.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['every item gets the same length, whatever its note shape',
   p => p.replace('const entry = { index, item, at, seconds: beats * secPerBeat };', 'const entry = { index, item, at, seconds: secPerBeat };')],

  ['tempo inverted, so a higher BPM plays slower',
   p => p.replace('const secPerBeat = 60 / bpm;\n  let at = startAt;', 'const secPerBeat = bpm / 60;\n  let at = startAt;')],

  ['items all start together instead of one after another',
   p => p.replace('    at += entry.seconds;\n    return entry;', '    return entry;')],

  ['the passage ignores where it was told to start',
   p => p.replace('function sequenceSchedule(items, bpm, startAt) {\n  const secPerBeat = 60 / bpm;\n  let at = startAt;',
              'function sequenceSchedule(items, bpm, startAt) {\n  const secPerBeat = 60 / bpm;\n  let at = 0;')],

  ['rests are given a sound',
   p => p.replace("    if (entry.item.rest || tiedInto.has(entry.index)) { player.queue.push({ index: entry.index, at: entry.at, key: null }); continue; }",
              "    if (tiedInto.has(entry.index)) { player.queue.push({ index: entry.index, at: entry.at, key: null }); continue; }")],

  ['a rest is dropped instead of taking up its time',
   p => p.replace('    const beats = itemBeats(item);', '    const beats = item.rest ? 0 : itemBeats(item);')],

  ['a note is held right up to the next one, so repeats slur together',
   p => p.replace('hold: entry.seconds * 0.92', 'hold: entry.seconds * 2')],

  ['notes play immediately instead of at their scheduled time',
   p => p.replace('playTone(note.freq, { at: entry.at, hold: entry.seconds * 0.92, voice: `seq-${entry.index}` });',
              'playTone(note.freq, { hold: entry.seconds * 0.92, voice: `seq-${entry.index}` });')],

  ['a note the clef does not have is passed on silently',
   p => p.replace('console.error(`playSequence: no "${player.clef}" entry for key "${entry.item.key}" - skipped.`);', '')],

  ['a phrase outside the passage is accepted',
   p => p.replace('if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to >= items.length || from > to) {', 'if (false) {')],

  ['an empty passage is accepted',
   p => p.replace('if (!Array.isArray(items) || items.length === 0) {', 'if (false) {')],

  ['a phrase plays on to the end of the passage',
   p => p.replace('const slice = player.items.slice(fromIndex, player.to + 1);', 'const slice = player.items.slice(fromIndex);')],

  ['pausing leaves the scheduled notes sounding',
   p => p.replace('  silenceSequenceVoices();\n  player.queue = [];\n  setPlaybackHighlight(null);\n  setPlayerButtons();\n  return true;', '  player.queue = [];\n  setPlaybackHighlight(null);\n  setPlayerButtons();\n  return true;')],

  ['pausing forgets where it had got to',
   p => p.replace('player.cursor = sounding ? sounding.index : player.from;', 'player.cursor = player.from;')],

  ['pausing leaves its wake-up timer running',
   p => p.replace('  if (player.timer !== null) clearInterval(player.timer);\n  player.timer = null;\n  silenceSequenceVoices();', '  silenceSequenceVoices();')],

  ['resuming starts again from the top',
   p => p.replace('schedulePhraseFrom(player.cursor);\n  player.timer = setInterval(playerTick, 25);\n  setPlayerButtons();\n  return true;',
              'schedulePhraseFrom(player.from);\n  player.timer = setInterval(playerTick, 25);\n  setPlayerButtons();\n  return true;')],

  ['looping is ignored and the passage stops at the end',
   p => p.replace('    if (player.loop) {', '    if (false) {')],

  ['a passage that is not looping keeps going forever',
   p => p.replace('    } else {\n      stopSequence();\n    }', '    } else {\n    }')],

  ['playback tempo outside the range is accepted',
   p => p.replace('if (!Number.isFinite(bpm) || bpm < PLAYBACK_BPM.min || bpm > PLAYBACK_BPM.max) {', 'if (false) {')],
];

const { missed } = run('T6 - playing a passage', MUTATIONS);
process.exit(missed ? 1 : 0);
