import {traverse} from '../traverse';

const getComparator = (type) => {
  switch (type) {
    case 'string':
    case 'number':
    case 'integer':
    case 'boolean':
      return (a, b) => a === b;
    case 'array':
    case 'object':
      return (a, b) => JSON.stringify(a) === JSON.stringify(b);
  }
  return (a, b) => a === b;
};

const hasItem = (array, newItem, type) => {
  const compare = getComparator(type);
  for (let item of array) {
    if (compare(item, newItem)) {
      return true;
    }
  }
  return false;
};

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
    if (schema.uniqueItems && itemSchema.type === 'boolean' && arrayLength > 2) {
      throw new Error('Unable to generate so many unique values for boolean.');
    }

    let {value: sample} = traverse(itemSchema, options, spec);
    if (schema.uniqueItems) {
      while (hasItem(res, sample, itemSchema.type)) {
         sample = traverse(itemSchema, options, spec).value;
      }
    }

    res.push(sample);
  }

  return res;
}
