import { isNull, hasData, hasNull, hasNaN, uuid, isInfinity, arraysEqual } from '~/helpers';

describe('Testing misc functions', () => {
  test('null is null', () => {
    expect(isNull(null)).toBe(true);
  });

  test('Test if an object should have data', () => {
    expect(hasData({ type: 'chrt' })).toBe(true);
  });

  test('Test if an object should not have data', () => {
    expect(hasData({ type: 'custom-no-data' })).toBe(false);
  });

  test('Test if an array has zero a null value', () => {
    expect(hasNull([1,2,3,4,5,6])).toBe(false);
  });

  test('Test if an array has a null value', () => {
    expect(hasNull([1,2,3,4,null,6])).toBe(true);
  });

  test('Test hasNull false without array', () => {
    expect(hasNull(1)).toBe(false);
  });

  test('Test hasNull true without array', () => {
    expect(hasNull(null)).toBe(true);
  });

  test('Test if an array has zero a NaN value', () => {
    expect(hasNaN([1,2,3,4,5,6])).toBe(false);
  });

  test('Test if an array has a NaN value', () => {
    expect(hasNaN([1,2,3,4,'a',6])).toBe(true);
  });

  test('Test hasNaN false without array', () => {
    expect(hasNaN(1)).toBe(false);
  });

  test('Test hasNaN true without array', () => {
    expect(hasNaN('a')).toBe(true);
  });

  test('Test uuid returns a string', () => {
    expect(typeof uuid()).toBe('string');
  });


  test('Test if finite number is not infinite', () => {
    expect(isInfinity(10)).toBe(false);
  });

  test('Test if string is not infinite', () => {
    expect(isInfinity('string')).toBe(false);
  });

  test('Test if infinite number is infinite', () => {
    expect(isInfinity(Infinity)).toBe(true);
  });

});

describe('Testing arrayEqual function', () => {
  test('Test if it returns false when one of the 2 parameters is not an array', ()=>{
    expect(arraysEqual([1,2,3], 'a')).toBe(false);
  })

  test('Test both arrays are empty', ()=>{
    expect(arraysEqual([], [])).toBe(true);
  })

  test('Test equal arrays', ()=>{
    expect(arraysEqual([1,2,3], [1,2,3])).toBe(true);
  })

  test('Test differetn arrays', ()=>{
    expect(arraysEqual([1,2,4], [1,2,3])).toBe(false);
  })
})
