import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [
  {
    x: 0,
    y: 100,
  },
  {
    x: 10,
    y: 200,
  },
  {
    x: 3,
    y: 700,
  },
  {
    x: 7,
    y: 100,
  },
];

const data2 = [
  {
    x: 0,
    y: 1000,
  },
  {
    x: 10,
    y: 70,
  },
  {
    x: 3,
    y: 0,
  },
  {
    x: 7,
    y: 14,
  },
];

export default async function (container) {
  let series = {};
  const chart = Chrt()
    .node(container)
    .size(600, 200)
    // .data(data)
    .y({ domain: [0, null] })
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrt
        .stack()
        .add((series.columns1 = chrt.columns().data([10, 10, 10]).fill('red')))
        .add(
          (series.columns2 = chrt.columns().data([10, 10, 10]).fill('blue')),
        ),
    );

  //
  // series.points.data([30,50,20,4,5,6].map((d,i) => ({x:i, y:d})))
  // chart.update()
  //
  // series.columns1.data([5,5,5].map((d,i) => ({x:i, y:d}))) // .update();
  // chart.update();

  //series.columns.data([7,8,9,10].map((d,i) => ({x:i, y:d})));
  //chart.update();
  // console.log(chart)

  return chart;
}
