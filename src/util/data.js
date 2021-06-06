export default function (data, accessor) {
  // console.log('---------------> data', data, accessor, this);
  if (!data) {
    return this._data;
  }

  // data is passed
  this._orginalData = data;

  // // console.log('DATA', this, this._data, data);



  // define accessor function to map values
  const accessorFunction = accessor || this._accessor;
  this._accessor = accessorFunction;
  this._data = accessorFunction ? data.map((d, i, arr) => {
    if(d instanceof Object) {
      return Object.assign({}, d, accessorFunction(d, i, arr));
    }
    return accessorFunction(d, i, arr);
  }) : data;

  // console.log('DATA', this._data)

  return this;
}
