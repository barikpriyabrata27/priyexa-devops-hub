/* Scenario exercises are separate from the existing quiz banks. */
(() => {
 const panel=document.getElementById('scenario-practice'), modes=document.querySelector('.mode-grid');
 modes.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('selected'))));
 modes.addEventListener('click',event=>{
  const b=event.target.closest('[data-mode]');if(!b)return;
  modes.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const active=b.dataset.mode==='scenarios';
  panel.classList.toggle('hidden',!active);
  document.querySelector('.setup-footer').classList.toggle('hidden',active);
  document.querySelector('.step-label').classList.toggle('hidden',active);
  document.querySelector('.panel-heading .mono-label').textContent=active?'3 flows / 3 commands':'20 questions / round';
  if(!active)return;
  document.getElementById('cycle-label').textContent='3 VPC demonstrations';
  event.stopImmediatePropagation();
  modes.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
  document.querySelector('.filters').classList.add('hidden');
  document.getElementById('quick-filter-list')?.classList.add('hidden');
  render();
 },true);
 function render(){
  panel.innerHTML='<h3>VPC scenario practice</h3><p>Arrange a flow or practice an inspection command. These illustrative examples never execute commands.</p><label for="scenario-choice">Demonstration</label><select id="scenario-choice"></select><div id="scenario-task"></div>';
  const select=panel.querySelector('select');
  Object.entries(VpcScenarios.cases).forEach(([id,c])=>select.add(new Option(c.title,id)));
  select.onchange=()=>task(select.value);task(select.value);
 }
 function task(id){
  const c=VpcScenarios.cases[id],host=panel.querySelector('#scenario-task'),table=c.source==='private'?'rtb-private':'rtb-public';
  host.innerHTML='<div class="scenario-task-grid"><section class="scenario-exercise"><p class="eyebrow">01 / Trace the journey</p><h4>Arrange the packet flow</h4><p>Use Up and Down to put the cards in order.</p><ol class="flow-cards"></ol><button type="button" class="secondary-button" id="check-flow">Check flow</button><p id="flow-feedback" class="scenario-feedback" role="status"></p></section><form id="command-form" class="scenario-exercise"><p class="eyebrow">02 / Inspect the route</p><h4>Inspect the source route table</h4><label for="scenario-command">Enter the AWS CLI command to describe '+table+'.</label><input id="scenario-command" maxlength="300" autocomplete="off" spellcheck="false" placeholder="aws ec2 …"><button class="secondary-button">Check command</button><p id="command-feedback" class="scenario-feedback" role="status"></p></form></div><a class="scenario-lab-link" target="_blank" rel="noopener" href="../LABS/AWS/vpc-routing-simulator/?scenario='+id+'">Go to lab ↗</a>';
  let order=c.steps.map((text,index)=>({text,index})).reverse();
  const list=host.querySelector('ol');
  function draw(focus,direction){
   list.replaceChildren();
   order.forEach((s,i)=>{
    const li=document.createElement('li'),text=document.createElement('span');text.textContent=s.text;li.append(text);
    ['Up','Down'].forEach((label,j)=>{
     const b=document.createElement('button'),next=i+(j?1:-1);b.type='button';b.textContent=label;b.disabled=next<0||next>=order.length;b.setAttribute('aria-label',label+': '+s.text);
     b.onclick=()=>{[order[i],order[next]]=[order[next],order[i]];host.querySelector('#flow-feedback').textContent='';draw(next,j);};li.append(b);
    });list.append(li);
   });
   if(focus!==undefined){const buttons=list.children[focus].querySelectorAll('button');(buttons[direction].disabled?buttons[1-direction]:buttons[direction]).focus();}
  }
  draw();
  host.querySelector('#check-flow').onclick=()=>{const correct=order.every((s,i)=>s.index===i),feedback=host.querySelector('#flow-feedback');feedback.classList.toggle('correct',correct);feedback.textContent=correct?'Correct. Follow this path in the lab.':'Try again. Expected flow: '+c.steps.join(' → ');};
  host.querySelector('form').onsubmit=event=>{
   event.preventDefault();
   const correct=VpcScenarios.validCommand(host.querySelector('input').value,table);host.querySelector('#command-feedback').classList.toggle('correct',correct);host.querySelector('#command-feedback').textContent=correct?'Correct. The lab shows simulated route-table output.':'Expected: aws ec2 describe-route-tables --route-table-ids '+table;
  };
 }
})();
