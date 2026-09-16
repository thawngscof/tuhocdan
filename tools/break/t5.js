/* Deliberate breakage: T5 - the metronome.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['beats spaced by the tempo number instead of by seconds per beat',
   p => p.replace('metronome.nextBeatTime += 60 / metronome.bpm;', 'metronome.nextBeatTime += metronome.bpm / 60;')],

  ['click times come off a wall clock instead of the audio clock',
   p => p.replace('scheduleClick(metronome.beat, metronome.nextBeatTime);', 'scheduleClick(metronome.beat, ctx.currentTime);')],

  ['the downbeat loses its accent',
   p => p.replace('const accent = beatIndex === 0;', 'const accent = false;')],

  ['every beat is accented, so the bar has no shape',
   p => p.replace('const accent = beatIndex === 0;', 'const accent = true;')],

  ['the accent is louder but not higher',
   p => p.replace('osc.frequency.setValueAtTime(accent ? 1600 : 1000, at);', 'osc.frequency.setValueAtTime(1000, at);')],

  ['the accent is higher but no louder',
   p => p.replace('const peak = accent ? 0.26 : 0.15;', 'const peak = 0.2;')],

  ['the beat counter never wraps, so the accent never comes back',
   p => p.replace('metronome.beat = (metronome.beat + 1) % metronome.beatsPerBar;', 'metronome.beat = metronome.beat + 1;')],

  ['the bar length is ignored and every bar is four beats',
   p => p.replace('metronome.beat = (metronome.beat + 1) % metronome.beatsPerBar;', 'metronome.beat = (metronome.beat + 1) % 4;')],

  ['clicks wired straight to the speakers, bypassing the limiter',
   p => p.replace('gain.connect(masterLimiter);\n  osc.start(at);\n  osc.stop(at + 0.06);', 'gain.connect(ctx.destination);\n  osc.start(at);\n  osc.stop(at + 0.06);')],

  ['click oscillators are never stopped',
   p => p.replace('osc.stop(at + 0.06);', '')],

  ['the scheduler runs on even after being stopped',
   p => p.replace('  if (!metronome.running) return;\n  const ctx = ensureAudio();\n  while (metronome.nextBeatTime', '  const ctx = ensureAudio();\n  while (metronome.nextBeatTime')],

  ['stopping leaves the timer running',
   p => p.replace('if (metronome.timer !== null) clearInterval(metronome.timer);', '')],

  ['starting twice restarts a running metronome',
   p => p.replace('  if (metronome.running) return;\n  const ctx = ensureAudio();', '  const ctx = ensureAudio();')],

  ['the first beat is scheduled in the past',
   p => p.replace('metronome.nextBeatTime = ctx.currentTime + 0.08;', 'metronome.nextBeatTime = ctx.currentTime - 0.5;')],

  ['a tempo outside the range is accepted',
   p => p.replace('if (!Number.isFinite(bpm) || bpm < METRONOME_BPM.min || bpm > METRONOME_BPM.max) {', 'if (false) {')],

  ['a nonsense bar length is accepted',
   p => p.replace('if (!Number.isInteger(beats) || beats < 2 || beats > 12) {', 'if (false) {')],

  ['the beat light replays every missed beat instead of catching up',
   p => p.replace('while (metronomeQueue.length && metronomeQueue[0].at <= now) current = metronomeQueue.shift();',
              'if (metronomeQueue.length && metronomeQueue[0].at <= now) current = metronomeQueue.shift();')],

  ['the beat light fires before its time',
   p => p.replace('metronomeQueue[0].at <= now', 'true')],

  ['every beat light is marked as the accent',
   p => p.replace("`<span class=\"beat-dot${i === 0 ? ' beat-dot-accent' : ''}\" id=\"beat-dot-${i}\"></span>`",
              "`<span class=\"beat-dot beat-dot-accent\" id=\"beat-dot-${i}\"></span>`")],

  ['the lookahead window stretches to a full minute',
   p => p.replace('const SCHEDULE_AHEAD = 0.12;', 'const SCHEDULE_AHEAD = 60;')],
];

const { missed } = run('T5 - the metronome', MUTATIONS);
process.exit(missed ? 1 : 0);
