import { createSVG as create } from './create';
export default function svg (update = true) {
  let svgNode = this.root.querySelector('svg');
  if(!svgNode) {
    svgNode = create('svg')

    svgNode.setAttribute('preserveAspectRatio', 'none')
    svgNode.setAttribute('width', '100%')
    svgNode.setAttribute('height', '100%')
    // svgNode.style.overflow = 'visible';
    this.currentNode.appendChild(svgNode)
    // this.svg = svgNode;
  }

  let g = svgNode.querySelector('g:first-of-type');
  if(!g) {
    g = svgNode.appendChild(create('g'));
  }

  this.currentNode = g;
  if(update) {
    this.update();
  }

  return this;
}