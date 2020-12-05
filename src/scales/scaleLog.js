import logTicks from "./util/logTicks";
import { baseLog } from "~/helpers/math";
import { memoize } from "~/util";
import { isNull, hasNaN } from "~/helpers";

export default function scale(name, domain, range, transformation = "log10") {
  // console.log('LOG SCALE', name, domain, range, transformation);
  // console.log('this.scales[',name,'].domain','=',this.scales[name].domain, 'isLog?',this.scales[name].isLog())
  const log = baseLog();

  const fixedDomain =
    domain || (this.scales[name] ? this.scales[name].fixedDomain : null);
  const copyOfFixedDomain = !isNull(fixedDomain) ? [...fixedDomain] : null;
  // console.log('CURRENT FIXED DOMAIN IS', fixedDomain)
  if (!domain) {
    //domain = [0, 1]; // not sure anymore about this
  }

  let _ticks = [];

  range[0] += name === "x" ? this._padding.left : -this._padding.bottom;
  range[1] -= name === "x" ? this._padding.right : -this._padding.top;
  // // console.log(name,'RANGE',range)

  const currentDomain =
    this.scales[name] && this.scales[name].isLog()
      ? this.scales[name].domain
      : [];
  let domainExtent = copyOfFixedDomain || domain || currentDomain;
  // console.log('using domainExtent', domainExtent[0], domainExtent[1]);
  if (arguments.length === 1) {
    return this.scales[arguments[0]];
  }
  if (
    isNull(fixedDomain) ||
    hasNaN(currentDomain) ||
    !domainExtent ||
    !domainExtent.length ||
    domainExtent[0] !== currentDomain[0] ||
    domainExtent[1] !== currentDomain[1]
  ) {
    this._data
      .filter((d) => d[name] > 0)
      .forEach((d) => {
        console.log(name, d[name])
        domainExtent[0] = isNull(domainExtent[0])
          ? d[name]
          : Math.min(d[name], domainExtent[0]);
        domainExtent[1] = isNull(domainExtent[1])
          ? d[name]
          : Math.max(d[name], domainExtent[1]);
      });

    this.objects.forEach((obj) => {
      const _data = (!isNull(obj.data) && obj._data.length) ? obj._data : this._data;
      if (_data) {
        _data.forEach((d) => {
          domainExtent[0] = isNull(domainExtent[0])
            ? d[obj.fields[name]]
            : Math.min(
                ...[
                  d[obj.fields[name]],
                  domainExtent[0],
                  d[`stacked_${obj.fields[name]}`],
                ].filter((value) => !isNull(value) && !hasNaN(value))
              );
          domainExtent[1] = isNull(domainExtent[1])
            ? d[obj.fields[name]]
            : Math.max(
                ...[
                  d[obj.fields[name]],
                  domainExtent[1],
                  d[`stacked_${obj.fields[name]}`],
                ].filter((value) => !isNull(value) && !hasNaN(value))
              );
        });
      }
    });
    // console.log('2 domainExtent ->', domainExtent[0], domainExtent[1])
  }

  const numScale = new logTicks(domainExtent);

  // re-assign domain based on max/min of logTicks nice scale
  // domainExtent[0] = numScale.getMin();
  // domainExtent[1] = numScale.getMax();

  if (isNull(fixedDomain)) {
    // console.log('--->eNumScale',eNumScale.getMin(), eNumScale.getMax())
    domainExtent[0] = !isNull(currentDomain[0])
      ? Math.min(currentDomain[0], numScale.getMin())
      : numScale.getMin();
    domainExtent[1] = !isNull(currentDomain[1])
      ? Math.max(currentDomain[1], numScale.getMax())
      : numScale.getMax();
  }
  // console.log('NEW domain extent', domainExtent[0], domainExtent[1])

  const domainWidth = log(domainExtent[1]) - log(domainExtent[0]);
  const direction = range[1] >= range[0] ? 1 : -1;
  const rangeWidth =
    range[1] -
    range[0] -
    (name === "x"
      ? this._margins.left + this._margins.right
      : this._margins.top + this._margins.bottom) *
      direction;

  const startCoord =
    range[0] +
    (name === "x" ? this._margins.left : this._margins.bottom) * direction;

  // // console.log('new this.scalingFunction', domainExtent, range, rangeWidth)
  const scalingFunction = (d) => {
    const valueToDomain = (log(d) - log(domainExtent[0])) / domainWidth;
    //// // console.log('LOG scalingFunction',domainExtent, d,log(d),log(domainExtent[0]),log(domainExtent[1]),valueToDomain);
    // // console.log('LOG', d, startCoord  + rangeWidth * valueToDomain)
    return startCoord + rangeWidth * valueToDomain;
  };

  const ticks = (n) => {
    if (isNull(n) && _ticks.length > 0) {
      return _ticks;
    }
    _ticks = numScale.ticks(n).map((value, index) => ({
      index,
      value,
      x: scalingFunction(value),
      isMinor: log(value) % 1,
    }));

    return _ticks;
  };

  const getName = () => {
    return name;
  };
  const getTransformation = () => {
    return transformation;
  };

  scalingFunction.getName = getName;
  scalingFunction.getTransformation = getTransformation;
  scalingFunction.isLog = () => true;
  scalingFunction.fixedDomain = fixedDomain;
  scalingFunction.domain = domainExtent;
  scalingFunction.range = range;

  scalingFunction.ticks = memoize(ticks);
  this.scales[name] = scalingFunction;
  return this;
}
