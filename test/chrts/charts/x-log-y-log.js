import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [
  {
    x: 0,
    y: 10
  },
  {
    x: 10,
    y: 14
  },
  {
    x: 3,
    y: 700
  },
  {
    x: 7,
    y: 10000000
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x({domain:[1,10000000], scale:'log'})
    .y({domain:[1,10000000], scale:'log'})
    .add(chrt.xAxis(3))
    .add(chrt.yAxis(3))
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.y,
          y: d.y,
        }))
    );
}
