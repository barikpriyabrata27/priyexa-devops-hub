/* All state stays in this browser. No AWS requests or command execution. */
(() => {
  const get = id => document.getElementById(id);
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const choices = AwsScenarios.filter(item => Object.hasOwn(AwsLabs.cases, item.id));
  const requested = new URL(location.href).searchParams.get('scenario');
  let id = choices.some(item => item.id === requested) ? requested : choices[0].id;
  let state, current = 0, timer = null;
  choices.forEach(item => get('lab-choice').add(new Option(item.id.slice(4) + ' · ' + item.title, item.id)));
  if (requested && requested !== id) {
    get('link-notice').hidden = false;
    get('link-notice').textContent = 'This scenario link is unknown. Showing the first AWS lab; choose another demonstration below.';
  }

  function stop() {
    clearTimeout(timer);
    timer = null;
    get('play').textContent = '▶ Play';
  }

  function open(nextId) {
    stop();
    id = nextId;
    current = 0;
    state = AwsLabs.initial(id);
    const item = choices.find(item => item.id === id);
    const lab = AwsLabs.cases[id];
    document.title = item.title + ' · Priyexa AWS Lab';
    get('lab-title').textContent = item.title;
    get('lab-description').textContent = lab.description;
    get('lab-choice').value = id;
    get('question-link').href = '../../../quiz/interview.html?scenario=' + id;
    const url = new URL(location.href);
    url.searchParams.set('scenario', id);
    history.replaceState(null, '', url);
    get('conditions').replaceChildren();
    lab.controls.forEach(control => {
      const group = element('div', undefined, 'condition');
      const label = element('label', control.label);
      label.htmlFor = 'condition-' + control.id;
      const select = element('select');
      select.id = label.htmlFor;
      select.dataset.condition = control.id;
      select.setAttribute('aria-describedby', select.id + '-hint');
      control.options.forEach(option => select.add(new Option(option.label, option.value)));
      select.value = state[control.id];
      const hint = element('p', undefined, 'hint');
      hint.id = select.id + '-hint';
      select.addEventListener('change', () => {
        stop();
        state[control.id] = select.value;
        render();
      });
      group.append(label, select, hint);
      get('conditions').append(group);
    });
    get('architecture').replaceChildren();
    lab.nodes.forEach((name, index) => {
      const node = element('li');
      node.append(element('small', String(index + 1).padStart(2, '0')), document.createTextNode(name));
      get('architecture').append(node);
    });
    get('lesson').textContent = item.explanation;
    get('model-answer').replaceChildren(...item.answer.map(point => element('li', point)));
    get('references').replaceChildren();
    item.sources.forEach((url, index) => {
      const li = element('li');
      const a = element('a', item.sourceTitles[index] + ' ↗');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      li.append(a); get('references').append(li);
    });
    // Keep the model answer collapsed when changing scenarios.
    get('model-answer').closest('details').open = false;
    render();
  }

  function render() {
    const lab = AwsLabs.cases[id], result = AwsLabs.evaluate(id, state);
    result.checks.forEach(check => {
      get('condition-' + check.id + '-hint').textContent = check.message;
    });
    get('outcome-badge').textContent = result.passed ? 'MODEL CHECKS PASS' : 'NEEDS ATTENTION';
    get('outcome-badge').classList.toggle('ready', result.passed);
    get('outcome-text').textContent = result.outcome;
    get('steps').replaceChildren();
    result.checks.forEach((check, index) => {
      const button = element('button');
      button.type = 'button';
      button.append(element('small', 'CHECK ' + (index + 1) + ' / ' + (check.passed ? 'PASS' : 'ATTENTION')), document.createTextNode(check.label));
      if (index === current) button.setAttribute('aria-current', 'step');
      button.addEventListener('click', () => { stop(); current = index; renderStage(); });
      get('steps').append(button);
    });
    get('terminal-hint').textContent = lab.command
      ? 'Example command shown for learning only. Observations below are simplified, simulated results, not raw AWS CLI output. All identifiers are illustrative.'
      : 'A simulated event/readiness log for this conceptual workflow. There is no command prompt or command execution.';
    get('terminal-output').textContent = (lab.command ? '$ ' + lab.command + '\n\n' : '') +
      'SIMULATION OBSERVATIONS\n' +
      result.checks.map((check, index) => String(index + 1).padStart(2, '0') + ' [' + (check.passed ? 'PASS' : 'ATTENTION') + '] ' + check.label + '\n   ' + check.message).join('\n\n') +
      '\n\nRESULT\n' + result.outcome;
    renderStage();
  }

  function renderStage() {
    const result = AwsLabs.evaluate(id, state), check = result.checks[current];
    [...get('steps').children].forEach((button, index) => {
      if (index === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    [...get('architecture').children].forEach((node, index) => {
      node.classList.toggle('active', index === check.node);
      const blocked = result.checks.some(item => item.node === index && !item.passed);
      node.classList.toggle('blocked', blocked);
      node.querySelector('.node-status')?.remove();
      if (blocked) node.append(element('span', 'Needs attention', 'node-status'));
    });
    get('step-detail').classList.toggle('fail', !check.passed);
    get('step-detail').replaceChildren(
      element('h3', 'Check ' + (current + 1) + ': ' + check.label),
      element('p', (check.passed ? 'Pass. ' : 'Needs attention. ') + check.message)
    );
    get('prev').disabled = current === 0;
    get('next').disabled = current === result.checks.length - 1;
  }

  function playStep() {
    renderStage();
    const result = AwsLabs.evaluate(id, state);
    if (!result.checks[current].passed || current === result.checks.length - 1) {
      stop();
      return;
    }
    get('play').textContent = '❚❚ Pause';
    timer = setTimeout(() => { current++; playStep(); }, 1500);
  }

  get('lab-choice').addEventListener('change', event => {
    get('link-notice').hidden = true;
    open(event.target.value);
  });
  get('working').addEventListener('click', () => {
    stop();
    state = AwsLabs.initial(id, true);
    AwsLabs.cases[id].controls.forEach(control => { get('condition-' + control.id).value = state[control.id]; });
    render();
  });
  get('reset').addEventListener('click', () => open(id));
  get('prev').addEventListener('click', () => { stop(); current--; renderStage(); });
  get('next').addEventListener('click', () => { stop(); current++; renderStage(); });
  get('play').addEventListener('click', () => {
    if (timer) { stop(); return; }
    current = 0;
    playStep();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  open(id);
})();
