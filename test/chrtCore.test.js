import * as chrt from 'chrt';
import Chrt from '~/Chrt';

test('Test data', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .data([0,1,2,3,4,5])

  console.log(chart.data())

  expect(chart.data()).toStrictEqual([0,1,2,3,4,5]);
});
