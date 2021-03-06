import {traverse} from '../traverse';

export function sampleArray(schema, options = {}, spec) {
  let arrayLength = schema.minItems || 1;

  if (Array.isArray(schema.items)) {
    arrayLength = Math.max(arrayLength, schema.items.length);
  }

  const itemSchemaGetter = itemNumber => {
    if (Array.isArray(schema.items)) {
      return schema.items[itemNumber] || {};
    }
    return schema.items || {};
  };

  const res = [];

  if (!schema.items) {
    return res;
  }

  for (let i = 0; i < arrayLength; i++) {
    const itemSchema = itemSchemaGetter(i);
    let {value: sample} = traverse(itemSchema, options, spec);
    res.push(sample);
  }

  return res;
}
