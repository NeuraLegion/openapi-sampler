const isInteger = (type) => {
  return type === 'integer';
};

const DECIMALS = 2;
const MAX_VALUE = Number.MAX_SAFE_INTEGER;
const MIN_VALUE = Number.MIN_SAFE_INTEGER;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function format(number, format) {
  switch (format) {
    case 'float':
    case 'double':
      return parseFloat(number.toFixed(DECIMALS));

    case 'int32':
    case 'int64':
      return parseInt(number);

    default:
      return number;
  }
}

export function sampleNumber(schema) {
  const type = schema.type ? schema.type : 'number';
  let numberFormat = schema.format;
  if (!numberFormat) {
    numberFormat = isInteger(type) ? 'int64' : 'float';
  }

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

    return format((max + min) / 2, numberFormat);
  }
  return format(getRandomInt(min, max), numberFormat);
}
