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
    y: 12
  },
  {
    x: 7,
    y: 16
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
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
