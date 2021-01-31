import { hasData, isNull } from '~/helpers';
import { accessor, render, update, curve, add, attr } from '../util';
import { data, node, parent } from '~/util';
import { linearInterpolation } from '~/curves';

export default function chrtGeneric() {
  // console.log('chrtGeneric', this)
  this._id = null;
  this.objects = [];
  this.fields = {
    x: null,
    y: null,
  };
  this.scales = {
    x: 'x',
    y: 'y',
  }
  this._classNames = [];

  this.interpolationFunction = linearInterpolation;

  // list of getter/setter function for custom attributes
  this.attrs = [];

  this.id = (id) => {
    // console.log('chrtGeneric.id', id, this._id);
    if(isNull(id)) {
      return this._id;
    }
    this._id = id || this._id;

    if(this.g) {
      this.g.setAttribute('id', this._id);
    }
    return this;
  }

  this.class = (className) => {
    console.log('adding className', className)
    if(isNull(className)) {
      return this._classNames;
    }
    const classNames = className.split(' ');
    this._classNames = [...this._classNames.filter(d => d !== className), ...classNames];

    if(this.g) {
      classNames.forEach(d => this.g.classList.add(d));
    }
    return this;
  }

  this.hasData = () => {
    return hasData(this);
  }

  this.draw = () => {
    return this.parentNode;
  }

  const setScale = (scale, scaleName) => {
    if(!isNull(scaleName)) {
      this.scales[scale] = scaleName;
    }
  }

  this.x = (scale = 'x') => {
    if(isNull(scale)) {
      return this.scales.x;
    }
    setScale('x', scale)
    return this;
  };
  this.y = (scale = 'y') => {
    if(isNull(scale)) {
      return this.scale.y;
    }
    setScale('y', scale)
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
