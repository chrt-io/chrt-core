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
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      (series.columns = chrt.columns().data([30, 50, 20]).add(chrt.labels())),
    )
    // .add(
    //   series.line = chrt.line().data([1,2,3,4,5,6]).add(chrt.labels())
    // )
    .add(
      (series.points = chrt
        .points()
        .data([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
          11, 12,
        ])
        .add(chrt.labels())),
    );

  // series.line.data([60,150,20,60,150,20].map((d,i) => ({x:i, y:d})))
  // chart.update()
  //
  // series.line.data([...Array(100).keys()].map((d,i) => ({x:i, y:d})))
  // chart.update()
  //
  // series.line.data([...Array(10).keys()].map((d,i) => ({x:i, y:d})))
  // chart.update()
  //
  setTimeout(() => {
    series.points.data([30, 60, 20, 4, 5, 6].map((d, i) => ({ x: i, y: d })));
    series.columns.data([].map((d, i) => ({ x: i, y: d })));
    chart.update();
  }, 5000);

  //series.columns.data([7,8,9,10].map((d,i) => ({x:i, y:d})));
  //chart.update();
  // console.log(chart)

  return chart;
}
