---
title: es moudle与commonJS
---
参考链接

+ [阮一峰Module](https://www.bookstack.cn/read/es6-3rd/docs-module.md)、[二者区别](https://juejin.cn/post/6844904067651600391)、[进阶](https://juejin.cn/post/6994224541312483336)

###  ES Moudle 和Common JS区别

如果没怎么写过node的话，Common Js 可能就没怎么接触过，这里就先简单介绍一下Common Js的用法。

我们先明白如下概念

>Node中每个模块都有一个module对象， module对象中的有一个exports属性为一个接口对象， 我们需要把模块之间公共的方法或属性挂载在这个接口对象中， 方便其他的模块使用这些公共的方法或属性。
>
>Node中每个模块的最后， 都会return: module.exports。
>
>Node中每个模块都会把module.exports指向的对象赋值给一个变量exports， 也就是说： exports = module.exports。
>
>module.exports = XXX， 表示当前模块导出一个单一成员， 结果就是XXX。

直接看代码

```js
// m1.js
let m1 = 0;
let m2 = 1;

exports.m1 = m1;
exports.m2 = m2;

// index.js
const m = require('./m1.js')
console.log(m)  // {m1: 0, m2: 1}

// 如果不想导出一个对象 就想导出一个值呢？

// m2.js
let m1 = 0;
module.exports = m1;

// index.js
const m = require('./m2.js')
console.log(m)  // 0


思考: 如果在 m2.js 中写 exports = m1， 那么index.js的log输出是什么

```

是{} 所以 我们知道 **使用module.exports可以给导出对象整个赋值，而exports只能给单个属性赋值**，所以就是刚刚提到的，exports其实是对module.exports的引用，我们require的是module.exports的值，而给exports直接赋值的话就切断了他们的引用关系。

那么 对于CommonJs， 我们是不是可以这么理解:

> m1.js, m2.js都是一个函数，我们通过require这个签名调用他们，exports就是他们的返回值。

这么理解的话，下面Common Js的一些运行机制就容易理解了

- CommonJS模块输出的是一个值的浅拷贝，ES6 模块输出的是值的引用；
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJs输出的值会被缓存，也就是每个模块都只会被执行一次（这一点同import），这也是为什么会是浅拷贝的原因

我们先不看后半部分，还没讲到。

先看第一点，CommonJS模块输出的是一个值的拷贝，换句话说就是，一旦输出了某个值，如果模块内部后续的变化，影响不了外部对这个值的使用。具体例子：

```js
// m3.js
let counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// index.js
let mod = require('./m3');
console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

这样看可能难理解，那我们用刚刚说的，我们使用函数的思维来理解

```js
let count = 3;
function incCounter() {
  count++
}

function Myrequire() {
  return {
    count,
    incCounter
  }
}

let mod = Myrequire()
console.log(mod.count); // 3
mod.incCounter();
console.log(mod.count); // 3
```

第二点运行时加载，这个直接看代码就懂了

```js
// m.js
let m = 0;
module.exports = m

// index.js
for (let i = 0; i < 3; ++i) {
  let m 
  if (i == 1) m = require('./3')
  console.log(m)
}
// undefined 0 undefined
```

简单的提下ESM，export导出值，但import的name要和export一致，所以可以用export default，import的时候可以重命名

import的值如果是简单变量，重新赋值会报错，因为是只读的，如果是引入一个对象的话就是可以改变这个对象的成员变量，因为import是对这个值的引用。

然后 import() 动态加载，可以达到和require差不多的效果。 不过require是同步的（这也是不在浏览器环境中使用commonJS的原因，同步就代表代码需要加载完整个模块才能继续执行），import()是异步的。import.meta 获取一些源信息，比如env啊，URL啊之类的，Vi te等还提供了glod这样的批量导入的功能。

**注意⚠️： ESM中，在一个模块中对导出的变量进行修改，都会影响到其他模块中对同一变量的对引用（cj会影响到，因为直接是浅拷贝），ESM会将模块导出的值包裹在一个只读的代理对象中，这个代理对象每次被导入都会被重新创建，从而确保每个模块都有自己的导出值**

就是，ESM中，模块的导入和导出是静态的，有利于词法分析，但在加载和执行是动态的。

导入导出关系在编译时静态确定，运行到导入模块语句时再动态加载执行

### 循环依赖

就是a加载了b而b又加载了a，二者的处理方式不同，所以结果会不同

commonJs之前说过，同步+加载时执行（require还会缓存，比如require了a和b，然后a中也require也require了b，那b其实只会执行1次），所以是**输出的是当前已经执行那部分的值，而不是代码全部执行后的值**，所以可能会导致导出的值不是一个完整的对象。

ESM会先创建一个未完成的模块对象，将其缓存，然后所有的模块都执行完成后再回到初始模块完成构建，确保导出的值时完整的，

### 总结

+ 因为**CommonJS**的`require`语法是同步的，所以就导致了**CommonJS**模块规范只适合用在服务端，而ES6模块无论是在浏览器端还是服务端都是可以使用的，但是在服务端中，还需要遵循一些特殊的规则才能使用 ；

+ **CommonJS** 模块输出的是一个值的拷贝，而ES6 模块输出的是值的引用；

+ **CommonJS** 模块是运行时加载，而ES6 模块是编译时输出接口，使得对JS的模块进行静态分析成为了可能；也实现了Tree Shanking这种优化技术。

+ 因为两个模块加载机制的不同，所以在对待循环加载的时候，它们会有不同的表现。**CommonJS**遇到循环依赖的时候，只会输出已经执行的部分，后续的输出或者变化，是不会影响已经输出的变量。而ES6模块相反，使用`import`加载一个变量，变量不会被缓存，真正取值的时候就能取到最终的值；

+ 关于模块顶层的`this`指向问题，在**CommonJS**顶层，`this`指向当前模块；而在ES6模块中，`this`指向`undefined`；但二者的作用域都是独立私有的，实现方式不同，CommonJs是在运行时被包装在一个函数中，就像我们刚刚提到的那样。

+ 关于两个模块互相引用的问题，在ES6模块当中，是支持加载**CommonJS**模块的。但是反过来，**CommonJS**并不能`require`ES6模块，在NodeJS中，两种模块方案是分开处理的。