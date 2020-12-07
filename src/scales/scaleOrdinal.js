import { DEFAULT_WIDTH } from '~/constants';
import { isNull, arraysEqual } from '~/helpers';
// import { memoize } from '~/util';
//import Heckbert from './util/Heckbert';
//import ExtendedWilkinson from './util/ExtendedWilkinson';

export default function scale(name, domain, range = [0, DEFAULT_WIDTH]) {
  // console.log('scale', arguments)
  const fixedDomain =
    domain || (this.scales[name] ? this.scales[name].fixedDomain : null);
  const copyOfFixedDomain = !isNull(fixedDomain) ? [...fixedDomain] : null;
  // console.log('CURRENT FIXED DOMAIN IS', fixedDomain)
  if (!domain) {
    //domain = [0, 1]; // not sure anymore about this
  }
  let _ticks = [];
  // // console.log('rrrrange', range)
  range[0] += name === 'x' ? this._padding.left : -this._padding.bottom;
  range[1] -= name === 'x' ? this._padding.right : -this._padding.top;
  // // console.log(name,'RANGE',range)

  const currentDomain =
    this.scales[name] && this.scales[name].getTransformation() === 'ordinal'
      ? this.scales[name].domain
      : [];
  let domainExtent = copyOfFixedDomain || domain || currentDomain;

  // console.log('DOMAIN', name, [...domainExtent].join(','), this.scales[name])
  // console.log('FIXED DOMAIN', name, fixedDomain)
  // console.log('CURRENT DOMAIN', name, currentDomain);
  if (arguments.length === 1) {
    return this.scales[arguments[0]];
  }

  // if no domain defined or new domain is different from current domain
  // calculate the new domain based on all the data
  // console.log("fixedDomain", fixedDomain);
  // console.log("domainExtent", domainExtent, hasNaN(domainExtent));
  // console.log("currentDomain", currentDomain, hasNaN(currentDomain));
  if (
    isNull(fixedDomain) ||
    !domainExtent ||
    !domainExtent.length ||
    !arraysEqual(domainExtent, currentDomain)
  ) {
    // if(isNull(fixedDomain)) {
    // console.log('CALCULATE DOMAIN BASED ON THE DATA', name, this._data)
    this._data.forEach((d) => {
      if(domainExtent.indexOf(d[name]) === -1) {
        domainExtent.push(d[name]);
      }
    });

    // console.log('DOMAIN EXTENT', name, domainExtent.join(','))

    // console.log('CALCULATE DOMAIN BASED ON OBJECTS', this.objects)
    this.objects.forEach((obj) => {
      const _data = (!isNull(obj._data) && obj._data.length) ? obj._data : this._data;
      if (_data) {
        _data.forEach((d) => {
          if(domainExtent.indexOf(d[obj.fields[name]]) === -1) {
            domainExtent.push(d[obj.fields[name]]);
          }
        });
      }
    });

    // console.log('DOMAIN EXTENT', name, domainExtent)
  }

  // // console.log('DOMAIN AFTER IMPROVEMENT', name, [...domainExtent])

  // const numScale = new Heckbert(domainExtent);
  // const eNumScale = new ExtendedWilkinson(domainExtent);
  // // console.log('E WILK', eNumScale.ticks())
  // re-assign domain based on, max/min of heckbert nice scale
  // console.log(domainExtent[0],domainExtent[1],'after WILKINSON', eNumScale.getMin(), eNumScale.getMax())

  // TODO: not sure which one is best between the 2 following:
  // if(!currentDomain) {
  //   domainExtent[0] = eNumScale.getMin();
  //   domainExtent[1] = eNumScale.getMax();
  // }
  // console.log('fixedDomain', fixedDomain);
  // if (isNull(fixedDomain)) {
  //   // console.log('--->eNumScale',eNumScale.getMin(), eNumScale.getMax())
  //   domainExtent[0] = !isNull(currentDomain[0])
  //     ? Math.min(currentDomain[0], eNumScale.getMin())
  //     : eNumScale.getMin();
  //   domainExtent[1] = !isNull(currentDomain[1])
  //     ? Math.max(currentDomain[1], eNumScale.getMax())
  //     : eNumScale.getMax();
  // }

  // console.log('new domain is ', domainExtent)

  // console.log('AFTER WILK DOMAIN',  name, [...domainExtent])

  const domainWidth = domainExtent.length;
  const direction = range[1] >= range[0] ? 1 : -1;
  const rangeWidth =
    range[1] -
    range[0] -
    (name === 'x'
      ? this._margins.left + this._margins.right
      : this._margins.top + this._margins.bottom) *
      direction;

  const startCoord =
    range[0] +
    (name === 'x' ? this._margins.left : this._margins.bottom) * direction;

  const barwidth = rangeWidth / domainExtent.length;

  const scalingFunction = (d) => {
    const valueToDomain = domainExtent.indexOf(d) / domainWidth;
    return startCoord + barwidth / 2 + rangeWidth * valueToDomain;
  };

  const ticks = (n = domainExtent.length) => {
    // // console.log('LINEAR SCALE', 'ticks', n)
    if (isNull(n) && _ticks.length > 0) {
      return _ticks;
    }
    _ticks = domainExtent;
    return _ticks.map((value, index) => ({
      index,
      value,
      x: scalingFunction(value),
    }));

    // return _ticks;
  };

  const getName = () => {
    return name;
  };
  const getTransformation = () => {
    return 'ordinal';
  };

  scalingFunction.getName = getName;
  scalingFunction.getTransformation = getTransformation;
  scalingFunction.isLog = () => false;
  scalingFunction.fixedDomain = fixedDomain;
  scalingFunction.domain = domainExtent;
  scalingFunction.range = range;
  scalingFunction.step = 1;
  scalingFunction.barwidth = barwidth;

  // console.log(scalingFunction.domain)

  scalingFunction.ticks = ticks;
  this.scales[name] = scalingFunction;
  return this;
}
