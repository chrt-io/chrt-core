import * as tests from './charts/chrts';

const select = document.querySelector('#chartSelector');
Object.keys(tests).map(d => {
  const option = document.createElement('option');
  option.value = d;
  option.textContent = d;

  select.append(option);
});

select.onchange = () => {
  const chartContainer = document.querySelector('#chart');
  chartContainer.innerHTML = '';
  if(select.value !== 'none') {
    tests[select.value](chartContainer);
  }

};
