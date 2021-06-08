import * as chrt from 'chrt';
import Chrt from '~/Chrt';

test('Test data', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt().data([0, 1, 2, 3, 4, 5]);

  expect(chart.data()).toStrictEqual(
    [0, 1, 2, 3, 4, 5].map(d => ({ x: d, y: d }))
  );
});

test('Test data accessor function', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt().data([0, 1, 2, 3, 4, 5], (d, i) => ({
    x: i,
    y: d
  }));

  expect(chart.data()).toStrictEqual(
    [0, 1, 2, 3, 4, 5].map((d, i) => ({
      x: i,
      y: d
    }))
  );
});

test('Test data (objects) accssor function', async () => {
  const objects = [0, 1, 2, 3, 4, 5].map(d => ({ value: d }));
  const mockElement = document.createElement('div');
  const chart = Chrt().data(objects, (d, i) => ({
    x: i,
    y: d.value
  }));

  expect(chart.data()).toStrictEqual(
    objects.map((d, i) => ({
      x: i,
      y: d.value,
      value: d.value
    }))
  );
});
