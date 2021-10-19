import { TICKS_DEFAULT } from '../../constants';
export default function ExtendedWilkinson(
  [dmin, dmax],
  ticksN = TICKS_DEFAULT,
  Q = [1, 5, 2, 2.5, 4, 3],
  onlyLoose = false,
  w = [0.25, 0.2, 0.5, 0.05],
  nice = true,
) {
  const eps = Number.EPSILON * 100;
  this._ticks = [];

  if (dmin > dmax) {
    const temp = dmin;
    dmin = dmax;
    dmax = temp;
  }

  // const n = Q.length;
  let best = { score: -2 };

  this.ticks = (ticksNumber) => {
    // // console.log('EWILKS CALLED TICKS WITH', ticksNumber)
    if (dmax - dmin < eps) {
      return range(dmin, dmax, (dmax - dmin) / ticksNumber);
    }
    // // console.log('RUNNING TICKS WITH', ticksNumber)
    best = { score: -2 };
    let j = 1;
    while (j < Infinity) {
      for (const q of Q) {
        const sm = simplicity.max(q, Q, j);
        if (w[0] * sm + w[1] + w[2] + w[3] < best.score) {
          j = Infinity;
          break;
        }
        let k = 2;
        while (k < Infinity) {
          const dm = density.max(k, ticksNumber);
          if (w[0] * sm + w[1] + w[2] * dm + w[3] < best.score) {
            break;
          }
          const delta = (dmax - dmin) / (k + 1) / j / q;
          let z = Math.ceil(Math.log10(delta));
          while (z < Infinity) {
            const step = j * q * Math.pow(10, z);

            const cm = coverage.max(dmin, dmax, step * (k - 1));
            if (w[0] * sm + w[1] * cm + w[2] * dm + w[3] < best.score) {
              break;
            }
            const min_start = Math.floor(dmax / step) * j - (k - 1) * j;
            const max_start = Math.ceil(dmin / step) * j;

            if (min_start > max_start) {
              z += 1;
              continue;
            }
            // const range = range(min_start, max_start);
            for (let start = min_start; start <= max_start; start++) {
              const lmin = start * (step / j);
              const lmax = lmin + step * (k - 1);
              const lstep = step;

              const s = simplicity(q, Q, j, lmin, lmax, lstep);
              const c = coverage(dmin, dmax, lmin, lmax);
              const g = density(k, ticksNumber, dmin, dmax, lmin, lmax);
              const l = legibility(lmin, lmax, lstep);

              const score = w[0] * s + w[1] * c + w[2] * g + w[3] * l;

              if (
                score > best.score &&
                (!onlyLoose || (lmin <= dmin && lmax >= dmax))
              ) {
                best.lmin = lmin;
                best.lmax = lmax;

                if(nice) {
                  best.lmin = lmin < lmax ? Math.floor(dmin / lstep) * lstep : Math.ceil(dmin / lstep) * lstep;
                  best.lmax = lmax > lmin ? Math.ceil(dmax / lstep) * lstep : Math.floor(dmax / lstep) * lstep;
                }
                // // console.log('lstep', lstep);
                best.lstep = lstep;
                best.score = score;
              }
            }
            z += 1;
          }

          k += 1;
        }
      }
      j += 1;
    }
    // // console.log('range',best.lmin, best.lmax + best.lstep, best.lstep)
    this._ticks = range(best.lmin, best.lmax + best.lstep, best.lstep);
    // // console.log('E-WILK RETURNING', this._ticks)
    return this._ticks;
  };

  this.ticks(ticksN);

  // // console.log('BEST', best);
  // best.ticks = d3.range(best.lmin, best.lmax + best.lstep, best.lstep);

  this.getMin = () => {
    return best.lmin;
  };

  this.getMax = () => {
    return best.lmax;
  };

  this.getStep = () => {
    return best.lstep;
  };

  return this;
}

function simplicity(q, Q, j, lmin, lmax, lstep) {
  const eps = Number.EPSILON * 100;
  const n = Q.length;
  const i = match(q, Q)[0];
  const v =
    (lmin % lstep < eps || lstep - (lmin % lstep) < eps) &&
    lmin <= 0 &&
    lmin >= 0
      ? 1
      : 0;

  return 1 - (i - 1) / (n - 1) - j + v;
}

simplicity.max = (q, Q, j) => {
  const n = Q.length;
  const i = match(q, Q)[0];
  const v = 1;
  return 1 - (i - 1) / (n - 1) - j + v;
};

function coverage(dmin, dmax, lmin, lmax) {
  const range = dmax - dmin;
  return (
    1 -
    (0.5 * (Math.pow(dmax - lmax, 2) + Math.pow(dmin - lmin, 2))) /
      Math.pow(0.1 * range, 2)
  );
}

coverage.max = (dmin, dmax, span) => {
  const range = dmax - dmin;
  if (span > range) {
    const half = (span - range) / 2;
    return (
      1 -
      (0.5 * (Math.pow(half, 2) + Math.pow(half, 2))) / Math.pow(0.1 * range, 2)
    );
  } else {
    return 1;
  }
};

function density(k, m, dmin, dmax, lmin, lmax) {
  const r = (k - 1) / (lmax - lmin);
  const rt = (m - 1) / (Math.max(lmax, dmax) - Math.min(dmin, lmin));
  return 2 - Math.max(r / rt, rt / r);
}

density.max = (k, m) => {
  return k >= m ? 2 - (k - 1) / (m - 1) : 1;
};

const legibility = () => 1;

function match(a, b) {
  if (Array.isArray(a)) {
    return a.map(d => b.indexOf(d)).map(d => (d > -1 ? d : null));
  } else {
    const index = b.indexOf(a);
    return index > -1 ? [index + 1] : [null];
  }
}

function range(min = 0, max = 10, step = 1) {
  const arr = [];
  for (let i = min; i < max; i += step) {
    arr.push(i);
  }
  return arr;
}
