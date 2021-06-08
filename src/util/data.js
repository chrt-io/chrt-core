export default function(data, accessor) {
  // console.log('---------------> data', data, accessor, this);
  if (!data) {
    return this._data;
  }

  // data is passed
  this._orginalData = data;

  // // console.log('DATA', this, this._data, data);

  const defaultAccessorFunction = (d, i) => {
    if (typeof d !== 'object') {
      return {
        x: i,
        y: d
      };
    }
    return {
      x: d.x ?? i,
      y: d.y ?? d
    };
  };

  // define accessor function to map values
  const accessorFunction = accessor || this._accessor;
  this._accessor = accessorFunction ?? defaultAccessorFunction;
  this._data = data.map((d, i, arr) => {
    if (d instanceof Object) {
      return Object.assign({}, d, this._accessor(d, i, arr));
    }
    return this._accessor(d, i, arr);
  });

  // console.log('DATA', this._data)

  return this;
}
