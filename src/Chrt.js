import { data, node, help } from './util';
import {
  append,
  add,
  rollup,
  border,
  svg,
  size,
  setMargins,
  setPadding,
  create
} from './layout';
import { scaleLinear, scaleLog, scaleOrdinal, scaleTime } from './scales';
import { isNull, arraysEqual } from './helpers';

export function Chrt(_data = [], _node = create('div')) {
  // console.log('Chrt', _data);
  this.type = 'chrt';
  this._data = _data;
  this._orginalData = this._data;
  this.root = _node;
  this.currentNode = _node;

  this._accessor = null;
  // (d, i) => ({
  //   x: !isNull(d) && Object.prototype.hasOwnProperty.call(d, 'x') ? d.x : i,
  //   y: isNull(d) ? null : Object.prototype.hasOwnProperty.call(d, 'y') ? d.y : d
  // });

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
  this.scales = {
    x: {},
    y: {}
  };
  this.objects = [];

  const _scaleLinear = (name, type, domain, range, field) => {
    // console.log('----> _scaleLinear name:',name,'type:',type,domain,range,field)
    // console.log('this.scales', this.scales)
    const _scale = this.scales[type][name];
    const oldDomain = _scale ? _scale.domain : [];
    const oldRange = _scale ? _scale.range : [];
    scaleLinear.apply(this, [
      name,
      type,
      domain, // || (this._data.length ? domain : null), // [0, 10] -> this messes up with the later assignement of data
      range,
      field
    ]);
    if (
      !isNull(_scale) &&
      (!arraysEqual(oldDomain, _scale.domain) ||
        !arraysEqual(oldRange, _scale.range))
    ) {
      this.objects.forEach(obj => obj.update());
    }
    return this;
  };

  const _scaleLog = (
    name,
    type,
    domain,
    range,
    field,
    transformation = 'log10'
  ) => {
    // console.log('scaleLog', name, type, domain, range, 'field:', field, transformation)

    const _scale = this.scales[type][name];
    const oldDomain = _scale ? _scale.domain : [];
    const oldRange = _scale ? _scale.range : [];
    scaleLog.apply(this, [
      name,
      type,
      // (domain || this._data.length) ? domain : [1, 10],
      domain,
      range,
      field,
      transformation
    ]);

    if (
      !isNull(_scale) &&
      (!arraysEqual(oldDomain, _scale.domain) ||
        !arraysEqual(oldRange, _scale.range))
    ) {
      this.objects.forEach(obj => obj.update());
    }
    return this;
  };

  const _scaleOrdinal = (name, type, domain, range, field) => {
    // console.log('scaleOrdinal', name, type, domain, range, 'field:', field)
    const _scale = this.scales[type][name];
    const oldDomain = _scale ? _scale.domain : [];
    const oldRange = _scale ? _scale.range : [];
    scaleOrdinal.apply(this, [
      name,
      type,
      this._data.length ? domain : [],
      range,
      field
    ]);
    // console.log('----->', this.scales)
    if (
      !isNull(_scale) &&
      (!arraysEqual(oldDomain, _scale.domain) ||
        !arraysEqual(oldRange, _scale.range))
    ) {
      this.objects.forEach(obj => obj.update());
    }
    return this;
  };

  const _scaleTime = (name, type, domain, range, field) => {
    // console.log('scaleTime', name, type, domain, range, 'field:', field)
    const _scale = this.scales[type][name];
    const oldDomain = _scale ? _scale.domain : [];
    const oldRange = _scale ? _scale.range : [];
    scaleTime.apply(this, [name, type, domain || [], range, field]);
    // console.log('----->', this.scales)
    if (
      !isNull(_scale) &&
      (!arraysEqual(oldDomain, _scale.domain) ||
        !arraysEqual(oldRange, _scale.range))
    ) {
      this.objects.forEach(obj => obj.update());
    }
    return this;
  };

  function isObject(value) {
    const prototype = Object.prototype.toString.call(value);
    return prototype === '[object Object]';
  }

  //this.x = (domain, range, options = {}) => {
  this.x = (...args) => {
    if (args.length === 1 && isObject(args[0])) {
      args = [args[0].domain, args[0].range, args[0].options || args[0]];
    }

    const [domain, range, options = {}] = args || [];

    const transformation = options ? options.scale || 'linear' : 'linear';
    switch (transformation) {
      case 'log':
      case 'log10':
      case 'log2':
        return _scaleLog(
          options.name || 'x',
          'x',
          domain,
          range || [0, this.width],
          options.field || 'x',
          transformation
        );
      case 'time':
        // console.log('this.x','time', domain, options.name,options.field)
        return _scaleTime.apply(this, [
          options.name || 'x',
          'x',
          domain,
          range || [0, this.width],
          options.field || 'x'
        ]);
      case 'ordinal':
        //console.log('this.x','ordinal', domain, options.name,options.field)
        return _scaleOrdinal.apply(this, [
          options.name || 'x',
          'x',
          domain,
          range || [0, this.width],
          options.field || 'x'
        ]);
      case 'linear':
      default:
        return _scaleLinear.apply(this, [
          options.name || 'x',
          'x',
          domain,
          range || [0, this.width],
          options.field || 'x'
        ]);
    }
  };

  // this.y = (domain, range, options = {}) => {
  this.y = (...args) => {
    if (args.length === 1 && isObject(args[0])) {
      args = [args[0].domain, args[0].range, args[0].options || args[0]];
    }

    const [domain, range, options = {}] = args || [];

    const transformation = options ? options.scale || 'linear' : 'linear';
    switch (transformation) {
      case 'log':
      case 'log10':
      case 'log2':
        return _scaleLog(
          options.name || 'y',
          'y',
          domain,
          range || [this.height, 0],
          options.field || 'y',
          transformation
        );
      case 'time':
        // console.log('this.x','time', domain, options.name,options.field)
        return _scaleTime.apply(this, [
          options.name || 'y',
          'y',
          domain,
          range || [this.height, 0],
          options.field || 'y'
        ]);
      case 'ordinal':
        // console.log('this.y','ordinal', domain, options.name,options.field)
        return _scaleOrdinal.apply(this, [
          options.name || 'y',
          'y',
          domain,
          range || [this.height, 0],
          options.field || 'y'
        ]);
      case 'linear':
      default:
        return _scaleLinear.apply(this, [
          options.name || 'y',
          'y',
          domain,
          range || [this.height, 0],
          options.field || 'y'
        ]);
    }
  };

  this.update = () => {
    if (this.autoWidth || this.autoHeight) {
      this.size(
        this.autoWidth || this.width,
        this.autoHeight || this.height,
        false
      );
    }
    if (!Object.values(this.scales.x).length) {
      // console.log('no scales x -> create a default linear scale')
      this.x({ range: [0, this.width] });
    } else {
      Object.values(this.scales.x).forEach(scale => {
        // console.log('scale x exists:', scale.getName(), scale.getType(), scale.transformation)
        this.x({
          domain: scale.fixedDomain,
          range: [0, this.width],
          options: {
            name: scale.getName(),
            type: scale.getType(),
            field: scale.field,
            scale: scale.transformation
          }
        });
      });
    }
    if (!Object.values(this.scales.y).length) {
      this.y({ range: [this.height, 0] });
    } else {
      Object.values(this.scales.y).forEach(scale => {
        this.y({
          domain: scale.fixedDomain,
          range: [this.height, 0],
          options: {
            name: scale.getName(),
            type: scale.getType(),
            field: scale.field,
            scale: scale.transformation
          }
        });
      });
    }

    this.objects.forEach(obj => {
      obj.update();
    });
    return this;
  };

  this.getAxis = (name, orientation) => {
    return this.objects.find(
      obj =>
        obj.type === 'axis' &&
        obj.name === name &&
        (!orientation || obj.orientation === orientation)
    );
  };

  this.help = obj => {
    help(obj ?? this);
  };

  this.class = prefix => {
    if (!isNull(prefix) && typeof prefix !== 'string') {
      console.warn(
        "CSS prefix should be a string. Setting main class name to 'chrt'."
      );
      prefix = null;
    }
    this._css = `${prefix ? prefix.replace(/-$/, '') : ''}${
      prefix ? '-' : ''
    }chrt`;
    this.root.classList.add(this._css);
    return this;
  };

  this.css = this.class;

  // this sets size and svg with default size
  size.apply(this, [this.width, this.height]).svg();
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
  padding: setPadding
};

export default chrt;
