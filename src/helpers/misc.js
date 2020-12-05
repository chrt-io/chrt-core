import {COMPONENTS_W_DATA} from '~/constants';

export function isNull(value) {
  return value === null || value == null || typeof value === 'undefined';
}

export function hasNaN(values) {
  if(!Array.isArray(values)) {
    values = [values];
  }
  return values.some(value => isNaN(value));
}

export function uuid() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}
export function hasData(obj) {
  return !isNull(obj.type) && COMPONENTS_W_DATA.indexOf(obj.type) > -1
}

export function isInfinity(value) {
  return !isFinite(value);
}

export function arraysEqual(array1, array2) {
    if(!Array.isArray(array1) || !Array.isArray(array2)) {
      console.warn('arraysEqual(array1, array2)', 'Both parameters should be arrays');
      return false;
    }
    if(array1.length === 0 && array2.length === 0) {
      return true;
    }
    return (array1.length == array2.length) && array1.every(function(element, index) {
      return element === array2[index];
    });
}
