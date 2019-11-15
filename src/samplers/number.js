const isInteger = (type) => {
  return type === 'integer';
};

const DECIMALS = 2;
const MAX_VALUE = Number.MAX_SAFE_INTEGER;
const MIN_VALUE = Number.MIN_SAFE_INTEGER;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function format(number, format) {
  switch (format) {
    case 'float':
    case 'double':
      return number.toFixed(DECIMALS);
    default:
      return number;
  }
}

export function sampleNumber(schema) {
  const type = schema.type ? schema.type : 'number';
  const isInt = isInteger(type);

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

  let sampledNumber;
  if (schema.exclusiveMaximum &&
    schema.exclusiveMinimum &&
    Math.abs(min - max) === 1) {
    if (isInt) {
      throw new Error('Invalid min and max boundaries supplied.');
    }
    sampledNumber = (max + min) / 2;
  } else {
    sampledNumber = getRandomInt(min, max);
  }
  return format(sampledNumber, schema.format);
}
