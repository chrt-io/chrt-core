import * as chrts from './charts/chrts';

function replaceIDWithMockId(str) {
  return str.replace(/\sid="[A-Za-z0-9\-]+"/gi, ' id="mockID"');
}

// testing SVG snapshots of all the visual tests
for (const key of Object.keys(chrts)) {
  test(`Test ${key} SVG`, async () => {
    const mockElement = document.createElement('div');
    const chart = await chrts[key](mockElement);

    const innerHTML = replaceIDWithMockId(chart.node().innerHTML);
    expect(innerHTML).toMatchSnapshot();
  });
}
