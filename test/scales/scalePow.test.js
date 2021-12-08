import Chrt from '~/Chrt';

describe('Testing pow scales', () => {
  test('test ticks', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[0,100],range:[0,100],scale:'sqrt'})
    const scales = chart.scales;

    const expectedTicks = [0,
        31.622776601683793,
        44.721359549995796,
        54.77225575051661,
        63.245553203367585,
        70.71067811865476,
        77.45966692414834,
        83.66600265340756,
        89.44271909999159,
        94.86832980505137,
        100];
    expect(scales.y.y.ticks(10).map(d => d.x)).toEqual(expectedTicks)
  });

  test('test ticks with negative domain', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[-100,100],range:[0,100],scale:'sqrt'})
    const scales = chart.scales;

    const expectedTicks = [0,
        5.278640450004204,
        11.27016653792583,
        18.377223398316207,
        27.639320225002102,
        50,
        72.36067977499789,
        81.6227766016838,
        88.72983346207415,
        94.7213595499958,
        100];
    expect(scales.y.y.ticks(10).map(d => d.x)).toEqual(expectedTicks)
  });

  test('test ticks 2', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[20,80],range:[0,100],scale:'sqrt'})
    const scales = chart.scales;

    const expectedTicks = [0,
        11.80339887498948,
        22.4744871391589,
        32.28756555322953,
        41.42135623730951,
        50,
        58.113883008418966,
        65.83123951776999,
        73.20508075688772,
        80.27756377319945,
        87.08286933869707,
        93.64916731037086,
        100];
    expect(scales.y.y.ticks(10).map(d => d.x)).toEqual(expectedTicks)
  });
});
