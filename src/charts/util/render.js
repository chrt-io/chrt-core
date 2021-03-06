import { createSVG as create } from '../../layout';
import { hasData } from '~/helpers';

export default function render(parent) {
  // console.log('RENDER', this, parent)
  this.g = create('g');
  if(this._id) {
    this.g.setAttribute('id', this._id);
  }

  // console.log('RENDER', this, this.parentNode)

  if(hasData(this)) {
    // series
    // in case of group or stack we want the chart to be added to svg g of the group/stack
    if(parent) {
      // if it's a stack we want the order of the charts in the dom to be opposite, so the stroke
      // of the charts below is not covered by the area above
      if(parent.type === 'stack' || parent.group === 'group') {
          parent.g.prepend(this.g);
      } else {
        parent.g.append(this.g);
      }
    } else {
      this.currentNode.append(this.g);
    }

  } else {
  //   const grid = (this.parentNode.objects || []).slice().reverse().find(obj => obj.type === 'grid');
  //   if(grid && this.type === 'axis') {
  //       // // console.log('THIS IS AN',this.type,'AND THERE IS A GRID',grid,'INSERT BEFORE',grid.node(), grid.node().nextSibling)
  //       this.currentNode.insertBefore(this.g, grid.node().nextSibling);
  //   } else {
  //     // console.log('THIS IS A', this.type, 'PREPEND')
  //     this.currentNode.append(this.g);
  //   }
      this.currentNode.append(this.g);
  }

  this.update();
  return this.parentNode;
}
