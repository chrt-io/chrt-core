import * as chrt from 'chrt';
import Chrt from '~/Chrt';

const data = new Array(120).fill(1).map((d,i) => {
  return {
    x: new Date(2021,0,i),
    y: i + (i%2 * i),
  }
})

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'time'})
    .add(chrt.xAxis()
      .interval('month')
      .format(d => new Intl.DateTimeFormat('en-US', {month: 'short'}).format(d))
    )
    .add(chrt.yAxis())
    .add(
      chrt.chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
    );
}
