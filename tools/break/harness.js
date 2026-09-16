/*
 * Shared runner for the deliberate-breakage suites.
 *
 *   node tools/break/all.js          run every suite
 *   node tools/break/t8.js           run one
 *
 * Each suite is a list of [label, mutate] pairs. `mutate` takes the text of one
 * of the project's three source files and returns it with one thing broken; the
 * runner works out which file it meant by trying each in turn. Every mutation
 * must make `node tools/verify.js` fail. A check that survives its own
 * breakage is not testing anything.
 *
 * These live in the repo for the same reason verify.js does: they go stale.
 * Three suites had already drifted by the time T17 was done, because the code
 * they name had been refactored underneath them and nothing said so.
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const SOURCES = ['index.html', 'styles.css', 'app.js'];

function run(suiteName, mutations) {
  const originals = {};
  for (const name of SOURCES) originals[name] = fs.readFileSync(path.join(ROOT, name), 'utf8');
  const verify = fs.readFileSync(path.join(ROOT, 'tools', 'verify.js'), 'utf8');

  let missed = 0;
  for (const [label, mutate] of mutations) {
    // Which file did this mutation mean? Exactly one should come back changed.
    const touched = SOURCES.filter(name => mutate(originals[name]) !== originals[name]);

    if (touched.length === 0) {
      console.log(`STALE   ${label} — no longer matches any source file`);
      missed++;
      continue;
    }
    if (touched.length > 1) {
      console.log(`VAGUE   ${label} — changes ${touched.join(' and ')}`);
      missed++;
      continue;
    }

    const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'tuhocdan-break-'));
    fs.mkdirSync(path.join(dir, 'tools'));
    for (const name of SOURCES) {
      fs.writeFileSync(path.join(dir, name), name === touched[0] ? mutate(originals[name]) : originals[name]);
    }
    fs.writeFileSync(path.join(dir, 'tools', 'verify.js'), verify);

    const result = cp.spawnSync('node', [path.join(dir, 'tools', 'verify.js')], { encoding: 'utf8', timeout: 60000 });
    const failed = (result.stdout.match(/^FAIL/gm) || []).length;
    const caught = result.status !== 0;

    console.log(`${caught ? 'caught' : 'MISSED'}  ${label}${caught ? ` (${failed} check(s) failed in ${touched[0]})` : ''}`);
    if (!caught) missed++;
    fs.rmSync(dir, { recursive: true, force: true });
  }

  const summary = missed
    ? `${suiteName}: ${missed} of ${mutations.length} mutation(s) slipped through`
    : `${suiteName}: all ${mutations.length} mutations caught`;
  console.log(`\n${summary}`);
  return { total: mutations.length, missed };
}

module.exports = { run, ROOT, SOURCES };
