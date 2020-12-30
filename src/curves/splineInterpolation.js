import { svgPath } from '../layout';

export default function splineInterpolation(data) {
  return svgPath(
    data.map(d => [
      this.parentNode.scales.x[this.scales.x](d[this.fields.x]),
      this.parentNode.scales.y[this.scales.y](d[this.fields.y])
    ]),
    bezierCommand
  );
}

// Properties of a line
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

// Position of a control point
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (current, previous, next, reverse) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current
  // The smoothing ratio
  const smoothing = 0.1
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

// Create the bezier curve command
// I:  - point (array) [x,y]: current point coordinates
//     - i (integer): index of 'point' in the array 'a'
//     - a (array): complete array of points coordinates
// O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
export const bezierCommand = (point, i, a) => {
  if(isNaN(point[0]) || isNaN(point[1])) {
    return '';
  }
  // start control point
  const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point)
  // end control point
  const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)

  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
}
//
// function splineCurve(firstPoint, middlePoint, afterPoint, t = 1) {
//   // Props to Rob Spencer at scaled innovation for his post on splining between points
//   // http://scaledinnovation.com/analytics/splines/aboutSplines.html
//
//   // This function must also respect "skipped" points
//
//   // console.log('splineCurve', firstPoint, middlePoint, afterPoint);
//
//   const previous = firstPoint.skip ? middlePoint : firstPoint;
//   const current = middlePoint;
//   const next = afterPoint.skip ? middlePoint : afterPoint;
//
//   const d01 = Math.sqrt(
//     Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2)
//   );
//   const d12 = Math.sqrt(
//     Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
//   );
//
//   let s01 = d01 / (d01 + d12);
//   let s12 = d12 / (d01 + d12);
//
//   // If all points are the same, s01 & s02 will be inf
//   s01 = isNaN(s01) ? 0 : s01;
//   s12 = isNaN(s12) ? 0 : s12;
//
//   const fa = t * s01; // scaling factor for triangle Ta
//   const fb = t * s12;
//
//   return {
//     previous: {
//       x: current.x - fa * (next.x - previous.x),
//       y: current.y - fa * (next.y - previous.y)
//     },
//     next: {
//       x: current.x + fb * (next.x - previous.x),
//       y: current.y + fb * (next.y - previous.y)
//     }
//   };
// }
