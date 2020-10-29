import { uuid } from '~/helpers';
export default function add(obj, prepend = false) {
  const id = obj._id || uuid();
  // console.log('adding to', this, obj.type, id, obj);
  obj
    .id(id)
    .parent(this)
    // .render();

  if(prepend) {
    this.objects = [obj, ...this.objects];
  } else {
    this.objects.push(obj);
  }


  //return this.update();

  return this;
}
