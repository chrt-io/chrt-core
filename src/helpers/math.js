// Math.log() function returns the natural logarithm (base e) of a number,
const DEFAULT_LOG_BASE = 10;
// generic function for log with multiple bases
export function baseLog(base = DEFAULT_LOG_BASE) {
  base = isNaN(base) ? DEFAULT_LOG_BASE : base;
  return base === Math.E
    ? Math.log
    : (base === 10 && log10) ||
        (base === 2 && log2) ||
        function(y) {
          return getBaseLog(base, y);
        };
}

// logarithm of y with base x:
export function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

export const log10 = (Math.log10 =
  Math.log10 ||
  function(x) {
    return Math.log(x) * Math.LOG10E;
  });

export const log2 =
  Math.log2 ||
  function(x) {
    return Math.log(x) * Math.LOG2E;
  };

export const pow10 = x => {
  return isFinite(x) ? +('1e' + x) : x < 0 ? 0 : x;
};

export const basePow = (base) => {
  return base === 10
    ? pow10
    : base === Math.E
    ? Math.exp
    : function(x) {
        return Math.pow(base, x);
      };
}

export function range(min = 0, max = 10, step = 1) {
  if(arguments.length === 1) {
    min = 0;
    max = arguments[0];
  }
  const arr = [];
  for (let i = min; i < max; i += step) {
    arr.push(i);
  }
  return arr;
}
