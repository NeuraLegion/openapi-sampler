const isInteger = (type) => {
  return type === 'integer';
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sampleNumber(schema) {
  const type = schema.type ? schema.type : 'number';
  const MAX_VALUE = isInteger(type) ? Number.MAX_SAFE_INTEGER : Number.MAX_VALUE;
  const MIN_VALUE = isInteger(type) ? Number.MIN_SAFE_INTEGER : -Number.MAX_VALUE;

  let schemaMin = schema.minimum && schema.exclusiveMinimum ?
    schema.minimum + 1 :
    schema.minimum;

  let schemaMax = schema.maximum && schema.exclusiveMaximum ?
    schema.maximum - 1 :
    schema.maximum;

  let min = schemaMin ? schemaMin : MIN_VALUE;
  let max = schemaMax ? schemaMax : MAX_VALUE;

  if (schema.multipleOf && schema.multipleOf > 0) {
    min = Math.ceil(min / schema.multipleOf) * schema.multipleOf;
    max = Math.floor(max / schema.multipleOf) * schema.multipleOf;
  }

  if (schema.exclusiveMaximum &&
    schema.exclusiveMinimum &&
    Math.abs(min - max) === 1) {
    if (isInteger(type)) {
      throw new Error('Invalid min and max boundaries supplied.');
    }
    return (max + min) / 2;
  }

  return getRandomInt(min, max);
}
