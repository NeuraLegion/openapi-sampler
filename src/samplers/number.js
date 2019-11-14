function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sampleNumber(schema) {
  const MAX_VALUE = schema.type && schema.type === 'integer' ?
    Number.MAX_SAFE_INTEGER : Number.MAX_VALUE;
  const MIN_VALUE = Number.MIN_SAFE_INTEGER;

  let schemaMin = schema.minimum + !!schema.exclusiveMinimum;
  let schemaMax = schema.maximum - !!schema.exclusiveMaximum;

  let min = schemaMin ? schemaMin : MIN_VALUE;
  let max = schemaMax ? schemaMax : MAX_VALUE;

  if (min > max) {
    [min, max] = [max, min];
  }

  if (schema.multipleOf && schema.multipleOf > 0) {
    min = Math.ceil(min / schema.multipleOf) * schema.multipleOf;
    max = Math.floor(max / schema.multipleOf) * schema.multipleOf;
  }

  return (max - min === 1 && schema.exclusiveMinimum && schema.exclusiveMaximum) ?
    (max + min) / 2 :
    getRandomInt(min, max);
}
