import { TICKS_DEFAULT } from '../../constants';
import { baseLog, basePow } from '../../helpers/math';

const DEFAULT_BASE = 10;
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 10;

export default function logTicks(
  [dmin, dmax],
  ticksNumber,
  base = DEFAULT_BASE
) {
  this.ticksNumber = ticksNumber || TICKS_DEFAULT;
  this._ticks = [];

  const log = baseLog(base);
  const pow = basePow(base);

  this.improveRange = (range) => {
    let min = range[0];
    let max = range[1];

    if (min === max) {
      if (min <= 0) {
        // includes null
        min = DEFAULT_MIN;
        max = DEFAULT_MAX;
      } else {
        min = pow(Math.floor(log(min)) - 1);
        max = pow(Math.floor(log(max)) + 1);
      }
    }
    if (min <= 0) {
      min = pow(Math.floor(log(max)) - 1);
    }
    if (max <= 0) {
      max = pow(Math.floor(log(min)) + 1);
    }

    return [min, max];
  };

  this.ticks = (n = this.ticksNumber) => {
    // if(this._ticks.length && n === this.ticksNumber) {
    //   return this._ticks;
    // }
    this.ticksNumber = n;

    // // console.log('CALCULATING TICKS', dmin, dmax, this.ticksNumber)
    this._ticks = [];

    this.range = this.improveRange([dmin, dmax]);

    // not working well, it keeps lowering and increasing bounds
    this.lmin = Math.floor(log(dmin)) !== log(dmin) ? pow(Math.floor(log(dmin)) - 1) : dmin;
    this.lmax = Math.floor(log(dmax)) !== log(dmax) ? pow(Math.floor(log(dmax)) + 1) : dmax;

    // this.lmin = this.range[0];
    // this.lmax = this.range[1];

    // console.log('TICKS', n, [dmin, dmax], this.range, [this.lmin, this.lmax]);

    const ticksRange = [log(this.lmin), log(this.lmax)];

    // // console.log('ticksRange', ticksRange)

    if (ticksRange[0] > 0) {
      for (let i = ticksRange[0]; i <= ticksRange[1]; ++i) {
          for (let k = 1; k < base; ++k) {
            const tick = pow(i) * k;
            // // console.log('k1',k,base,tick)
            // if (tick > this.lmax) break;
            if(tick >= this.lmin) {
              this._ticks.push(tick);
            }
          }
        }
    } else for (let i = ticksRange[0]; i <= ticksRange[1]; ++i) {
        for (let k = base - 1; k >= 1; --k) {
          const tick = pow(i) * k;
          // // console.log('k2',k,base,tick, this.lmax)
          // if (tick > this.lmax) break;
          if(tick >= this.lmin) {
            this._ticks.push(tick);
          }
        }
      }
    // // console.log('TICKS ARE', this._ticks)
    return this._ticks;
  };

  this.ticks(this.ticksNumber);

  this.getMin = () => {
    return this.lmin;
  };

  this.getMax = () => {
    return this.lmax;
  };

  return this;
}
