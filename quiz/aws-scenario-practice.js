/* Decision practice uses native controls; model answers are not keyword-graded. */
globalThis.AwsScenarioPractice = {
  render(host, item, navigate) {
    host.replaceChildren();
    const element = (tag, text, className) => {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (className) node.className = className;
      return node;
    };
    const number = AwsScenarios.indexOf(item);
    const card = element('article', undefined, 'scenario-exercise aws-scenario-card');
    card.append(element('p', 'AWS scenario ' + (number + 1) + ' of ' + AwsScenarios.length + ' / ' + item.category, 'eyebrow'));
    const title = element('h4', item.title);
    title.id = 'aws-question-title';
    title.tabIndex = -1;
    card.setAttribute('aria-labelledby', title.id);
    card.append(title, element('p', item.question, 'aws-question'));
    const form = element('form');
    const fieldset = element('fieldset', undefined, 'aws-choices');
    fieldset.append(element('legend', 'Choose the strongest decision'));
    item.choices.forEach((choice, index) => {
      const label = element('label', undefined, 'aws-option');
      const radio = element('input');
      radio.type = 'radio';
      radio.name = 'aws-decision';
      radio.value = String(index);
      label.append(radio, element('span', choice));
      fieldset.append(label);
    });
    const check = element('button', 'Check decision', 'secondary-button');
    check.type = 'submit';
    check.disabled = true;
    fieldset.addEventListener('change', () => {
      check.disabled = false;
      feedback.textContent = '';
      fieldset.querySelectorAll('label').forEach(label => label.classList.remove('aws-correct', 'aws-wrong'));
    });
    const feedback = element('p', undefined, 'scenario-feedback');
    feedback.id = 'aws-feedback';
    feedback.setAttribute('role', 'status');
    form.append(fieldset, check, feedback);
    const model = element('details', undefined, 'aws-model');
    model.append(element('summary', 'Model answer & explanation'));
    const answer = element('ul');
    item.answer.forEach(point => answer.append(element('li', point)));
    model.append(answer, element('p', 'Practice only: the model answer is one reasonable approach. Your choices are not saved.', 'muted'));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const chosen = form.querySelector('input:checked');
      if (!chosen) return;
      const correct = Number(chosen.value) === item.correct;
      feedback.classList.toggle('correct', correct);
      feedback.textContent = (correct ? 'Correct. ' : 'Not quite. Expected decision: ' + item.choices[item.correct] + ' ') + item.explanation;
      fieldset.querySelectorAll('label').forEach((label, index) => {
        label.classList.toggle('aws-correct', index === item.correct);
        label.classList.toggle('aws-wrong', !correct && index === Number(chosen.value));
      });
      model.open = true;
    });
    card.append(form, model);
    const references = element('div', undefined, 'aws-references');
    references.append(element('h5', 'Read the AWS documentation'));
    const list = element('ul');
    item.sources.forEach((url, index) => {
      const li = element('li');
      const link = element('a', item.sourceTitles[index] + ' ↗');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      li.append(link);
      list.append(li);
    });
    references.append(list);
    card.append(references);
    const labLink = element('a', 'Go to interactive lab ↗', 'scenario-lab-link');
    labLink.href = '../LABS/AWS/scenario-lab/?scenario=' + item.id;
    labLink.target = '_blank';
    labLink.rel = 'noopener';
    card.append(labLink, element('p', 'Change the conditions and follow this scenario’s simulated flow. No AWS account or command execution.', 'aws-lab-note'));
    host.append(card);
    const nav = element('nav', undefined, 'aws-question-nav');
    nav.setAttribute('aria-label', 'AWS scenario navigation');
    [['Previous question', -1], ['Next question', 1]].forEach(([text, delta]) => {
      const button = element('button', text, 'secondary-button');
      button.type = 'button';
      button.disabled = !AwsScenarios[number + delta];
      button.addEventListener('click', () => navigate(AwsScenarios[number + delta].id));
      nav.append(button);
    });
    host.append(nav);
  }
};
