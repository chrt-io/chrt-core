import { isNull } from '~/helpers';

export default function setPadding(padding, saveOriginal = false) {
  if(isNull(padding)) {
    return this._padding;
  }
  const {top, bottom, left, right} = padding;
  this._padding.top = !isNull(top) ? top  : this._padding.top;
  this._padding.bottom = !isNull(bottom) ? bottom  : this._padding.bottom;
  this._padding.left = !isNull(left) ? left  : this._padding.left;
  this._padding.right = !isNull(right) ? right  : this._padding.right;

  if(saveOriginal) {
    this.originalPadding = this._padding;
  }

  return this.update();
}
