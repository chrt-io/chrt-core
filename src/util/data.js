import {hasData} from '~/helpers';

export default function (data, accessor) {
  console.log('---------------> data', data, accessor, this);
  if (!data) {
    return hasData(this) ? this._data : this;
  }
  // TODO: not sure what this is doing...
  if(!hasData(this)) {
    return this;
  }
  // // console.log('chrt or series', this.type)
  // passing only accessor to inherit/reuse data
  if(typeof arguments[0] === 'function') {
    // // console.log('ACCESSOR FUNCTION')
    this._accessor = arguments[0];
    return this;
  }
  // // console.log('DATA', this, this._data, data);
  // data is passed
  this._orginalData = data;


  // define accessor function to map values
  const accessorFunction = accessor || this._accessor;
  this._accessor = accessorFunction;
  this._data = accessorFunction ? data.map((d, i, arr) => {
    if(d instanceof Object) {
      return Object.assign({}, d, accessorFunction(d, i, arr));
    }
    return accessorFunction(d, i, arr);
  }) : data;

  console.log('DATA', this._data)

  return this;
}
