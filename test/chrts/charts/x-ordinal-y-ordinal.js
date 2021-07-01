import * as chrt from 'chrt';
import Chrt from '~/Chrt';

const data = [
  {
    x: 'a',
    y: 'x'
  },
  {
    x: 'b',
    y: 'y'
  },
  {
    x: 'c',
    y: 'z'
  },
  {
    x: 'd',
    y: 'j'
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .data(data)
    .x({scale:'ordinal'})
    .y({scale:'ordinal'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    // .add(
    //   chrt.chrtLine()
    //     .data(data.slice(0,2), d => ({
    //       x: d.x,
    //       y: d.y,
    //     }))
    // )
    // .add(
    //   chrt.chrtLine()
    //     .data(data, d => ({
    //       x: d.x,
    //       y: d.y * 5,
    //     }))
    // );
}
