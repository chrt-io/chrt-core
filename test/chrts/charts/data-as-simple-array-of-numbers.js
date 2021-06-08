import * as chrt from 'chrt';
import Chrt from '~/Chrt';

const data = [0,3,5,3,7,9,2,5];

export default async function(container) {
  const chart = Chrt()
    .node(container)
    .data(data)
    .size(600, 200)
    .add(chrt.xAxis(8))
    .add(chrt.yAxis())
    .add(
      chrt.chrtLine()
    );

  // console.log(chart)

  return chart
}
