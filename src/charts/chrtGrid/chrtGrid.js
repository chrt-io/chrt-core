import { createSVG as create } from '~/layout';
import { TICKS_DEFAULT } from '~/constants';
import { isNull } from '~/helpers';
import lineWidth from './lib/lineWidth';
import lineColor from './lib/lineColor';
import lineStyle from './lib/lineStyle';
import minor from './lib/minor';
import chrtGeneric from '../chrtGeneric';

const DEFAULT_LINE_WIDTH = 1;
const DEAULT_LINE_COLOR = '#000';

function chrtGrid(name, ticksNumber = TICKS_DEFAULT) {
  chrtGeneric.call(this);

  // ticksNumber *= 2;

  console.log('GRID', name, ticksNumber);

  this.strokeWidth = DEFAULT_LINE_WIDTH;
  this.stroke = DEAULT_LINE_COLOR;
  this.showMinorTicks = false;

  const verticalGridLine = (gridLine, position, y1, y2, visible = true) => {
    gridLine.style.display = visible ? 'block' : 'none';
    gridLine.setAttribute('x1', position);
    gridLine.setAttribute('x2', position);
    gridLine.setAttribute('y1', y1);
    gridLine.setAttribute('y2', y2);
  };

  const horizontalGridLine = (gridLine, position, x1, x2, visible = true) => {
    gridLine.style.display = visible ? 'block' : 'none';
    gridLine.setAttribute('x1', x1);
    gridLine.setAttribute('x2', x2);
    gridLine.setAttribute('y1', position);
    gridLine.setAttribute('y2', position);
  };

  this.draw = () => {
    if (!this.parentNode.scales[name]) {
      return;
    }

    const { _margins, width, height } = this.parentNode;

    const ticks = this.parentNode.scales[name].ticks(
      //ticksNumber * (this.showMinorTicks ? 2 : 1)
      ticksNumber * 2
    );
    console.log('got this ticks', name, ticksNumber, ticks);

    this.g.querySelectorAll('line').forEach(gridLine => gridLine.setAttribute('toBeHidden', true));

    ticks.forEach((tick) => {
      let gridLine = this.g.querySelector(
        `[data-id='gridLine-${name}-${tick.value}']`
      );
      if (!gridLine) {
        gridLine = create('line');
        gridLine.setAttribute('data-id', `gridLine-${name}-${tick.value}`);

        if (tick.isMinor) {
          gridLine.classList.add('tick-minor');
        }

        this.g.appendChild(gridLine);
      }

      gridLine.setAttribute('stroke', this.stroke);
      gridLine.setAttribute('stroke-width', this.strokeWidth);
      if(!isNull(this.strokeStyle)) {
        gridLine.setAttribute('stroke-dasharray', this.strokeStyle);
      }
      gridLine.removeAttribute('toBeHidden');

      const position = this.parentNode.scales[name](tick.value);

      if (name === 'x') {
        const isLog = this.parentNode.scales[name].isLog();
        const visible =
          this.showMinorTicks || (!isLog && !tick.isMinor) || (isLog && !tick.isMinor); // TODO: improve this check
        verticalGridLine(
          gridLine,
          position,
          height - _margins.bottom,
          _margins.top,
          visible
        );
      }
      if (name === 'y') {
        const isLog = this.parentNode.scales[name].isLog();
        const visible =
          this.showMinorTicks || (!isLog && !tick.isMinor) || (isLog && !tick.isMinor); // TODO: improve this check
        horizontalGridLine(
          gridLine,
          position,
          _margins.left,
          width - _margins.right,
          visible
        );
      }
    });
    this.g.querySelectorAll('line[toBeHidden=true]').forEach(gridLine => gridLine.remove());
    return this.parentNode;
  };

  this.dashed = () => lineStyle.call(this, 'dashed');
  this.dotted = () => lineStyle.call(this, 'dotted');
}

chrtGrid.prototype = Object.create(chrtGeneric.prototype);
chrtGrid.prototype.constructor = chrtGrid;
chrtGrid.parent = chrtGeneric.prototype;

chrtGrid.prototype = Object.assign(chrtGrid.prototype, {
  width: lineWidth,
  color: lineColor,
  minor,
});

export default chrtGrid;
