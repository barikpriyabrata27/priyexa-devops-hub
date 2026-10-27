const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../quiz/aws-scenarios.js'), 'utf8'), context);
const cases = context.AwsScenarios;

test('all 20 requested AWS topics have complete, distinct practice content', () => {
  const topics = ['same account','private connectivity','cross-account','private path','application','database','Secure','NAT','timeout','Transit','ALB','Bastion','MFA','CloudTrail','Shield','WAF','Route 53','CloudFront','Lambda','Update'];
  assert.equal(cases.length, 20);
  assert.equal(new Set(cases.map(item => item.id)).size, 20);
  cases.forEach((item, index) => {
    assert.equal(item.id, 'aws-' + String(index + 1).padStart(2, '0'));
    assert.ok(item.title.includes(topics[index]), item.title);
    assert.ok(item.question.length > 80);
    assert.equal(item.choices.length, 3);
    assert.equal(new Set(item.choices).size, 3);
    assert.ok(Number.isInteger(item.correct) && item.correct >= 0 && item.correct < 3);
    assert.ok(item.explanation.length > 80);
    assert.ok(item.answer.length >= 4);
    assert.ok(item.answer.every(point => point.length > 50));
    assert.ok(item.sources.length > 0);
    assert.equal(item.sourceTitles.length, item.sources.length);
    assert.ok(item.sourceTitles.every(title => typeof title === 'string' && title.length > 5));
    item.sources.forEach(url => {
      assert.equal(new URL(url).hostname, 'docs.aws.amazon.com');
      assert.equal(new URL(url).protocol, 'https:');
    });
    assert.equal(item.lab, undefined, 'No unsupported lab preset for ' + item.id);
    assert.equal(item.command, undefined, 'No invented command for ' + item.id);
  });
});

test('S3 answers separate connectivity, identity and cross-account resource authorization', () => {
  const privateAccess = cases[1].answer.join(' ');
  assert.match(privateAccess, /does not receive a private IP/);
  assert.match(privateAccess, /does not independently grant/);
  const crossAccount = cases[3].answer.join(' ');
  assert.match(crossAccount, /role policy in A and bucket policy in B/);
  assert.match(crossAccount, /aws:SourceVpce/);
  assert.match(crossAccount, /SSE-KMS/);
});

test('MFA, DNS, illustrative experience and availability retain important boundaries', () => {
  assert.match(cases[12].explanation, /Root is not an IAM user/);
  assert.match(cases[12].answer.join(' '), /MFA registration and MFA enforcement are separate/);
  assert.match(cases[16].explanation, /DNS layer/);
  assert.match(cases[18].question, /not a claim about your past work/);
  assert.match(cases[19].answer.join(' '), /do not promise unconditional zero downtime/);
});
