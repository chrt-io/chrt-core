# chrt-core
Opinionated charts

** WORK IN PROGRESS ** Please come back in few months after we will announce the first beta version. For more info mail to sayhi@chrt.io

## How to build

###  Install the dependencies
```
npm install
```

###  Build the package
```
npm build
```
### Developing
If you want to develop and see the changes reloaded live into another app you can use the watch script
```
npm run watch
```

## Use it as a module

### Method 1 - tgz package

#### Use the tgz provided in the repository
You can use the `chrt-VERSION.tgz` package. The following commands will expand the chrt module in the `node_modules` folder of your project. Ready to be used with the usual `import` command:
```
cp chrt-VERSION.tgz SOMEWHERE
cd myproject
npm install SOMEWHERE/chrt-VERSION.tgz
```

#### Create a tgz npm package
You can create a package for testing with
```
npm pack
```
This command will create a file called `chrt-VERSION.tgz` in the root folder of chrt.

### Method 2 - symlinked package

####  Create a global node module
```
npm link
```
This creates `chrt` module inside your global `node_modules` so that you can import it with `import Chrt from 'chrt'`

####  Use the module in a different app
```
npm link chrt
```
This will create a sym link to the module created in your global.

## Use it in your code
After having installed or sym-linked the node you can use it as usual
```
import Chrt, {chrtPoints, chrtLine} from 'chrt';
```



## Testing

### Unit test with Jest
Run `npm run test` to run all the tests on the code with Jest.
```
npm run test
```

To run only one test:
```
npx jest test/scales/scaleLinear.test.js
```
