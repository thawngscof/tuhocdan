/* Run every deliberate-breakage suite.
 *
 *   node tools/break/all.js
 *
 * Slower than tools/verify.js by a long way - it runs the whole check suite
 * once per mutation - so it is the thing to run after changing a feature, not
 * after every edit.
 */
const cp = require('child_process');
const path = require('path');

const SUITES = ["t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t20", "t22", "t23", "t24"];

let total = 0, missed = 0;
for (const suite of SUITES) {
  const result = cp.spawnSync('node', [path.join(__dirname, suite + '.js')], { encoding: 'utf8' });
  process.stdout.write(result.stdout);
  const summary = /: (?:all (\d+) mutations caught|(\d+) of (\d+) mutation)/.exec(result.stdout || '');
  if (summary) {
    total += Number(summary[1] || summary[3]);
    missed += Number(summary[2] || 0);
  }
}
console.log(`\n${'='.repeat(60)}`);
console.log(missed
  ? `${missed} of ${total} mutations slipped through`
  : `all ${total} mutations caught across ${SUITES.length} suites`);
process.exit(missed ? 1 : 0);
