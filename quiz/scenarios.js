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
  document.querySelector('.panel-heading .mono-label').textContent=active?'20 AWS questions + matching labs':'20 questions / round';
  if(!active)return;
  document.getElementById('cycle-label').textContent='20 AWS labs to explore';
  event.stopImmediatePropagation();
  modes.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
  document.querySelector('.filters').classList.add('hidden');
  document.getElementById('quick-filter-list')?.classList.add('hidden');
  render();
 },true);
 function render(){
  panel.innerHTML='<h3>AWS scenario practice</h3><p>Work through 20 AWS interview decisions, then explore each one in its interactive lab. The three original VPC demonstrations are also available.</p><label for="scenario-choice">Question or demonstration</label><select id="scenario-choice"></select><div id="scenario-task"></div>';
  const select=panel.querySelector('select');
  const questions=document.createElement('optgroup');questions.label='AWS interview scenarios · 20 questions';
  AwsScenarios.forEach((item,index)=>questions.append(new Option(String(index+1).padStart(2,'0')+' · '+item.title,item.id)));
  const demos=document.createElement('optgroup');demos.label='VPC demonstrations · flow + command';
  Object.entries(VpcScenarios.cases).forEach(([id,c])=>demos.append(new Option(c.title,id)));
  select.append(questions,demos);
  select.onchange=()=>task(select.value);task(select.value);
 }
 function task(id){
  const question=AwsScenarios.find(item=>item.id===id);
  if(question){
   AwsScenarioPractice.render(panel.querySelector('#scenario-task'),question,next=>{
    panel.querySelector('select').value=next;task(next);panel.querySelector('#aws-question-title').focus();
   });
   return;
  }
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
 // Initial bank loading must not overwrite the visible scenario-mode metadata.
 const bankObserver = new MutationObserver(() => {
  if (modes.querySelector('.selected')?.dataset.mode === 'scenarios') {
   document.getElementById('cycle-label').textContent = '20 AWS labs to explore';
   document.querySelector('.panel-heading .mono-label').textContent = '20 AWS questions + matching labs';
  }
  bankObserver.disconnect();
 });
 bankObserver.observe(document.getElementById('bank-count'), {childList:true});
 // A lab's return link opens its exact question.
 const requested = new URLSearchParams(location.search).get('scenario');
 if (AwsScenarios.some(item => item.id === requested)) {
  document.addEventListener('DOMContentLoaded', () => {
   modes.querySelector('[data-mode="scenarios"]').click();
   panel.querySelector('#scenario-choice').value = requested;
   task(requested);
  });
 }
})();