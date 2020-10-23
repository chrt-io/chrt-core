// import { isNull } from '~/helpers';
import { add } from '../util';
import chrtGeneric from '../chrtGeneric';

function chrtGroup() {
  console.log('chrtGroup')

  chrtGeneric.call(this);
  this.type = 'group';

  this.add = (chart) => {
    console.log('chrtGroup','add',chart)
    add.call(this, chart);

    chart._groupIndex = this.objects.length - 1;
    this.objects.forEach(obj => obj._grouped = this.objects.length)

    return this;
  }

  this.draw = () => {
    this.objects.forEach(obj => {
      if(this.parentNode.objects.map(d => d._id).indexOf(obj._id) === -1) {
        this.parentNode.add(obj);
      }
      // console.log('--->', obj)
    })

    this.objects.forEach(obj => obj.draw())

    return this.parentNode;
  }
}

chrtGroup.prototype = Object.create(chrtGeneric.prototype);
chrtGroup.prototype.constructor = chrtGroup;
chrtGroup.parent = chrtGeneric.prototype;

chrtGroup.prototype = Object.assign(chrtGroup.prototype, {

});

export default chrtGroup;
