const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = {};
vm.createContext(context);
for (const file of ['aws-scenarios.js', 'aws-labs.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../quiz', file), 'utf8'), context);
}
const {AwsScenarios: questions, AwsLabs: labs} = context;

test('every AWS question has a distinct matching interactive model', () => {
  assert.equal(Object.keys(labs.cases).length, 20);
  for (const question of questions) {
    const lab = labs.cases[question.id];
    assert.ok(lab, question.id);
    assert.ok(lab.description.length > 60);
    assert.ok(lab.nodes.length >= 4);
    assert.equal(new Set(lab.controls.map(c => c.id)).size, lab.controls.length);
    for (const control of lab.controls) {
      assert.ok(control.node >= 0 && control.node < lab.nodes.length);
      assert.ok(control.options.some(option => option.value === control.expected));
      assert.ok(control.pass.length > 30 && control.fail.length > 30);
    }
  }
});

test('every default fault can be repaired and every modeled fault changes the outcome', () => {
  for (const id of Object.keys(labs.cases)) {
    assert.equal(labs.evaluate(id, labs.initial(id)).passed, false, id);
    const working = labs.initial(id, true);
    assert.equal(labs.evaluate(id, working).passed, true, id);
    for (const control of labs.cases[id].controls) {
      const faulty = {...working, [control.id]: 'missing'};
      const result = labs.evaluate(id, faulty);
      assert.equal(result.passed, false, id + '/' + control.id);
      assert.equal(result.checks.filter(check => !check.passed).length, 1);
      assert.ok(result.outcome.includes(control.fail));
      assert.equal(labs.evaluate(id, {...faulty, [control.id]: control.expected}).passed, true);
    }
  }
});

test('unknown IDs and invalid or incomplete state cannot silently pass', () => {
  assert.equal(labs.initial('aws-unknown'), null);
  assert.equal(labs.initial('__proto__'), null);
  assert.equal(labs.evaluate('constructor', {}), null);
  assert.equal(labs.evaluate('aws-unknown', {}), null);
  for (const id of Object.keys(labs.cases)) {
    assert.equal(labs.evaluate(id, {}).passed, false);
    assert.equal(labs.evaluate(id, null).passed, false);
    const state = labs.initial(id, true);
    state[labs.cases[id].controls[0].id] = 'unrecognized';
    assert.equal(labs.evaluate(id, state).passed, false);
  }
});

test('private cross-account S3 requires routing and both accounts permissions', () => {
  const state = labs.initial('aws-04', true);
  for (const key of ['path', 'identity', 'bucket', 'endpoint']) {
    assert.equal(labs.evaluate('aws-04', {...state, [key]: 'missing'}).passed, false, key);
  }
  assert.match(labs.cases['aws-04'].controls.find(c=>c.id==='identity').fail, /authorize its own role/);
});

test('conceptual MFA workflow has no fake root command and preserves distinct enrollment', () => {
  const lab = labs.cases['aws-13'];
  assert.equal(lab.command, undefined);
  assert.match(lab.controls.find(c => c.id === 'root').fail, /Root is not an IAM user/);
});
