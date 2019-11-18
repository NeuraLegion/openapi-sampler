import { sampleNumber } from '../../src/samplers/number.js';

describe('sampleNumber', () => {
  let res;
  it('should return number by default', () => {
    res = sampleNumber({});
    expect(typeof res).to.equal('number');
  });

  it('should return minimum if minimum is specified', () => {
    res = sampleNumber({minimum: 3});
    expect(res).to.be.gte(3);
  });

  it('should return minimum +1 for exclusiveMinimum', () => {
    res = sampleNumber({minimum: 3, exclusiveMinimum: true});
    expect(res).to.be.gt(3);
  });

  it('should return number below maximum even if negative', () => {
    res = sampleNumber({maximum: -3});
    expect(res).to.be.lte(-3);
  });

  it('should return value smaller than maximum and never equal to maximum ', () => {
    res = sampleNumber({maximum: -3, exclusiveMaximum: true});
    expect(res < -3).to.equal(true);
  });

  it('should return between if both minimum and maximum are specified', () => {
    res = sampleNumber({maximum: 10, minimum: 3});
    expect(res).to.be.gte(3);
    expect(res).to.be.lte(10);
  });

  // (2, 3) -> 2.5
  it('should return middle point if integer is not possible', () => {
    res = sampleNumber({minimum: 2, maximum: 3, exclusiveMinimum: true, exclusiveMaximum: true});
    expect(res).to.equal(2.5);
  });

  // (2, 3] -> 3
  it('should return closer to minimum possible int', () => {
    res = sampleNumber({minimum: 2, maximum: 3, exclusiveMinimum: true});
    expect(res).to.equal(3);
  });
});
