/* Deliberate breakage: T12 - ear training.
 * Every mutation here must make `node tools/verify.js` fail. */
const { run } = require('./harness.js');

const MUTATIONS = [
  ['the right answer left out of the options',
   p => p.replace('  const options = [answer];', '  const options = [];')],
  ['the options never shuffled, so the answer is always first',
   p => p.replace('  for (let i = options.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [options[i], options[j]] = [options[j], options[i]];\n  }', '')],
  ['the wrong options allowed to repeat the right one',
   p => p.replace('  const rest = pool.filter(o => o !== answer);', '  const rest = pool.slice();')],
  ['only two options offered',
   p => p.replace('const EAR_OPTION_COUNT = 4;', 'const EAR_OPTION_COUNT = 2;')],
  ['the same question drawn every time',
   p => p.replace('const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];', 'const pickRandom = (list) => list[0];')],
  ['the question never sounded',
   p => p.replace('  playEarQuestion();\n  renderEarTraining();', '  renderEarTraining();')],
  ['an interval question sounds only its lower note',
   p => p.replace("kind: 'interval', keys: [INTERVAL_ROOT, step.key], answer: interval.name,", "kind: 'interval', keys: [INTERVAL_ROOT], answer: interval.name,")],
  ['an interval question sounds both notes at once, giving nothing to compare',
   p => p.replace('playTone(note.freq, { at: ctx.currentTime + 0.05 + i * 0.75, hold: 0.7, voice: `ear-${i}` });',
              'playTone(note.freq, { at: ctx.currentTime + 0.05, hold: 0.7, voice: `ear-${i}` });')],
  ['the panel shows the key it is asking the ear to name',
   p => p.replace('      <p class="text-sm font-semibold text-slate-800 mb-3">${EAR_MODES[earTraining.mode].prompt}</p>',
              '      <p class="text-sm font-semibold text-slate-800 mb-3">${EAR_MODES[earTraining.mode].prompt} (${question.keys.join(\", \")})</p>')],
  ['a wrong answer reported as right',
   p => p.replace('  const correct = question.options[optionIndex] === question.answer;', '  const correct = true;')],
  ['a wrong answer leaves the streak running',
   p => p.replace('  } else {\n    earTraining.streak = 0;\n  }', '  } else {\n  }')],
  ['a wrong answer counts towards the score',
   p => p.replace('  if (correct) {\n    earTraining.score++;\n    earTraining.streak++;', '  earTraining.score++;\n  if (correct) {\n    earTraining.streak++;')],
  ['a question can be answered over and over',
   p => p.replace('  if (earTraining.answered) return null;      // one go per question', '')],
  ['a mode that does not exist is accepted',
   p => p.replace('  if (!EAR_MODES[mode]) {\n    console.error(`setEarMode: there is no ear training mode called "${mode}".`);\n    return false;\n  }', '  if (!EAR_MODES[mode]) { return true; }')],
  ['an option index out of range is accepted',
   p => p.replace('  if (!question || !question.options[optionIndex]) {\n    console.error(`answerEar: there is no option ${optionIndex} to choose.`);\n    return null;\n  }', '  if (!question) { return null; }')],
  ['replaying with no question is accepted',
   p => p.replace("  if (!question) {\n    console.error('playEarQuestion: there is no question to play.');\n    return false;\n  }", '  if (!question) { return true; }')],
];

const { missed } = run('T12 - ear training', MUTATIONS);
process.exit(missed ? 1 : 0);
