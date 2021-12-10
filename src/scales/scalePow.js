import { DEFAULT_WIDTH, TICKS_DEFAULT } from '../constants';
import { isNull, hasNaN, hasNull } from '../helpers';
import { memoize } from '../util';
//import Heckbert from './util/Heckbert';
import ExtendedWilkinson from './util/ExtendedWilkinson';

export default function scale(name, type, domain, range = [0, DEFAULT_WIDTH], field, transformation = pow, pow = 1, margins, padding) {
  // console.log(`POW scale(${name}, ${type}, ${domain}, ${range}, ${field}, ${transformation}, ${pow}, ${margins}, ${padding})`)

  const _scale = this.scales[type][name];
  // console.log(`LINEAR: this.scales[${type}][${name}]=`,_scale);

  const fixedDomain =
    domain || (_scale ? _scale.fixedDomain : null);
  const copyOfFixedDomain = !isNull(fixedDomain) ? [...fixedDomain] : null;
  // console.log('CURRENT FIXED DOMAIN IS', fixedDomain)
  if (!domain) {
    //domain = [0, 1]; // not sure anymore about this
  }
  let _ticks = [];
  const _padding = padding || this._padding;
  // TODO: this should be removed and calculated somewhere else
  range[0] += type === 'x' ? _padding.left : -_padding.bottom;
  range[1] -= type === 'x' ? _padding.right : -_padding.top;
  // console.log(name,'RANGE',range)

  const currentDomain =
    _scale && !_scale.isLog()
      ? _scale.domain
      : [];
  let domainExtent = copyOfFixedDomain || domain || currentDomain;

  // console.log('DOMAIN', name, [...domainExtent], this.scales[name])
  // console.log('FIXED DOMAIN', name, fixedDomain)
  // console.log('CURRENT DOMAIN', name, currentDomain);
  // if (arguments.length === 1) {
  //   // this code is never reached
  //   return this.scales.x[arguments[0]] || this.scales.y[arguments[0]];
  // }

  // if no domain defined or new domain is different from current domain
  // calculate the new domain based on all the data
  // console.log(name, "fixedDomain", fixedDomain);
  // console.log(name, "domainExtent", domainExtent);
  // console.log(name, "currentDomain", currentDomain);
  if (
    isNull(fixedDomain) ||
    hasNull(fixedDomain) ||
    hasNaN(currentDomain) ||
    !domainExtent ||
    !domainExtent.length ||
    domainExtent[0] !== currentDomain[0] ||
    domainExtent[1] !== currentDomain[1]
  ) {
    // if(isNull(fixedDomain)) {
    // console.log('CALCULATE DOMAIN BASED ON THE DATA', name, field, this._data)
    this._data.forEach((d) => {
      // // console.log(name, domainExtent[0],d[name],domainExtent[1])
      // console.log('getting min of', [!isNull(d) ? d[field || name] : null, domainExtent[0], !isNull(d) ? d[`stacked_${field || name}`] : null])
      domainExtent[0] =
        isNull(domainExtent[0])
          ? d[field || name]
          : Math.min(
              ...[!isNull(d) ? d[field || name] : null, domainExtent[0], !isNull(d) ? d[`stacked_${field || name}`] : null].filter(
                (value) => !isNull(value) && !isNaN(value)
              )
            );
      domainExtent[1] =
        isNull(domainExtent[1])
          ? d[field || name]
          : Math.max(
              ...[!isNull(d) ? d[field || name] : null, domainExtent[1], !isNull(d) ? d[`stacked_${field || name}`] : null].filter(
                (value) => !isNull(value) && !isNaN(value)
              )
            );
    });

    // console.log('DOMAIN EXTENT', name, domainExtent)

    // console.log('CALCULATE DOMAIN BASED ON OBJECTS', name, field, this.objects)
    this.objects.forEach((obj) => {
      const _data = (!isNull(obj._data) && obj._data.length) ? obj._data : this._data;
      if (_data) {
        // console.log('OBJ/CHART', obj)
        _data.forEach((d) => {
          domainExtent[0] =
            isNull(domainExtent[0])
              ? d[field || obj.fields[name]]
              : Math.min(
                  ...[
                    !isNull(d) ? d[field || obj.fields[name]] : null,
                    domainExtent[0],
                    !isNull(d) ? d[`stacked_${field || obj.fields[name]}`] : null,
                  ].filter((value) => !isNull(value) && !hasNaN(value))
                );
          domainExtent[1] =
            isNull(domainExtent[1])
              ? d[field || obj.fields[name]]
              : Math.max(
                  ...[
                    !isNull(d) ? d[field || obj.fields[name]] : null,
                    domainExtent[1],
                    !isNull(d) ? d[`stacked_${field || obj.fields[name]}`]: null,
                  ].filter((value) => !isNull(value) && !hasNaN(value))
                );
        });
      }
    });

    // console.log('DOMAIN EXTENT', name, field, domainExtent)
  } else {
    // console.log('FAILED IF BECAUSE')
    // console.log(this.objects)
    // console.log("domainExtent", domainExtent);
    // console.log("currentDomain", currentDomain);
  }

  if(domainExtent[0] === domainExtent[1]) {
    if(domainExtent[0] < 0) {
      domainExtent[1] = Math.abs(domainExtent[1]);
    } else if (domainExtent[0] === 0) {
      domainExtent[0] = -1;
      domainExtent[1] = 1;
    } else {
      domainExtent[0] = 0;
      domainExtent[1] = domainExtent[1] * 2;
    }
  }

  // console.log('DOMAIN AFTER IMPROVEMENT', name, [...domainExtent])

  // const numScale = new Heckbert(domainExtent);
  const eNumScale = new ExtendedWilkinson(domainExtent);
  // // console.log('E WILK', eNumScale.ticks())
  // re-assign domain based on, max/min of heckbert nice scale
  // console.log(domainExtent[0],domainExtent[1],'after WILKINSON', eNumScale.getMin(), eNumScale.getMax())

  // TODO: not sure which one is best between the 2 following:
  // if(!currentDomain) {
  //   domainExtent[0] = eNumScale.getMin();
  //   domainExtent[1] = eNumScale.getMax();
  // }
  // console.log('fixedDomain', fixedDomain);
  if (isNull(fixedDomain)) {
    // console.log('--->eNumScale',eNumScale.getMin(), eNumScale.getMax())
    domainExtent[0] = !isNull(currentDomain[0])
      ? Math.min(currentDomain[0], eNumScale.getMin())
      : eNumScale.getMin();
    domainExtent[1] = !isNull(currentDomain[1])
      ? Math.max(currentDomain[1], eNumScale.getMax())
      : eNumScale.getMax();
  }

  // console.log('new domain is ', domainExtent)

  // console.log('AFTER WILK DOMAIN',  name, [...domainExtent])

  const powFunction = (d, exponent) => {
    return d < 0 ? -Math.pow(-d, exponent) : Math.pow(d, exponent);
  }

  // // console.log('new this.scalingFunction', domainExtent, range, rangeWidth)
  const scalingFunction = (d) => {
    const domainWidth = domainExtent[1] - domainExtent[0];
    const direction = range[1] >= range[0] ? 1 : -1;
    const _margins = margins || this._margins;
    const rangeWidth =
      range[1] -
      range[0] -
      (type === 'x'
        ? _margins.left + _margins.right
        : _margins.top + _margins.bottom) *
        direction;
    const startCoord =
      range[0] +
      (type === 'x' ? _margins.left : _margins.bottom) * direction;

    const valueToDomain = (powFunction(d, pow) - powFunction(domainExtent[0],pow)) / (powFunction(domainExtent[1], pow) - powFunction(domainExtent[0], pow)); // - powFunction(domainExtent[0], pow)) / powFunction(domainWidth, pow);
    // console.log('_margins', _margins)
    // console.log('POW',domainExtent, range,d,pow,'--->', valueToDomain, )
    return startCoord + rangeWidth * valueToDomain;
  };

  const ticks = (n = TICKS_DEFAULT) => {
    // TODO: n can never be null...this needs to be reviews, it doesn't work well, _ticks?!?
    // if (isNull(n) && _ticks.length > 0) {
    // // this code can never be reached
    //   return _ticks;
    // }
    const fixedTicks = Array.isArray(n) && n.length;
    _ticks = fixedTicks ? n : eNumScale.ticks(n + 1);


    // TODO: Verify this, I can't remember why this was done.
    // if (_ticks.length > 1 && _ticks[0] < _ticks[1]) {
      // _ticks.reverse();
    // }
    // console.log('#### TICKS', _ticks);
    return _ticks.map((value, index) => ({
      index,
      value,
      x: scalingFunction(value),
      isMinor: fixedTicks ? 0 : index % 2,
      isZero: value === 0,
    }));

    // return _ticks;
  };

  scalingFunction.getName = () => name;
  scalingFunction.getType = () => type;
  scalingFunction.transformation = 'pow';
  scalingFunction.pow = pow;
  scalingFunction.getField = () => field;
  scalingFunction.isLog = () => false;
  scalingFunction.fixedDomain = fixedDomain;
  scalingFunction.domain = domainExtent;
  scalingFunction.field = field;
  scalingFunction.range = range;
  scalingFunction.step = eNumScale.getStep();
  scalingFunction.barwidth =
    Math.abs(scalingFunction(domainExtent[0] + scalingFunction.step) -
    scalingFunction(domainExtent[0]));
  scalingFunction.ticks = memoize(ticks);
  this.scales[type][name] = scalingFunction;
  return this;
}