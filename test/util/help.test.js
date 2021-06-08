import * as chrt from 'chrt';
import Chrt from '~/Chrt';

test('Test help', async () => {
  const chart = Chrt()
    .data([0,1,2,3,4,5])

  expect(chart.help()).toBeDefined();
});

test('Test help obj', async () => {
  let xAxis;
  const chart = Chrt()
    .data([0,1,2,3,4,5])
    .add(xAxis = chrt.xAxis())

  expect(chart.help(xAxis)).toBeDefined();
});
