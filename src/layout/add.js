import { uuid, hasData } from '~/helpers';
export default function add(obj) {
  //console.log('LAYOUT ADD', obj)
  const id = uuid();
  // console.log('adding', obj.type, id);
  // console.log('HERE!!!', obj.hasData(), obj.data())

  // console.log('CALLING DATA on', obj)
  // console.log('DATA', obj.hasData() ? obj.data() : this._orginalData)
  // console.log('ACCESSOR', obj.accessor() || this._accessor)

  const data = obj.hasData() ? obj.data() : this._orginalData;
  //data = data.length ? data : this._orginalData
  obj
    .id(id)
    .parent(this)
    .node(this.currentNode)
    .data(data  || this._orginalData)
    //.data(obj.hasData() ? obj.data() : this._orginalData, obj.accessor() || this._accessor)
    .render(obj._stacked || obj._group);
  this.objects.push(obj);

  // TODO: verify if the obj.updater condition is needed

  //if(hasData(obj) || obj.updater) {
  if(hasData(obj)) {
    // // console.log('BECAUSE THE OBJ HAS DATA > UPDATE')
    return this.update();
  }

  return this;
}
