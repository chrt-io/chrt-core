import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [
  {
    x: 0,
    y: 10,
    y1: 22
  },
  {
    x: 10,
    y: 14,
    y1: 56,
  },
  {
    x: 3,
    y: 700,
    y1: 1400,
  },
  {
    x: 7,
    y: 10000,
    y1: 60000,
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'linear'})
    .y({scale:'log'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
    )
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y1,
        }))
    );
}
