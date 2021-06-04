import * as chrt from 'chrt';
import Chrt from '~/Chrt';

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
    y: 14
  },
  {
    x: 7,
    y: 22
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'linear'})
    .y({scale:'linear'})
    // .y({domain:[1,10000], scale:'log'})
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
