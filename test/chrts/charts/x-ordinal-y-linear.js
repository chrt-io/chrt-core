import * as chrt from 'chrt';
import Chrt from '~/Chrt';

const data = [
  {
    x: 'apples',
    y: 10
  },
  {
    x: 'pears',
    y: 14
  },
  {
    x: 'cherries',
    y: 22
  },
  {
    x: 'plums',
    y: 18
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x(null,  null, {scale:'ordinal'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrt.chrtColumns()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
    );
}
