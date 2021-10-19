import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [
  {
    y: 0,
    x: 10
  },
  {
    y: 10,
    x: 14
  },
  {
    y: 3,
    x: 700
  },
  {
    y: 7,
    x: 10000
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x({domain:[1,10000], scale:'log'})
    .y({scale:'linear'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
    );
}
