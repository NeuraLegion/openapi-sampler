'use strict';

import { traverse } from './traverse';
import { mergeDeep } from './utils';

export function allOfSample(into, children, options, spec) {
  const res = traverse(into, options, spec);
  const subSamples = [];

  for (let subSchema of children) {
    const { type, readOnly, writeOnly, value } = traverse({ type, ...subSchema }, options, spec);

    if (res.type && type && type !== res.type) {
      throw new Error(`allOf: schemas with different types can't be merged`);
    }

    res.type = res.type || type;
    res.readOnly = res.readOnly || readOnly;
    res.writeOnly = res.writeOnly || writeOnly;

    if (value != null) {
      subSamples.push(value);
    }
  }

  switch (res.type) {
    case 'object':
      res.value = mergeDeep(res.value || {}, ...subSamples);
      break;

    case 'array':
      if (!options.quiet) {
        console.warn('OpenAPI Sampler: found allOf with "array" type. Result may be incorrect');
      }

      const typeSet = children.reduce((acc, child) => {
        if (child.items) {
          acc.add(child.items.type);
        }
        return acc;
      }, new Set());

      if (typeSet.size !== 1) {
        throw new Error('Schema has no types or has 2 or more incompatible types');
      }

      const arraySchema = mergeDeep(...children);
      res.value = traverse(arraySchema, options, spec).value;
      break;

    default:
      const lastSample = subSamples[subSamples.length - 1];
      res.value = lastSample != null ? lastSample : res.value;
  }

  return res;
}
