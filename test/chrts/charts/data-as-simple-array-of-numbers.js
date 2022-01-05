import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [0,3,5,3,7,9,2,5];

export default async function(container) {
  const chart = Chrt()
    .node(container)
    .data(data)
    .size(600, 200)
    .snap(chrt.xAxis(8))
    .snap(chrt.yAxis())
    .snap(
      chrt.chrtLine()
    );
  return chart
}
