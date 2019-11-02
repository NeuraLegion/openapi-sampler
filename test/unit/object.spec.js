import { sampleObject} from '../../src/samplers/object.js';

describe('sampleObject', () => {
  let res;
  it('should return emtpy object by default', () => {
    res = sampleObject({});
    expect(res).to.deep.equal({});
  });

  it('should instantiate all properties', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'integer'}
    }});
    expect(typeof res.a).to.equal('string');
    expect(typeof res.b).to.equal('number');
  });

  it('should skip readonly properties if skipReadOnly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'integer', readOnly: true}
    }}, {skipReadOnly: true});
    expect(typeof res.a).to.equal('string');
  });

  it('should skip readonly properties in nested objects if skipReadOnly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'object', properties: {
        b1: { type: 'number', readOnly: true },
        b2: { type: 'number'}
      }}
    }}, {skipReadOnly: true});
    expect(typeof res.a).to.equal('string');
    expect(typeof res.b.b2).to.equal('number');
  });

  it('should skip writeonly properties if writeonly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'integer', writeOnly: true}
    }}, {skipWriteOnly: true});
    expect(typeof res.a).to.equal('string');
  });

  it('should skip writeonly properties in nested objects if writeonly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'object', properties: {
        b1: { type: 'number', writeOnly: true },
        b2: { type: 'number'}
      }}
    }}, {skipWriteOnly: true});
    expect(typeof res.a).to.equal('string');
    expect(typeof res.b.b2).to.equal('number');
  });

  it('should should instantiate 2 additionalProperties', () => {
    res = sampleObject({additionalProperties: {type: 'string'}});
    expect(typeof res.property1).to.equal('string');
    expect(typeof res.property2).to.equal('string');
  });

  it('should skip non-required properties if skipNonRequired=true', () => {
    res = sampleObject({
      properties: {
        a: {type: 'string'},
        b: {type: 'integer'}
      },
      required: ['a']
    }, {skipNonRequired: true});
    expect(typeof res.a).to.equal('string');
  });
});
