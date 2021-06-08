import * as chrt from 'chrt';
import Chrt from '~/Chrt';

test('Test border', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .border();

  expect(mockElement.querySelector('svg').style.border).toStrictEqual('1px solid #000');
});

test('Test default margins', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(600,300)
    .margins({})
    .add(chrt.xAxis())

  const line = mockElement.querySelector('line[data-id="tick-x-axis-line"]');

  expect({
    left: +line.getAttribute('x1'),
    right: 600 - +line.getAttribute('x2'),
  }).toStrictEqual({
    left: 40,
    right: 20,
  })
  // expect(mockElement.querySelector('svg').style.border).toStrictEqual('1px solid #000');
});

test('Test default padding', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(600,300)
    // .padding({})
    .add(chrt.chrtLine().data([0,1,2,3].map(d => ({x:d,y:20}))))
  const path = mockElement.querySelector('path[data-id="path-0"]');
  expect(path.getAttribute('d')).toStrictEqual('M40,0L220,0L400,0L580,0');

});
