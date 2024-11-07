# chrt-core

The core module of the chrt framework. It provides the foundation for creating charts, managing data, and coordinating different visualization components. This module is required for all chrt visualizations.

### Observable Examples and Documentation:

- [Introducing Chrt - Observable](https://observablehq.com/@chrt/introducing-chrt?collection=@chrt/chrt)

## Installing

```bash
npm install chrt-core
```

## Basic Usage

```js
import Chrt from "chrt-core";

// Create a basic chart
const chart = Chrt()
  .node(document.querySelector("#chart")) // set container
  .size(600, 400) // set dimensions
  .data([1, 2, 3, 4, 5]) // add data
  .add(chrt.line()); // add components
```

## API Reference

### Chart Creation and Container

#### `Chrt([data[, container]])`

Creates a new chart instance.

```js
// Empty chart
const chart = Chrt();

// Chart with data
const chart = Chrt([1, 2, 3, 4, 5]);

// Chart with data and container
const chart = Chrt([1, 2, 3, 4, 5], document.querySelector("#chart"));
```

#### `.node([element])`

Sets or gets the DOM container for the chart.

```js
// Set container
chart.node(document.querySelector("#chart"));

// Get current container
const container = chart.node();
```

### Dimensions and Layout

#### `.size([width[, height]])`

Sets the dimensions of the chart.

```js
// Fixed size
chart.size(600, 400);

// Auto size (fits container)
chart.size("auto", "auto");
```

#### `.margins([values])`

Sets the margins around the chart area.

```js
chart.margins({
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
});
```

#### `.padding([values])`

Sets the padding within the chart area.

```js
chart.padding({
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
});
```

### Data Management

#### `.data([data[, accessor]])`

Sets or gets the chart's data.

```js
// Set simple array
chart.data([1, 2, 3, 4, 5]);

// Set object array with accessor
chart.data(data, (d) => ({
  x: d.date,
  y: d.value,
}));
```

### Scales

#### `.x([options])` / `.y([options])`

Configures the x and y scales.

```js
// Linear scale (default)
chart.x({ scale: "linear" });

// Log scale
chart.y({ scale: "log" });

// Time scale
chart.x({
  scale: "time",
  domain: [new Date(2020, 0, 1), new Date(2021, 0, 1)],
});

// Ordinal scale
chart.x({
  scale: "ordinal",
  domain: ["A", "B", "C"],
});
```

### Components

#### `.add(component)` / `.snap(component)`

Adds a visualization component to the chart. Both methods are aliases.

```js
// Add multiple components
chart.add(chrt.xAxis()).add(chrt.yAxis()).add(chrt.line());
```

### Examples

#### Basic Line Chart

```js
Chrt()
  .node(container)
  .size(600, 400)
  .data([
    { date: "2021-01", value: 10 },
    { date: "2021-02", value: 20 },
    { date: "2021-03", value: 15 },
  ])
  .x({ scale: "time" })
  .y({ scale: "linear" })
  .add(chrt.xAxis())
  .add(chrt.yAxis())
  .add(chrt.line());
```

#### Multiple Scales

```js
Chrt()
  .size(600, 400)
  .x({ scale: "linear" })
  .y({ name: "primary", scale: "linear" })
  .y({ name: "secondary", scale: "log" })
  .add(chrt.xAxis())
  .add(chrt.yAxis())
  .add(chrt.yAxis("secondary").orient("right"))
  .add(chrt.line().data(data1).y("primary"))
  .add(chrt.line().data(data2).y("secondary"));
```

#### Auto-updating Chart

```js
const chart = Chrt().size(600, 400).add(chrt.line());

// Update data and redraw
function updateChart(newData) {
  chart.data(newData).update();
}
```
