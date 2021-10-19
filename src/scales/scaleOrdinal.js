import { DEFAULT_WIDTH } from '../constants';
import { isNull, arraysEqual } from '../helpers';
// import { memoize } from '~/util';
//import Heckbert from './util/Heckbert';
//import ExtendedWilkinson from './util/ExtendedWilkinson';

export default function scale(name, type, domain, range = [0, DEFAULT_WIDTH], field) {
  // console.log('scaleOrdinal', name, type, domain, range, field)
  const _scale = this.scales[type][name];

  const fixedDomain =
    domain || (_scale && _scale.transformation === 'ordinal' ? _scale.fixedDomain : null);
  const copyOfFixedDomain = !isNull(fixedDomain) ? [...fixedDomain] : null;
  // console.log('CURRENT FIXED DOMAIN IS', fixedDomain)
  if (!domain) {
    //domain = [0, 1]; // not sure anymore about this
  }
  let _ticks = [];
  // // console.log('rrrrange', range)
  range[0] += type === 'x' ? this._padding.left : -this._padding.bottom;
  range[1] -= type === 'x' ? this._padding.right : -this._padding.top;
  // // console.log(name,'RANGE',range)
  // console.log('ORDINAL', _scale, _scale.getName(), _scale.transformation)
  const currentDomain =
    _scale && _scale.transformation === 'ordinal'
      ? _scale.domain
      : [];
  let domainExtent = copyOfFixedDomain || domain || currentDomain;

  // console.log('DOMAIN', name, [...domainExtent].join(','), this.scales[name])
  // console.log('FIXED DOMAIN', name, fixedDomain)
  // console.log('CURRENT DOMAIN', name, currentDomain);
  if (arguments.length === 1) {
    return this.scales.x[arguments[0]] || this.scales.y[arguments[0]];
  }

  // if no domain defined or new domain is different from current domain
  // calculate the new domain based on all the data
  // console.log("fixedDomain", fixedDomain);
  // console.log("domainExtent", domainExtent);
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
      if(domainExtent.indexOf(d[field || name]) === -1) {
        domainExtent.push(d[field || name]);
      }
    });

    // console.log('DOMAIN EXTENT', name, domainExtent.join(','))

    // console.log('CALCULATE DOMAIN BASED ON OBJECTS', this.objects)
    this.objects.forEach((obj) => {
      const _data = (!isNull(obj._data) && obj._data.length) ? obj._data : this._data;
      // console.log('OBJ', obj, _data)
      if (_data) {
        _data.forEach((d) => {
          // console.log('test',type,name,'||',obj.fields[name],'->',d[field || obj.fields[name]],'in',domainExtent)
          const datum = d[field || obj.fields[name]] ?? d;
          if(domainExtent.indexOf(datum) === -1) {
            domainExtent.push(datum);
          }
        });
      }
    });

    // console.log('DOMAIN EXTENT AFTER OBJECTS', name, domainExtent.join(','))
  }

  const domainWidth = domainExtent.length;
  const direction = range[1] >= range[0] ? 1 : -1;
  const rangeWidth =
    range[1] -
    range[0] -
    (type === 'x'
      ? this._margins.left + this._margins.right
      : this._margins.top + this._margins.bottom) *
      direction;

  const startCoord =
    range[0] +
    (type === 'x' ? this._margins.left : this._margins.bottom) * direction;

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
    // console.log('calculate ticks', domainExtent)
    _ticks = domainExtent;
    return _ticks.map((value, index) => ({
      index,
      value,
      x: scalingFunction(value),
    }));

    // return _ticks;
  };

  scalingFunction.getName = () => name;
  scalingFunction.getType = () => type;
  scalingFunction.transformation = 'ordinal';
  scalingFunction.getField = () => field;
  scalingFunction.field = field;
  scalingFunction.isLog = () => false;
  scalingFunction.fixedDomain = fixedDomain;
  scalingFunction.domain = domainExtent;
  scalingFunction.range = range;
  scalingFunction.step = 1;
  scalingFunction.barwidth = barwidth;

  // console.log(scalingFunction.domain)

  scalingFunction.ticks = ticks;
  this.scales[type][name] = scalingFunction;
  return this;
}
