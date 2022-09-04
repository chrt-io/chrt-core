import { DEFAULT_WIDTH, TICKS_DEFAULT } from '../constants';
import { isNull, hasNaN, arraysEqual } from '../helpers';
import { memoize } from '../util';
//import Heckbert from './util/Heckbert';
// import ExtendedWilkinson from './util/ExtendedWilkinson';

const DURATION_SECOND = 1000;
const UNITS = {
  second: DURATION_SECOND,
  minute: DURATION_SECOND * 60,
};
UNITS.hour = UNITS.minute * 60;
UNITS.day = UNITS.hour * 24;

Object.keys(UNITS).forEach((unit) => (UNITS[`${unit}s`] = UNITS[unit]));

const LONGER_UNITS = {
  bidiurnal: UNITS.day * 2,
  week: UNITS.day * 7,
  fortnight: UNITS.day * 14,
  month: UNITS.day * 30, // depending on year/month
  year: UNITS.day * 365, // depending on year
};

Object.keys(LONGER_UNITS).forEach(
  (unit) => (LONGER_UNITS[`${unit}s`] = LONGER_UNITS[unit])
);

export default function scale(
  name,
  type,
  domain,
  range = [0, DEFAULT_WIDTH],
  field,
  margins,
  padding
) {
  // console.log(`TIME scale(${name}, ${type}, [${domain ? domain.join(',') : 'null'}], ${range}, ${field})`)
  // console.log('domain in date:', domain ? domain.join(',') : 'null')
  let step = UNITS.day;

  const _scale = this.scales[type][name];
  // console.log(`LINEAR: this.scales[${type}][${name}]=`,_scale);

  const fixedDomain = domain || (_scale ? _scale.fixedDomain : null);
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
  // // console.log(name,'RANGE',range)

  const currentDomain = _scale && !_scale.isLog() ? _scale.domain : [];
  let domainExtent = copyOfFixedDomain || domain || currentDomain;

  // console.log('---------------------> DOMAIN', name, [...domainExtent], this.scales[name])
  // console.log('FIXED DOMAIN', name, fixedDomain)
  // console.log('CURRENT DOMAIN', name, currentDomain);
  if (arguments.length === 1) {
    return this.scales.x[arguments[0]] || this.scales.y[arguments[0]];
  }

  // if no domain defined or new domain is different from current domain
  // calculate the new domain based on all the data
  // console.log("fixedDomain", fixedDomain);
  // console.log("domainExtent", domainExtent);
  // console.log("currentDomain", currentDomain);
  if (
    isNull(fixedDomain) ||
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
      [field, `${field}0`].forEach(f => {
        domainExtent[0] =
          isNull(domainExtent[0])
            ? d[f || name]
            : Math.min(
                ...[!isNull(d) ? d[f || name] : null, domainExtent[0], !isNull(d) ? d[`stacked_${f || name}`] : null].filter(
                  (value) => !isNull(value) && !isNaN(value)
                )
              );
        domainExtent[1] =
          isNull(domainExtent[1])
            ? d[f || name]
            : Math.max(
                ...[!isNull(d) ? d[f || name] : null, domainExtent[1], !isNull(d) ? d[`stacked_${f || name}`] : null].filter(
                  (value) => !isNull(value) && !isNaN(value)
                )
              );
      });
    });

    // console.log('AFTER DATA DOMAIN EXTENT', name, domainExtent)

    // console.log('CALCULATE DOMAIN BASED ON OBJECTS', name, field, this.objects)
    this.objects.forEach((obj) => {
      const _data =
        !isNull(obj._data) && obj._data.length ? obj._data : this._data;
      if (_data) {
        // console.log('OBJ/CHART', obj, _data)
        _data.forEach((d) => {
          [field, `${field}0`].forEach(f => {
            domainExtent[0] = isNull(domainExtent[0])
              ? +d[f || obj.fields[name]]
              : Math.min(
                  ...[
                    !isNull(d) ? +d[f || obj.fields[name]] : null,
                    domainExtent[0],
                    !isNull(d) ? +d[`stacked_${f || obj.fields[name]}`] : null,
                  ].filter((value) => !isNull(value) && !hasNaN(value))
                );
            domainExtent[1] = isNull(domainExtent[1])
              ? +d[f || obj.fields[name]]
              : Math.max(
                  ...[
                    !isNull(d) ? +d[f || obj.fields[name]] : null,
                    domainExtent[1],
                    !isNull(d) ? +d[`stacked_${f || obj.fields[name]}`] : null,
                  ].filter((value) => !isNull(value) && !hasNaN(value))
                );
          });
        });
      }
    });

    // console.log('AFTER OBJS DOMAIN EXTENT', name, field, [...domainExtent])
  } else {
    // console.log('FAILED IF BECAUSE')
    // console.log(this.objects)
    // console.log("domainExtent", domainExtent);
    // console.log("currentDomain", currentDomain);
  }

  if(domainExtent.length > 1 && domainExtent[0] === domainExtent[1]) {
    if(domainExtent[0] < 0) {
      domainExtent[1] = Math.abs(domainExtent[1]);
    } else if (domainExtent[0] === 0) {
      domainExtent[0] = -1;
      domainExtent[1] = 1;
    } else {
      domainExtent[0] = domainExtent[0] - 1;
      domainExtent[1] = domainExtent[1] + 1;
    }

    // console.log('SAME domainExtent, so ->', domainExtent)
  }



  if (
    isNull(fixedDomain) ||
    !domainExtent ||
    !domainExtent.length ||
    !arraysEqual(domainExtent, currentDomain)
  ) {
    // if(isNull(fixedDomain)) {
    // console.log('CALCULATE DOMAIN BASED ON THE DATA', name, this._data)
    this._data.forEach((d) => {
      // // console.log(name, domainExtent[0],d[name],domainExtent[1])
      domainExtent[0] = isNull(domainExtent[0])
        ? d[field || name]
        : Math.min(
            ...[
              !isNull(d) ? d[field || name] : null,
              domainExtent[0],
              !isNull(d) ? d[`stacked_${field || name}`] : null,
            ].filter((value) => !isNull(value))
          );
      domainExtent[1] = isNull(domainExtent[1])
        ? d[field || name]
        : Math.max(
            ...[
              !isNull(d) ? d[field || name] : null,
              domainExtent[1],
              !isNull(d) ? d[`stacked_${field || name}`] : null,
            ].filter((value) => !isNull(value))
          );
    });

    // console.log('DOMAIN EXTENT', name, domainExtent.join(','), domainExtent.map(d => new Date(d)).join(','))

    // console.log('CALCULATE DOMAIN BASED ON OBJECTS', this.objects)
    this.objects.forEach((obj) => {
      const _data =
        !isNull(obj._data) && obj._data.length ? obj._data : this._data;
      if (_data) {
        // console.log('OBJ/CHART', obj)
        _data.forEach((d) => {
          domainExtent[0] = isNull(domainExtent[0])
            ? d[field || obj.fields[name]]
            : Math.min(
                ...[
                  !isNull(d) ? d[field || obj.fields[name]] : null,
                  domainExtent[0],
                  !isNull(d) ? d[`stacked_${field || obj.fields[name]}`] : null,
                ].filter((value) => !isNull(value) && !hasNaN(value))
              );
          domainExtent[1] = isNull(domainExtent[1])
            ? d[field || obj.fields[name]]
            : Math.max(
                ...[
                  !isNull(d) ? d[field || obj.fields[name]] : null,
                  domainExtent[1],
                  !isNull(d) ? d[`stacked_${field || obj.fields[name]}`] : null,
                ].filter((value) => !isNull(value) && !hasNaN(value))
              );
        });
      }
    });

    // console.log('DOMAIN EXTENT', name, domainExtent, domainExtent.map(d => new Date(d)))
  }

  // console.log('new domain is ', domainExtent, domainExtent.map(d => new Date(d)))

  // console.log('AFTER WILK DOMAIN',  name, [...domainExtent])

  const calculateTimeDomain = (interval) => {
    if (domainExtent.length) {
      const _domainExtent = [...domainExtent];
      // console.log('---->', interval, '_domainExtent', _domainExtent, _domainExtent.map(d => new Date(d)))
      if (isNull(interval)) {
        // console.log('NEED TO FIND BEST UNIT');
        interval = UNITS.seconds;
        Object.keys(UNITS).forEach((d) => {
          // console.log(domainWidth, '>=', d, UNITS[d])
          // console.log('testing',d,_domainExtent[1] - _domainExtent[0],'>=',UNITS[d])
          if (Math.abs(_domainExtent[1] - _domainExtent[0]) >= UNITS[d]) {
            interval = d;
            // console.log('!!!', unit)
          }
        });
        // console.log('FOUND', interval)
        // step = UNITS[interval] || LONGER_UNITS[interval] || UNITS.day;
      }
      step = UNITS[interval] || LONGER_UNITS[interval] || UNITS.day;
      //domainExtent[0] = new Date(domainExtent)
      // console.log('original dates', domainExtent.map(d => new Date(d)))
      if (step >= UNITS.day) {
        const d0 = new Date(_domainExtent[0]);
        const d1 = new Date(_domainExtent[1]);
        switch (interval) {
          case 'month':
          case 'months':
            _domainExtent[0] = new Date(d0.getFullYear(), d0.getMonth(), 1);
            _domainExtent[1] = new Date(d1.getFullYear(), d1.getMonth() + 1, 1);
            break;
          case 'year':
          case 'years':
            _domainExtent[0] = new Date(d0.getFullYear(), 0, 1);
            _domainExtent[1] = new Date(d1.getFullYear(), 0, 1);
            break;
          case 'day':
          default:
            _domainExtent[0] = new Date(d0.getFullYear(), +d0.getMonth(), d0.getDate());
            _domainExtent[1] = new Date(d1.getFullYear(), +d1.getMonth(), d1.getDate());
            // break;
        }

        return _domainExtent;
      }
      // console.log('new dates', domainExtent.map(d => new Date(d)))
      // console.log('DEFINE DOMAIN EXTENTS WITH', interval, step, _domainExtent)

      // console.log('_domainExtent', _domainExtent, _domainExtent.map(d => new Date(d)))
      return [
        Math.floor(_domainExtent[0] / step) * step,
        Math.ceil(_domainExtent[1] / step) * step,
        // _domainExtent[0],
        // _domainExtent[1],
      ];
    }
    return [];
  };
  // console.log('domainExtent', domainExtent.map(d => new Date(d)))
  let roundedDomainExtent = domainExtent;
  roundedDomainExtent = calculateTimeDomain();
  // console.log('ORIGINAL DOMAIN', domainExtent)
  // console.log('ROUNDED DOMAIN', roundedDomainExtent)
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

  // console.log('roundedDomainExtent', roundedDomainExtent.map(d => new Date(d)))

  // const domainWidth = roundedDomainExtent[1] - roundedDomainExtent[0];
  // const barwidth = rangeWidth / Math.floor(domainWidth / step);

  // console.log('barwidth', barwidth, 'domainWidth', domainWidth, step, Math.floor(domainWidth/step))
  // // console.log('new this.scalingFunction', domainExtent, range, rangeWidth)
  const scalingFunction = (d) => {
    const valueToDomain =
      (d - roundedDomainExtent[0]) /
      (roundedDomainExtent[1] - roundedDomainExtent[0]);
    return startCoord + rangeWidth * valueToDomain;
  };

  const setTimeInterval = (interval) => {
    if (isNull(interval)) {
      return interval;
    }
    if (typeof interval === 'number') {
      console.error('Please use a string for now');
      return;
    }
    if (UNITS[interval] || LONGER_UNITS[interval]) {
      roundedDomainExtent = calculateTimeDomain(interval);
    } else {
      console.error('The selected interval does not exists.');
    }
  };

  const ticks = (n = TICKS_DEFAULT, interval) => {
    if (!domainExtent.length) {
      return [];
    }
    // console.log('ticks', n, interval)
    const _domainExtent = calculateTimeDomain(interval);
    // console.log('time domain', _domainExtent, _domainExtent.map(d => new Date(d)))
    const _domainWidth = _domainExtent[1] - _domainExtent[0];

    // console.log("TICKS", _domainExtent, _domainExtent.map(d => new Date(d)))
    // console.log('TICKS TIME SCALE', 'ticks', n, interval)
    // TODO: n can never be null...this needs to be reviews, it doesn't work well, _ticks?!?
    if (isNull(n) && isNull(interval) && _ticks.length > 0) {
      return _ticks;
    }
    const step = LONGER_UNITS[interval] || UNITS[interval] || UNITS.day;
    const fixedTicks = Array.isArray(n) && n.length;
    // console.log('create array of', Math.floor(domainWidth / step), domainWidth, step)
    // console.log('STEP IS', step, 'FROM', interval, UNITS, LONGER_UNITS)
    if (step <= LONGER_UNITS.fortnight) {
      _ticks = [
        ...Array(fixedTicks ? n : Math.floor(_domainWidth / step) + 1).keys(),
      ].map((d) => +_domainExtent[0] + d * step);
    } else {
      if (step === LONGER_UNITS.month) {
        // console.log('OPTIONAL DOMAIN', _domainExtent.map(d => new Date(d)))
        _ticks = [new Date(_domainExtent[0])];
        let d = _ticks[0];
        let i = _ticks[0].getMonth();
        const startingYear = new Date(_domainExtent[0]).getFullYear();
        while (i < 10000 && +d < +_domainExtent[1]) {
          d = new Date(startingYear, i, 1);
          _ticks.push(d);
          // console.log('pushing', d, startingYear)
          i++;
        }
      } else if (step === LONGER_UNITS.year) {
        // console.log('YEAR DOMAIN', _domainExtent.map(d => new Date(d)))
        _ticks = [new Date(_domainExtent[0])];
        let d = _ticks[0];
        const startingYear = _ticks[0].getFullYear();
        let i = _ticks[0].getFullYear();
        // console.log('starting year', i)
        while (+d < +_domainExtent[1] && i < startingYear + 10000) {
          d = new Date(i, 0, 1);
          _ticks.push(d);
          // console.log('pushing', d,  _ticks[0].getYear())
          i++;
        }
        // console.log('_ticks', _ticks)
      }
    }

    // console.log('MY TICKS ARE', _ticks, _ticks.map(d => new Date(d)))
    return _ticks.map((value, index) => ({
      index,
      value,
      x: scalingFunction(value),
    }));

    // return _ticks;
  };

  scalingFunction.getName = () => name;
  scalingFunction.getType = () => type;
  scalingFunction.transformation = 'time';
  scalingFunction.getField = () => field;
  scalingFunction.isLog = () => false;
  scalingFunction.fixedDomain = fixedDomain;
  scalingFunction.interval = setTimeInterval;
  scalingFunction.domain = domainExtent;
  scalingFunction.roundedDomainExtent = roundedDomainExtent;
  scalingFunction.field = field;
  scalingFunction.range = range;
  scalingFunction.step = step;
  scalingFunction.barwidth =
    scalingFunction(roundedDomainExtent[0] + scalingFunction.step) -
    scalingFunction(roundedDomainExtent[0]);

  scalingFunction.ticks = memoize(ticks);
  this.scales[type][name] = scalingFunction;
  return this;
}
