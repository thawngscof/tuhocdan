/* Deliberate breakage: T7 - the audio engine.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['voices wired straight to the speakers, bypassing the limiter',
   p => p.replace('gain.connect(masterLimiter);', 'gain.connect(ctx.destination);')],

  ['the limiter is dropped from the chain',
   p => p.replace('masterLimiter.connect(masterGain);', 'masterGain.connect(masterGain);')],

  ['back to a flat level with a single fade, no envelope',
   p => p.replace(`    const g = gain.gain;
    g.setValueAtTime(SILENT, at);
    g.exponentialRampToValueAtTime(VOICE_PEAK, at + attack);
    g.exponentialRampToValueAtTime(sustainLevel, at + attack + decay);
    g.setValueAtTime(sustainLevel, releaseAt);
    g.exponentialRampToValueAtTime(SILENT, endAt);`,
 `    const g = gain.gain;
    g.setValueAtTime(0.3, at);
    g.exponentialRampToValueAtTime(SILENT, endAt);`)],

  ['the envelope ramps down to a true zero',
   p => p.replace('g.exponentialRampToValueAtTime(SILENT, endAt);', 'g.exponentialRampToValueAtTime(0, endAt);')],

  ['attack and decay swapped, so the note fades in backwards',
   p => p.replace(`    g.exponentialRampToValueAtTime(VOICE_PEAK, at + attack);
    g.exponentialRampToValueAtTime(sustainLevel, at + attack + decay);`,
 `    g.exponentialRampToValueAtTime(sustainLevel, at + attack);
    g.exponentialRampToValueAtTime(VOICE_PEAK, at + attack + decay);`)],

  ['the voice peak is back to the old flat 0.3, which a chord sums past full scale',
   p => p.replace('const VOICE_PEAK = 0.22;', 'const VOICE_PEAK = 0.35;')],

  ['a short hold folds the release back before the attack',
   p => p.replace('const releaseAt = at + Math.max(hold, attack + decay);', 'const releaseAt = at + hold;')],

  ['the envelope is scheduled from now instead of from the given time',
   p => p.replace('g.setValueAtTime(SILENT, at);', 'g.setValueAtTime(SILENT, ctx.currentTime);')],

  ['the oscillator starts now instead of when it was scheduled',
   p => p.replace('osc.start(at);', 'osc.start();')],

  ['oscillators are never stopped',
   p => p.replace('osc.stop(endAt + 0.02);', '')],

  ['a re-struck key stacks a second note instead of cutting the first',
   p => p.replace('if (voiceId !== null) releaseVoice(voiceId, at);', '')],

  ['a re-struck key is snapped off rather than faded',
   p => p.replace('voice.gain.gain.exponentialRampToValueAtTime(SILENT, at + 0.03);', 'voice.gain.gain.value = 0;')],

  ['the old note is cut but never cancelled, so its schedule plays on',
   p => p.replace('voice.gain.gain.cancelScheduledValues(at);', '')],

  ['the live voice set keeps pointing at the note that was cut',
   p => p.replace('activeVoices.set(voiceId, voice);', '')],

  ['a suspended context is never resumed',
   p => p.replace("if (audioCtx.state === 'suspended') audioCtx.resume();", '')],

  ['a note with no pitch builds a voice anyway',
   p => p.replace('if (!freq) return null;', '')],
];

const { missed } = run('T7 - the audio engine', MUTATIONS);
process.exit(missed ? 1 : 0);
