import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';
const years = 10;
const data = new Array((52 / 2) * years).fill(1).map((d,i) => {
  return {
    x: new Date(2021 - years,0,i * 7 * 2),
    y: Math.sin((i % 360) / Math.PI) * 100,
  }
})

export default async function(container) {
  return Chrt()
    .node(container)
    .size(1200, 200)
    .x({scale:'time'})
    .add(chrt.xAxis()
      .interval('year')
      .format(d => new Intl.DateTimeFormat('en-US', {year: 'numeric'}).format(d))
    )
    .add(chrt.yAxis())
    .add(
      chrt.chrtPoints()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .radius(1)
    );
}
