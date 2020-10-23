import { uuid, hasData } from '~/helpers';
export default function add(obj) {
  const id = uuid();
  // console.log('adding', obj.type, id);
  console.log('HERE!!!', obj.hasData(), obj.data())
  obj
    .id(id)
    .parent(this)
    .node(this.currentNode)
    .data(obj.hasData() ? obj.data() : this._orginalData, obj.accessor() || this._accessor)
    // .data.apply(
    //   COMPONENTS_W_DATA.indexOf(obj.type) === -1 ? null : obj,
    //   [obj.data() || this._orginalData, obj.accessor() || this._accessor]
    // )
    .render();
  this.objects.push(obj);

  //if (COMPONENTS_W_DATA.indexOf(obj.type) === -1) {
  if(hasData(obj) || obj.updater) {
    // // console.log('BECAUSE THE OBJ HAS DATA > UPDATE')
    return this.update();
  }

  return this;
}
