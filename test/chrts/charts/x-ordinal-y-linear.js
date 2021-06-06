import * as chrt from 'chrt';
import Chrt from '~/Chrt';

const data = [
  {
    x: 'a',
    y: 10
  },
  {
    x: 'b',
    y: 14
  },
  {
    x: 'c',
    y: 22
  },
  {
    x: 'd',
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
        .data(data.slice(0,2), d => ({
          x: d.x,
          y: d.y,
        }))
    )
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y * 5,
        }))
    );
}
