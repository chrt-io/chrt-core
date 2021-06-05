import Chrt from '~/Chrt';

describe('Testing linear scale', () => {
  const chrt = new Chrt().x([0,10],[0,100]);
  const scales = chrt.scales;

  test('test if the x scale has been created', () => {
    expect(scales['x']).toBeDefined();
  });

  test('test if the x scale is named x', () => {
    expect(scales.x['x'].getName()).toBe('x');
  });

  test('test if domain is an array', () => {
    expect(scales.x['x'].domain).toBeInstanceOf(Array);
  });

  test('test if range is an array', () => {
    expect(scales.x['x'].range).toBeInstanceOf(Array);
  });

  test.each([
    ['domain', 2],
    ['range', 2]
  ])('%p length is %i', (d, expected) => {
    expect(scales.x['x'][d].length).toBe(expected);
  });

  test('test ticks() is an array', () => {
    expect(scales.x['x'].ticks()).toBeInstanceOf(Array);
  });

  test.each([
    [0,100],
    [100,0]
  ])('test scaleLinear(x) is within range %i, %i', (lower, upper) => {
    const chrt = new Chrt().x([0,10],[lower,upper]);
    const scales = chrt.scales;
    const domain = scales.x['x'].domain;
    const range = scales.x['x'].range;

    if(range[0] < range[1]) {
      expect(scales.x['x']((domain[0] + domain[1])/2)).toBeGreaterThanOrEqual(range[0]);
      expect(scales.x['x']((domain[0] + domain[1])/2)).toBeLessThan(range[1]);
    } else {
      expect(scales.x['x']((domain[0] + domain[1])/2)).toBeGreaterThanOrEqual(range[1]);
      expect(scales.x['x']((domain[0] + domain[1])/2)).toBeLessThan(range[0]);
    }
  })

  test.each([
    [0,100],
    [100,0]
  ])('test scaleLinear(domain[0]) is within range %i, %i', (lower, upper) => {
    const chrt = new Chrt().x([0,10],[lower,upper]);
    const scales = chrt.scales;
    const domain = scales.x['x'].domain;
    const range = scales.x['x'].range;

    if(range[0] < range[1]) {
      expect(scales.x['x'](domain[0])).toBeGreaterThanOrEqual(range[0]);
    } else {
      expect(scales.x['x'](domain[0])).toBeLessThanOrEqual(range[0]);
    }
  })

  test.each([
    [0,100],
    [100,0]
  ])('test scaleLinear(domain[1]) is within range %i, %i', (lower, upper) => {
    const chrt = new Chrt().x([0,10],[lower,upper]);
    const scales = chrt.scales;

    const domain = scales.x['x'].domain;
    const range = scales.x['x'].range;

    if(range[0] < range[1]) {
      expect(scales.x['x'](domain[1])).toBeLessThanOrEqual(range[1]);
    } else {
      expect(scales.x['x'](domain[1])).toBeGreaterThanOrEqual(range[1]);
    }
  })

  test('Test if only domain is passed', async () => {
    const mockElement = document.createElement('div');
    const chart = Chrt()
      .data([0,1,2,3,4,5])
      .x([0,10])

    const domain = chart.scales.x['x'].domain;

    expect(domain).toStrictEqual([0,10]);
  });

  test('Test if ticks returns the list of ticks', async () => {
    const mockElement = document.createElement('div');
    const chart = Chrt()
      .data([0,1,2,3,4,5])
      .x([0,5])

    const ticks = chart.scales.x['x'].ticks();
    // console.log('ticks', ticks)
    expect(ticks.length).toBeGreaterThanOrEqual(0);
  });

});
