import {DEFAULT_WIDTH, DEFAULT_HEIGHT} from '~/constants';

export default function size(...dimensions) {
  if(!dimensions.length) {
    return {
      width: this.width,
      height: this.height
    }
  }
  const [width, height] = dimensions;
  const oldWidth = this.width;
  const oldHeight = this.height;

  this.width = width || oldWidth || DEFAULT_WIDTH;
  this.height = height || oldHeight || DEFAULT_HEIGHT;

  let svg = this.root.querySelector('svg');
  if(!svg) {
    this.svg(false);
  }

  svg = this.root.querySelector('svg');
  svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
  svg.parentNode.style.width = `${this.width}px`;
  svg.parentNode.style.height = `${this.height}px`;



  // if(!oldWidth || !oldHeight || oldWidth !== width || oldHeight !== height) {
    return this.update();
  //}
  //return this;
}
