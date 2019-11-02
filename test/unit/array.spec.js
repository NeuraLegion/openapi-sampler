import { sampleArray } from '../../src/samplers/array.js';

describe('sampleArray', () => {
  var res;

  it('should return empty array by default', () => {
    res = sampleArray({});
    expect(res).to.deep.equal([]);
  });

  it('should return elements of correct type', () => {
    res = sampleArray({items: {type: 'number'}});
    expect(typeof res[0]).to.equal('number');
  });

  it('should return correct number of elements based on minItems', () => {
    res = sampleArray({items: {type: 'number'}, minItems: 3});
    expect(typeof res[0]).to.equal('number');
    expect(typeof res[1]).to.equal('number');
    expect(typeof res[2]).to.equal('number');
  });

  it('should correcly sample tuples', () => {
    res = sampleArray({items: [{type: 'number'}, {type: 'string'}, {}]});
    let [integerValue, stringValue, unknownValue] = res;
    expect(typeof integerValue).to.equal('number');
    expect(typeof stringValue).to.equal('string');
    expect(unknownValue).to.equal(null);
  });
});
