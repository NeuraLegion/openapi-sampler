'use strict';

const schemaKeywordTypes = {
  multipleOf: 'number',
  maximum: 'number',
  exclusiveMaximum: 'number',
  minimum: 'number',
  exclusiveMinimum: 'number',

  maxLength: 'string',
  minLength: 'string',
  pattern: 'string',

  items: 'array',
  maxItems: 'array',
  minItems: 'array',
  uniqueItems: 'array',
  additionalItems: 'array',

  maxProperties: 'object',
  minProperties: 'object',
  required: 'object',
  additionalProperties: 'object',
  properties: 'object',
  patternProperties: 'object',
  dependencies: 'object'
};

export function inferType(schema) {
  if (schema.type) {
    return schema.type;
  }

  const keywords = Object.keys(schemaKeywordTypes);

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    const type = schemaKeywordTypes[keyword];

    if (schema[keyword]) {
      return type;
    }
  }

  return null;
}
