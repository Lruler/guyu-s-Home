---
title: React
---
## 开放性：了解HOOKS吗，和Class有什么区别，解决了什么问题？
Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性

至于为什么引入hook，官方给出的动机是解决长时间使用和维护react过程中常遇到的问题，例如：

1. 逻辑割裂
在 hooks 出现之前，React 主要通过编写 class 类来编写组件，每个组件有自己的生命周期，这就导致我们在编码时必须按照组件的生命周期去写，例如：我们在 componentDidMount 注册一个定时去，在 componentWillUnmount 销毁定时器。在 componentDidMount 中请求数据，在 componentDidUpdate 中判断状态变化请求数据。同样的逻辑， 我们需要在不同的生命周期中去实现，在一个大型的 app 中，类似的逻辑会有很多，掺杂在一起，越来越难以维护。
2. 逻辑复用
在 hooks 出现之前，复用逻辑的方式主要是高阶函数和Render Props，但这两种模式都有它们自己的问题，那就是会出现「嵌套地域」。

Hooks 的出现是一种全新的写法，抛弃了类，使用函数来写组件。但由于函数没法保存状态，React 引入了 useState 等 API 来帮助我们保留状态。其中的原理是 React 会根据 useState 的调用顺序来在内部保留状态，所以 Hooks 有一个重要的规则，只能在最顶层使用 Hooks。使用 Hooks 编写的代码没有「嵌套地狱」，组织代码粒度更细，相关逻辑代码紧密，提升了组件的内聚性，减少了维护成本。

编写hooks为函数式编程，每个功能都包裹在函数中，整体风格更清爽，更优雅

hooks的出现，使函数组件的功能得到了扩充，拥有了类组件相似的功能，在我们日常使用中，使用hooks能够解决大多数问题，并且还拥有代码复用机制，因此优先考虑hooks

在以前，函数组件也被称为无状态的组件，只负责渲染的一些工作

因此，现在的函数组件也可以是有状态的组件，内部也可以维护自身的状态以及做一些逻辑方面的处理
## react fiber的发展演进？

React Fiber是React框架中一项重大的架构改进，旨在改善React的渲染性能和用户体验。下面是React Fiber的发展演进：

1. React 15及之前版本：React的早期版本使用了基于栈的调和算法，称为"Stack Reconciler"。这种调和算法在处理大型组件树或复杂交互时容易出现性能问题，导致用户界面的卡顿和响应性差。
2. React 16及引入Fiber：React 16引入了Fiber架构，这是一个全新的调和算法和渲染引擎。Fiber的目标是实现增量渲染和可中断的渲染，以提高React应用的响应性和渲染性能。
3. 引入异步渲染：Fiber架构使React能够支持异步渲染，将渲染任务分解为多个优先级不同的子任务，使得React可以更好地响应用户输入，并在空闲时间执行优先级较低的任务。
4. 优先级调度和任务切片：Fiber将渲染任务切片为多个小任务，并为每个任务分配优先级，可以根据任务的优先级动态调整任务的执行顺序，以更好地响应用户操作和保持页面的流畅性。
5. 错误边界：Fiber架构引入了错误边界的概念，使得React应用能够更好地处理运行时错误，避免整个应用崩溃，并提供优雅的错误处理和回退机制。
6. 生命周期重构：Fiber架构对React组件的生命周期进行了重新设计和重构，引入了新的生命周期方法，并提供了更细粒度的控制和更好的性能优化。

总的来说，React Fiber的发展演进使得React能够更好地处理大型应用、复杂交互和高性能要求的场景。它通过引入异步渲染、优先级调度、任务切片和错误边界等特性，提升了React应用的响应性能和用户体验，并为未来的功能和扩展提供了更强的基础。

先谈谈理念

为什么 React 叫react(响应)，这就是他的优点之一，能实现快速响应。

我们日常使用App，浏览网页时，有两类场景会制约`快速响应`：

- 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：

- CPU的瓶颈
- IO的瓶颈

主流浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次。

我们知道，JS可以操作DOM，`GUI渲染线程`与`JS线程`是互斥的。所以**JS脚本执行**和**浏览器布局、绘制**不能同时执行。

在每16.6ms时间内，需要完成如下工作：

```text
JS脚本执行 -----  样式布局 ----- 样式绘制
```

当JS执行时间过长，超出了16.6ms，这次刷新就没有时间执行**样式布局**和**样式绘制**了。

当组件数量繁多，JS脚本执行时间过长，页面掉帧，造成卡顿。

如何解决这个问题呢？

答案是：在浏览器每一帧的时间中，预留一些时间给JS线程，`React`利用这部分时间更新组件（可以看到，在[源码 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)中，预留的初始时间是5ms）。

所以，解决`CPU瓶颈`的关键是实现`时间切片`，而`时间切片`的关键是：将**同步的更新**变为**可中断的异步更新**。

IO的瓶颈

`网络延迟`是前端开发者无法解决的。如何在`网络延迟`客观存在的情况下，减少用户对`网络延迟`的感知？

这里的窍门在于：点击“Siri与搜索”后，先在当前页面停留了一小段时间，这一小段时间被用来请求数据。

当“这一小段时间”足够短时，用户是无感知的。如果请求时间超过一个范围，再显示`loading`的效果。

试想如果我们一点击“Siri与搜索”就显示`loading`效果，即使数据请求时间很短，`loading`效果一闪而过。用户也是可以感知到的。

而在源码内部，为了支持这些特性，同样需要将**同步的更新**变为**可中断的异步更新**。

## 总结

通过以上内容，我们可以看到，`React`为了践行“构建**快速响应**的大型 Web 应用程序”理念做出的努力。

其中的关键是解决CPU的瓶颈与IO的瓶颈。而落实到实现上，则需要将**同步的更新**变为**可中断的异步更新**。

浏览器一帧要做哪些事情

1. 首先需要处理输入事件，能够让用户得到最早的反馈
2. 接下来是处理定时器，需要检查定时器是否到时间，并执行对应的回调
3. 接下来处理 Begin Frame（开始帧），即每一帧的事件，包括 window.resize、scroll、media query change 等
4. 接下来执行请求动画帧 requestAnimationFrame（rAF），即在每次绘制之前，会执行 rAF 回调
5. 紧接着进行 Layout 操作，包括计算布局和更新布局，即这个元素的样式是怎样的，它应该在页面如何展示
6. 接着进行 Paint 操作，得到树中每个节点的尺寸与位置等信息，浏览器针对每个元素进行内容填充
7. 到这时以上的六个阶段都已经完成了，接下来处于空闲阶段（Idle Peroid），可以在这时执行 requestIdleCallback 里注册的任务（后面会详细讲到这个 requestIdleCallback ，它是 React Fiber 实现的基础）

js引擎和页面渲染引擎是在同一个渲染线程之内，两者是互斥关系。如果在某个阶段执行任务特别长，例如在定时器阶段或`Begin Frame`阶段执行时间非常长，时间已经明显超过了16ms，那么就会阻塞页面的渲染，从而出现卡顿现象。

在 react16 引入 Fiber 架构之前，react 会采用递归对比虚拟DOM树，找出需要变动的节点，然后同步更新它们，这个过程 react 称为`reconcilation`（协调）。在`reconcilation`期间，react 会一直占用浏览器资源，会导致用户触发的事件得不到响应。

就是 react现在的VDOM已经不是树了 是 Fiber 基于多项链表的图

到这时以上的六个阶段都已经完成了，接下来处于空闲阶段（Idle Peroid），可以在这时执行 requestIdleCallback 里注册的任务（后面会详细讲到这个 requestIdleCallback ，它是 React Fiber 实现的基础）

# Fiber

React16架构可以分为三层：

- Scheduler（调度器，saidiule）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

可以看到，相较于React15，React16中新增了**Scheduler（调度器）**，让我们来了解下他。

`Fiber`包含三层含义：

1. 作为架构来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`实现，被称为`Fiber Reconciler`。
2. 作为静态的数据结构来说，每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为动态的工作单元来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

### Fiber与diff

在更新Fiber架构后，那原本 VDOM从树的结构变成了链表的结构，那自然diff算法就要有所更新。

简单说说两版diff的比较吧

其实diff算法归根结底是一个很传统的算法，就是找出树的更新部分，原本的思路是需要迭代/递归对比每一个节点（以及他们的叶子结点）对比需要 O(n^2) ，再加上更新，总的时间复杂度就是 O(n^3)

然后老diff算法主要用了三个策略来把时间复杂度优化到O(n)

#### 旧版本diff

##### 一. tree diff

1. React通过updateDepth对Virtual DOM树进行层级控制。

就是同层比较而不是循环比较，一层比较一次，时间复杂度就是O(n) n为层数

2. 对树分层比较，两棵树 只对同一层次节点 进行比较。如果该节点不存在时，则该节点及其子节点会被完全删除，不会再进一步比较。

##### 二. **component diff**

（1）同一类型的两个组件，按原策略（层级比较）继续比较Virtual DOM树即可
（2）同一类型的两个组件，组件A变化为组件B时，可能Virtual DOM没有任何变化，如果知道这点（变换的过程中，Virtual DOM没有改变），可节省大量计算时间，所以 用户 可以通过 shouldComponentUpdate() 来判断是否需要 判断计算
（3）不同类型的组件，将一个（将被改变的）组件判断为dirty component（脏组件），从而替换 整个组件的所有节点，其实就是父组件改变，所有的子组件都会重新渲染的意思

##### 三. element diff

这里就引入到一个react中key的作用这个问题了

在 React 的 diff 算法中，key 的作用是用于判断节点是否可复用，从而减少不必要的diff，提高 diff 的效率。

最终执行diff算法是在 reconcileChildFibers 函数中，在该函数中，分别对单节点和多节点进行了新旧节点的diff比较。通过 key 判断节点是否可复用就发生在单节点和多节点的diff比较中。



#### Fiber diff

为什么要改？

原来的 VDOM 是一颗由上至下的**树**，很普通，通过深度优先遍历，层层递归直下。然而，这个直下最大的毛病在于**不可中断**。因此，我们在 diff + patch 又或者是 Mount 巨大节点的时候，会造成巨大的卡顿。

Fiber VDOM 不再是一颗由上至下那么简单的树，而是链表形式的虚拟 DOM，链表的每一个节点是 Fiber，而不是在 16 之前的虚拟DOM 节点。每个 Fiber 节点记录着诸多信息，以便走到某个节点的时候中断。Fiber的思路是把渲染/更新过程（递归diff）拆分成一系列小任务，每次检查树上的一小部分，做完看是否还有时间继续下一个任务，有的话继续，没有的话把自己挂起，主线程不忙的时候再继续。

所以，Fiber是根据一个fiber节点（VDOM节点）来拆分，以fiber node为一个任务单元，一 个组件实例都是一个任务单元。任务循环中，每处理完一个fiber node，可以中断/挂起/恢复。

Fiber核心是实现了一个基于优先级和requestIdleCallback的循环任务调度算法：

通过浏览器提供的requestIdleCallback API中的Cooperative Scheduling来进行中断/挂起/恢复，可以让浏览器在空闲时间执行回调（开发者传入的方法），在回调参数中可以获取到当前帧（16ms）剩余的时间。利用这个信息可以合理的安排当前帧需要做的事情，如果时间足够，那继续做下一个任务，如果时间不够就歇一歇，调用requestIdleCallback来获知主线程不忙的时候，再继续做任务

##### 部分重要属性

Alternate：一个极其重要的属性。在新的 Fiber 架构中，我们同样是有两颗 Fiber 树，一颗是旧的，一颗是新的（当调用 setState）以后。当我们的更新完毕以后，新的 Alternate 树就会变成我们的老树，以此进行新旧交替。

child：因为就像我之前说的，要解决用户态调度问题，那么就要把每一个节点的 diff patch 过程都变成可控制的，因此我们需要将原来的递归，变成一个循环，以链表为链接，控制每一次的 diff 和 patch。因此，一个 Fiber 都会有一个 child 、sibling、return 三大属性作为链接树前后的指针。

return属性是实现错误边界的极其关键的一个Fiber 属性，得益于它，React 实现了每一个节点的完全跟踪，你可以看到当你组件报错的时候，一个清晰的 React 组件级别的堆栈就会出现。

effectTag:一个很有意思的标记，用于记录 effect 的类型，effect 指的就是对 DOM 操作的方式，比如修改，删除等操作，用于到后面进行 Commit（类似数据库）

firstEffect 、lastEffect 等玩意是用来保存中断前后 effect 的状态，用户中断后恢复之前的操作。这个意思还是很迷糊的，因为 Fiber 使用了可中断的架构。

tag：根据 react 的源码，tag 以下的含义 ，用于标记，这个 Fiber 是什么

```ts
export type TypeOfWork = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const IndeterminateComponent = 0; // 尚不知是类组件还是函数式组件
export const FunctionalComponent = 1; // 函数式组件
export const ClassComponent = 2; // Class类组件
export const HostRoot = 3; // 组件树根组件，可以嵌套
export const HostPortal = 4; // 子树. Could be an entry point to a different renderer.
export const HostComponent = 5; // 标准组件，如地div， span等
export const HostText = 6; // 文本
export const CallComponent = 7; // 组件调用
export const CallHandlerPhase = 8; // 调用组件方法
export const ReturnComponent = 9; // placeholder（占位符）
export const Fragment = 10; // 片段
```

React实现可以粗划为两部分：reconciliation（diff阶段）和 commit(操作DOM阶段)

reconciliation阶段：包含的主要工作是对current tree 和 new tree 做diff计算，找出变化部分。进行遍历、对比等是可以中断，歇一会儿接着再来。

commit阶段：对上一阶段获取到的变化部分应用到真实的DOM树中，是一系列的DOM操作。不仅要维护更复杂的DOM状态，而且中断后再继续，会对用户体验造成影响。在普遍的应用场景下，此阶段的耗时比diff计算等耗时相对短。


## 双缓存Fiber树

在`React`中最多会同时存在两棵`Fiber树`。当前屏幕上显示内容对应的`Fiber树`称为`current Fiber树`，正在内存中构建的`Fiber树`称为`workInProgress Fiber树`。

`current Fiber树`中的`Fiber节点`被称为`current fiber`，`workInProgress Fiber树`中的`Fiber节点`被称为`workInProgress fiber`，他们通过`alternate`属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

`React`应用的根节点通过使`current`指针在不同`Fiber树`的`rootFiber`间切换来完成`current Fiber`树指向的切换。

即当`workInProgress Fiber树`构建完成交给`Renderer`渲染在页面上后，应用根节点的`current`指针指向`workInProgress Fiber树`，此时`workInProgress Fiber树`就变为`current Fiber树`。

每次状态更新都会产生新的`workInProgress Fiber树`，通过`current`与`workInProgress`的替换，完成`DOM`更新。

# 类组件和函数组件

**区别**：

函数组件的性能比类组件的性能要高，因为类组件使用的时候要实例化，而函数组件直接执行函数取返回结果即可。

1.状态的有无
 hooks出现之前，函数组件`没有实例`，`没有生命周期`，`没有state`，`没有this`，所以我们称函数组件为无状态组件。 hooks出现之前，react中的函数组件通常只考虑负责UI的渲染，没有自身的状态没有业务逻辑代码，是一个纯函数。它的输出只由参数props决定，不受其他任何因素影响。

2.调用方式的不同
 函数组件重新渲染，将重新调用组件方法返回新的react元素。类组件重新渲染将new一个新的组件实例，然后调用render类方法返回react元素，这也说明为什么类组件中this是可变的。

比如说我有一个类组件和函数组件，他们都有一个onClick事件，是点击后在3s后alert父组件的props，就比如说是0，我在触发click事件后立刻改变父组件的状态为1，那么此时传入的props就从0变成1，函数组件会alert(0)，因为函数组件会捕获当前的props和state，我们在触发click事件时的函数组件捕获到的props是0，而改变props后新调用的函数组件的click事件没有被触发，所以alert(0)，而对于class组件，虽然this.props中的props在每次render中是不可变的，但是this是可变的，每次render时这个this会指向新的组件实例，而新的组件的props是1，故this.props也就是 1，所以alert(1)

对于这种捕获性质，函数组件可以用useRef来代替useState获取最新的状态

3.因为调用方式不同，在函数组件使用中会出现问题
 在操作中改变状态值，类组件可以获取最新的状态值，而函数组件则会按照顺序返回状态值

## 怎么替代 shouldComponentUpdate

说实话，Function Component 替代 `shouldComponentUpdate` 的方案并没有 Class Component 优雅，代码是这样的：

```jsx
const Button = React.memo(props => {
  // your component
});
```

或者在父级就直接生成一个自带 `memo` 的子元素：

```jsx
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  );
}
```

相比之下，Class Component 的写法通常是：

```jsx
class Button extends React.PureComponent {}
```

# React-filber

#### 1）背景

react-fiber 产生的根本原因，是`大量的同步计算任务阻塞了浏览器的 UI 渲染`。默认情况下，JS 运算、页面布局和页面绘制都是运行在浏览器的主线程当中，他们之间是互斥的关系。如果 JS 运算持续占用主线程，页面就没法得到及时的更新。当我们调用`setState`更新页面的时候，React 会遍历应用的所有节点，计算出差异，然后再更新 UI。如果页面元素很多，整个过程占用的时机就可能超过 16 毫秒，就容易出现掉帧的现象。

#### 2）实现原理

- react内部运转分三层：
  - Virtual DOM 层，描述页面长什么样。
  - Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
  - Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

`Fiber 其实指的是一种数据结构，它可以用一个纯 JS 对象来表示`：

```js
const fiber = {
    stateNode,    // 节点实例
    child,        // 子节点
    sibling,      // 兄弟节点
    return,       // 父节点
}
复制代码
```

- 为了实现不卡顿，就需要有一个调度器 (Scheduler) 来进行任务分配。优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。任务的优先级有六种：
  - synchronous，与之前的Stack Reconciler操作一样，同步执行
  - task，在next tick之前执行
  - animation，下一帧之前执行
  - high，在不久的将来立即执行
  - low，稍微延迟执行也没关系
  - offscreen，下一次render时或scroll时才执行
- Fiber Reconciler（react ）执行过程分为2个阶段：
  - 阶段一，生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。阶段一可被打断的特性，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。
  - 阶段二，将需要更新的节点一次过批量更新，这个过程不能被打断。
- Fiber树：React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构成为 Fiber Tree。Fiber Tree 一个重要的特点是链表结构，将递归遍历编程循环遍历，然后配合 requestIdleCallback API, 实现任务拆分、中断与恢复。

从Stack Reconciler到Fiber Reconciler，源码层面其实就是干了一件递归改循环的事情

传送门 ☞[# 深入了解 Fiber](https://juejin.cn/post/7002250258826657799)

### React 事件绑定原理

React并不是将click事件绑在该div的真实DOM上，而是`在document处监听所有支持的事件`，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数运行。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。
 另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 event.stopPropagation 是无效的，而应该调用 `event.preventDefault`。

### react中的key

这个之前一开始在学react中就做过总结 看[这篇文章](https://lruler.github.io/2021/06/09/map-%E4%B8%AD%E7%9A%84key/#more)

# VDOM

Real DOM，真实`DOM`， 意思为文档对象模型，是一个结构化文本的抽象，在页面渲染出的每一个结点都是一个真实`DOM`结构

`Virtual Dom`，本质上是以 `JavaScript` 对象形式存在的对 `DOM` 的描述

创建虚拟`DOM`目的就是为了更好将虚拟的节点渲染到页面视图中，虚拟`DOM`对象的节点与真实`DOM`的属性一一照应

两者的区别如下：

- 虚拟DOM不会进行排版与重绘操作，而真实DOM会频繁重排与重绘
- 虚拟DOM的总损耗是“虚拟DOM增删改+真实DOM差异增删改+排版与重绘”，真实DOM的总损耗是“真实DOM完全增删改+排版与重绘”

传统的原生`api`或`jQuery`去操作`DOM`时，浏览器会从构建`DOM`树开始从头到尾执行一遍流程

当你在一次操作时，需要更新10个`DOM`节点，浏览器没这么智能，收到第一个更新`DOM`请求后，并不知道后续还有9次更新操作，因此会马上执行流程，最终执行10次流程

而通过`VNode`，同样更新10个`DOM`节点，虚拟`DOM`不会立即操作`DOM`，而是将这10次更新的`diff`内容保存到本地的一个`js`对象中，最终将这个`js`对象一次性`attach`到`DOM`树上，避免大量的无谓计算

真实`DOM`的优势：

- 易用

缺点：

- 效率低，解析速度慢，内存占用量过高
- 性能差：频繁操作真实DOM，易于导致重绘与回流

使用虚拟`DOM`的优势如下：

- 简单方便：如果使用手动操作真实`DOM`来完成页面，繁琐又容易出错，在大规模应用下维护起来也很困难
- 性能方面：使用Virtual DOM，能够有效避免真实DOM数频繁更新，减少多次引起重绘与回流，提高性能
- 跨平台：React借助虚拟DOM， 带来了跨平台的能力，一套代码多端运行

缺点：

- 在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化
- 首次渲染大量DOM时，由于多了一层虚拟DOM的计算，速度比正常稍慢

> 1. 减少重绘回流次数
>
> 比如向一个`<ui>`列表添加5个`<li>`，如果直接操作真实DOM，那么浏览器需要经历5次回流；
>
> 但使用虚拟DOM在更新完后再异步批量更新真实DOM，一次性插入5个，浏览器只需要经历一次回流。
>
>   2.diff算法可以尝试对DOM进行复用，可以减少一些可能的DOM操作
>
> 虚拟DOM未必一定能提升性能，需要分情况讨论：
>
> 小量数据更新: 当页面的渲染数据高达几万条，但只需要修改某一条数据时，Virtual DOM的Diff比对算法，能够避免不必要的DOM操作，节省开销
>
> 大量数据更新: 当页面的渲染数据高达几万条, 但是更新的数据却非常大，甚至全量更新，Virtual DOM无法进行优化, 加剧了性能的浪费

# React渲染流程

+ 准备阶段

1.创建根节点的一些关联对象 ReactRoot、fiberRoot、(HostRoot)fiberNode

2.定义根节点的默认浏览器事件

+ render阶段

根据fiber架构更新出VDOM Tree 

+ commit阶段

执行真正的dom操作和事件提交，useEffect也在这一阶段执行



# React和Vue

先了解三个概念

+ 响应式更新

描述的是**「状态与UI之间的关系」**，即**「状态变化如何映射到UI变化」**。

两种方式 推和拉，改变一个状态，然后一步步到UI更新，拉是UI去反过来检测状态是否更新

React就是推，因为要手动推送状态更新(setState)，Vue是拉，data改变后自动更新UI

+ 单向数据流

React和Vue都是单向数据流，目的是减少状态更新的影响范围，因为这样更容易排查问题

不然一个状态更新后总要计算多少组件收到影响，得到一个影响范围才能debug

**「单向数据流」**是一条约定，他规定了**「当状态变化后，变化产生的影响只会从上往下传递」**。

+ 双向数据绑定

其实就一句话 **「双向数据绑定」**是**「状态+改变状态后触发的回调」**相结合的语法糖。

比如Vue中的v-model

```vue
<input v-model=‘data’/>

<input @input='onInput' :value=‘data’ /> 
<!-- 二者相等 -->
```

总结就是

- **「双向数据绑定」**描述的是**「组件内逻辑与视图的关系」**
- **「单向数据流」**描述的是**「组件之间的关系」**
- **「响应式更新」**描述的是**「状态与UI之间的关系」**



### 区别

二者现在的主要发展已经变了，Vue已经是一个完善成熟的框架了，提供了很多语法和约束，然后包括一套工具，状态管理/路由方案也都趋向于统一。

而React将自己定位为meta-framework（元框架），只提供底层API供上层应用框架调用（而不是提供面向开发者的API），比如useTransition这个API，就是提供给路由库使用的。可以认为，React未来的方向是发展为「前端框架的底层操作系统」。把自己定义为一个库而不是框架。

其他的一些区别 

1. 语法区别 模版语法和JSX vue实现的MVVM的双向绑定，react单纯的函数式 + 单向数据

“异步渲染”（Asynchronous Rendering）。在前端开发中，异步渲染是一种优化技术，用于提高用户界面的性能和响应速度。异步渲染的核心思想是将渲染任务分解为多个较小的任务，这些任务可以在浏览器的空闲时间内执行，从而避免阻塞主线程。这有助于提高页面的响应性，尤其是在处理大量数据或复杂界面时。

在 React 应用程序中，异步渲染是通过 Concurrent Mode（并发模式）实现的。Concurrent Mode 是 React 16.x 版本引入的一个实验性特性，它允许 React 在执行渲染任务时更有效地利用浏览器的空闲时间。在 Concurrent Mode 下，React 可以在需要时中断渲染任务，先处理高优先级的用户交互事件，然后在空闲时间内继续执行渲染任务。这有助于实现更平滑的用户体验，尤其是在低性能设备上。

要启用 Concurrent Mode，你需要将应用程序的根组件包裹在 `<React.StrictMode>` 或 `<React.unstable_ConcurrentMode>` 标签中（请注意，这是一个实验性特性，未来可能会有所变化）：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

然后，你可以使用 React 提供的 `useTransition` 和 `useDeferredValue` 等 Hooks，在组件中实现异步渲染的相关逻辑。

需要注意的是，并发模式仍处于实验阶段，可能会有一些兼容性问题和不稳定的表现。在实际项目中，你需要权衡利弊，决定是否使用这一特性。



在 React 中，异步渲染可以通过 Suspense 组件和 Error Boundary 实现。Suspense 组件用于“暂停”组件的渲染，直到异步操作（如数据获取）完成。Error Boundary 是一种特殊的组件，可以捕获子组件树中的错误，并在发生错误时显示备用 UI。当你在组件中抛出一个 Promise 时，Error Boundary 可以捕获这个 Promise，然后在 Promise 完成时继续渲染。

你提到的思路与 React 中的 `throw` 和 `catch` 机制有关。在组件中，你可以使用 `throw` 语句抛出一个 Promise。这个 Promise 会被最近的 Error Boundary 捕获。然后，你可以在 Error Boundary 中使用 `componentDidCatch()` 或 React 16.6 之后的 `static getDerivedStateFromError()` 方法来处理这个 Promise。在 Promise 完成时，你可以调用 `setState()` 或 `forceUpdate()` 方法来重新渲染组件。

下面是一个简单的例子，说明如何使用 Error Boundary 和 Suspense 实现异步渲染：

```javascript
import React, { Suspense } from 'react';

// 异步数据获取函数
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Hello, world!');
    }, 1000);
  });
}

// 异步组件
function AsyncComponent() {
  const data = React.useMemo(() => {
    throw fetchData();
  }, []);
  return <div>{data}</div>;
}

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      // 如果有错误，显示备用 UI
      return <div>Loading...</div>;
    }
    // 否则，渲染子组件
    return this.props.children;
  }
}

// 应用程序组件
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
```

在这个例子中，`AsyncComponent` 组件会抛出一个 Promise，这个 Promise 会被 `ErrorBoundary` 捕获。在 Promise 完成时，`ErrorBoundary` 会重新渲染组件，显示异步获取的数据。这样，你可以将异步操作与组件渲染同步化，实现更好的用户体验。

**路由懒加载**：当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。

懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载

**懒加载前提的实现：ES6的动态地加载模块——import()。**


## 严格模式
在官网中大概是这样解释的，<React.StrictMode>和Fragment作用相似，仅仅是作为一个容器，不会被渲染出任何的真实UI，它为其后代元素触发额外的检查和报告。我们可以在任何地方利用此标签开启严格模式，比如在组件中和App.js(入口文件)中。当启用检查后，会对后代元素都进行检查。

作用以及优点
识别不安全的生命周期组件
有关旧式字符串ref用法的警告
关于一些被弃用的方法的警告，比如（findDOMNode）
检测意外的副作用
检测过时的API
