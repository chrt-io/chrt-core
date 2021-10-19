import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [0,3,5,3,7,9,2,5];

export default async function(container) {
  const chart = Chrt()
    .node(container)
    .data([10])
    .size(600, 200)
    .add(chrt.xAxis(3))
    .add(chrt.yAxis(3))
    .add(
      chrt.chrtPoints()
    )

  // console.log(chart)

  return chart
}
