/* Deliberate breakage: T20 - markup and script agreeing.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['a button wired to a function that does not exist',
   p => p.replace('onclick="toggleMetronome()"', 'onclick="toggleMetronom()"')],
  ['a slider wired to a misspelled handler',
   p => p.replace('oninput="setPlaybackBpm(Number(this.value))"', 'oninput="setPlaybackBPM(Number(this.value))"')],
  ['the script looks for an element the markup does not have',
   p => p.replace("document.getElementById('metronome-beats')", "document.getElementById('metronome-dots')")],
  ['an id used on two different elements',
   p => p.replace('id="player-bpm-value"', 'id="metronome-bpm-value"')],
  ['a renamed function leaves its button behind',
   p => p.replace('function stopSequence() {', 'function haltSequence() {')],
];

const { missed } = run('T20 - markup and script agreeing', MUTATIONS);
process.exit(missed ? 1 : 0);
