import * as chrt from 'chrt';
import Chrt from '~/Chrt';

test('Test class', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .class('test-class-name')

  const classList = [...chart.node().classList.values()];


  expect(classList).toContain('test-class-name-chrt')
});

test('Test not-a-string class', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .class(1234)

  const classList = [...chart.node().classList.values()];


  expect(classList).toContain('chrt')
});

test('Test getAxis', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .add(chrt.xAxis())

  // console.log(chart.getAxis('x'))


  expect(chart.getAxis('x')).toBeDefined()
});
