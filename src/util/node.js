/**
 * node - Returns the DOM element that contains a chart element
 *
 * @param {type} node Set this as root node
 *
 * @return {type} Description
 */
export default function (node) {
  if (!node) {
    return this.g || this.root;
  }

  node.appendChild(this.root)
  // this.currentNode = this.root;
  this.root = node;

  return this;
}
