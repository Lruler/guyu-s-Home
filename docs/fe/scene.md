---
title: 场景题
---

## 实现图片懒加载

懒加载，顾名思义，在当前网页，滑动页面到能看到图片的时候再加载图片
故问题拆分成两个：
如何判断图片出现在了当前视口 （即如何判断我们能够看到图片）
如何控制图片的加载
### 方案一: 位置计算 + 滚动事件 (Scroll) + DataSet API
**如何判断图片出现在了当前视口**

`clientTop`，`offsetTop`，`clientHeight` 以及 `scrollTop` 各种关于图片的静态高度作比对
动态高度，监听 `window.scroll` 事件

**如何控制图片的加载**

`<img data-src="shanyue.jpg" />`

首先设置一个临时 Data 属性 `data-src`，控制加载时使用 `src` 代替 `data-src`，可利用 DataSet API 实现

`img.src = img.datset.src`

### 方案二: getBoundingClientRect API + Scroll with Throttle + DataSet API
**如何判断图片出现在了当前视口**

引入一个新的 API， `Element.getBoundingClientRect()` 方法返回元素的大小及其相对于视口的位置。

那如何判断图片出现在了当前视口呢，代码如下。

```js
// clientHeight 代表当前视口的高度
img.getBoundingClientRect().top < document.documentElement.clientHeight;
```

**如何控制图片的加载**

用节流监听`window.scroll`

### 方案三: IntersectionObserver API + DataSet API
方案二使用的方法是: `window.scroll` 监听 `Element.getBoundingClientRect()` 并使用 `throttle` 节流

一系列组合动作太复杂了，于是浏览器出了一个三合一事件: IntersectionObserver API，一个能够监听元素是否到了当前视口的事件.

### 方案四: LazyLoading
浏览器自己的一个属性，不过兼容性一般

## 实现浏览器复制
这个简单 
```js
navigator.clipboard.writeText(text);
```

## 把JSON数据转化成demo.json文件并下载
1. 模拟下载，可以通过新建一个 `<a href="url" download><a>` 标签并设置 url 及 download 属性来下载
2. 可以通过把 json 转化为 `dataurl` 来构造 URL
3. 可以通过把 json 转换为 `Blob` 再转化为 `ObjectURL` 来构造 URL

## 简单介绍 requestIdleCallback 及使用场景
`requestIdleCallback `维护一个队列，将在浏览器空闲时间内执行。它属于 `Background Tasks API`，可以使setTimeout来模拟

在 rIC 中执行任务时需要注意以下几点：

执行重计算而非紧急任务
空闲回调执行时间应该小于 50ms，最好更少
空闲回调中不要操作 DOM，因为它本来就是利用的重排重绘后的间隙空闲时间，重新操作 DOM 又会造成重排重绘
React 的时间分片便是基于类似 rIC 而实现，然而因为 rIC 的兼容性及 50ms 流畅问题，React 自制了一个实现:[scheduler
](https://github.com/facebook/react/tree/main/packages/scheduler)

## 如何计算白屏时间和首屏时间
白屏时间: window.performance.timing.domLoading - window.performance.timing.navigationStart

首屏时间: window.performance.timing.domInteractive - window.performace.timing.navigationStart

## 什么是 Data URL
Data URL 是将图片转换为 base64 直接嵌入到了网页中，使用<img src="data:[MIME type];base64"/>这种方式引用图片，不需要再发请求获取图片。 使用 Data URL 也有一些缺点：

+ base64 编码后的图片会比原来的体积大三分之一左右。
+ Data URL 形式的图片不会缓存下来，每次访问页面都要被下载一次。可以将 Data URL 写入到 CSS 文件中随着 CSS 被缓存下来。

Data URL 是前缀为data:协议的 URL； 它允许内容创建者向文档中嵌入小文件，比如图片等。 Data URL 由四部分组成：

+ 前缀data:
+ 指示数据类型的 MIME 类型。例如image/jpeg表示 JPEG 图像文件；如果此部分被省略，则默认值为text/plain;charset=US-SACII
+ 如果为非文本数据，则可选 base64 做标记
+ 数据
`data:[mediatype][;base63], data`

## 在 Canvas 中如何处理跨域的图片
`img.setAttribute("crossOrigin", "anonymous");`

## 如何取消请求的发送
根据发送网络请求的 API 不同，取消方法不同

+ xhr
+ fetch
+ axios
如果使用XMLHttpRequest发送请求可以使用XMLHttpRequest.abort()

如果使用fetch发送请求可以使用AbortController
```js
const controller = new AbortController();
const signal = controller.signal;
fetch('https://somewhere', { signal })
controller.abort()
```
如果使用`axios`，取消原理同 fetch


# 大文件上传

核心是`利用 Blob.prototype.slice` 方法

预先定义好单个切片大小，将文件切分为一个个切片，然后借助 http 的可并发性，同时上传多个切片。这样从原本传一个大文件，变成了`并发`传多个小的文件切片，可以大大减少上传时间

另外由于是并发，传输到服务端的顺序可能会发生变化，因此我们还需要给每个切片记录顺序

```js
const SIZE = 10 * 1024 * 1024;     
// 生成文件切片
createFileChunk(file, size = SIZE) {
  const fileChunkList = [];
  let cur = 0;
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + size) });
    cur  = size;
  }
  return fileChunkList;
},
  // 上传切片
  async uploadChunks() {
    const requestList = this.data
    .map(({ chunk，hash }) => {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("hash", hash);
      formData.append("filename", this.container.file.name);
      return { formData };
    })
    .map(({ formData }) =>
         this.request({
      url: "http://localhost:3000",
      data: formData
    })
        );
    // 并发请求
    await Promise.all(requestList); 
```

### 断点续传

断点续传指的是在下载或上传时，将下载或上传任务（一个文件或一个压缩包）人为的划分为几个部分，每一个部分采用一个线程进行上传或下载，如果碰到网络故障或页面刷新，可以从已经上传或下载的部分开始继续上传下载未完成的部分，用户可以节省时间，提高速度。

> 断点续传的原理在于前端/服务端需要`记住`已上传的切片，这样下次上传就可以跳过之前已上传的部分，有两种方案实现记忆的功能
>
> - 前端使用 localStorage 记录已上传的切片 hash
> - 服务端保存已上传的切片 hash，前端每次上传前向服务端获取已上传的切片
>
> 第一种是前端的解决方案，第二种是服务端，而前端方案有一个缺陷，如果换了个浏览器就失去了记忆的效果，所以这里选后者
>
> `之前我们使用文件名 + 切片下标作为切片 hash`，这样做文件名一旦修改就失去了效果，而事实上只要文件内容不变，hash 就不应该变化，所以正确的做法是`根据文件内容生成 hash`，所以我们修改一下 hash 的生成规则
>
> 考虑到如果上传一个超大文件，读取文件内容计算 hash 是非常耗费时间的，并且会`引起 UI 的阻塞`，导致页面假死状态，所以我们使用 web-worker 在 worker 线程计算 hash，这样用户仍可以在主界面正常的交互

# 前端水印

#####  重复的dom元素覆盖实现

从效果开始，要实现的效果是「在页面上充满透明度较低的重复的代表身份的信息」，第一时间想到的方案是在页面上覆盖一个position:fixed的div盒子，盒子透明度设置较低，设置pointer-events: none;样式实现点击穿透，在这个盒子内通过js循环生成小的水印div，每个水印div内展示一个要显示的水印内容

#####  canvas / svg 输出背景图

第一步还是在页面上覆盖一个固定定位的盒子，然后创建一个canvas画布，绘制出一个水印区域，将这个水印通过toDataURL方法输出为一个图片，将这个图片设置为盒子的背景图，通过backgroud-repeat：repeat；样式实现填满整个屏幕的效果

> 但是，以上三种方法存在一个共同的问题，由于是前端生成dom元素覆盖到页面上的，对于有些前端知识的人来说，可以在开发者工具中找到水印所在的元素，将元素整个删掉，以达到删除页面上的水印的目的，针对这个问题，我想到了一个很笨的办法：设置定时器，每隔几秒检验一次我们的水印元素还在不在，有没有被修改，如果发生了变化则再执行一次覆盖水印的方法。网上看到了另一种解决方法：使用MutationObserver
>
> MutationObserver是变动观察器，字面上就可以理解这是用来观察节点变化的。Mutation Observer API 用来监视 DOM 变动，DOM 的任何变动，比如子节点的增减、属性的变动、文本内容的变动，这个 API 都可以得到通知。
>
> 但是MutationObserver只能监测到诸如属性改变、子结点变化等，对于自己本身被删除，是没有办法监听的，这里可以通过监测父结点来达到要求。

#####  图片加水印(圣诞树使用的方法)

有时我们需要在图片上加水印用来标示归属或者其他信息，在图片上加水印的实现思路是，图片加载成功后画到canvas中，随后在canvas中绘制水印，完成后通过canvas.toDataUrl()方法获得base64并替换原来的图片路径

设计模式

https://juejin.cn/post/7072175210874535967



# Token鉴权相关

### token

"token"通常是指一个字符串或数字，它用于验证和授权访问资源的身份验证凭据。当一个用户进行登录或者请求访问一个受保护的资源时，系统通常会生成一个token，并将其返回给用户。这个token在之后的请求中被用来验证用户的身份和授权。

在实际应用中，token通常需要加密或签名来保证其不被篡改或伪造。加密的方法通常有很多种，其中比较常用的是使用对称密钥加密算法，例如AES或者DES等。在这种加密方式下，系统将一个密钥存储在服务端，并用这个密钥对token进行加密。用户在每次请求时，都将token发送给服务端，并由服务端使用相同的密钥解密token。这样就能够确保token不会被其他人篡改或者伪造。

此外，还有一些基于非对称密钥加密算法的方法来加密token，例如RSA。在这种方法下，服务端使用自己的私钥对token进行加密，而客户端使用服务端的公钥来解密token。这种方法的优点是能够避免密钥的泄露问题，但是加密和解密的速度较慢，适用性不如对称密钥加密算法。

### 如何防止token泄漏

1. 使用https协议：使用https协议可以对网络传输进行加密，有效地防止了中间人攻击和窃听，保障了token的安全。
2. 不在前端存储敏感信息：不建议将敏感信息如token存储在前端本地存储，比如localStorage、sessionStorage等，可以将其存储在后端session或redis等缓存中。
3. 使用token有效期：可以设置token的有效期，在有效期内token才能被使用，过期后需要重新登录获取新的token。
4. 对请求进行身份验证：服务端可以对请求进行身份验证，验证token的正确性和有效期，只有验证通过的请求才能得到响应。
5. 增加token的复杂度：增加token的复杂度可以提高token的安全性，可以增加唯独，比如IP或者主机号
6. 使用单独的token：对于不同的应用场景可以使用不同的token，这样即使某一个token泄漏了，也只会影响对应的应用场景，降低了整个系统的安全风险。

### 鉴权方案

1. 基于Token的鉴权：在用户登录成功后，服务端颁发一个Token，客户端每次请求时需要携带这个Token，服务端验证Token的有效性来判断是否允许访问。

2. 基于Cookie的鉴权：在用户登录成功后，服务端返回一个带有用户信息的Cookie，客户端每次请求时会自动携带这个Cookie，服务端验证Cookie的有效性来判断是否允许访问。

3. 基于Session的鉴权：在用户登录成功后，服务端在后台为该用户创建一个Session，客户端每次请求时需要携带SessionID，服务端验证Session的有效性来判断是否允许访问。

4. 基于OAuth2的鉴权：OAuth2是一种授权机制，允许第三方应用在用户授权的情况下，通过访问用户授权的API资源，实现数据共享。OAuth2通常用于实现授权码模式、密码模式等多种鉴权方式。

### JWT

JWT是`json web token`缩写。它将用户信息加密到`token`里，服务器不保存任何用户信息。服务器通过使用保存的密钥验证`token`的正确性，只要正确即通过验证。

JWT包含三个部分： `Header`头部，`Payload`负载和`Signature`签名。由三部分生成`token`，三部分之间用“`.`”号做分割。

- `Header` 声明信息。 在`Header`中通常包含了两部分：`type`：代表`token`的类型，这里使用的是`JWT`类型。
  alg:使用的`Hash`算法，例如`HMAC SHA256`或`RSA`.
  `{ “alg”: “HS256”, “typ”: “JWT” }` 这会被经过base64Url编码形成第一部分

- `Payload token`的第二个部分是荷载信息，它包含一些声明Claim(实体的描述，通常是一个`User`信息，还包括一些其他的元数据)
  声明分三类:
  1)`Reserved Claims`,这是一套预定义的声明，并不是必须的,这是一套易于使用、操作性强的声明。包括：`iss(issuer)、exp(expiration time)、sub(subject)、aud(audience)`等
  2)`Plubic Claims`,
  3)`Private Claims`,交换信息的双方自定义的声明 `{ “sub”: “1234567890”, “name”: “John Doe”,“admin”: true }` 同样经过`Base64Url`编码后形成第二部分

- `signature` 使用`header`中指定的算法将编码后的`header`、编码后的`payload`、用`secret`进行加密。例如使用的是`HMAC SHA256`算法，大致流程类似于: `HMACSHA256( base64UrlEncode(header) + “.” + base64UrlEncode(payload),secret)`这个`signature`字段被用来确认`JWT`信息的发送者是谁，并保证信息没有被修改 。

- 验证流程：

  - 在头部信息中声明加密算法和常量，然后把`header`使用`json`转化为字符串
  - 在载荷中声明用户信息，同时还有一些其他的内容，再次使用json把在和部分进行转化，转化为字符串
  - 使用在`header`中声明的加密算法来进行加密，把第一部分字符串和第二部分的字符串结合和每个项目随机生成的`secret`字符串进行加密，生成新的字符串，此字符串是独一无二的
  - 解密的时候，只要客户端带着`jwt`来发起请求，服务端就直接使用`secret`进行解密，解签证解出第一部分和第二部分，然后比对第二部分的信息和客户端穿过来的信息是否一致。如果一致验证成功，否则验证失败。

  特点：

  - 三部分组成，每一部分都进行字符串的转化
  - 解密的时候没有使用数据库，仅仅使用的是`secret`进行解密
  - `Jwt`使用的`secret`千万不能丢失

  # 低代码方案

  可视化编辑器是前端低代码方案中常见的一种实现方式，可以通过可视化界面拖拽、拖拽组件，直观地搭建页面。同时，可视化编辑器通常会为开发者提供实时预览功能，以便及时查看页面的效果。

  模板化设计则是通过提前设计好一系列的页面模板，并让开发者在此基础上进行修改的方式，以提高开发效率。开发者可以基于已有的模板进行修改，而不需要从零开始编写页面。

  自动生成代码则是前端低代码方案中非常重要的一部分，通过预设好的逻辑和规则，让系统自动生成相应的代码。这种方式可以避免开发者重复编写大量的重复代码，提高代码质量和开发效率。

  # RESTFUL

  `REST`，全名 `Representational State Transfer`(表现层状态转移)，他是一种**设计风格**，一种**软件架构风格**，而**不是标准**，只是**提供了一组设计原则和约束条件**。

  `RESTful API` 就是满足 `REST `风格的，以此规范设计的 `API`。

  普通

  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e5e2e9dccc44a99a97009932cc624c6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 

  RESTFUL

  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df3dffda154247b491dbd7ef2fe786e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

  缺点：

  1、RESTful是面向资源的，所以接口都是一些名词，尤指复数名词。简单的CRUD还是很合适的，但很多业务逻辑都很难将其抽象为资源。比如说登录/登出，怎么看也不是一个资源，如果硬是抽象为创建一个session/删除一个session。这不仅反直觉，还违背了RESTful的思想。

  2、RESTful只提供了基本的增删改查，对于复杂的逻辑是一点办法没有，比如批量下载、批量删除等。对于复杂的查询，更是无从下手。而且开发时会面临诸多选择，修改资源用PUT还是PETCH？采用查询参数还是用body？

  3、关于错误码的问题更是复杂的一批，RESTful建议使用status code作为错误码，以便统一。在实际开发中，业务逻辑的含义数不胜数，很难统一。比如400状态码到底是表示传参有问题，还是该资源已被占用了。404是表示接口不存在，还是资源不存在。