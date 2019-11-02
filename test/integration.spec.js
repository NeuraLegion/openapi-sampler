'use strict';

describe('Integration', function() {
  var schema;
  var result;
  var expected;

  describe('Primitives', function() {

    it('should sample string', function() {
      schema = {
        'type': 'string'
      };
      result = OpenAPISampler.sample(schema);
      expected = 'string';
      expect(typeof result).to.deep.equal(expected);
    });

    it('should sample number', function() {
      schema = {
        'type': 'number'
      };
      result = OpenAPISampler.sample(schema);
      expected = 'number';
      expect(typeof result).to.deep.equal(expected);
    });

    it('should sample boolean', function() {
      schema = {
        'type': 'boolean'
      };
      result = OpenAPISampler.sample(schema);
      expected = true;
      expect(typeof result).to.deep.equal('boolean');
    });

    it('should use default property', function() {
      schema = {
        'type': 'number',
        'default': 100
      };
      result = OpenAPISampler.sample(schema);
      expected = 100;
      expect(result).to.deep.equal(expected);
    });

    it('should use null if type is not specified', function() {
      schema = {
      };
      result = OpenAPISampler.sample(schema);
      expected = null;
      expect(result).to.deep.equal(expected);
    });
  });

  describe('Objects', function() {
    it('should sample object without properties', function() {
      schema = {
        'type': 'object'
      };
      result = OpenAPISampler.sample(schema);
      expected = {};
      expect(result).to.deep.equal(expected);
    });

    it('should sample object with property', function() {
      schema = {
        'type': 'object',
        'properties': {
          'title': {
            'type': 'string',
          }
        }
      };
      result = OpenAPISampler.sample(schema);
      expect(typeof result.title).to.deep.equal('string');
    });

    it('should sample object with property with default value', function() {
      schema = {
        'type': 'object',
        'properties': {
          'title': {
            'type': 'string',
            'default': 'Example'
          }
        }
      };
      result = OpenAPISampler.sample(schema);
      expected = {
        'title': 'Example'
      };
      expect(result).to.deep.equal(expected);
    });

    it('should sample object with more than one property', function() {
      schema = {
        'type': 'object',
        'properties': {
          'title': {
            'type': 'string',
            'default': 'Example'
          },
          'amount': {
            'type': 'number',
            'default': 10
          }
        }
      };
      result = OpenAPISampler.sample(schema);
      expected = {
        'title': 'Example',
        'amount': 10
      };
      expect(result).to.deep.equal(expected);
    });

    it('should sample both properties and additionalProperties', function() {
      schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        },
        additionalProperties: {
          type: 'number'
        }
      };
      result = OpenAPISampler.sample(schema);
      expected = {
        property1: 0,
        property2: 0
      };
      expect(typeof result.test).to.equal('string');
      expect(typeof result.property1).to.equal('number');
      expect(typeof result.property2).to.equal('number');
    });
  });

  describe('AllOf', function() {
    it('should sample schema with allOf', function() {
      schema = {
        'allOf': [
          {
            'type': 'object',
            'properties': {
              'title': {
                'type': 'string',
                'default': 'string'
              }
            }
          },
          {
            'type': 'object',
            'properties': {
              'amount': {
                'type': 'number',
                'default': 1
              }
            }
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expected = {
        'title': 'string',
        'amount': 1
      };
      expect(result).to.deep.equal(expected);
    });

    it('should throw for schemas with allOf with different types', function() {
      schema = {
        'allOf': [
          {
            'type': 'string'
          },
          {
            'type': 'object',
            'properties': {
              'amount': {
                'type': 'number',
                'default': 1
              }
            }
          }
        ]
      };
      expect(() => OpenAPISampler.sample(schema)).to.throw();
    });

    it('deep array', function() {
      schema = {
        'allOf': [
          {
            'type': 'object',
            'properties': {
              'arr': {
                'type': 'array',
                'items': {
                  'type': 'object',
                }
              }
            }
          },
          {
            'type': 'object',
            'properties': {
              'arr': {
                'type': 'array',
                'items': {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    }
                  }
                }
              }
            }
          },
        ]
      };

      expected = {
        arr: [
          {
            name: 'string'
          }
        ]
      };
      const result = OpenAPISampler.sample(schema);
      expect(Array.isArray(result.arr)).to.equal(true);
    });

    it('should not be confused by subschema without type', function() {
      schema = {
        'type': 'string',
        'allOf': [
          {
            'description': 'test'
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expected = 'string';
      expect(typeof result).to.equal(expected);
    });

    it('should not throw for array allOf', function() {
      schema = {
        'type': 'array',
        'allOf': [
          {
            'type': 'array',
            'items': {
              'type': 'string'
            }
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expect(result).to.be.an('array');
    });

    it('should sample schema with allOf even if some type is not specified', function() {
      schema = {
        'properties': {
          'title': {
            'type': 'string',
            'default': 'string'
          }
        },
        'allOf': [
          {
            'type': 'object',
            'properties': {
              'amount': {
                'type': 'number',
                'default': 1
              }
            }
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expected = {
        'title': 'string',
        'amount': 1
      };
      expect(result).to.deep.equal(expected);

      schema = {
        'type': 'object',
        'properties': {
          'title': {
            'type': 'string',
            'default': 'string'
          }
        },
        'allOf': [
          {
            'properties': {
              'amount': {
                'type': 'number',
                'default': 1
              }
            }
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expect(typeof result.title).to.equal('string');
      expect(result.amount).to.equal(1);
    });

    it('should merge deep properties', function() {
      schema = {
        'type': 'object',
        'allOf': [
          {
            'type': 'object',
            'properties': {
              'parent': {
                'type': 'object',
                'properties': {
                  'child1': {
                    'type': 'string'
                  }
                }
              }
            }
          },
          {
            'type': 'object',
            'properties': {
              'parent': {
                'type': 'object',
                'properties': {
                  'child2': {
                    'type': 'number'
                  }
                }
              }
            }
          }
        ]
      };

      result = OpenAPISampler.sample(schema);

      expect(typeof  result.parent.child1).to.equal('string');
      expect(typeof result.parent.child2).to.equal('number');
    });
  });

  describe('Example', function() {
    it('should use example', function() {
      var obj = {
        test: 'test',
        properties: {
          test: {
            type: 'string'
          }
        }
      };
      schema = {
        type: 'object',
        example: obj
      };
      result = OpenAPISampler.sample(schema);
      expected = obj;
      expect(result).to.deep.equal(obj);
    });

    it('should use falsy example', function() {
      schema = {
        type: 'string',
        example: false
      };
      result = OpenAPISampler.sample(schema);
      expected = false;
      expect(result).to.deep.equal(expected);
    });

    it('should use enum', function() {
      schema = {
        type: 'string',
        enum: ['test1', 'test2']
      };
      result = OpenAPISampler.sample(schema);
      expected = 'test1';
      expect(result).to.equal(expected);
    });
  });

  describe('Detection', function() {
    it('should detect autodetect types based on props', function() {
      schema = {
        properties: {
          a: {
            minimum: 10
          },
          b: {
            minLength: 1
          }
        }
      };
      result = OpenAPISampler.sample(schema);
      expect(result.a).to.deep.equal(10);
      expect(typeof result.b).to.equal('string');
    });
  });

  describe('oneOf and anyOf', function() {
    it('should support oneOf', function() {
      schema = {
        oneOf: [
          {
            type: 'string'
          },
          {
            type: 'number'
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expected = 'string';
      expect(typeof result).to.equal(expected);
    });

    it('should support anyOf', function() {
      schema = {
        anyOf: [
          {
            type: 'string'
          },
          {
            type: 'number'
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expected = 'string';
      expect(typeof result).to.equal(expected);
    });

    it('should prefer oneOf if anyOf and oneOf are on the same level ', function() {
      schema = {
        anyOf: [
          {
            type: 'string'
          }
        ],
        oneOf: [
          {
            type: 'number'
          }
        ]
      };
      result = OpenAPISampler.sample(schema);
      expect(typeof result).to.equal('number');
    });
  });

  describe('$refs', function() {
    it('should follow $ref', function() {
      schema = {
        $ref: '#/defs/Schema'
      };
      const spec = {
        defs: {
          Schema: {
            type: 'object',
            properties: {
              a: {
                type: 'string'
              }
            }
          }
        }
      };
      result = OpenAPISampler.sample(schema, {}, spec);
      expect(typeof result.a).to.equal('string');
    });

    it('should not follow circular $ref', function() {
      schema = {
        $ref: '#/defs/Schema'
      };
      const spec = {
        defs: {
          str: {
            type: 'string'
          },
          Schema: {
            type: 'object',
            properties: {
              a: {
                $ref: '#/defs/str'
              },
              b: {
                $ref: '#/defs/Schema'
              }
            }
          }
        }
      };
      result = OpenAPISampler.sample(schema, {}, spec);
      expect(result.b).to.deep.equal({});
      expect(typeof result.a).to.equal('string');
    });

    it('should not follow circular $ref if more than one in properties', function() {
      schema = {
        $ref: '#/defs/Schema'
      };
      const spec = {
        defs: {
          Schema: {
            type: 'object',
            properties: {
              a: {
                $ref: '#/defs/Schema'
              },
              b: {
                $ref: '#/defs/Schema'
              }
            }
          }
        }
      };
      result = OpenAPISampler.sample(schema, {}, spec);
      expected = {
        a: {},
        b: {}
      };
      expect(result).to.deep.equal(expected);
    });

    it('should throw if schema has $ref and spec is not provided', function() {
      schema = {
        $ref: '#/defs/Schema'
      };

      expect(() => OpenAPISampler.sample(schema)).to
        .throw(/You must provide specification in the third parameter/);
    });

    it('should ignore readOnly params if referenced', function() {
      schema = {
        type: 'object',
        properties: {
          a: {
            allOf: [
              { $ref: '#/defs/Prop' }
            ],
            description: 'prop A'
          },
          b: {
            type: 'string'
          }
        }
      };

      const spec = {
        defs: {
          Prop: {
            type: 'string',
            readOnly: true
          }
        }
      };

      result = OpenAPISampler.sample(schema, {skipReadOnly: true}, spec);
      expect(typeof result.b).to.deep.equal('string');
    });
  });
});
