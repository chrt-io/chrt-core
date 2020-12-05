import { data, node } from './util';
import {
  append,
  add,
  rollup,
  border,
  svg,
  size,
  setMargins,
  setPadding,
} from './layout';
import { scaleLinear, scaleLog } from './scales';
import { isNull, arraysEqual } from './helpers';

export function Chrt(_data = [], _node) {
  // // console.log('CHRT', _data);
  this.type = 'chrt';
  this._data = _data;
  this._orginalData = this._data;
  this.root = _node;
  this.currentNode = _node;

  this._accessor = (d, i) => ({
    x: !isNull(d) && Object.prototype.hasOwnProperty.call(d, 'x') ? d.x : i,
    y: isNull(d) ? null : Object.prototype.hasOwnProperty.call(d, 'y') ? d.y : d
  });

  this.width = 500; // default width
  this.height = 300; // default height

  this._margins = {
    top: 20,
    bottom: 20,
    left: 40,
    right: 20
  };
  this._padding = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  this.scales = {};
  this.objects = [];

  this.scaleLinear = (name, domain, range) => {
    const oldDomain = this.scales[name] ? this.scales[name].domain : [];
    const oldRange = this.scales[name] ? this.scales[name].range : [];
    scaleLinear.apply(this, [
      name,
      domain, // || (this._data.length ? domain : null), // [0, 10] -> this messes up with the later assignement of data
      range
    ]);
    if(
      !arraysEqual(oldDomain, this.scales[name].domain)
      ||
      !arraysEqual(oldRange, this.scales[name].range)
    ) {
        this.objects.forEach(obj => obj.update());
      }
    return this;
  };

  this.scaleLog = (name, domain, range, transformation = 'log10') => {
    const oldDomain = this.scales[name] ? this.scales[name].domain : [];
    const oldRange = this.scales[name] ? this.scales[name].range : [];
    scaleLog.apply(this, [
      name,
      this._data.length ? domain : [1, 10],
      range,
      transformation
    ]);
    if(
      !arraysEqual(oldDomain, this.scales[name].domain)
      ||
      !arraysEqual(oldRange, this.scales[name].range)
    ) {
        this.objects.forEach(obj => obj.update());
      }
    return this;
  };

  this.x = (domain, range, options = {}) => {
    const transformation = options
      ? options.transformation || 'linear'
      : 'linear';
    switch (transformation) {
      case 'log':
      case 'log10':
      case 'log2':
        return this.scaleLog.apply(
          this,
          ['x', domain, range || [0, this.width]],
          transformation
        );
      case 'linear':
      default:
        return this.scaleLinear.apply(this, [
          'x',
          domain,
          range || [0, this.width]
        ]);
    }
  };

  this.y = (domain, range, options = {}) => {
    const transformation = options
      ? options.transformation || 'linear'
      : 'linear';
    switch (transformation) {
      case 'log':
      case 'log10':
      case 'log2':
        return this.scaleLog.apply(
          this,
          ['y', domain, range || [this.height, 0]],
          transformation
        );
      case 'linear':
      default:
        return this.scaleLinear.apply(this, [
          'y',
          domain,
          range || [this.height, 0]
        ]);
    }
  };

  this.update = () => {
    this.x();
    this.y(
      null,
      null,
      this.scales.y ? { transformation: this.scales.y.getTransformation() } : {}
    );
    this.objects.forEach(obj => {
      obj.update()
    });
    return this;
  };

  this.getAxis = (name, orientation) => {
    return this.objects.find(obj => obj.type === 'axis' && obj.name === name && (!orientation || obj.orientation === orientation));
  }

  this.css = (prefix) => {
    if(!isNull(prefix) && typeof prefix !== 'string') {
      console.warn('CSS prefix should be a string. Setting main class name to \'chrt\'.');
      prefix = null;
    }
    this._css = `${prefix ? prefix.replace(/-$/,'') : ''}${prefix ? '-' : ''}chrt`;
    this.root.classList.add(this._css);
    return this;
  }
}

function chrt(data, node) {
  return new Chrt(data, node);
}

Chrt.prototype = chrt.prototype = {
  data,
  node,
  append,
  add,
  rollup,
  svg,
  border,
  size,
  setWidth: width => size(width),
  setHeight: height => size(null, height),
  margins: setMargins,
  padding: setPadding,
};

export default chrt;
