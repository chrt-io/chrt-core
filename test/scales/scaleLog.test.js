import Chrt from '~/Chrt';

describe('Testing log scales', () => {
  test('test ticks', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[1,100],range:[0,100],scale:'log'})
    const scales = chart.scales;

    const expectedTicks = [47.712125471966246,
    45.154499349597174,
    42.25490200071284,
    38.90756251918218,
    34.948500216800944,
    30.10299956639812,
    23.856062735983123,
    15.05149978319906,
    0,
    97.71212547196623,
    95.15449934959717,
    92.25490200071285,
    88.90756251918218,
    84.94850021680094,
    80.10299956639813,
    73.85606273598312,
    65.05149978319906,
    50,
    147.71212547196623,
    145.1544993495972,
    142.25490200071283,
    138.90756251918216,
    134.94850021680094,
    130.10299956639813,
    123.85606273598313,
    115.05149978319906,
    100];
    expect(scales.y.y.ticks().map(d => d.x)).toEqual(expectedTicks)
  });

  test('test ticks with 0 as domain lower bound', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[0,100],range:[0,100],scale:'log'})
    const scales = chart.scales;

    const expectedTicks = [0,
    30.102999566398125,
    47.71212547196624,
    60.20599913279625,
    69.89700043360187,
    77.81512503836436,
    84.50980400142569,
    90.30899869919435,
    95.42425094393248,
    100,
    130.10299956639813,
    147.71212547196626,
    160.20599913279625,
    169.89700043360187,
    177.81512503836433,
    184.5098040014257,
    190.30899869919438,
    195.42425094393246];
    expect(scales.y.y.ticks(10).map(d => d.x)).toEqual(expectedTicks)
  });

  test('test ticks with 0 as domain lower+upper bound', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[0,0],range:[0,100],scale:'log'})
    const scales = chart.scales;

    const expectedTicks = [
    95.42425094393249,
    90.30899869919435,
    84.50980400142568,
    77.81512503836436,
    69.89700043360189,
    60.20599913279624,
    47.712125471966246,
    30.10299956639812,
    0,
    195.42425094393246,
    190.30899869919435,
    184.5098040014257,
    177.81512503836436,
    169.89700043360187,
    160.20599913279625,
    147.71212547196623,
    130.10299956639813,
    100,];
    expect(scales.y.y.ticks(10).map(d => d.x)).toEqual(expectedTicks)
  });

  test('test ticks with negative lower bound', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[-100,100],range:[-100,100],scale:'log'})
    const scales = chart.scales;

    const expectedTicks = [-100,
    -39.79400086720375,
    -4.575749056067522,
    20.4119982655925,
    39.79400086720375,
    55.630250076728714,
    69.01960800285138,
    80.6179973983887,
    90.84850188786496,
    100,
    160.20599913279625,
    195.42425094393252,
    220.4119982655925,
    239.79400086720375,
    255.63025007672866,
    269.0196080028514,
    280.61799739838875,
    290.8485018878649,];
    expect(scales.y.y.ticks(10).map(d => d.x)).toEqual(expectedTicks)
  });

  test('test ticks with negative lower+upper bound', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[-100,-1],range:[0,100],scale:'log'})
    const scales = chart.scales;

    const expectedTicks = [];
    expect(scales.y.y.ticks(10).map(d => d.x)).toEqual(expectedTicks)
  });

  test('test ticks with parameter', () => {
    const chart = Chrt()
              .margins({top:0, bottom:0})
              .y({domain:[1,100],range:[0,100],scale:'log'})
    const scales = chart.scales;

    const expectedTicks = [47.712125471966246,
    45.154499349597174,
    42.25490200071284,
    38.90756251918218,
    34.948500216800944,
    30.10299956639812,
    23.856062735983123,
    15.05149978319906,
    0,
    97.71212547196623,
    95.15449934959717,
    92.25490200071285,
    88.90756251918218,
    84.94850021680094,
    80.10299956639813,
    73.85606273598312,
    65.05149978319906,
    50,
    147.71212547196623,
    145.1544993495972,
    142.25490200071283,
    138.90756251918216,
    134.94850021680094,
    130.10299956639813,
    123.85606273598313,
    115.05149978319906,
    100,];
    expect(scales.y.y.ticks(3).map(d => d.x)).toEqual(expectedTicks)
  });
});
