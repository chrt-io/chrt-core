import * as chrt from 'chrt';
import Chrt from '~/Chrt';

const data = [
  {
    x: 1,
    y: 10
  },
  {
    x: 2,
    y: 14
  },
  {
    x: 3,
    y: 22
  },
  {
    x: 4,
    y: 18
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'ordinal'})
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
