import * as math from '~/helpers/math';

describe('Testing log/pow functions', () => {
  test ('base 10 log of 1 should equals 0', () => {
    expect(math.getBaseLog(10,1)).toBe(0)
  });

  test ('base 10 log of 0 should equals -Infinity', () => {
    expect(math.getBaseLog(10,0)).toBe(-Infinity)
  });

  test ('base 10 log of 100 should equals 2', () => {
    expect(math.baseLog(10)(100)).toBe(2)
  });

  test ('base 2 log of 8 should equals 3', () => {
    expect(math.baseLog(2)(8)).toBe(3)
  });

  test ('base 2 log of 0 should equals -Infinity', () => {
    expect(math.baseLog(2)(0)).toBe(-Infinity)
  });

  test ('base E log of 1 should equals 0', () => {
    expect(math.baseLog(Math.E)(1)).toBe(0)
  });

  test ('base E log of 0 should equals -Infinity', () => {
    expect(math.baseLog(Math.E)(0)).toBe(-Infinity)
  });

  test ('base 3 log of 9 should equals 3', () => {
    expect(math.baseLog(3)(9) - 2).toBeLessThan(0.0000005)
  });
  test ('base NaN log of 100 should equals 2', () => {
    expect(math.baseLog('a')(100)).toBe(2)
  });
  test ('log2 of 8 should equals 3', () => {
    expect(math.log2(8)).toBe(3)
  });

  test ('log2 of 0 should equals -Infinity', () => {
    expect(math.log2(0)).toBe(-Infinity)
  });

  test ('pow 10 of 3 should equals 1000', () => {
    expect(math.pow10(3)).toBe(1000)
  });

  test ('pow 10 of 3 should equals 1000', () => {
    expect(math.basePow(10)(3)).toBe(1000)
  });
})

describe('Testing range functions', () => {
  test ('Default range', () => {
    expect(math.range()).toStrictEqual([0,1,2,3,4,5,6,7,8,9])
  });

  test ('Range with one argument', () => {
    expect(math.range(5)).toStrictEqual([0,1,2,3,4])
  });

  test ('Range with step 10', () => {
    expect(math.range(0,30,10)).toStrictEqual([0,10,20])
  });
})
