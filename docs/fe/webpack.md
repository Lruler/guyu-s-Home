---
title: Webpack
---
为什么要有webpack?

`Webpack`最初的目标是实现前端项目的模块化，旨在更高效地管理和维护项目中的每一个资源

最早的时候，我们会通过文件划分的形式实现模块化，也就是将每个功能及其相关状态数据各自单独放到不同的JS 文件中

```html
<script src="module-a.js"></script>
<script src="module-b.js"></script>
```

约定每个文件是一个独立的模块，然后再将这些js文件引入到页面，一个script标签对应一个模块，然后调用模块化的成员

但这种模块弊端十分的明显，模块都是在全局中工作，大量模块成员污染了环境，模块与模块之间并没有依赖关系、维护困难、没有私有空间等问题

随后，就出现了命名空间方式，规定每个模块只暴露一个全局对象，然后模块的内容都挂载到这个对象中,再后来，使用立即执行函数为模块提供私有空间，通过参数的形式作为依赖声明。

而且随着前端的发展，前端开发越来越复杂，会有如下问题

+ 需要通过模块化的方式来开发
+ 使用一些高级的特性来加快我们的开发效率或者安全性，比如通过ES6+、TypeScript开发脚本逻辑，通过sass、less等方式来编写css样式代码
+ 监听文件的变化来并且反映到浏览器上，提高开发的效率
+ JavaScript 代码需要模块化，HTML 和 CSS 这些资源文件也会面临需要被模块化的问题
+ 开发完成后我们还需要将代码进行压缩、合并以及其他相关的优化

所以就需要一个静态打包工具，拥有编译代码，模块整合等功能

几个专业概念：bundle、chunk、vendor。

+ bundle：指的是整体的打包产物，包含 JS 和各种静态资源。
+ chunk：指的是打包后的 JS 文件，是 bundle 的子集。
+ vendor：是指第三方包的打包产物，是一种特殊的 chunk。

## webpack启动流程

**启动**

> 指定入口 - `entry`，然后以 `entry` 为起点，通过分析整个项目内各个源文件之间的依赖关系，构建一个模块依赖图 - `module graph`，然后再将 `module graph` 分离为三种类型的 `bundle`: `entry` 所在的 `initial bundle`、`lazy load` 需要的 `async bundle` 和自定义分离规则的 `custome bundle`
>
> 构建过程
>
> 1. 获取配置文件中 `entry` 对应的 `url` (这个 `url` 一般为相对路径);
> 2. `resolve` - 将 `url` 解析为绝对路径，找到源文件在本地磁盘的位置，并构建一个 `module` 对象；
> 3. `load` - 读取源文件的内容;
> 4. `transform` - 使用对应的 `loader` 将源文件内容转化为浏览器可识别的类型；
> 5. `parse` - 将转化后的源文件内容解析为 `AST` 对象，分析 `AST` 对象，找到源文件中的静态依赖(`import xxx from 'xxx'`) 和动态依赖(`import('xx')`)对应的 `url`, 并收集到 `module` 对象中；
> 6. 遍历第 `5` 步收集到的静态依赖、动态依赖对应的 `url`，重复 `2` - `6` 步骤，直到项目中所有的源文件都遍历完成。
>
> 分离过程
>
> 1. 预处理 `module graph`，对 `module graph` 做 `tree shaking`；
> 2. 遍历 `module graph`，根据静态、动态依赖关系，将 `module graph` 分解为 `initial chunk`、`async chunks`；
> 3. 优化 `initial chunk`、 `async chunks` 中重复的 `module`；
> 4. 根据 `optimization.splitChunks` 进行优化，分离第三方依赖、被多个 `chunk` 共享的 `module` 到 `common chunks` 中；
> 5. 根据 `chunk` 类型，获取对应的 `template`；
> 6. 遍历每个 `chunk` 中收集的 `module`，结合 `template`，为每个 `chunk` 构建最后的输出内容；
> 7. 将最后的构建内容输出到 `output` 指定位置；

常见的loader: css,less,babel,file,postcss等

**更新**

> `dev server` 启动以后，会 `watch` 源文件的变化。当源文件发生变化后，`Webpack` 会重新编译打包。这个时候，由于我们只修改了一个文件，因此只需要对这个源文件做 `resolve`、 `load`、 `transfrom`、`parse` 操作，依赖的文件直接使用缓存，因此 `dev server` 的响应速度比冷启动要好很多。
>
> `dev server` 重新编译打包以后，会通过 `ws` 连接通知浏览器去获取新的打包文件，然后对页面做局部更新。

打包过程和构建一致。

`Plugin`贯穿了webpack整个编译周期，例如打包优化、资源管理、环境变量注入等，它们会运行在 webpack 的不同阶段（钩子 / 生命周期）。

+ loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中
+ plugin 赋予了 webpack 各种灵活的功能，例如打包优化、资源管理、环境变量注入等，目的是解决 loader 无法实现的其他事

如何实现代理？

简单的说，跨域问题是浏览器的同源机制导致的，而服务器和服务器之间的通信其实不会有这个问题。
所以node正向代理的机制就是webpack启了一个代理服务器，然后客户端向这个服务器发请求，这个代理服务器在以客户端的身份把请求给转发到真正的服务端，再response即可。

## 优化webpack构建打包速度
1. 优化loader，比如优化文件搜索范围（让Babel只找js），缓存已经编译过的文件
2. HappyPack，将 Loader 的同步执行转换为并行的
3. DllPlugin 可以将特定的类库提前打包然后引入， 极大的减少打包类库的次数，只有当类库更新版本才有需要重新打包
4. 代码压缩

## 减少打包体积？
1. 按需加载，路由/类库
2. Scope Hoisting 会分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去。
3. Tree Shaking 可以实现删除项目中未被引用的代码

## webpack两种打包方式
1. 处理方式一：所有内容打包到一个chunk包内
无额外配置，webpack一般会把所有js打成一个包。实现步骤

读文件，扫描代码，按模块加载顺序，排列模块，分为模块1，模块2，...，模块n 。放到一个作用域内，用modules保存，modules是一个数组，所有模块按加载顺序，索引排序
webpack自己实现对应的api（比如自己实现require），让浏览器支持源代码内的模块化的写法（比如：module.export, require, esm稍微有些不同 见下方）

打包外部依赖也是一样的

```js
// 入口文件 main.js
const { b } = require('./test/b')
const a = '我是a';
console.log('打印' + a + b);

// ./test/b
module.exports = { 
    b: '我是b' 
};

```
打包得到：（简化后，方便理解原理）(代码可以直接在浏览器终端正确执行)
```js
(function (modules) {
  var installedModules = {}; // 缓存模块

  // webpack自己实现的require方法，源代码内的require都会换成这个
  function __webpack_require__(moduleId) {
    // 加载过的模块，直接返回缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 注意！！ 这个module会是webpack自己写的，然后会return出去，模仿commonjs的 module
    var module = installedModules[moduleId] = {
      i: moduleId,
      exports: {} // 模仿commonjs的 module.exports
    };

    // 注意！！ 此行是执行模块函数，就是下面的 /* 0 */ /* 1 */  （并且传入了webpack模仿的 module.exports）
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Return webpack模仿的 module.exports
    return module.exports;
  }
  // 从 第/* 0 */个模块开始执行
  return __webpack_require__(0); //  
})
  /************************************************************************/
  ([
    /* 0 */  // 入口文件 main.js
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
       const { b } = __webpack_require__(1); // 源代码内的require换成了webpack模仿的__webpack_require__
       const a = '我是a';
       console.log('打印' + a + b);
    }),
    /* 1 */  // 入口文件 main.js的依赖./test/b
    /***/ (function (module, exports, __webpack_require__) {
      module.exports = {
        b: '我是b'
      };
    })
  ]);

```
+ 打包纯 commonjs
webpack解决模块问题的思路一是：所有的js依赖，打包到一个文件内，然后自己实现一套require和module.exports，让浏览器可以执行源代码
+ 打包纯ems
    1. webpack会做tree shaking，最终的产物，会和rollup的产物比较接近，不会有过多的webpack注入的兼容代码
    2. 实现思路类似rollup，通过esm的静态特性，可以在编译的时候，就分析出对应的依赖关系

+ 打包二者混用

实现的思路和上面的模拟module.exports和提供__webpack_require__替代require的思路类似，webpack会去模拟esm的exports对象 让浏览器支持

另外 对于打包第三方依赖，只要不是动态打包（比如 ()=>import('xx')），不是代码分离的话，处理方式同上。

1. 处理方式二：多个chunk包？（比如：动态打包 ()=>import('xx')，代码分离）

正常情况下，webpack打包js文件都是只生成一个chunk，除非做了一些额外的配置，或引入了一些共享的依赖，或者动态加载。

以下3种情况，打成多个chunk，举例：

1. import() 动态加载 (懒加载)
    import('./test/a').then(e => {
      console.log(e)
    })
    console.log(111)

2. 公共依赖 (比如a，b 两文件 都依赖vue， 防止vue重复被打包进a和b) 公共依赖放入venders中
    SplitChunksPlugin  开箱即用的
    从 webpack v4 开始，移除了 `CommonsChunkPlugin`，取而代之的是 `optimization.splitChunks`。

    webpack 将根据以下条件自动拆分 chunks：

    -   新的 chunk 可以被共享，或者模块来自于 `node_modules` 文件夹
    -   新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
    -   当按需加载 chunks 时，并行请求的最大数量小于或等于 30
    -   当加载初始化页面时，并发请求的最大数量小于或等于 30

    当尝试满足最后两个条件时，最好使用较大的 chunks。

3. 多个打包入口 会有多个chunk
    entry: {
        index: './src/index.js',
        another: './src/another-module.js',
    },



## 为什么webpack打包产物会自注入那么多代码？
+ webpack 诞生在esm标准出来前，commonjs出来后
  + 当时的浏览器只能通过script标签加载模块
    + script标签加载代码是没有作用域的，只能在代码内 用iife的方式 实现作用域效果，
        + 这就是webpack打包出来的代码 大结构都是iife的原因
        + 并且每个模块都要装到function里面，才能保证互相之间作用域不干扰。
        + 这就是为什么 webpack打包的代码为什么乍看会感觉乱，找不到自己写的代码的真正原因

+ 关于webpack的代码注入问题，是因为浏览器不支持cjs，所以webpack要去自己实现require和module.exports方法（才有很多注入）（相当于webpack自己做了polyfill）
    + 这么多年了，甚至到现在2022年，浏览器为什么不支持cjs？
        + cjs是同步的，运行时的，node环境用cjs，node本身运行在服务器，无需等待网络握手，所以同步处理是很快的
        + 浏览器是 客户端，访问的是服务端资源，中间需要等待网络握手，可能会很慢，所以不能 同步的 卡在那里等服务器返回的，体验太差

+ 后续出来esm后，webpack为了兼容以前发在npm上的老包（并且当时心还不够决绝，导致这种“丑结构的包”越来越多，以后就更不可能改这种“丑结构了”），所以保留这个iife的结构和代码注入，导致现在看webpack打包的产物，乍看结构比较乱且有很多的代码注入，自己写的代码都找不到

[参考](https://juejin.cn/post/7053998924071174175)