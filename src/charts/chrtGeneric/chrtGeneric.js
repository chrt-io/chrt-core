import { hasData, isNull } from '~/helpers';
import { accessor, render, update, curve, add, attr } from '../util';
import { data, node, parent } from '~/util';
import { linearInterpolation } from '~/curves';

export default function chrtGeneric() {
  // console.log('chrtGeneric', this)
  this._id = null;
  this.objects = [];
  this.fields = {
    x: 'x',
    y: 'y',
  };
  this.interpolationFunction = linearInterpolation;

  // list of getter/setter function for custom attributes
  this.attrs = [];

  this.id = (id) => {
    // console.log('chrtGeneric.id', id, this._id);
    if(isNull(id)) {
      return this._id;
    }
    this._id = this._id || id;

    if(this.g) {
      this.g.setAttribute('id', this._id);
    }


    return this;
  }

  this.hasData = () => {
    return hasData(this);
  }

  this.draw = () => {
    return this.parentNode;
  }

  const setField = (field, value) => {
    if(!isNull(value)) {
      this.fields[field] = value;
      // TODO: verify if this is necessary -> maybe not
      // this._accessor = (d) => {
      //   return {
      //     x: d[this.fields.x],
      //     y: d[this.fields.y],
      //   }
      // };
    }
  }

  this.x = (value) => {
    if(isNull(value)) {
      return this.fields.x;
    }
    setField('x', value)
    return this;
  };
  this.y = (value) => {
    if(isNull(value)) {
      return this.fields.y;
    }
    setField('y', value);
    return this;
  }

  return this;
}

function chrt() {
  return new chrtGeneric();
}

chrtGeneric.prototype = chrt.prototype = {
  node,
  data,
  add,
  parent,
  accessor,
  render,
  update,
  curve,
  attr,
};
