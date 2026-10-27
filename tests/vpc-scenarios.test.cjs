const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../quiz/vpc-scenarios.js'),'utf8'),context);
const {validCommand,cases}=context.VpcScenarios;
test('accepts equivalent read-only inspection commands',()=>{
 for(const command of [
  'aws ec2 describe-route-tables --route-table-ids rtb-private',
  'aws   ec2 describe-route-tables --output table --route-table-ids "rtb-private"',
  "aws ec2 describe-route-tables --route-table-ids='rtb-private' --region us-east-1",
  'aws ec2 describe-route-tables --route-table-ids=rtb-private --output=json'
 ])assert.equal(validCommand(command),true,command);
 assert.equal(validCommand('aws ec2 describe-route-tables --route-table-ids rtb-public','rtb-public'),true);
});
test('rejects wrong targets, mutations, shell suffixes and malformed flags',()=>{
 for(const command of [
  '', 'aws ec2 delete-route-table --route-table-id rtb-private',
  'aws ec2 describe-route-tables', 'aws ec2 describe-route-tables --route-table-ids rtb-public',
  'aws ec2 describe-route-tables --route-table-ids rtb-private; echo done',
  'aws ec2 describe-route-tables --route-table-ids rtb-private --unknown foo',
  'aws ec2 describe-route-tables --route-table-ids=rtb-private=extra',
  'aws ec2 describe-route-tables --route-table-ids rtb-private --output',
  'aws ec2 describe-route-tables --route-table-ids rtb-private --route-table-ids rtb-private'
 ])assert.equal(validCommand(command),false,command);
});
test('scenario presets reference only supported VPC paths',()=>{
 assert.equal(Object.keys(cases).length,3);
 for(const item of Object.values(cases)){
  assert.ok(['private','public'].includes(item.source));
  assert.ok(['internet','rds'].includes(item.destination));
  assert.equal(new Set(item.steps).size,item.steps.length);
 }
});
