import { TICKS_DEFAULT } from '../../constants';
import { log10 } from '../../helpers/math';

export default function Heckbert([dmin, dmax], ticksNumber) {
  this.ticksNumber = ticksNumber || TICKS_DEFAULT;
  this._ticks = [];

  this.nicenum = (x, round) => {
    const e = Math.floor(log10(x));
    const f = x / Math.pow(10, e);
    let nf;
    if (round) {
      if (f < 1.5) nf = 1;
      else if (f < 3) nf = 2;
      else if (f < 7) nf = 5;
      else nf = 10;
    } else {
      if (f <= 1) nf = 1;
      else if (f <= 2) nf = 2;
      else if (f <= 5) nf = 5;
      else nf = 10;
    }
    return nf * Math.pow(10, e);
  };

  this.ticks = (n = this.ticksNumber) => {
    // if(this._ticks.length && n === this.ticksNumber) {
    //   return this._ticks;
    // }
    this.ticksNumber = n;

    // // console.log('CALCULATING TICKS', dmin, dmax, this.ticksNumber)
    this._ticks = [];

    this.range = this.nicenum(dmax - dmin, false);
    this.lstep = this.nicenum(this.range / (this.ticksNumber - 1), true);
    this.lmin = Math.floor(dmin / this.lstep) * this.lstep;
    this.lmax = Math.ceil(dmax / this.lstep) * this.lstep;

    // // console.log(this.range, this.lstep, this.lmin, this.lmax)

    for (let tick = this.lmin; tick < this.lmax; tick += this.lstep) {
      this._ticks.push(tick);
    }

    return this._ticks;
  };

  this.ticks(this.ticksNumber);

  this.getMin = () => {
    return this.lmin;
  }

  this.getMax = () => {
    return this.lmax;
  }

  return this;
}
