'use strict';

import { traverse, clearCache } from './traverse';
import { sampleArray, sampleBoolean, sampleNumber, sampleNull, sampleObject, sampleString } from './samplers/index';

export const _samplers = {};

const defaults = {
  skipReadOnly: false
};

export function sample(schema, options, spec) {
  const opts = Object.assign({}, defaults, options);
  clearCache();
  return traverse(schema, opts, spec).value;
}

export function _registerSampler(type, sampler) {
  _samplers[type] = sampler;
}

export { inferType } from './infer';

_registerSampler('array', sampleArray);
_registerSampler('boolean', sampleBoolean);
_registerSampler('null', sampleNull);
_registerSampler('integer', sampleNumber);
_registerSampler('number', sampleNumber);
_registerSampler('object', sampleObject);
_registerSampler('string', sampleString);
