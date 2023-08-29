---
title: 浏览器
---

浏览器内容
## 聊聊渲染合成层？

渲染合成层（Compositing Layer）是浏览器中的一个关键概念，用于优化页面的渲染性能和动画效果。它是浏览器渲染引擎的一部分，用于将页面元素分成多个层，并将这些层按照正确的顺序进行合成，以最终呈现在屏幕上。

以下是一些关于渲染合成层的重要信息：

1. **分层渲染**：渲染合成层允许浏览器将页面分解为多个独立的层。每个层都可以单独进行绘制和处理，这样可以减少不必要的重绘和重排操作。
2. **硬件加速**：渲染合成层利用硬件加速技术，将图形处理器（GPU）用于合成和渲染操作。这可以提高渲染性能，并实现流畅的动画和滚动效果。
3. **层的创建**：浏览器根据一些特定的规则将页面元素分为不同的层。具有特定属性或样式的元素，例如`position: fixed`、`opacity`、`transform`等，通常会被提升为独立的层。
4. **合成过程**：在合成阶段，浏览器将各个层的内容按照正确的顺序进行合成。这包括层的叠加、透明度混合、裁剪等操作，最终生成最终的图像输出。
5. **优化渲染性能**：渲染合成层可以减少页面的重绘和重排，从而提高渲染性能。只有发生变化的层才需要重新绘制，其他层可以保持不变，减少不必要的工作量。
6. **动画和滚动优化**：由于渲染合成层可以利用硬件加速和部分重绘的特性，因此可以实现更平滑和流畅的动画和滚动效果。这对于提供良好的用户体验非常重要。

渲染合成层的使用需要权衡各种因素，包括页面复杂性、设备性能和浏览器支持等。在一些复杂的动画和滚动效果中，显式地创建渲染合成层可以提供更好的性能。然而，在简单的页面中，可能不需要显式地创建渲染合成层，浏览器也会自动进行优化处理。

总体而言，渲染合成层是一种优化技术，旨在提高页面的渲染性能和动画效果。通过有效地使用渲染合成层，开发人员可以创建更流畅、响应更快的网页应用，并提供更好的用户体验。


浏览器打开URL
URL组成

## 网络安全攻击
#### XSS攻击

（Cross Site Scripting) 跨站脚本攻击，缩写css容易混淆，故改名xss

不过现在react和vue等一些前端框架支持的jsx写法，会默认转义成字符，所以前端到不用考虑太多如何防范，除非必须要用到dangerouslySetInnerHTML，仔细想了想我目前接触到的业务直接用这个属性的话，是只有转译markdown语法才会用到，however，几个开源的markdown解析库也都默认过滤掉`<script>`等一些可能会是xss攻击的脚本标签，所以现在的前端项目很难被xss攻击了，想更多了解的可以参考一下[这篇文章](https://tech.meituan.com/2018/09/27/fe-security.html)

#### CSRF攻击

CSRF（Cross-site request forgery）跨站请求伪造，典型流程为

- 受害者登录a.com，并保留了登录凭证（Cookie）。
- 攻击者引诱受害者访问了b.com。
- b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会默认携带a.com的Cookie。
- a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
- a.com以受害者的名义执行了act=xx。
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作。

防范看[这篇](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

后续还有

#### injection (注入攻击)

sql语句注入，这一般看后端防范了，当然我们要是用ORM + NoSql应该可以无视 :D

#### SSRF (服务端伪造请求)

Server-Side Request Forgery:服务器端请求伪造

#### DOS (把服务器搞崩)

DOS和DDOS [参考文章](https://www.yisu.com/news/id_393.html#:~:text=DoS%E6%98%AF%E2%80%9C%E6%8B%92%E7%BB%9D%E6%9C%8D%E5%8A%A1%E6%94%BB%E5%87%BB,%E7%A7%8D%E6%96%B0%E7%9A%84%E6%94%BB%E5%87%BB%E6%96%B9%E5%BC%8F%E3%80%82)

​
[浏览器](https://juejin.cn/post/6844904021308735502#heading-0)

## 在浏览器中输入Url后会发生什么？

老生常谈，简单的看下过程，分为如下几步

1. 输入地址

输入地址的时候浏览器已经开始工作了，会从历史记录，书签收藏等地方给出补全提示

2. 浏览器查找域名的 IP 地址

DNS 解析域名 先从本地硬盘的host文件找，有id就直接用

没有就会请求(`递归查询`，哎我查不到，你帮我查了吧)到本地的DNS服务器(中国电信啥的承包)

然后本地DNS服务器就开始查，比如www.baidu.com,其实后面严格还有个.root，是根域名，所有网站都有，就没隐藏了本地DNS问root，你有没有啊！root也不惯着他，我肯定没有啊，你去找com那小崽子吧！然后本地DNS服务器就只能再去访问com，com脾气也不好，又把本地轰到baidu那里，如此往复，这一步就叫`迭代查询`

最后的最后，本地DNS服务器不仅要把IP地址返回给用户电脑，还要把这个对应关系保存在缓存中，以备下次别的用户查询时，可以直接返回结果，加快网络访问。

3. 浏览器向 web 服务器发送一个 HTTP 请求

找到服务器了，就开始发请求要静态资源了，这一步到第六步的HTTP的部分在另一篇博客里，这里就不细说了

4. 服务器的永久重定向响应

5. 服务器处理请求

6. 服务器返回一个 HTTP 响应

7. 浏览器显示 HTML

就渲染过程呗，下面会讲

8. 浏览器发送请求获取嵌入在 HTML 中的资源（如图片、音频、视频、CSS、JS等等）

# 浏览器渲染网页过程

[参考链接](https://zhuanlan.zhihu.com/p/394223139)

+ 预解析

**当渲染引擎收到字节流之后，会开启一个预解析线程，用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。**

+ load

当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发 **load 事件**。 它与 DOMContentLoaded 不同，后者只要页面DOM加载完成就触发，无需等待依赖资源的加载。

所以渲染网页步骤为: 

1. 请求HTML文件，把HTML字节流解析构建成DOM Tree(栈的形式)，边加载边解析（ **流的性质**）
2. 此时如果执行到`<script>`脚本且没有defer或async属性时会触发页面渲染 就会阻塞DOM构建

![](http://segmentfault.com/img/bVcQV0)

defer:  脚本并行加载，等待HTML解析完成之后，按照加载顺序执行脚本，执行时机在DOMContentLoaded事件派发之前       

async:  脚本并行加载，加载完成之后立即执行，执行时机不确定，仍有可能阻塞HTML解析，执行时机在load事件派发之前

3. 但要注意,Js脚本是在CSS文件下载完生成CSSOM树后才开始执行的

4. DOM和CSSOM结合生成渲染树
5. 依据渲染树开始layout阶段，计算每个节点位置和大小

6. 浏览器绘制渲染节点

所以注意点就是，Js会直接阻塞DOM解析构建，但是JS的执行时机受CSS的影响，最终CSS（CSSOM）会影响DOM树的渲染，也可以说最终会影响布局树的生成（有的版本说是渲染树，差不多意思）

# 重排和重绘

根据渲染树布局，计算CSS样式，即每个节点在页面中的大小和位置等几何信息。HTML默认是流式布局的，CSS和js会打破这种布局，改变DOM的外观样式以及大小和位置。这时就要提到两个重要概念：replaint和reflow。

 replaint：屏幕的一部分重画，不影响整体布局，比如某个CSS的背景色变了，但元素的几何尺寸和位置不变。

 reflow： 意味着元件的几何尺寸变了，我们需要重新验证并计算渲染树。是渲染树的一部分或全部发生了变化。这就是Reflow，或是Layout。

 所以我们应该尽量减少reflow和replaint，我想这也是为什么现在很少有用table布局的原因之一。

display:none 会触发 reflow，visibility: hidden属性并不算是不可见属性，它的语义是隐藏元素，但元素仍然占据着布局空间，它会被渲染成一个空框，所以visibility:hidden 只会触发 repaint，因为没有发生位置变化。

激活CSS伪类也会引起重排

有些情况下，比如修改了元素的样式，浏览器并不会立刻 reflow 或 repaint 一次，而是会把这样的操作积攒一批，然后做一次 reflow，这又叫异步 reflow 或增量异步 reflow。

 有些情况下，比如 resize 窗口，改变了页面默认的字体等。对于这些操作，浏览器会马上进行 reflow。
 在浏览器中，当对元素的样式进行修改时，可能会触发浏览器执行重排（reflow）和重绘（repaint）操作。重排是指浏览器重新计算元素的几何属性（如位置、尺寸），并重新布局页面的过程。而重绘是指浏览器重新绘制元素的外观，但布局并没有改变。

以下是一些常见的CSS属性和操作，可能会引起重排和重绘：

引起重排的属性：

+ 盒模型相关属性：width、height、padding、margin、border等。
+ 定位属性：position、top、left、bottom、right等。
+ 布局属性：display、float、clear、flex等。
+ 字体相关属性：font-size、line-height、text-align等。
+ 盒子模型属性：box-sizing、overflow等。
+ 表格布局属性：table-layout、border-collapse等。
+ 获取元素尺寸的属性和方法：offsetWidth、offsetHeight、clientWidth、clientHeight、getBoundingClientRect()等。
引起重绘的属性：

+ 颜色相关属性：color、background-color、border-color等。
+ 文本样式属性：font-weight、text-decoration、text-transform等。
+ 盒子模型属性：border-style、border-width、border-radius、box-shadow等。
需要注意的是，重排的开销比重绘更大，因为它涉及到重新计算元素的几何属性和重新布局整个页面。因此，为了提高页面性能，尽量减少触发重排和重绘的操作，可以通过合并样式修改、使用 CSS 动画代替 JavaScript 动画、使用 CSS Transforms 等技术来优化页面渲染性能

## 浏览器缓存

[参考链接](https://www.jianshu.com/p/54cc04190252)

#### Service Worker

Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker的话，传输协议必须为 HTTPS。

**Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的**。

#### Memory Cache

Memory Cache 也就是内存中的缓存，主要包含的是当前中页面中已经抓取到的资源,例如页面上已经下载的样式、脚本、图片等。读取内存中的数据肯定比磁盘快,内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。 **一旦我们关闭 Tab 页面，内存中的缓存也就被释放了**。

#### Disk Cache

Disk Cache 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，**比之 Memory Cache 胜在容量和存储时效性上**。

#### Push Cache

Push Cache（推送缓存）是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。**它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂**，在Chrome浏览器中只有5分钟左右，同时它也并非严格执行HTTP头中的缓存指令。

那么为了性能上的考虑，大部分的接口都应该选择好缓存策略，**通常浏览器缓存策略分为两种：强缓存和协商缓存，并且缓存策略都是通过设置 HTTP Header 来实现的**。

- 浏览器每次发起请求，都会`先在浏览器缓存中查找该请求的结果以及缓存标识`
- 浏览器每次拿到返回的请求结果都会`将该结果和缓存标识存入浏览器缓存中`

### 强缓存

设置强缓存后, 页面第一次加载 走的是 disk(磁盘)缓存, 如果刷新页面就会走 memory(内存)缓存, 当然内存有限不是所以都能从disk(磁盘)缓存走到memory(内存)缓存的.如果memory(内存)满了,那么没进入memory(内存)缓存的还是从disk(磁盘)拿. 返回200 不会访问服务器

`强制缓存就是向浏览器缓存查找该请求结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程。`当浏览器向服务器发起请求时，服务器会将缓存规则放入HTTP响应报文的HTTP头中和请求结果一起返回给浏览器，控制强制缓存的字段分别是 `Expires` 和 `Cache-Control`，其中Cache-Control优先级比Expires高。因为前者是HTTP1.1产物，后者是过时的1.0产物

强缓存判断是否缓存的依据来自于是否超出某个时间或者某个时间段，而不关心服务器端文件是否已经更新，这可能会导致加载文件不是服务器端最新的内容

强制缓存的情况主要有三种(暂不分析协商缓存过程)，如下：

1. 不存在该缓存结果和缓存标识，强制缓存失效，则直接向服务器发起请求（跟第一次发起请求一致）。
2. 存在该缓存结果和缓存标识，但该结果已失效，强制缓存失效，则使用协商缓存。
3. 存在该缓存结果和缓存标识，且该结果尚未失效，强制缓存生效，直接返回该结果。

### 协商缓存

默认缓存, 一次进入页面向后端请求资源, 如果刷新页面则和后端资源比对Etag 是否有改变,如果没有则使用已有资源,如果改变,则重新请求资源

html这类文件不建议设置强缓存,就算设置后,浏览器第一次进来走disk缓存, 如果手动刷新还是会走协商缓存

设置强缓存就是在 response header 中 配置 Cache-Control

`协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程`，同样，协商缓存的标识也是在响应报文的HTTP头中和请求结果一起返回给浏览器的，控制协商缓存的字段分别有：`Last-Modified / If-Modified-Since` 和 `Etag / If-None-Match`，其中Etag / If-None-Match的优先级比Last-Modified / If-Modified-Since高。协商缓存主要有以下两种情况：

1. 协商缓存生效，返回304
2. 协商缓存失效，返回200和请求结果结果

### 介绍下304过程

- a. 浏览器请求资源时首先命中资源的Expires 和 Cache-Control，Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效，可以通过Cache-control: max-age指定最大生命周期，状态仍然返回200，但不会请求数据，在浏览器中能明显看到from cache字样。
- b. 强缓存失效，进入协商缓存阶段，首先验证ETag,ETag可以保证每一个资源是唯一的，资源变化都会导致ETag变化。服务器根据客户端上送的If-None-Match值来判断是否命中缓存。
- c. 协商缓存Last-Modify/If-Modify-Since阶段，客户端第一次请求资源时，服务服返回的header中会加上Last-Modify，Last-modify是一个时间标识该资源的最后修改时间。再次请求该资源时，request的请求头中会包含If-Modify-Since，该值为缓存之前返回的Last-Modify。服务器收到If-Modify-Since后，根据资源的最后修改时间判断是否命中缓存。

### 缓存的整体流程

强缓存 => 协商缓存 => 资源请求

如果强缓存和协商缓存任何一个有命中就不会往下走

#### 禁止浏览器缓存

1. 设置 HTTP 响应头：在服务器端，你可以设置一些 HTTP 响应头来控制浏览器的缓存行为。以下是一些常用的 HTTP 响应头：

   - `Cache-Control: no-store`：告诉浏览器不要存储任何关于客户端请求和服务器响应的缓存信息。
   - `Cache-Control: no-cache`：告诉浏览器可以缓存资源，但必须在使用前验证资源的新鲜度（即向服务器发起新的请求）。
   - `Pragma: no-cache`：类似于 `Cache-Control: no-cache`，但适用于 HTTP/1.0 协议。
   - `Expires: 0` 或 `Expires: -1`：将资源的过期时间设置为一个过去的时间，使其立即过期。

2. 使用 `<meta>` 标签：在 HTML 页面中，你可以使用 `<meta>` 标签设置一些缓存控制指令。这种方法对于无法直接设置 HTTP 响应头的静态页面或第三方托管服务特别有用。

3. 添加 URL 时间戳或哈希：对于特定资源（如 JavaScript、CSS 或图片文件），你可以在 URL 中添加时间戳或哈希值作为查询参数。这将使浏览器将资源视为新的版本，从而避免使用缓存的副本。请注意，这种方法不会禁止浏览器缓存资源，而是强制浏览器在每次请求时获取新的版本。

# 浏览器存储

## sessionStorage、localStorage、cookie

相同点：都保存在浏览器端，同源的：
不同点：

1. 传递方式不同

   cookie数据始终在同源的http请求中携带(即使不需要)，即cookie在浏览器和服务器间来回传递。

   sessionStorage和loaclStorage不会自动把数据发给服务器，仅在本地保存。

2. 数据大小不同
   cookie数据还有路径(path)的概念，可以限制cookie只属于某个路径下。

   

   存储大小限制也不同，cookie数据不能超过4k，同时因为每次http请求都会携带cookie，所以cookie只适合保存很小的数据，如会话标识。

   sessionStorage和localStorage虽然也有存储大小的限制,但比cookie大得多，可以达到5M或者更大。

3. 数据有效期不同

   sessionStorage:仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；

   localStorage:始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；

   cookie只在设置cookie过期时间之前一直有效，即使窗口或浏览器关闭。

4. 作用域不同
   sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；

   localStorage在所有同源窗口中都是共享的；

   cookie也是在所有同源窗口中都是共享的。

   Web Storage支持事件通知机制，可以将数据更新的通知发送给监听者。

   Web Storage的api接口使用更方便。

indexedDB 就理解为一个本地的非关系型数据库

# cookie和session还有Jwt

**Cookie的内容是保存一小段文本信息，这些文本信息组成一份通行证。它是客户端对于无状态协议的一种解决方案。**

（1）客户端第一次请求时，发送数据到服务器。

（2）服务器返回响应信息的同时，还会传回一个cookie（cookie S-001）

（3）客户端接收服务器的响应之后，浏览器会将cookie存放在一个统一的位置。

（4）客户端再次向服务器发送请求的时候，会把Cookie S-001再次发挥服务器。

cookoe的生存时间是整个会话期间：浏览器会将cookie保存在内存中，浏览器关闭时自动删除这个cookie

cookie的生存时间是长久有效的：手动将cookie报存在客户端的硬盘中，浏览器关闭的话，cookie页不会清除；下次在打开浏览器访问对应网站内容，这个cookie就会自动再次发送到服务器

session 

（1）服务器在处理客户端请求过程中会创建session，并且为该session生存唯一的session ID。（这个session ID在随后的请求中会被用来重新获得已经创建的session。在session被创建后，就可以调用session相关的方法向session中新增内容，这些内容只会保存在服务器中）

（2）服务器将session ID发送到客户端

（3）当客户端再次请求时，就会带上这个session ID

（4）服务器接收到请求之后就会一句Session ID 找到相应的Session ，完成请求

ps：1、虽然session保存在服务器，但它还是需要客户端浏览器的支持，因为session需要使用cookie作为识别标志。服务器会向客户端发送一个名为JSEDDIONID的cookie，它的值为session ID。

2、当cookie被禁用时，可以使用url重写的方法：将session写在URL中，服务器在进行解析
session的生命周期：

与cookie一样，服务器也能设置session的生效时间。

## cookie和session的区别

1、存储位置不同：session存储在服务器，cookie存储在客户端

2、存储容量不同：单个cookie保存数据小于等于4kb，一个站点最多保存20个cookie；session没有上限，但是由于服务器内存性能考虑，session不要存太多东西，并有删除机制

3、存取方式不同：cookie只能保存ASCII字符串；session能存取任何类型的数据

4、隐私策略不同：cookie是对客户端是可见的，可以分析存放在本地的cookie并进去cookie欺骗；session存储在服务器上，对于客户端是透明的，不存在敏感信息泄露的风险

5、服务器压力不同：session是保存在服务端，每隔用户都会产生一个session。加入并发访问的用户太多，会产生很多的session，对服务器是一个很大的负担，耗费大量内存

cookie保管在客户端，不占用服务器资源。对于并发用户十分多的网站，session是一个很好的选择。

6、浏览器的支持不同：session不支持新建窗口，只支持字窗口。而cookie都支持。

假设浏览器禁用cookie，session可以通过URL重写的方法实现。COOKIE就派不上用场。

前端 JavaScript 可以修改 Cookie。可以通过 `document.cookie` 属性来读取和设置 Cookie。例如，要设置一个名为 `username` 的 Cookie，可以这样做：

   ```javascript
document.cookie = "username=John Doe; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
   ```

   这里，`expires` 是 Cookie 的过期时间，`path` 是 Cookie 的作用路径。需要注意的是，设置 `document.cookie` 时，只会修改指定的 Cookie，不会影响其他 Cookie。

2. 在不发请求的情况下读取 Cookie：是的，前端 JavaScript 可以在不发请求的情况下读取 Cookie。可以通过 `document.cookie` 属性来读取当前页面的所有 Cookie。例如：

   ```javascript
   console.log(document.cookie);
   ```

   需要注意的是，`document.cookie` 只能访问当前域下的 Cookie，无法访问其他域的 Cookie。此外，带有 `HttpOnly` 标志的 Cookie 无法通过 JavaScript 访问，以防止跨站脚本攻击（XSS）。

3. 后端修改 Cookie：在后端，可以通过设置 HTTP 响应的 `Set-Cookie` 头来修改 Cookie。这可以在不同的编程语言和框架中实现。以下是一个使用 Node.js 和 Express 框架的示例：

   ```javascript
   const express = require('express');
   const app = express();
   
   app.get('/', (req, res) => {
       res.cookie('username', 'John Doe', { expires: new Date(Date.now() + 86400000), httpOnly: true });
       res.send('Cookie has been set.');
   });
   
   app.listen(3000, () => {
       console.log('Server is running on port 3000');
   });
   ```

   在这个示例中，我们使用 `res.cookie()` 方法设置了一个名为 `username` 的 Cookie，并指定了过期时间和 `HttpOnly` 标志。当客户端请求这个页面时，服务器会发送一个包含 `Set-Cookie` 头的响应，浏览器会根据这个响应头来设置或更新 Cookie。

Cookie 是用于在客户端存储少量数据的一种机制。Cookie 具有以下属性：

1. Name：Cookie 的名称。每个 Cookie 必须有一个唯一的名称，用于在后续操作中识别它。

2. Value：Cookie 的值。这是与 Cookie 名称关联的实际数据。值可以是任意字符串，通常需要进行 URL 编码以确保特殊字符不会引起问题。

3. Domain：Cookie 的作用域名。此属性定义了哪些域名可以访问此 Cookie。如果未指定，Cookie 的作用域名将默认为创建 Cookie 的页面的域名。

4. Path：Cookie 的作用路径。此属性定义了在特定域名下的哪些路径可以访问此 Cookie。例如，如果路径设置为 `/blog`，则只有 `/blog` 下的页面可以访问此 Cookie。如果未指定，路径将默认为创建 Cookie 的页面的路径。

5. Expires / Max-Age：Cookie 的过期时间。可以使用 `Expires` 属性设置一个具体的过期日期和时间，或使用 `Max-Age` 属性设置一个相对于当前时间的过期时长（以秒为单位）。如果未指定，Cookie 将在浏览器会话结束时过期（即会话 Cookie）。

6. Secure：此属性表示 Cookie 是否仅应通过安全（加密）连接（如 HTTPS）传输。如果设置了 `Secure` 属性，浏览器将仅在安全连接上发送此 Cookie。

7. HttpOnly：此属性表示 Cookie 是否仅应通过 HTTP(S) 请求传输，而不允许通过客户端 JavaScript 访问。这有助于防止跨站脚本攻击（XSS）。

8. SameSite：此属性允许服务器指定 Cookie 是否应在跨站点请求中发送。`SameSite` 属性可以设置为以下值之一：

   - `Strict`：仅在同站点请求中发送 Cookie。
   - `Lax`：在同站点请求中发送 Cookie，并在跨站点请求中发送部分 Cookie（如导航到目标网站的 GET 请求）。
   - `None`：在同站点和跨站点请求中发送 Cookie。需要与 `Secure` 属性一起使用。

这些属性用于配置 Cookie 的行为，以满足特定应用程序的需求和安全要求。在设置 Cookie 时，建议根据实际情况选择适当的属性。

## Json Web Token的原理：

（1）客户端第一次请求时，发送用户信息到服务器。服务器对用户信息使用HSA256算法及密钥进行签名，再将这个签名和数据一起作为token返回给客户户端。

（2）服务端不再保存token，客户端保存token。

（3）当客户端再次发送请求时，在请求信息中将token一起发送给服务器。

（4）服务器用同样的HSA256算法和密钥，对数据再计算一次签名，和token的签名做比较

（5）如果相同，服务器就知道客户端登录过，则反之。
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

## 附加一个问题：cookie和token都存放在header中，为什么不会劫持token？

浏览器发送请求的时候不会自动带上token，而cookie在浏览器发送请求的时候会被自动带上。

csrf就是利用的这一特性，所以token可以防范csrf，而cookie不能。

# 浏览器跨域

跨域就是浏览器同源策略导致的，只有当

**protocol（协议）、domain（域名）、port（端口）三者一致。** 才算同源。

跨域解决方法

#### CORS

跨域资源共享([CORS](https://link.segmentfault.com/?enc=EgrgJole7grtLFNjtmxsSw%3D%3D.qExhxumzPgc9h1BSFKG5KCHMfP5wTnu2nVh1vIrv38ZIITyjcErRaza%2BKu9ZyvLJLGFJjEhNWt4B7IBLZR1WMg%3D%3D)) 是一种机制，它使用额外的[HTTP](https://link.segmentfault.com/?enc=VUR%2Ffqj2EPiJOUl186GQTw%3D%3D.fy2o4A3yaoSvk9vbJQ0bvebaKz2OIjGDfSUqhy5469zGcE7%2BFnr716GPDKeXBTLwVs9yiPwPiqO7g0hmy4ZQjg%3D%3D)头来告诉浏览器 让运行在一个 origin (domain) 上的 Web 应用被准许访问来自不同源服务器上的指定的资源。当一个资源从与该资源本身所在的服务器**不同的域、协议或端口**请求一个资源时，资源会发起一个**跨域 HTTP 请求**。

而在 cors 中会有`简单请求`和`复杂请求`的概念。

简单请求不会出发CORS预检

- 请求方法：GET、POST、HEAD
- 除了以下的请求头字段之外，没有自定义的请求头
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type
  - [DPR](https://link.segmentfault.com/?enc=ER1rlIX%2B%2Bh78XtEYFjHdrA%3D%3D.YqX%2FmVDXDk4nqwZv581zH9XM4ATycN4xENpVH6jsQTVzqvMZcrPISAI6AVdGlwdrd5V%2BpT6kfNwWd0zGWYONRw%3D%3D)
  - [Downlink](https://link.segmentfault.com/?enc=j6z1KZJElM%2Bm4mu%2FDrtbRg%3D%3D.6Mz9HbkI9ndVfhzCdxtVptGQOqrxJMsIW8ZFcWEsMssoBhDI7vb0eiorTpEmo6KnXWwqWuysDrSDyz5ps2ok0Q%3D%3D)
  - [Save-Data](https://link.segmentfault.com/?enc=1f%2Bu4r%2Fq38MnjxXNbV0HpQ%3D%3D.RH%2BL6a6W5JTkidy1jd32alE6DvUbhd9%2BNJwNH6ffYf1EpAjjJ0KW%2BYlfRklyE2f6ZCKK%2B20CWSWvjpFUJO%2FyVQ%3D%3D)
  - [Viewport-Width](https://link.segmentfault.com/?enc=h3gQU2pXTqfT%2B7Lxj6mFVA%3D%3D.0qhddR78fH1AgR3uer7YprQ2D%2BG3T%2FHqNId3R0geQ3DvwEAx%2BQfUxIZ3JmsmebXoV9an6uxzqRd%2BjMfIID9KTuEVuDcEIqVhaNeQ8Sfn03o%3D)
  - [Width](https://link.segmentfault.com/?enc=3jPpegKpERjwauTj3LIpcg%3D%3D.qPD8K9H1b3tym%2BHN9dxVWKJEdKGhX4JstPbL%2FkazdVmhD4YIa0bruQQNSTqctepUqRuiXdVErHKICfsFOcT8bg%3D%3D)
- Content-Type的值只有以下三种`(Content-Type一般是指在post请求中，get请求中设置没有实际意义)`
  - text/plain
  - multipart/form-data
  - application/x-www-form-urlencoded
- 请求中的任意XMLHttpRequestUpload 对象均没有注册任何事件监听器 `(未验证)`
  - XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问
- 请求中没有使用 ReadableStream 对象 `(未验证)`

此时需要

```
Access-Control-Allow-Origin:*
// 如果只是针对某一个请求源进行设置的话，可以设置为具体的值
Access-Control-Allow-Origin: 'http://www.yourwebsite.com'
```

针对复杂请求(不是简单请求的请求)，我们需要设置不同的响应头。因为在预检请求的时候会携带相应的请求头信息

```
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-CUSTOMER-HEADER, Content-Type

// 相应的相应头信息
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
// 设置max age，浏览器端会进行缓存。没有过期之前真对同一个请求只会发送一次预检请求
Access-Control-Max-Age: 86400
```

#### Node 正向代理

代理的思路为，利用服务端请求不会跨域的特性，让接口和当前站点同域。

正向代理（forward proxy）：是一个位于客户端和目标服务器之间的服务器(代理服务器)，为了从目标服务器取得内容，客户端向代理服务器发送一个请求并指定目标，然后代理服务器向目标服务器转交请求并将获得的内容返回给客户端。

租房客 => 中介 => 房东

客户端 => 正向代理服务器 => 实际服务器

#### Nginx 反向代理

反向代理（reverse proxy）：是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

租房客 => 二房东 => 房东

客户端 => 反向代理服务器 => 实际服务器

总结就是 正向代理代理客户端，反向代理代理服务端，正向代理知道服务端的最终id，正向代理不知道，甚至不知道自己访问了一个代理服务器

#### 脚手架工具代理

比如webpack啊,vite啊，vue-cil啊等，都提供了配置项

#### JSONP

`JSONP`主要就是利用了`script`标签没有跨域限制的这个特性来完成的。 但只支持GET

### Websocket

不同于HTTP的一种协议哈，做即使通信的，比如在线聊天，还没学

#### Js方法

**window.postMessage()**，document.domain + Iframe，window.location.hash + Iframe，[window.name](https://link.segmentfault.com/?enc=izYr1tbtDpA3B8gAADMnIg%3D%3D.WW9r8fsQvoGifEygxrO7t1u%2FnWWwJbBEecSB3kSILdM%3D)+ Iframe

#### 浏览器直接开启允许跨域

1. 图片跨域：图片跨域是指从一个域加载的脚本试图访问另一个域加载的图片数据。通常，将图片插入到 HTML 页面中并不受同源策略的限制，但当你试图使用 JavaScript（如 `<canvas>` 元素）操作图片数据时，就可能受到同源策略的限制。

为了解决这个问题，可以在服务器端为图片资源设置 `Access-Control-Allow-Origin` 响应头，允许特定域名或所有域名访问图片资源。同时，在客户端，需要为 `<img>` 标签设置 `crossOrigin` 属性。

```html
<img src="https://example.com/image.jpg" crossorigin="anonymous" />
```

2. Cookie 跨域：Cookie 跨域是指一个域下的脚本试图访问另一个域的 Cookie。根据同源策略，不同域之间的 Cookie 是隔离的，无法直接访问。

为了实现跨域访问 Cookie，可以使用以下方法之一：

- 服务器端设置：可以在服务器端设置 `Access-Control-Allow-Credentials` 响应头为 `true`，并设置 `Access-Control-Allow-Origin` 为具体的域名（不能为 `*`）。这样，客户端在发送请求时可以携带 Cookie。
- JSONP：JSONP 是一种跨域通信的技术，通过动态插入 `<script>` 标签来实现。由于 `<script>` 标签不受同源策略限制，因此可以从其他域获取数据。但 JSONP 只支持 GET 请求，且存在安全风险。
- 使用代理：可以在同源服务器上设置一个代理，将请求转发到目标服务器。这样，客户端的请求看起来就像是在访问同源服务器，从而绕过同源策略的限制。

# 后端模版渲染，客户端渲染，node中间层，SSR区别

[参考链接](https://segmentfault.com/a/1190000016704384)

#### 后端模版渲染

1. 前端请求一个地址 `url`
2. 后端接收到这个请求，然后根据请求信息，从数据库或者其他地方获取相应的数据
3. 使用模板引擎（如 `java > jsp`、`php > smarty`）将这些数据渲染成 `html`
4. 将 `html` 文本返回给前端

缺点

1. 前后端杂揉在一起，不方便本地开发、本地模拟调试，也不方便自动化测试
2. 前端被约束在后端开发的模式中，不能充分使用前端的构建生态，开发效率低下
3. 项目难以管理和维护，也可能会有前后端职责不清的问题

尽管如此，但因为这种方式是最早出现的方式，并且这种渲染方式有一个好处，就是前端能够快速呈现服务器端渲染好的页面，而不用等客户端渲染，这能够提供很好的用户体验与 SEO 友好，所以当下很多比较早的网站或者需要快速响应的展示性网站仍然是使用这种方式



### 客户端渲染

就是react，vue这些框架的主流渲染方式，客户端渲染的页面渲染都是在客户端进行，后端不负责任何的渲染，只管数据交互。

1. 前端请求一个地址 `url`
2. 后端接收到这个请求，然后把相应的 `html` 文件直接返回给前端
3. 前端解析 `js` 后，然后通过 `ajax` 向后台获取相应的数据
4. 然后由 `js` 将这些数据渲染成页面

这样一来，前端与后端将完全解耦，数据使用全 `ajax` 的方式进行交互，如此便可前后端分离了。

其实，不难看出，客户端渲染与前后端分离有很大的好处：

1. 前端独立出来，可以充分使用前端生态的强大功能
2. 更好的管理代码，更有效率的开发、调试、测试
3. 前后端代码解耦之后，能更好的扩展、重构

所以，客户端渲染与前后端分离现在已经是主流的开发方式了。

但这种方式也有一些不足：

1. 首屏加载缓慢，因为要等 `js` 加载完毕后，才能进行渲染
2. SEO 不友好，因为 `html` 中几乎没有可用的信息



### node中间层

为了解决客户端渲染的不足，便出现了 node 中间层的理念。

传统的 B/S 架构中，是 `浏览器 -> 后端服务器 -> 浏览器`，上文所讲的都是这种架构。

而加入了 node 中间层之后，就变成 `浏览器 -> node -> 后端服务器 -> node -> 浏览器`。

这样做，达到了以下的目的：

1. 保留后端模板渲染、首屏快速响应、SEO 友好
2. 保留前端后分离、客户端渲染的功能（首屏服务器端渲染、其他客户端渲染）

但这种方式也有一些不足：

1. 增加了一个中间层，应用性能有所降低
2. 增加了架构的复杂度、不稳定性，降低应用的安全性
3. 对开发人员要求高了很多



### SSR

服务端渲染，就是在服务端把react，vue实例解析编译成HTcd

1. 客户端发送请求给服务器
2. 服务器读取模板，解析成dom节点，返回一个完整的首屏html结构
3. 客户端进行首屏激活（把用户写的交互的代码，在前端激活，重新变成一个spa应用）
4. 这样后续，用户再点击超链接、跳转时，不会再向服务器发送请求了，而是使用前端路由跳转，只会发送一些ajax请求数据

提一下SPA（single-page application），单页应用，通过JS动态重写页面



### 说下进程、线程和协程

**进程**是一个具有一定独立功能的程序在一个数据集上的一次动态执行的过程，`是操作系统进行资源分配和调度的一个独立单位`，是应用程序运行的载体。进程是一种抽象的概念，从来没有统一的标准定义。

**线程**是程序执行中一个单一的顺序控制流程，是`程序执行流的最小单元`，是处理器调度和分派的基本单位。一个进程可以有一个或多个线程，各个线程之间共享程序的内存空间(也就是所在进程的内存空间)。一个标准的线程由线程ID、当前指令指针(PC)、寄存器和堆栈组成。而进程由内存空间(代码、数据、进程空间、打开的文件)和一个或多个线程组成。

**协程**，英文Coroutines，是一种`基于线程之上，但又比线程更加轻量级的存在`，这种由程序员自己写程序来管理的轻量级线程叫做『用户空间线程』，具有对内核来说不可见的特性。

**进程和线程的区别与联系**

【区别】：
 调度：线程作为调度和分配的基本单位，进程作为拥有资源的基本单位；
 并发性：不仅进程之间可以并发执行，同一个进程的多个线程之间也可并发执行；
 拥有资源：进程是拥有资源的一个独立单位，线程不拥有系统资源，但可以访问隶属于进程的资源。
 系统开销：在创建或撤消进程时，由于系统都要为之分配和回收资源，导致系统的开销明显大于创建或撤消线程时的开销。但是进程有独立的地址空间，一个进程崩溃后，在保护模式下不会对其它进程产生影响，而线程只是一个进程中的不同执行路径。线程有自己的堆栈和局部变量，但线程之间没有单独的地址空间，一个进程死掉就等于所有的线程死掉，所以多进程的程序要比多线程的程序健壮，但在进程切换时，耗费资源较大，效率要差一些。

【联系】： 一个线程只能属于一个进程，而一个进程可以有多个线程，但至少有一个线程；
 资源分配给进程，同一进程的所有线程共享该进程的所有资源；
 处理机分给线程，即真正在处理机上运行的是线程；
 线程在执行过程中，需要协作同步。不同进程的线程间要利用消息通信的办法实现同步。

传送门 ☞ [# 一文搞懂进程、线程、协程及JS协程的发展](https://juejin.cn/post/7005465381791875109) [☞了解更多](https://link.juejin.cn?target=http%3A%2F%2Fwww.360doc.com%2Fcontent%2F20%2F0417%2F14%2F32196507_906628857.shtml)

关于浏览器传送门 ☞[# 深入了解现代 Web 浏览器](https://juejin.cn/post/6993095345576083486)

### 僵尸线程和孤儿线程

孤儿进程:父进程退出了，而它的一个或多个进程还在运行，那这些 子进程都会成为孤儿进程。孤儿进程将被 init 进程(进程号为 1)所 收养，并由 init 进程对它们完成状态收集工作。

僵尸进程:子进程比父进程先结束，而父进程又没有释放子进程占用 的资源，那么子进程的进程描述符仍然保存在系统中，这种进程称之 为僵尸进程。

### 实现浏览器标签页之间的通信

标签页无法直接通信，所以通过中介者模式来实现，即找一个中介者

1. websocket
2. 使用ShareWorker,shareWorker 会在页面存在的生命周期 内创建一个唯一的线程，并且开启多个页面也只会使用同一个线程。 这个时候共享线程就可以充当中介者的角色。标签页间通过共享一个 线程，然后通过这个共享的线程来实现数据的交换。
3. 使用localStorage
4. 使用 postMessage

### 浏览器事件和事件模型

事件是用户操作网页时发生的交互动作，比如 click/move， 事件除 了用户触发的动作外，还可以是文档加载，窗口滚动和大小调整。事 件被封装成一个 event 对象，包含了该事件发生时的所有相关信息 ( event 的属性)以及可以对事件进行的操作( event 的方法)。

事件是用户操作网页时发生的交互动作或者网页本身的一些操作，现 代浏览器一共有三种事件模型:

+ DOM0 级事件模型，这种模型不会传播，所以没有事件流的概念，但 是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义 监听函数，也可以通过 js 属性来指定监听函数。所有浏览器都兼容 这种方式。直接在 dom 对象上注册事件名称，就是 DOM0 写法。

+ IE 事件模型，在该事件模型中，一次事件共有两个过程，事件处理 阶段和事件冒泡阶段。事件处理阶段会首先执行目标元素绑定的监听 事件。然后是事件冒泡阶段，冒泡指的是事件从目标元素冒泡到 document，依次检查经过的节点是否绑定了事件监听函数，如果有则 执行。这种模型通过 attachEvent 来添加监听函数，可以添加多个 监听函数，会按顺序依次执行。

+ DOM2 级事件模型，在该事件模型中，一次事件共有三个过程，第一 个过程是事件捕获阶段。捕获指的是事件从 document 一直向下传播 到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有 则执行。后面两个阶段和 IE 事件模型的两个阶段相同。这种事件模 型，事件绑定的函数是 addEventListener，其中第三个参数可以指 定事件是否在捕获阶段执行。

# Event Loop

首先JS是单线程的

可以把 CPU 理解为一个工厂 然后进程理解为 工厂的车间

工厂的电 只能供一个车间使用  也就是说 一个CPU(单核) 同一时间只能运行一个进程 CPU使用时间片轮转进度算法来实现同时运行多个`进程`

一个车间里面 有很多机器流程 他们共享车间的资源 每一个流程都是一个线程

一个线程崩掉 这个进程就无法正常工作

浏览器是多进程的 什么是多进程 可以理解为 对于操作系统来说，每一个app都是一个进程，而每一个app又有许多功能模块，这些功能模块都是通过子进程来实现的，我们就叫这种模式为多进程。

浏览器的每一个Tab页 都可以理解为是一个子进程

### 浏览器包含的进程

- 主进程

  - 协调控制其他子进程（创建、销毁）
  - 浏览器界面显示，用户交互，前进、后退、收藏
  - 将渲染进程得到的内存中的Bitmap，绘制到用户界面上
  - 处理不可见操作，网络请求，文件访问等

- 第三方插件进程

  - 每种类型的插件对应一个进程，仅当使用该插件时才创建

- GPU进程

  - 用于3D绘制等

- ```
  渲染进程 ，就是我们说的 浏览器内核
  ```

  - 负责页面渲染，脚本执行，事件处理等
  - 每个tab页一个渲染进程

那么浏览器中包含了这么多的进程，那么对于普通的前端操作来说，最重要的是什么呢？

答案是`渲染进程`，也就是我们常说的`浏览器内核`

### 渲染进程

- ```
  GUI渲染线程
  ```

  - 负责渲染页面，布局和绘制
  - 页面需要重绘和回流时，该线程就会执行
  - 与js引擎线程互斥，防止渲染结果不可预期

- ```
  JS引擎线程
  ```

  - 负责处理解析和执行javascript脚本程序
  - 只有一个JS引擎线程（单线程）
  - 与GUI渲染线程互斥，防止渲染结果不可预期

- ```
  事件触发线程
  ```

  - 用来控制事件循环（鼠标点击、setTimeout、ajax等）
  - 当事件满足触发条件时，将事件放入到JS引擎所在的执行队列中

- ```
  定时触发器线程
  ```

  - setInterval与setTimeout所在的线程
  - 定时任务并不是由JS引擎计时的，是由定时触发线程来计时的
  - 计时完毕后，通知事件触发线程

- ```
  异步http请求线程
  ```

  - 浏览器有一个单独的线程用于处理AJAX请求
  - 当请求完成时，若有回调函数，通知事件触发线程。

>在前端开发中我们会通过`setTimeout/setInterval`来指定定时任务，会通过`XHR/fetch`发送网络请求， 接下来简述一下`setTimeout/setInterval`和`XHR/fetch`到底做了什么事
>
>我们知道，不管是`setTimeout/setInterval`和`XHR/fetch`代码，在这些代码执行时， 本身是同步任务，而其中的回调函数才是异步任务。
>
>当代码执行到`setTimeout/setInterval`时，实际上是`JS引擎线程`通知`定时触发器线程`，间隔一个时间后，会触发一个回调事件， 而`定时触发器线程`在接收到这个消息后，会在等待的时间后，将回调事件放入到由`事件触发线程`所管理的`事件队列`中。
>
>当代码执行到`XHR/fetch`时，实际上是`JS引擎线程`通知`异步http请求线程`，发送一个网络请求，并制定请求完成后的回调事件， 而`异步http请求线程`在接收到这个消息后，会在请求成功后，将回调事件放入到由`事件触发线程`所管理的`事件队列`中。
>
>当我们的同步任务执行完，`JS引擎线程`会询问`事件触发线程`，在`事件队列`中是否有待执行的回调函数，如果有就会加入到执行栈中交给`JS引擎线程`执行



DomContentLoaded在DOM Tree建立后运行 只监控DOM Tree

window.onload在页面所有资源加载完后运行 监控当前网页所有资源

LocalStorage 是一种浏览器端存储数据的方式，它的容量大小一般是在 5MB 到 10MB 之间的，具体的大小与不同的浏览器和操作系统有关。如果您需要存储更多的数据，可以考虑使用 IndexedDB 和 WebSQL 等其他浏览器端存储方案。

对于sessionStorage，每个页面都有自己独立保存了一份sessionStorage，就算是几个窗口打开同一个页面，每个页面的sessionStorage互不影响

相同浏览器下，并且是同源窗口（协议、域名、端口一致），不同页面可以共享localStorage，Cookies值，通过跳转的页面可以共享sessionStorage值。

多窗口之间sessionStorage不可以共享状态！！！但是在某些特定场景下新开的页面会复制之前页面的sessionStorage！！（window.open 或者 a标签打开同源页面）