/* Illustrative examples only. Commands are never executed. */
globalThis.VpcScenarios = {
 cases: {
  privateInternet: {title:'Private EC2 to internet',source:'private',destination:'internet',steps:['Private EC2 sends packet','Private route selects NAT','NAT translates source','Public route selects IGW','IGW maps Elastic IP','Internet receives request']},
  publicInternet: {title:'Public EC2 to internet',source:'public',destination:'internet',steps:['Public EC2 sends packet','Public route selects IGW','IGW maps public IPv4','Internet receives request']},
  privateRds: {title:'Private EC2 to RDS',source:'private',destination:'rds',steps:['Private EC2 sends packet','VPC local route wins','RDS access rules allow connection']}
 },
 validCommand(value, table='rtb-private') {
  const args=(value.trim().match(/"[^"\n]*"|'[^'\n]*'|[^\s]+/g)||[]).map(t=>t.replace(/^(['"])(.*)\1$/,'$2'));
  if(args.slice(0,3).join(' ')!=='aws ec2 describe-route-tables')return false;
  let found=false;
  for(let i=3;i<args.length;i++){
   const [flag,inline,...extra]=args[i].split('=');
   if(extra.length)return false;
   const val=(inline===undefined?args[++i]:inline)?.replace(/^(['"])(.*)\1$/, '$2');
   if(flag==='--route-table-ids'&&val===table&&!found)found=true;
   else if(flag==='--output'&&['json','text','table','yaml','yaml-stream'].includes(val))continue;
   else if(flag==='--region'&&/^[a-z]{2}(?:-[a-z]+)+-\d$/.test(val||''))continue;
   else return false;
  }
  return found;
 }
};
