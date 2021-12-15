import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [
  {
    x: 0,
    y: 10,
    y2: 0.2,
  },
  {
    x: 10,
    y: 14,
    y2: 0.1,
  },
  {
    x: 3,
    y: 14,
    y2: 0.3,
  },
  {
    x: 7,
    y: 22,
    y2: 0.6,
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .margins({right: 40})
    .x({scale:'linear'})
    .y({scale:'linear'})
    .y({name: 'y2'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(chrt.yAxis(5,'y2').orient('right').labelsColor('#f00'))
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
          y: d.y2,
        }))
        .y('y2')
        .stroke('#f00')
    );
}
