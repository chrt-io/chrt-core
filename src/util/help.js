function args(func) {
    return (func + '')
      .replace(/[/][/].*$/mg,'') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .split(',').filter(Boolean); // split & filter [""]
}

function getMethods(obj) {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.entries()].filter(item => typeof obj[item[0]] === 'function')
}

export default function (obj) {
  console.log('HELP')
  const funcs = getMethods(obj);
  console.log(funcs)
  funcs.forEach(func => {
    const functionArgs = args(obj[func[0]]);
    console.log(func[0], functionArgs);
  })
  console.log('####')
}
