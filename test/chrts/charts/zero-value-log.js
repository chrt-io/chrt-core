import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

export default async function(container) {
  const chart = Chrt()
    .node(container)
    .size(600, 200)
    .data([5,5,5,0,10,10,10])
    .y({ scale:'log'})
    //.add(chrt.xAxis(8))
    .add(chrt.yAxis())

  return chart
}
