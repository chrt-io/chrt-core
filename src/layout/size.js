import {DEFAULT_WIDTH, DEFAULT_HEIGHT} from '../constants';

export default function size(...dimensions) {
  if(!dimensions.length) {
    return {
      width: this.width,
      height: this.height
    }
  }
  // console.log('size', dimensions)
  const [width, height, update = true] = dimensions;

  const oldWidth = this.width;
  const oldHeight = this.height;

  this.width = (width !== 'auto' ? width : null) || oldWidth || DEFAULT_WIDTH;
  this.height = (height !== 'auto' ? height : null) || oldHeight || DEFAULT_HEIGHT;

  this.autoWidth = null;
  if(width === 'auto') {
    this.autoWidth = 'auto';
    this.width = this.root.parentElement?.clientWidth ?? this.width;
  }
  this.autoHeight = null;
  if(height === 'auto') {
    this.autoHeight = 'auto';
    this.height = this.root.parentElement?.clientHeight ?? this.height;
  }

  let svg = this.root.querySelector('svg');
  if(!svg) {
    this.svg(false);
  }

  svg = this.root.querySelector('svg');
  svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
  svg.parentNode.style.width = `${this.width}px`;
  svg.parentNode.style.height = `${this.height}px`;



  // if(!oldWidth || !oldHeight || oldWidth !== width || oldHeight !== height) {
  if(update) {
    return this.update();
  }
  //return this;
}
