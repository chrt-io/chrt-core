import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = new Array(10).fill(1).map((d,i) => {
  return {
    y: new Date(2021 + i,0,1),
    x: i + (i%2 * i),
  }
})

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 400)
    .y({scale:'time'})
    .add(chrt.xAxis())
    .add(chrt.yAxis()
      .interval('year')
      .format(d => new Intl.DateTimeFormat('en-US', {year: 'numeric'}).format(d))
    )
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
    );
}
