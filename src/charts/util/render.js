import { createSVG as create } from '../../layout';
import { hasData } from '~/helpers';

export default function render() {
  // console.log('RENDER', this)
  this.g = create('g');
  if(this._id) {
    this.g.setAttribute('id', this._id);
  }

  // console.log('RENDER', this, this.parentNode)

  if(hasData(this)) {
    // series
    // console.log('THIS IS A SERIES', 'APPEND')
    this.currentNode.append(this.g);
  } else {
    const grid = (this.parentNode.objects || []).slice().reverse().find(obj => obj.type === 'grid');
    if(grid && this.type === 'axis') {
        // // console.log('THIS IS AN',this.type,'AND THERE IS A GRID',grid,'INSERT BEFORE',grid.node(), grid.node().nextSibling)
        this.currentNode.insertBefore(this.g, grid.node().nextSibling);
    } else {
      // console.log('THIS IS A', this.type, 'PREPEND')
      this.currentNode.append(this.g);
    }

  }
  this.update();
  return this.parentNode;
}
