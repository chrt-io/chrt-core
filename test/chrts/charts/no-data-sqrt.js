import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

export default async function(container) {
  const chart = Chrt()
    .node(container)
    .size(600, 200)
    .x({scale: 'sqrt'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrt.chrtLine()
    );

  // console.log(chart)

  return chart
}
