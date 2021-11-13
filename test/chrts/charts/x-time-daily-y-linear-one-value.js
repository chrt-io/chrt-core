import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';
const data = [
  {
    x: new Date(2021,11,1),
    y: 20,
  }
]

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'time'})
    .add(chrt.xAxis()
      .interval('day')
      .format(d => new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(d))
    )
    .add(chrt.yAxis())
    .add(
      chrt.chrtPoints()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .radius(5)
    );
}
