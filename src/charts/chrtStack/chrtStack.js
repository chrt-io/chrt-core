import { isNull } from '~/helpers';
import { add } from '../util';
import chrtGeneric from '../chrtGeneric';

function chrtStack() {
  //console.log('chrtStack')

  chrtGeneric.call(this);
  this.type = 'stack';
  this._grouped = 1;
  this._groupIndex = 0;
  this._orientation = 'bottom';

  this._dataMap = {
    x: {},
    y: {},
  };

  this.orientation = (orientation) => {
    if(isNull(orientation)) {
      return this._orientation;
    }
    const orientations = ['bottom', 'left'];
    this._orientation = orientations.indexOf(orientation) > -1 ? orientation : this._orientation;

    return this;
  }

  this.add = (chart) => {
    // console.log('chrtStack','add',chart, chart._area)
    chart._stacked = this;
    add.call(this, chart);
    // console.log('add', this.parentNode)

    const dataFunction = chart.data;
    chart.data = (data, accessor) => {
      // console.log('chrtStack','data!', this._dataMap)
      if(!isNull(data)) {
          data = data.map(d => {
            if(!this._dataMap.x[d.x]) {
              this._dataMap.x[d.x] = {
                x: d.x,
                values: [],
              }
            }
            this._dataMap.x[d.x].values.push(d);
            const y0 = !isNull(this._dataMap.x[d.x].y0) ? this._dataMap.x[d.x].y0 : null;
            this._dataMap.x[d.x].y0 = this._orientation !== 'bottom' ? null : (y0 || 0) + d.y;

            if(!this._dataMap.y[d.y]) {
              this._dataMap.y[d.y] = {
                y: d.y,
                values: [],
              }
            }
            this._dataMap.y[d.y].values.push(d);
            const x0 = !isNull(this._dataMap.y[d.y].x0) ? this._dataMap.y[d.y].x0 : null;
            this._dataMap.y[d.y].x0 = this._orientation !== 'left' ? null : (x0 || 0) + d.x;



            return Object.assign({}, d, { stacked_y: (y0 || 0) + d.y, y0, stacked_x: (x0 || 0) + d.x, x0})
          })
      }
      // console.log('CALLING DATA ON',chart,'WITH', data)
      return dataFunction.call(chart, data, accessor);
    }



    return this;
  }

  this.draw = () => {
    // console.log('chrtStack', 'draw', this.objects);
    const parentNode = this.parentNode.type === 'group' ? this.parentNode.parentNode : this.parentNode;
    this.objects.forEach(obj => {
      if(parentNode.objects.map(d => d._id).indexOf(obj._id) === -1) {
        parentNode.add(obj);
      }
      // console.log('--->', obj)
    })

    this.objects.forEach(obj => obj.draw())

    return parentNode;
  }
}

chrtStack.prototype = Object.create(chrtGeneric.prototype);
chrtStack.prototype.constructor = chrtStack;
chrtStack.parent = chrtGeneric.prototype;

chrtStack.prototype = Object.assign(chrtStack.prototype, {

});

export default function() {
  return new chrtStack();
}
