import { isNull } from '~/helpers';
import { add } from '../util';
import chrtGeneric from '../chrtGeneric';

function chrtStack() {
  console.log('chrtStack')

  chrtGeneric.call(this);
  this.type = 'stack';

  this._data = {};

  this.add = (chart) => {
    console.log('chrtStack','add',chart)
    chart._stacked = true;
    add.call(this, chart);
    console.log('add', this.parentNode)

    const dataFunction = chart.data;
    chart.data = (data, accessor) => {
      console.log('chrtStack','data!', this._data)
      if(!isNull(data)) {
          data = data.map(d => {
            if(!this._data[d.x]) {
              this._data[d.x] = {
                x: d.x,
                values: [],
              }
            }
            this._data[d.x].values.push(d);
            const y0 = !isNull(this._data[d.x].y0) ? this._data[d.x].y0 : 0;
            this._data[d.x].y0 = y0 + d.y;
            console.log(this._data[d.x].y0,'->', y0,'+', d.y)
            return Object.assign({}, d, { stacked_y: y0 + d.y, y0 })
          })
      }
      console.log('CALLING DATA ON',chart,'WITH', data)
      return dataFunction.call(chart, data, accessor);
    }



    return this;
  }

  this.draw = () => {
    console.log('chrtStack', 'draw', this.objects);

    this.objects.forEach(obj => {
      if(this.parentNode.objects.map(d => d._id).indexOf(obj._id) === -1) {
        this.parentNode.add(obj);
      }
      console.log('--->', obj)
    })

    this.objects.forEach(obj => obj.draw())

    return this.parentNode;
  }
}

chrtStack.prototype = Object.create(chrtGeneric.prototype);
chrtStack.prototype.constructor = chrtStack;
chrtStack.parent = chrtGeneric.prototype;

chrtStack.prototype = Object.assign(chrtStack.prototype, {

});

export default chrtStack;
