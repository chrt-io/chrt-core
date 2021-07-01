import Chrt from '~/Chrt';

const data = [
  {
    x: 'a',
    y: 10
  },
  {
    x: 'b',
    y: 14
  },
  {
    x: 'c',
    y: 14
  },
  {
    x: 'd',
    y: 22
  }
];

describe('Testing ordinal scales', () => {
  const chrt = new Chrt()
                      .data(data)
                      .x({scale: 'ordinal'})
  const scales = chrt.scales;


  test('test if the x scale has been created and is ordinal', () => {
    expect(scales['x']).toBeDefined();
    expect(scales['x'].x).toBeDefined();
    expect(scales['x'].x.transformation).toEqual('ordinal');
  });

  test('test if the x scale has N ticks', () => {
    const expectedTicks = [...new Set(data.map(d => d.x))];
    expect(scales['x'].x.ticks()).toHaveLength(expectedTicks.length)
  });
});
