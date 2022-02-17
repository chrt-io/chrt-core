import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';
const days = 28;
const data = new Array(24 * days).fill(1).map((d,i) => {
  return {
    x: new Date(2021,0,Math.floor(i / 24) + 1,i % 24,0),
    y: Math.sin((i % 360) / Math.PI) * 100,
  }
})

export default async function(container) {
  return Chrt()
    .node(container)
    .size(1200, 200)
    .x({scale:'time'})
    .add(chrt.xAxis()
      .interval('day')
      .format(d => {
        // console.log('day', d)
        return new Intl.DateTimeFormat('en-US', {day: 'numeric'}).format(d)
      })
    )
    .add(chrt.yAxis())
    .add(
      chrt.chrtPoints()
        // .data(data, d => ({
        //   x: d.x,
        //   y: d.y,
        // }))
        .data([0,1,2,3,4,5,6,7,8].map(d => ({
          x: new Date(2022,0,d,0),
          y: d,
        })))
        .radius(d => {
          // console.log('r ---->', d)
          return 2;
        })
    );
}
