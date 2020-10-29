import { isNull } from '~/helpers';
import { add } from '../util';
import chrtGeneric from '../chrtGeneric';

function chrtStack() {
  //console.log('chrtStack')

  chrtGeneric.call(this);
  this.type = 'stack';
  this._grouped = 1;
  this._groupIndex = 0;

  this._dataMap = {};

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
            if(!this._dataMap[d.x]) {
              this._dataMap[d.x] = {
                x: d.x,
                values: [],
              }
            }
            this._dataMap[d.x].values.push(d);
            const y0 = !isNull(this._dataMap[d.x].y0) ? this._dataMap[d.x].y0 : 0;
            this._dataMap[d.x].y0 = y0 + d.y;
            // console.log(this._dataMap[d.x].y0,'->', y0,'+', d.y)
            return Object.assign({}, d, { stacked_y: y0 + d.y, y0 })
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

export default chrtStack;
