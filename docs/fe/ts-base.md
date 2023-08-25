---
title: Ts基础知识
---
### 泛型

平时我们都是对值进行编程，泛型是对类型进行编程

指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。 使用`<T>`代表类型的变量，T只是约定用法，可以任意指定。

### Ts中的数据类型

`typescript` 的数据类型主要有如下：（12个）

- boolean（布尔类型）
- number（数字类型）
- string（字符串类型）
- array（数组类型）
- tuple（元组类型）
- enum（枚举类型）
- any（任意类型）
- null 和 undefined 类型
- void 类型
- never 类型
- object 对象类型
- unknown 类型

+ void与never更多的是运用于函数返回的限制，如果这个函数不会返回任何东西（undefined算东西），没有返回的机会（比如一直在执行），或者扔（throw）不是return一个错误出去，那么应该用never，即表示这个函数绝对不（never）返回。 
+ 任何类型都能分配给 `unknown`，但 `unknown` 不能分配给其他基本类型

### 谈谈Ts中的枚举

枚举是一个被命名的整型常数的集合，用于声明一组命名的常数,当一个变量有几种可能的取值时,可以将它定义为枚举类型

通俗来说，枚举就是一个对象的所有可能取值的集合

在日常生活中也很常见，例如表示星期的SUNDAY、MONDAY、TUESDAY、WEDNESDAY、THURSDAY、FRIDAY、SATURDAY就可以看成是一个枚举

[参考](https://vue3js.cn/interview/typescript/enum.html#%E4%BA%8C%E3%80%81%E4%BD%BF%E7%94%A8)

### 谈谈interface

**接口**是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的**类**去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法

简单来讲，一个接口所描述的是一个对象相关的属性和方法，但并不提供具体创建此对象实例的方法

`typescript`的核心功能之一就是对类型做检测，虽然这种检测方式是“鸭式辨型法”，而接口的作用就是为为这些类型命名和为你的代码或第三方代码定义一个约定

#### interface 和 type的区别

1. interface和type，一个是接口一个是类型别名， 所以本质上来说他们一个用于规范类和对象的数据类型，一个给我们的自定义类型取一个名字
2. 二者可以互相继承，但是联合类型和基础类型不可被interface继承也不可被class实现，可以被type继承
3. type不能合并声明，就是说如果我有两个type a会报错，interface不会报错也不是覆盖，是合并

#### interface 和 抽象类

1. 抽象类里面可以有方法的实现，但是接口完全都是抽象的，不存在方法的实现；
2. 子类只能继承一个抽象类，而接口可以被多个实现；
3. 抽象方法可以是public，protected，但是接口只能是public，默认的；
4. 抽象类可以有构造器，而接口不能有构造器；

### Ts中的高级类型

常见的高级类型有如下：

- 交叉类型 `&`
- 联合类型 `｜`
- 类型别名 `type`
- 类型索引 `keyof`
- 类型约束 `extends`
- 映射类型 `in`
- 条件类型 `T extends U ? X : Y`



### 类型守卫

这里就用到 `is` 关键字 一般会出现在联合类型(联合类型只能访问交集)的使用上，用于缩紧类型范围，可以理解为一种别样的类型判断

先说说什么是类型守卫，在开发中经常会出现对类型判断的情况，比如

```ts
function test(input: string | number) {
  if (typeof input == 'string') {
    // 这里 input 的类型「收紧」为 string
  } else {
    // 这里 input 的类型「收紧」为 number
  }
}

// 通过对类型的收紧，在块级作用域里让一个联合类型变成简单类型，这就可以理解为一个类型守卫，除了typeof外，我们还可以用instanceof, in, ===/!== 来判断
```

但这样写比较冗余，那我们把类型判断抽象成函数呢 ？第一思路如下

```ts
function isString (input: any) {
  return typeof input === 'string';
}

function foo (input: string | number) {
  if (isString(input)) {
    // 这里 input 的类型没有「收紧」，仍为 string | number
  } else {
    // 这里也一样
  }
}
```

那要想达到类型守卫的效果，该怎么写呢？

```ts
function betterIsString (input: any): input is string { // 返回类型改为了 `input is string`
  return typeof input === 'string';
}
// 这样即可 input is string 理解为一个boolean类型，当他为true是就会再充当断言的作用把input视为string
```



### infer关键字

**infer 用于声明类型变量，以存储在模式匹配过程中所捕获的类型**

```ts
type UnpackedArray<T> = T extends (infer U)[] ? U : T  
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

**需要注意的是，infer 只能在条件类型的 extends 子句中使用，同时 infer 声明的类型变量只在条件类型的 true 分支中可用。**



### const 和 readOnly

const声明一个常量变量 且必须被初始化 在运行中检查

readonly 可以声明类/interface/type中一个属性 且不用被初始化 在编译时检查

#### 枚举和常量枚举

（1）枚举会被编译时会编译成一个对象，可以被当作对象使用

（2）**`const` 枚举会在 typescript 编译期间被删除，`const` 枚举成员在使用的地方会被内联进来，避免额外的性能开销**

```ts
// 枚举
enum Color {
  Red,
  Green,
  Blue
}
var sisterAn = Color.Red
// 会被编译成 JavaScript 中的 var sisterAn = Color.Red
// 即在运行执行时，它将会查找变量 Color 和 Color.Red
// 常量枚举
const enum Color {
  Red,
  Green,
  Blue
}
var sisterAn = Color.Red
// 会被编译成 JavaScript 中的 var sisterAn = 0
// 在运行时已经没有 Color 变量
```



### 命名空间

**Ts中如果一个文件不带有顶级的`import`或者`export`声明，那么它的内容被视为全局可见的，相反，如果带有则会被认为是一个模块**

命名空间`namespace` 命名空间一个最明确的目的就是解决重名问题

命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的

- 命名空间是位于全局命名空间下的一个普通的带有名字的 JavaScript 对象，使用起来十分容易。但就像其它的全局命名空间污染一样，它很难去识别组件之间的依赖关系，尤其是在大型的应用中

⚠️ : `declare `关键字可全局声明类型

`declare` 是用来定义全局变量、全局函数、全局命名空间、js modules、class等
 `declare global` 为全局对象 `window` 增加新的属性

```ts
declare global { 
   interface Window { 
        csrf: string; 
   }
}
```

### **TypeScript 中 ?.、??、!、!.、_、\** 等符号的含义？**

> `?. 可选链` 遇到 null 和 undefined 可以立即停止表达式的运行。
> `?? 空值合并运算符` 当左侧操作数为 null 或 undefined 时，其返回右侧的操作数，否则返回左侧的操作数。
> `! 非空断言运算符` x! 将从 x 值域中排除 null 和 undefined
> `!. ` 在变量名后添加，可以断言排除undefined和null类型
> `_ 数字分割符` 分隔符不会改变数值字面量的值，使人更容易读懂数字 .e.g 1_101_324。
> `** `求幂

### **对 TypeScript 类中成员的 public、private、protected、readonly 修饰符的理解？**

> `public`: 成员都默认为`public`，被此限定符修饰的成员是可以被外部访问；
> `private`: 被此限定符修饰的成员是只可以被类的内部访问；
> `protected`: 被此限定符修饰的成员是只可以被类的内部以及类的子类访问;
> `readonly`: 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。



### React中使用ts

[参考](https://lruler.github.io/2021/12/05/react%E4%B8%AD%E7%9A%84%E5%86%85%E7%BD%AEts%E7%B1%BB%E5%9E%8B/#more)

###  在 Typescript 中如何实现类型标记 Pick 与 Omit

```ts
interface User {
  id: number;
  age: number;
  name: string;
}

// 相当于: type PickUser = { age: number; name: string; }
type OmitUser = Omit<User, "id">;

// 相当于: type PickUser = { id: number; age: number; }
// 从泛型 T 中检出指定的属性并组成一个新的对象类型


type PickUser = Pick<User, "id" | "age">;
```

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Exclude<T, U> = T extends U ? never : T;

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Ts手动实现工具类型

```ts
// 将泛型 T 中的所有属性转化为可选属性
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 将泛型 T 中的所有属性转化为必选属性
type Required<T> = {
    [P in keyof T]-?: T[P];
};

// 将泛型 T 中的所有属性转化为只读属性
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}

// 从泛型 T 中检出指定的属性并组成一个新的对象类型
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// Record 允许从 Union 类型中创建新类型，Union 类型中的值用作新类型的属性。
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

// 从泛型 T 中排除可以赋值给泛型 U 的类型
type Exclude<T, U> = T extends U ? never : T;

// 从泛型 T 中提取可以赋值给泛型 U 的类型
type Extract<T, U> = T extends U ? T : never;

// 从泛型 T 中提取出不在泛型 K 中的属性类型，并组成一个新的对象类型
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// 从泛型 T 中排除掉 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T;

// 元组的方式获得函数的入参类型
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

// 获得函数返回值的类型
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

```

[参考](https://blog.csdn.net/gtLBTNq9mr3/article/details/115499520)

**协变、逆变、双变和抗变的理解？**

> `协变：X = Y `Y 类型可以赋值给 X 类型的情况就叫做协变，也可以说是 X 类型兼容 Y 类型
>
> ```typescript
> interface X { name: string; age: number; } 
> interface Y { name: string; age: number; hobbies: string[] }
> let x: X = { name: 'xiaoming', age: 16 }
> let y: Y = { name: 'xiaohong', age: 18, hobbies: ['eat'] }
> x = y
> 复制代码
> ```
>
> `逆变：printY = printX` 函数X 类型可以赋值给函数Y 类型，因为函数Y 在调用的时候参数是按照Y类型进行约束的，但是用到的是函数X的X的属性和方法，ts检查结果是类型安全的。这种特性就叫做逆变，函数的参数有逆变的性质。
>
> ```typescript
> let printY: (y: Y) => void
> printY = (y) => { console.log(y.hobbies) }
> let printX: (x: X) => void
> printX = (x) => { console.log(x.name) }
> printY = printX
> 复制代码
> ```
>
> `双变（双向协变）：X = Y；Y = X`父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”（ts2.x 之前支持这种赋值，之后 ts 加了一个编译选项 strictFunctionTypes，设置为 true 就只支持函数参数的逆变，设置为 false 则支持双向协变）
> `抗变（不变）：`非父子类型之间不会发生型变，只要类型不一样就会报错



### 装饰器

https://juejin.cn/post/7006483808832716813



### 函数重载

定义多个重载签名和一个实现签名，即类型和函数体，重载签名的类型不会合并，就是重载签名有number和string，但参数类型是number | string 会报错



# ts部分

+ 基本类型
+ interface和type

如何理解interface 和 type / 说说他们的相同点和不同点

+ 联合类型 交叉类型(这个类似于继承)

+ 元组，枚举
+ 泛型
+ 类型断言
+ 类型保护 typeof / instanceof / in / 类型谓词 xx is xx
+ 字面量类型
+ keyof关键字
+ Readonly
+ 索引签名， Ts对象的索引只能是string ,symbol, number(这个是为了数组和元组)
+ infer关键字

表示在 `extends` 条件语句中待推断的类型变量。

`type ParamType<T> = T extends (...args: infer P) => any ? P : T;`

如果 `T` 能赋值给 `(...args: infer P) => any`，则结果是 `(...args: infer P) => any` 类型中的参数 `P`，否则返回为 `T`

