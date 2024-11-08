import * as chrt from 'chrt';
import Chrt from '../../../src/Chrt';

const data = [
  {
    x: 0,
    y: 10
  },
  {
    x: 10,
    y: 14
  },
  {
    x: 3,
    y: 700
  },
  {
    x: 7,
    y: 10000
  }
];

export default async function(container) {
  return Chrt()
    .node(container)
    .size(600, 200)
    .data(data)
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrt.chrtLine()
    );
}
