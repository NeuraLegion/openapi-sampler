'use strict';

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

const isObject = obj => obj && typeof obj === 'object';

export function toRFCDateTime(date, omitTime, milliseconds) {
  var res = date.getUTCFullYear() +
    '-' + pad(date.getUTCMonth() + 1) +
    '-' + pad(date.getUTCDate());
  if (!omitTime) {
    res += 'T' + pad(date.getUTCHours()) +
    ':' + pad(date.getUTCMinutes()) +
    ':' + pad(date.getUTCSeconds()) +
    (milliseconds ? '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) : '') +
    'Z';
  }
  return res;
}

export function ensureLength(sample, min, max) {
  const minLength = min ? min : 0;
  const maxLength = max ? max : sample.length;
  if (minLength > sample.length) {
    return sample.repeat(Math.trunc(min / sample.length) + 1).substring(0, min);
  }
  return sample.substr(0, Math.min(Math.max(sample.length, minLength), maxLength));
}

export function mergeDeep(...objects) {

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, Array.isArray(objects[objects.length - 1]) ? [] : {});
}
