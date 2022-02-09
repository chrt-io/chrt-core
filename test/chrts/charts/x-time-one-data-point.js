import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

export default async function(container) {
  const chart = Chrt()
    .node(container)
    .x({scale:'time'})
    .data([{x:new Date(2022,1,7), y: 20}])
    .size(600, 200)
    .add(
      chrt.xAxis(3)
        .format(d => new Intl.DateTimeFormat('en-US').format(d))
    )
    .add(chrt.yAxis(3))
    .add(
      chrt.chrtPoints()
    )

  // console.log(chart)

  return chart
}
