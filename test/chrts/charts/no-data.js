import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [0,3,5,3,7,9,2,5];

export default async function(container) {
  const chart = Chrt()
    .node(container)
    .size(600, 200)
    .add(chrt.xAxis(5))
    .add(chrt.yAxis())
    .add(
      chrt.chrtLine()
    );

  // console.log(chart)

  return chart
}
