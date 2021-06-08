import * as chrt from 'chrt';
import Chrt from '~/Chrt';

const WIDTH = 500;
const HEIGHT = 500;
const MARGINS = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10
};
const PADDING = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

function replaceIDWithMockId(str) {
  return str.replace(/\sid="[A-Za-z0-9\-]+"/gi, ' id="mockID"');
}

test('Test size', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(WIDTH, HEIGHT);

  expect(chart.size()).toStrictEqual({ width: WIDTH, height: HEIGHT });
});

test('Test auto size', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size('auto', 'auto');
  expect(chart.size()).toStrictEqual({ width: 600, height: 300 });
});

test('Test setWidth and setHeight', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .setWidth(WIDTH)
    .setHeight(HEIGHT)

  expect(chart.size()).toStrictEqual({ width: WIDTH, height: HEIGHT });
});

test('Test svg viewBox size', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(WIDTH, HEIGHT);

  const svg = chart.node().querySelector('svg');
  const box = svg.getAttribute('viewBox');

  expect(box).toBe(`0 0 ${WIDTH} ${HEIGHT}`);
});

test('Test margins', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(WIDTH, HEIGHT)
    .margins(MARGINS);

  expect(chart.margins()).toStrictEqual(MARGINS);
});

test('Test paddings', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(WIDTH, HEIGHT)
    .padding(PADDING);

  expect(chart.padding()).toStrictEqual(PADDING);
});

test('Test margins in SVG', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(WIDTH, HEIGHT)
    .margins(MARGINS)
    .add(chrt.xAxis())
    .add(chrt.yAxis());

  const node = chart.node();

  const xAxis = node.querySelector('line[data-id="tick-x-axis-line"]');
  const yAxis = node.querySelector('line[data-id="tick-y-axis-line"]');

  expect({
    x1: +xAxis.getAttribute('x1'),
    x2: +xAxis.getAttribute('x2'),
    y1: +yAxis.getAttribute('y1'),
    y2: +yAxis.getAttribute('y2')
  }).toStrictEqual({
    x1: MARGINS.left,
    x2: WIDTH - MARGINS.right,
    y1: MARGINS.top,
    y2: HEIGHT - MARGINS.bottom
  });
});

test('Test margins + padding in SVG with chrtPoints', async () => {
  const mockElement = document.createElement('div');
  const chart = Chrt()
    .node(mockElement)
    .size(WIDTH, HEIGHT)
    .margins(MARGINS)
    .padding(PADDING)
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(chrt.chrtPoints().data([{x: 0, y: 0}, {x: 10, y: 10}]))

  const node = chart.node();

  const circle0 = node.querySelector('circle[data-id="circle--0"]');
  const circle1 = node.querySelector('circle[data-id="circle--1"]');

  expect({
    cx0: +circle0.getAttribute('cx'),
    cy0: +circle0.getAttribute('cy'),
    cx1: +circle1.getAttribute('cx'),
    cy1: +circle1.getAttribute('cy')
  }).toStrictEqual({
    cx0: MARGINS.left + PADDING.left,
    cy0: HEIGHT - (MARGINS.bottom + PADDING.bottom),
    cx1: WIDTH - (MARGINS.right + PADDING.right),
    cy1: MARGINS.top + PADDING.top,
  });
});
