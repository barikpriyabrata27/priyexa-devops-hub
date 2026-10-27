/* Read-only companion to the visual trace; all output is simulated. */
(() => {
 const get=id=>document.getElementById(id);
 const id=new URLSearchParams(location.search).get('scenario');
 const example=Object.hasOwn(VpcScenarios.cases,id)?VpcScenarios.cases[id]:null;
 if(example){
  get('source').value=example.source;get('destination').value=example.destination;
  get('nat').checked=get('publicIp').checked=get('rdsAccess').checked=true;
  get('source').dispatchEvent(new Event('change'));
 }
 function update(){
  const priv=get('source').value==='private',local=get('destination').value==='rds';
  const available=local?get('rdsAccess').checked:priv?get('nat').checked:get('publicIp').checked;
  get('terminal-output').textContent='$ aws ec2 describe-route-tables --route-table-ids '+(priv?'rtb-private':'rtb-public')+
   '\n# Illustrative route-table output\n10.0.0.0/16  local\n0.0.0.0/0    '+(priv?'nat-example':'igw-example')+
   '\n\n$ '+(local?'nc -vz -w 3 10.0.3.20 5432':'curl -I --connect-timeout 3 https://example.com')+
   '\n'+(available?(local?'Connection to 10.0.3.20 port 5432 succeeded (simulated).':'HTTP/2 200 (simulated)'):'Connection timed out (simulated): '+(local?'RDS access blocked':priv?'NAT unavailable':'public IPv4 missing'))+
   '\n\n# '+(local?'The VPC local route wins.':priv?'Private EC2 → NAT → public route → IGW → internet.':'Public EC2 → IGW → internet.');
  get('terminal-context').textContent=(example?'Opened from '+example.title+'. ':'')+'Output follows the current source, destination and lab conditions.';
 }
 ['source','destination','nat','publicIp','rdsAccess'].forEach(id=>get(id).addEventListener('change',update));
 get('reset').addEventListener('click',update);get('traceBtn').addEventListener('click',update);update();
})();
