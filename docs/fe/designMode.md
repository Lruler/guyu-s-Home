---
title: 设计模式
---
常见的设计模式包括但不限于以下几种：

1. 单例模式（Singleton Pattern）：确保一个类只有一个实例，并提供全局访问点。
2. 工厂模式（Factory Pattern）：通过一个工厂类来创建对象，隐藏对象的创建细节。
3. 观察者模式（Observer Pattern）：定义了一种一对多的依赖关系，当一个对象的状态发生改变时，其依赖者将收到通知。
4. 适配器模式（Adapter Pattern）：将一个类的接口转换成客户端所期望的接口。
5. 策略模式（Strategy Pattern）：定义一系列的算法，将它们封装起来，并使它们可以相互替换。
6. 装饰者模式（Decorator Pattern）：动态地给对象添加额外的职责，是继承的一种替代方案。
7. MVC模式（Model-View-Controller Pattern）：将应用程序分为模型、视图和控制器三个部分，实现关注点分离。
8. 迭代器模式（Iterator Pattern）：提供一种顺序访问聚合对象中各个元素的方法，而无需暴露其内部表示。

# 设计模式

就是优化嘛

>#### 🍅 我们写代码到底是在写什么？
>
>我们写项目其实就是写模块然后设计它们之间的沟通，设计模式说白了就是帮助我们更好的设计模块， 更好的组织它们之间的沟通。
>
>#### 🍅 设计模式扮演的角色
>
>- 帮助我们组织模块
>
> 通过一些设计模式，组织模块间的组成结构
>
>- 帮助我们设计沟通
>
> 有的设计模式可以帮助我们设计模块间如何沟通
>
>- 提高代码质量
>
> 通过设计模式，让代码更加优雅
>
>#### 🍅 设计原则
>
>1. 开闭原则
>
>  我们的程序要对扩展开放，对修改关闭；我们的程序要给具体使用的时候扩展的接口，但是在具体使用的时候不能让其修改我们的源码， 也就是说我们不用修改源码就能扩展功能，像 vue，react 等都有扩展的接口。
>
>2. 单一职责原则
>
>  我们的模块只做一件事情，模块的职责越单一越好。
>
>3. 依赖倒置原则
>
>  我们的上层模块不要依赖与具体的下层模块，应该依赖于抽象
>
>4. 接口隔离原则
>
>我们的接口要细化，功能要单一，一个接口不要调用太多方法，使其能力单一，听起来像单一职责原则；但是 2 者的关注点不同， 单一职责原则主要关注于模块本身，接口隔离原则关注于接口；我们尽量细化接口，每个接口做的事情尽量单一化。
>
>5. 迪米特法则
>
>我们让 2 个对象之间产生沟通，我们最好让 2 个对象之间知道的越少越好，没必要 2 者之间非常的了解；我们的中介者模式是一个很好体现迪米特法则的设计模式，中介者模式让 2 个对象之间没必要直接的沟通，如果直接沟通需要了解 2 者之间的 api 和彼此的调用方式，这个时候我们可以采用一个中介者来转达我们的需求，而不用彼此知道
>
>6. 里氏替换原则
>
>它主要关注于继承，它的意义是任何使用父类的地方都可以用子类去替换，直白的说我们子类继承父类的时候，我们的子类必须完全保证继承父类的属性和方法，这样的话父类使用的地方，子类可以进行替换

### 设计模式的分类

#### 🍅 创建型

帮我们优雅的创建对象

- 工厂模式-大量创建对象
- 单例模式-全局只能有我一个
- 建造者模式-精细化组合对象
- 原型模式-javaScript 的灵魂

#### 🍅 结构型

帮我们优雅的设计代码结构

- 外观模式-给你的一个套餐
- 适配器模式-用适配代替更改
- 装饰者模式-更优雅地扩展需求
- 享元模式-共享来减少数量
- 桥接模式-独立出来，然后再对接过去

#### 🍅 行为型

模块之间的行为模式，帮助我们组织模块行为

- 观察者模式-我作为第三方转发
- 状态模式-用状态代替判断
- 策略模式-算法工厂
- 职责链模式-像生产线一样组织模块
- 命令模式-用命令去解耦
- 迭代器模式-告别 for 循环

#### 🍅 技巧模式

帮助我们优化代码技巧

- 链模式-链式调用
- 委托模式-让别人代替你收快递
- 数据访问模式-一个方便的数据管理器
- 惰性模式-我要搞机器学习（第一次执行完后把状态记录下来）
- 等待者模式-等你们都回来再吃饭



## 1. 封装对象的设计模式

#### 工厂模式

方便大量创建对象，看名字就能看出来嘛。直接看例子，这个用的还是比较多的，其实我们平常封装的可复用组件，都可以理解为是工厂模式，最常见的就比如说Message提示框。我们通过调用Message的方法，传递不同的参数来得到不同类型的Message提示

```react
const Message = (type, text) => {
  switch(type) {
    case 'success': return Message.success(text)
    case 'error': return Message.error(text)
  }
}
```

#### 建造者模式

这个我用的就比较少了，意思是假如我们有一个很复杂的类，比如说一个md编辑器，我们要先把他的模块功能都剥开成一个个单独的类，然后再合并成md编辑器这么一个大类。

```js
// 假设我们要new一个md编辑器对象出来，需要配置语法解析，代码块高亮，字体样式等等100多个参数，不用建造者模式的情况下或许会这样写
new MdEditor('dom', 'bule', 'big', ...args) 

// 有了建造者模式，先拆分模块

// DOM解析
function DOMPrase(){}
// 代码高亮
function CodeHighLight(){}
// 字体样式
function FontStyle(){}
// 建造mdEditor
function runMdEditor(){
  new DomPrase()
  new CodeHighLight()
  new FontStyle()
}
// 就是一步步来，一个个小的模块慢慢积累，最后建造出完整的所需的对象，并且建造步骤可以更换
```

#### 单例模式

简单理解就是全局的一个唯一对象，并且这个对象全局共享访问。

我们最常用的就是redux 中的 store

## 2. 提高复用性的设计模式

#### 桥接模式

名字花里胡哨，其实我们也经常用，就是抽取公共逻辑复用代码。react里面的自定义hook就可以这么理解。假设我们有三个组件，每一个组件的state都需要存到localStorage里面，我们就封装一个 useLocalState()来使用，这就是所谓的“抽取重复的方法，桥接完成对象本该有的功能”

#### 享元模式

简单来说就是 “享有共同的部分”，举个弹窗的例子，假设我要有100个弹窗，每个弹窗只有内容不一样，那我难道要new 一百个弹窗实例出来？这显然不够优雅是吧，所以我们其实只需要调用100次关于弹窗内容的方法就可以了，一下子从new 一百个对象，变成了一个对象，只不过调用了一百次一个局部方法而已。

#### 模版模式

这个可以往大了理解，就是插件实现的基础，比如浏览器理解为一个大的模版，他只实现了一些基础功能，他还有很多其他可发展的功能，只是有一个预留槽，不同的插件注入进去就会实现不同的效果。 Array.map()这种就可以理解为一个模版模式的发展行为

```js
function baseNav() {
  // 基础类，此处定下基本骨架
}

baseNav.prototype.action = function(fn) {
  // 特异性的处理，留一个回调等待具体实现
}
```

## 3. 提高可扩展性

#### 适配器模式

就是将一个类的老接口再封装，适配新需求

```js
class Plug {
  getName() {
    return 'iphone充电头';
  }
}

class Target {
  constructor() {
    this.plug = new Plug();
  }
  getName() {
    return this.plug.getName() + ' 适配器Type-c充电头';
  }
}

let target = new Target();
target.getName(); // iphone充电头 适配器转Type-c充电头
```

#### 装饰器模式

去看看Js ES7的装饰器语法就能理解了 就是我在我的a()方法里面调用b()方法，就可以做到在不修改b的情况下扩展了b方法

```js
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true
```

#### 代理模式

详情可见ES6的Proxy

#### 命令者模式

这个不太懂，说是把一次API调用的过程解藕成 发布者，命令对象，接受者的模式，有点类似中介吧，没用过也没具体例子



## 4. 提高代码的核心可扩展性

之前的只是提高某个类或者某个方法的可扩展性，比较微观，现在说的是宏观的提高。

#### 观察者模式

DOM的事件绑定就是典型的观察者模式，DOM监听点击事件，事件触发后调用他的callback

>定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使它们能够自动更新自己，当一个对象的改变需要同时改变其它对象，并且它不知道具体有多少对象需要改变的时候，就应该考虑使用观察者模式。



```js
// 主题 保存状态，状态变化之后触发所有观察者对象
class Subject {
  constructor() {
    this.state = 0
    this.observers = []
  }
  getState() {
    return this.state
  }
  setState(state) {
    this.state = state
    this.notifyAllObservers()
  }
  notifyAllObservers() {
    this.observers.forEach(observer => {
      observer.update()
    })
  }
  attach(observer) {
    this.observers.push(observer)
  }
}

// 观察者
class Observer {
  constructor(name, subject) {
    this.name = name
    this.subject = subject
    this.subject.attach(this)
  }
  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`)
  }
}

// 测试
let s = new Subject()
let o1 = new Observer('o1', s)
let o2 = new Observer('02', s)

s.setState(12)
```

#### 职责链模式

把要做的事拆分成模块，模块之间只做自己模块的事

具体例子就是koa的洋葱圈模型了，后端常见的中间件的使用就是基于这个职责链的

#### 访问者模式

一个数据对象，不同场景有不同的数据操作方式，新的方法不应该定义在对象本身，而是new 一个访问者对象出来，把对数据对象的操作方法定义在访问者上。

比如有一个财务系统，我以老板的身份访问，我只关心盈利，并且可以决定支出。 而我以会计的身份访问，只关心收入和支出，但没有对财务的分配权。

## 5. 提高代码质量



### 优化代码结构的设计模式



#### 策略模式/ 状态模式 （优化 if-else逻辑）

```js
// 没有用策略的模式的情况
function showPart1() {
  console.log(1)
}
function showPart2() {
  console.log(2)
}
function showPart3() {
  console.log(3)
}
axios.get('xxx').then(res => {
  if (res == 'boss') {
    showPart1()
    showPart2()
    showPart3()
  } else if (res == 'manner') {
    showPart1()
    showPart2()
  } else if (res == 'staff') {
    showPart3()
  }
})

// 用策略模式的情况
function showControl() {
  this.status = ''
  this.power = {
    boss: function() {
      showPart1()
      showPart2()
      showPart3()
    },
    manner: function() {
      showPart1()
      showPart2()
    },
    staff: function() {
      showPart3()
    }
  }
}
showControl.prototype.show = function() {
  var self = this
  axios.get('xxx').then(res => {
    self.status = res
    self.power[self.status]()
  })
}
new showControl().show()
```

状态模式 就是有 状态的 策略模式

```js
function moveLeft() {
  console.log('left')
}
function moveRight() {
  console.log('RigmoveRight')
}
function moveTop() {
  console.log('Top')
}
function moveBottom() {
  console.log('bomoveBottom')
}

// 没有用状态模式的情况
function mover() {
  if (arguments.length == 1) {
    if (arguments[0] == 'left') {
      moveLeft()
    } else if (arguments[0] == 'right') {
      moveRight()
    } else if (arguments[0] == 'top') {
      moveTop()
    } else if (arguments[0] == 'bottom') {
      moveBottom()
    }
  } else {
    if (arguments[0] == 'left' && arguments[1] == 'top') {
      moveLeft()
      moveTop()
    } else if (arguments[0] == 'right' && arguments[1] == 'bottom') {
      moveRight()
      moveBottom()
    }
  }
}

// 用状态模式的情况
function mover() {
  this.status = []
  this.actionHandle = {
    left: moveLeft,
    right: moveRight,
    top: moveTop,
    bottom: moveBottom
  }
}
mover.prototype.run = function() {
  this.status = Array.prototype.slice.call(arguments)
  this.status.forEach(action => {
    this.actionHandle[action]()
  })
}
new mover().run('left', 'right')

```



#### 外观模式 (为多个复杂的子系统提供一致的接口)

意思大概就是 当完成一个操作时，需要操作多个子系统，不如提供一个更高级的Face直接操作

```js
// 浏览器兼容
let addMyEvent = function (el, ev, fn) {
    if (el.addEventListener) {
        el.addEventListener(ev, fn, false)
    } else if (el.attachEvent) {
        el.attachEvent('on' + ev, fn)
    } else {
        el['on' + ev] = fn
    }
}; 
```

### 优化代码操作的设计模式

#### 迭代器模式 (不访问内部的情况下遍历数据)

就是Js的Iteration, forEach方法也是个典型的迭代器方法

#### 备忘录模式(记录状态 方便回滚)

顾名思义，这个比较好理解，算法上面也有类似的memo优化(dp table)

