---
title: JS基础知识
---
这是JS
## v8垃圾回收机制？

V8 是一种开源的JavaScript 引擎，它主要用于Chrome 浏览器和Node.js 环境。V8 引擎中的垃圾回收机制负责自动管理内存的分配和释放，以确保程序运行期间不会出现内存泄漏或垃圾堆积的问题。

V8 引擎的垃圾回收机制基于代际假说和分代回收的原理。它将内存分为新生代（young generation）和老生代（old generation）两个代。新生代用于存放新创建的对象，老生代用于存放经过一定时间仍然存活的对象。

下面是V8 引擎中的垃圾回收机制的一般流程：

1. **新生代垃圾回收**：V8 将新生代内存空间分为两个部分：From 空间和To 空间。新创建的对象首先被分配到From 空间，当From 空间满时，会触发垃圾回收过程。回收过程中，V8 首先进行标记操作，标记活跃的对象，然后将这些对象复制到To 空间，同时进行压缩等操作。最后，From 空间和To 空间的角色互换，完成垃圾回收。
2. **老生代垃圾回收**：老生代中的对象由于存活时间较长，垃圾回收的成本较高。V8 使用标记-清除（mark-sweep）和标记-压缩（mark-compact）两种算法进行老生代的垃圾回收。标记-清除算法首先进行标记操作，标记出活跃的对象，然后清除未标记的对象。标记-压缩算法在清除未标记的对象后，将存活的对象压缩到内存的一端，从而减少内存碎片化。
3. **增量标记**：为了降低垃圾回收对程序执行的影响，V8 引擎使用增量标记算法。增量标记允许垃圾回收过程与程序执行交替进行，每次执行一小部分的标记操作，减少了垃圾回收对程序的中断时间。

V8 引擎的垃圾回收机制是自动进行的，开发者无需手动管理内存。但是，了解垃圾回收机制的工作原理有助于编写高效的JavaScript 代码，避免内存泄漏和性能问题。





前端内存泄漏是指在JavaScript应用程序中，由于某些原因，无法释放不再使用的内存。这可能会导致应用程序变慢、崩溃或耗尽设备的资源。以下是一些排查前端内存泄漏的方法和工具：

1. 监控内存使用情况：使用浏览器内置的开发者工具，可以在Performance或Memory选项卡下监控JavaScript内存使用情况，查看内存使用情况的变化，以及是否有明显的内存泄漏。
2. 使用Heap Profiler：浏览器内置的Heap Profiler可以帮助您分析JavaScript内存使用情况，识别内存泄漏的原因。您可以在Chrome DevTools或Firefox DevTools中使用Heap Profiler。
3. 分析代码：检查代码中是否存在DOM元素或JavaScript对象未被正确清除的情况。例如，移除事件监听器或定时器，确保不再需要的DOM元素被正确地移除等。
4. 使用第三方工具：一些第三方工具可以帮助您分析和识别内存泄漏。例如，LeakFinder、Memory Leak Detection、HeapAnalyzer等。

## 处理过内存泄漏问题吗？

我在过去遇到过并处理过内存泄漏问题。内存泄漏是指不再需要的对象或数据没有被正确释放，导致未使用的内存随时间累积。这可能导致应用程序性能下降，并可能导致崩溃。

以下是我用来解决内存泄漏问题的一些方法：

1. **确定问题来源**：首先要确定内存泄漏的来源。这可以通过分析代码并使用调试工具和内存分析器来跟踪对象引用和内存使用情况来完成。
2. **审查对象生命周期**：审查代码中对象的生命周期，并确保对象在适当的时候被创建和释放。确保在不再需要时释放资源，比如关闭数据库连接或移除事件监听器。
3. **避免循环引用**：循环引用会阻止对象被垃圾回收。确保对象不会不必要地相互引用，或者使用弱引用来打破循环依赖。
4. **释放不再使用的对象**：明确地释放不再需要的对象或资源。这可以包括将引用置为null或调用特定的清理方法来释放资源。
5. **优化内存使用**：分析内存使用模式，并优化数据结构或算法以减少内存消耗。这可以包括使用内存占用更小的数据结构或实现对象池来重用对象，而不是创建新的对象。
6. **使用内存分析工具**：利用内存分析工具来分析内存使用情况并找出潜在的泄漏。这些工具可以提供关于内存分配、对象生命周期的信息，并识别内存使用过多的区域。
7. **测试和监控**：定期对应用程序进行测试，并监控其内存使用情况。这有助于识别潜在的内存泄漏，并确保修复措施的有效性。

需要注意的是，诊断和解决内存泄漏问题可能具有一定的挑战性，解决方法可能因编程语言和环境而异。因此，了解内存管理原则和最佳实践是非常重要的，以有效预防和解决内存泄漏问题。


## 原型链
可以通过 JavaScript 中的原型链来实现 A 继承于 B，B 继承于 C，具体实现如下：

```javascript
function C() {
  this.cProp = "C property";
}

C.prototype.cMethod = function() {
  console.log("C method");
};

function B() {
  C.call(this);
  this.bProp = "B property";
}

B.prototype = Object.create(C.prototype);
B.prototype.constructor = B;
B.prototype.bMethod = function() {
  console.log("B method");
};

function A() {
  B.call(this);
  this.aProp = "A property";
}

A.prototype = Object.create(B.prototype);
A.prototype.constructor = A;
A.prototype.aMethod = function() {
  console.log("A method");
};

var a = new A();
a.aMethod(); // "A method"
a.bMethod(); // "B method"
a.cMethod(); // "C method"
console.log(a.aProp); // "A property"
console.log(a.bProp); // "B property"
console.log(a.cProp); // "C property"
```

上述代码中，我们定义了三个构造函数 C、B 和 A，分别表示三个类。C 中有一个属性 `cProp` 和一个方法 `cMethod`，B 通过调用 `C.call(this)` 来继承 C 的属性和方法，并定义了自己的属性 `bProp` 和方法 `bMethod`。A 通过调用 `B.call(this)` 来继承 B 的属性和方法，并定义了自己的属性 `aProp` 和方法 `aMethod`。

在继承过程中，我们使用了 `Object.create()` 方法来创建一个新的对象，并将其原型指向父类的原型对象，从而实现了原型链继承。同时，我们还需要将子类的构造函数指向自己，以便可以正确地创建子类的实例。最后，我们创建了一个 A 类的实例 a，并测试了其继承的属性和方法。

可以使用 JavaScript 中的原型链来实现 A 继承 B。具体实现步骤如下：

1. 定义一个 B 构造函数，并在它的原型对象上添加属性和方法：

```js
function B() {
  this.name = 'B';
}

B.prototype.sayHello = function() {
  console.log('Hello from B!');
}
```

2. 定义一个 A 构造函数，并将它的原型对象指向 B 的实例对象：

```js
function A() {
  this.name = 'A';
}

A.prototype = new B();
```

这里将 A 的原型对象设置为 B 的实例对象，这样 A 的实例就可以访问 B 的属性和方法。

3. 在 A 的原型对象上添加自己的方法：

```js
A.prototype.sayHi = function() {
  console.log('Hi from A!');
}
```

这样，A 的实例就可以访问 B 和 A 的属性和方法了。

完整代码如下：

```js
function B() {
  this.name = 'B';
}

B.prototype.sayHello = function() {
  console.log('Hello from B!');
}

function A() {
  this.name = 'A';
}

A.prototype = new B();

A.prototype.sayHi = function() {
  console.log('Hi from A!');
}

vara = new A();
console.log(a.name); // 输出 "A"
a.sayHello(); // 输出 "Hello from B!"
a.sayHi(); // 输出 "Hi from A!"
```

在这个例子中，A 继承了 B 的属性和方法，并在自己的原型对象上添加了新的方法。通过原型链实现继承，可以减少重复代码，提高代码的复用性和可维护性。



页面加载很多图表会卡对不对，这时候一次性打开很多个相同域名，请问怎么处理浏览器崩溃

`document.visibilityState` 是一个只读属性，用于获取当前文档的可见性状态。该属性返回一个字符串，表示文档当前的可见性状态，可能的取值包括：

- "visible": 表示文档当前处于激活状态，即当前窗口处于前台显示状态，或者当前标签页处于被选中的状态。
- "hidden": 表示文档当前处于非激活状态，即当前窗口处于后台状态，或者当前标签页处于未被选中的状态。
- "prerender": 表示文档处于预加载状态，即文档正在后台加载并渲染，但还没有显示出来。
- "unloaded": 表示文档已经被卸载，即文档已经从浏览器中移除。

`document.visibilityState` 属性可以用于判断当前文档是否处于激活状态，从而在文档状态发生变化时执行相应的操作。例如，可以使用 `document.addEventListener('visibilitychange', handler)` 监听文档的可见性状态变化事件，从而在文档激活或非激活状态发生变化时执行相应的处理逻辑，如暂停或继续视频播放等。

需要注意的是，`document.visibilityState` 属性可能不被所有浏览器所支持，需要进行兼容性处理。同时，该属性只能判断文档是否处于激活状态，无法判断具体哪个窗口或标签页处于激活状态。


JavaScript 是单进程，单线程的，这是由它的设计决定的。

JavaScript 最初是为浏览器而设计的，它的主要任务是处理用户与网页的交互。由于浏览器需要在用户界面上展示多种多样的内容，如文本、图片、视频等，同时还需要处理用户的鼠标、键盘等输入事件，因此 JavaScript 的主要任务是处理这些事件和与浏览器界面的交互。

为了保证 JavaScript 的执行不会阻塞浏览器界面的渲染，JavaScript 引擎使用单线程模型，即一次只能执行一个任务，避免了多个线程之间的竞争和同步问题。这样能够保证 JavaScript 的执行不会对浏览器的性能和响应速度产生负面影响。

虽然 JavaScript 是单线程的，但是它可以通过异步编程模型和事件循环机制来处理复杂的任务，如网络请求、文件读写等，从而实现高效的并发处理。此外，浏览器还提供了 Web Worker API，使得 JavaScript 可以在后台运行多个线程，以便处理一些耗时的任务，但这些线程并不能访问 DOM，从而避免了多线程之间的竞争问题。

总之，JavaScript 是单线程的，这是它的设计决定的，它通过异步编程模型和事件循环机制来实现高效的并发处理，同时也可以通过 Web Worker API 在后台运行多个线程。



JavaScript 是单进程的，主要是由于它最初是为浏览器环境而设计的。

在浏览器环境中，每个网页都是一个独立的进程，不同的网页之间相互隔离，互不干扰。每个进程都有自己的内存空间、运行环境和资源，例如网络连接、文件系统等。这样可以保证浏览器的稳定性和安全性，防止恶意代码对用户设备的攻击和破坏。

JavaScript 作为浏览器环境中的一种脚本语言，也需要遵循这种隔离原则，不能访问其他进程的资源。因此，JavaScript 在浏览器中只能运行在浏览器进程中，不能单独创建进程。

此外，JavaScript 是一种解释性语言，它的执行速度较慢，因此采用单进程模型可以避免多个进程之间的竞争和同步问题，从而提高了 JavaScript 的执行效率。

虽然 JavaScript 是单进程的，但是它可以通过异步编程模型和事件循环机制来实现高效的并发处理，从而满足了处理复杂任务的需要。此外，浏览器也提供了一些 API，如 Web Worker，允许 JavaScript 在后台运行多个线程，以便处理一些耗时的任务。


Navigator userAgent获取用户设备等信息

















[GPT-4] `requestAnimationFrame`是一个浏览器提供的API，用于在下一次重绘之前调用指定的回调函数，从而实现平滑的动画效果。相比于传统的定时器（如`setTimeout`和`setInterval`），`requestAnimationFrame`具有以下优势：

1. 更高的帧率和性能：`requestAnimationFrame`会根据浏览器的刷新率自动调整回调函数的执行频率，通常为每秒60次（60fps）。这可以确保动画更加流畅，减少卡顿和丢帧现象。相比之下，定时器的执行频率通常较低，且不稳定，可能导致动画效果不佳。

2. 节省资源和能源：当浏览器窗口被最小化或隐藏时，`requestAnimationFrame`会自动暂停回调函数的执行，从而节省系统资源和电池能源。而定时器会继续执行，即使用户无法看到动画效果，这可能导致不必要的资源浪费。

3. 更好的同步和协调：`requestAnimationFrame`可以确保回调函数在浏览器的重绘周期中正确执行，避免了不必要的重绘和布局计算。而定时器可能会在任意时间触发回调函数，这可能导致浏览器的重绘和布局计算过程被频繁打断，影响性能。

定时器可能会引起丢帧现象，原因如下：

1. 定时器的执行频率不稳定：由于JavaScript是单线程的，定时器的回调函数可能会因为其他任务（如事件处理、网络请求等）而被延迟执行。这可能导致动画的帧率不稳定，出现卡顿和丢帧现象。

2. 定时器和浏览器重绘周期不同步：定时器的回调函数可能在浏览器的重绘周期之外执行，导致浏览器需要频繁重绘和计算布局，从而影响性能和帧率。

因此，为了实现更高效、流畅的动画效果，建议使用`requestAnimationFrame`而非传统的定时器。



[GPT-4] 这个现象可以通过 JavaScript 中的类型转换和隐式类型转换来解释。当你在 JavaScript 中使用一元加操作符（`+`）时，它会尝试将操作数转换为数字。在这两个例子中，我们使用 `+[]` 和 `+{}`，分别对数组和对象应用一元加操作符。现在我们来解析这两个表达式的执行过程。

**+[]：**

1. 当一元加操作符作用于数组时，首先尝试将数组转换为原始值。这是通过调用数组的 `valueOf()` 方法来实现的。然而，`valueOf()` 对于数组来说并没有意义，所以它会退回到调用数组的 `toString()` 方法。

2. 对于空数组 `[]`，`toString()` 方法返回一个空字符串（`""`）。

3. 空字符串被一元加操作符作用后，会尝试将其转换为数字。在这种情况下，空字符串被转换为数字 `0`。

因此，`+[]` 的结果是 `0`。

**+{}：**

1. 当一元加操作符作用于对象时，首先尝试将对象转换为原始值。这是通过调用对象的 `valueOf()` 方法来实现的。然而，`valueOf()` 对于普通对象来说并没有意义，所以它会退回到调用对象的 `toString()` 方法。

2. 对于普通对象 `{}`，`toString()` 方法返回字符串 `"[object Object]"`。

3. 字符串 `"[object Object]"` 被一元加操作符作用后，会尝试将其转换为数字。在这种情况下，由于该字符串无法被解析为一个合法的数字，所以转换结果是 `NaN`。

因此，`+{}` 的结果是 `NaN`。



[GPT-4] 这个现象同样可以通过 JavaScript 中的类型转换和隐式类型转换来解释。当你在 JavaScript 中使用一元加操作符（`+`）时，它会尝试将操作数转换为数字。在这两个例子中，我们使用 `+undefined` 和 `+null`，分别对 `undefined` 和 `null` 应用一元加操作符。现在我们来解析这两个表达式的执行过程。

**+undefined：**

1. 当一元加操作符作用于 `undefined` 时，它会尝试将 `undefined` 转换为数字。

2. 根据 JavaScript 的规则，`undefined` 被转换为数字时，结果是 `NaN`。

因此，`+undefined` 的结果是 `NaN`。

**+null：**

1. 当一元加操作符作用于 `null` 时，它会尝试将 `null` 转换为数字。

2. 根据 JavaScript 的规则，`null` 被转换为数字时，结果是 `0`。

因此，`+null` 的结果是 `0`。

这些转换规则是由 JavaScript 的内部逻辑定义的，可能在其他编程语言中不适用。在实际编程过程中，为了避免潜在的错误和混淆，建议使用明确的类型转换，如 `Number()`，来执行类型转换。

[GPT-4] 为了使用原型继承的方式让B类继承A类，我们可以先定义A类和B类，然后将B类的原型设置为A类的实例。以下是代码示例：

```javascript
// 定义A类
function A() {
  // ...
}

// 定义B类
function B() {
  // ...
}

// 设置B类的原型为A类的实例
B.prototype = new A();

// 创建B类的实例
let b = new B();
```

现在，我们来分析b的原型链：

1. 首先，`b` 是 `B` 类的实例，所以 `b.__proto__` 指向 `B.prototype`。
2. 接下来，`B.prototype` 是 `A` 类的实例，所以 `B.prototype.__proto__` 指向 `A.prototype`。
3. 最后，`A.prototype` 是一个普通的JavaScript对象，它的原型是 `Object.prototype`。因此，`A.prototype.__proto__` 指向 `Object.prototype`。

所以，b的原型链如下：

```
b --> B.prototype --> A.prototype --> Object.prototype --> null
```

这里的箭头表示“__proto__”指向。当我们在b对象上查找属性或方法时，JavaScript引擎会沿着这条原型链进行查找。


防止对象被修改：
Object.freeze 冻结一个对象
Object.seal 密封一个对象
通过defineProperty预定义属性描述符，设置writable(是否可写), configurable(是否可配置)
使用代理
```js
const obj = { prop: 'value' };
const proxy = new Proxy(obj, {
  set: function(target, prop, value) {
    return false; // 阻止属性值的修改
  },
  deleteProperty: function(target, prop) {
    return false; // 阻止属性的删除
  }
});
proxy.prop = 'new value'; // 无效，属性值不可修改
delete proxy.prop; // 无效，属性不可删除
```

严格模式对正常的 JavaScript 语义做了一些更改：
把use strict放在第一行，则整个脚本以严格模式运行。如果不在第一行，则无效。当不同模式的代码文件合并时，需要特别注意。
通过抛出错误来消除原有的静默错误，eg, 未定义使用变量，undifined
修复了一些导致javascript引擎难以执行优化的缺陷：有时候，相同的代码，严格模式可以比非严格模式下运行更快。
禁用了在 ECMAScript 的未来版本中可能会定义的一些语法。比如一些保留字如：class,enum,export, extends, import, super 不能做变量名
1. 全局变量显示声明 就是必须要用let const var
2. 静态绑定 禁止用with 创建eval作用域
3. 禁止this指向全局对象(定时器的this还是指向window)

