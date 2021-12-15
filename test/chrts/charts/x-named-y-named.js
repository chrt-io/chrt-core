import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [
  {
    x: 0,
    y: 10,
    j: 1,
    z: 6,
  },
  {
    x: 10,
    y: 14,
    j: 2,
    z: 3,
  },
  {
    x: 3,
    y: 14,
    j: 3,
    z: 9,
  },
  {
    x: 7,
    y: 22,
    j: 4,
    z: 2,
  }
];

export default async function(container) {
  const chart=Chrt()
    .node(container)
    .size(600, 200)
    .x({name:'X', field: 'x', scale:'linear'})
    .y({name:'Z', field: 'z', scale:'linear'})
    .add(chrt.xAxis(10, 'X'))
    .add(chrt.yAxis(3,'Z'))
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y,
          z: d.z,
        }))
        .x('X')
        .y('Z')
    )
  // console.log('chart', chart)
  return chart;
}
