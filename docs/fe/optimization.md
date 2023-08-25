---
title: 性能优化
---
![](../../.vuepress/public/fe/youhua.webp)
# 性能优化

1. 减少HTTP请求：
   - 合并CSS和JavaScript文件。
   - 使用CSS Sprites将多个小图标合并成一张大图。
   - 尽量使用字体图标（如Font Awesome）代替图片。
2. 优化资源：
   - 压缩CSS、JavaScript和HTML文件，减少文件大小。
   - 优化图片大小，使用WebP、JPEG 2000等现代图像格式。
   - 使用懒加载（Lazy Loading）技术，仅在需要时加载图片和其他资源。
   - 使用预加载，预加载是一种优化策略，可以提前加载关键资源，以便在用户需要时立即可用。
3. 利用浏览器缓存：
   - 为静态资源设置合适的缓存策略（如Cache-Control和Expires头）。
   - 使用Service Workers实现离线缓存。
4. 优化网络传输：
   - 使用CDN（内容分发网络）加速静态资源的加载。
   - 开启HTTP压缩（如Gzip）以减少传输数据大小。
   - 使用HTTP/2或HTTP/3协议以获得更高的传输性能。
5. 使用Web性能API：
   - 利用`requestAnimationFrame`进行动画操作，而不是`setTimeout`或`setInterval`。
   - 使用`window.performance` API监控页面性能。
   - 减少回流（reflow）和重绘（repaint）：避免频繁修改样式，尽量在修改样式之前将元素设为`display: none`，完成修改后再显示
6. 代码分割和按需加载：
   - 使用Webpack等构建工具实现代码分割，仅加载需要的代码。
   - 使用动态导入（Dynamic Imports）按需加载模块。

7. 服务端渲染（Server Side Rendering, SSR）：通过在服务器端渲染页面，可以加快首屏渲染速度。

### React性能优化

1. 避免不必要的重新渲染：
   - 使用`React.memo`包装函数式组件，仅在props改变时重新渲染。
   - 在类组件中，使用`shouldComponentUpdate`或继承`React.PureComponent`来避免不必要的重新渲染。

2. 使用虚拟化列表：
   - 对于大型列表或表格，使用虚拟化（如`react-window`库）仅渲染可见部分，以提高性能。

3. 优化事件处理器：
   - 使用事件委托（Event Delegation）减少事件监听器。
   - 使用防抖（Debounce）和节流（Throttle）技术避免频繁触发事件处理器。

4. 代码分割和按需加载：
   - 使用`React.lazy`和`React.Suspense`实现组件的懒加载和按需加载。
   - 使用Webpack等构建工具进行代码分割。

5. 使用`React.Fragment`避免额外的DOM元素：
   - 使用`React.Fragment`组合多个子元素，以避免创建不必要的DOM节点。

6. 优化React Context：
   - 使用多个独立的Context来避免不必要的组件重新渲染。
   - 将Context Provider放在组件树的合适位置，以减少作用范围。

7. 使用`useCallback`和`useMemo`避免不必要的计算和渲染：
   - 使用`useCallback`保存事件处理器和回调函数的引用，避免不必要的重新创建。
   - 使用`useMemo`缓存计算结果，避免不必要的重新计算。

8. 优化CSS-in-JS：
   - 避免在组件内部创建大量CSS规则，尽量将样式提取到外部。
   - 使用`classnames`库或其他方法避免不必要的样式计算。

9. 服务器端渲染（SSR）：
   - 使用服务器端渲染（如Next.js）加快首屏渲染速度，提高SEO。

10. 监控性能：

   - 使用React DevTools和Performance API监控React应用程序的性能。
   - 使用`React.Profiler`组件收集组件渲染性能数据。


## 如何极致的优化动画性能

1. 使用CSS动画：CSS动画借助GPU加速，在大多数情况下具有更好的性能。使用transform和opacity属性，避免使用top、left等属性进行动画操作。
2. 使用requestAnimationFrame：requestAnimationFrame是浏览器提供的优化动画的方法，可以更好地与浏览器的渲染机制同步。
3. 减少重绘和回流：通过合并多个DOM修改、使用transform进行动画变换，避免频繁的DOM重绘和回流操作，以提高性能。
4. 使用硬件加速：使用CSS属性translate3d、scale3d等可以启用GPU硬件加速，提高动画的性能。
5. 避免使用阻塞操作：确保动画执行期间没有长时间的JavaScript计算或网络请求阻塞主线程。


# CDN

CDN (全称 Content Delivery Network)，即内容分发网络

构建在现有网络基础之上的智能虚拟网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。`CDN` 的关键技术主要有内容存储和分发技术

简单来讲，`CDN`就是根据用户位置分配最近的资源

于是，用户在上网的时候不用直接访问源站，而是访问离他“最近的”一个 CDN 节点，术语叫**边缘节点**，其实就是缓存了源站内容的代理服务器。如下图：

# 虚拟列表

和懒加载的区别

+ 懒加载主要是用于优化网络请求的，就是只加载可视部分的资源

+ 虚拟列表是优化渲染的，只渲染可视部分的列表Item，而实际上所有的列表信息是已经加载好了，只不过没渲染罢了、

+ 懒加载的计算方式 **img.offsetTop (图片距离document顶部的高度)< window.innerHeight(浏览器可视区域高度) + document.body.scrollTop(浏览器滚动过的距离);** 然后使用HTML5中自定义属性的方式 ，写一个自定义属性data-src，然后等到该加载高度时再把data-src赋值给src就行

+ 虚拟列表的计算方式:  

  虚拟列表的实现，实际上就是在首屏加载的时候，只加载`可视区域`内需要的列表项，当滚动发生时，动态通过计算获得`可视区域`内的列表项，并将`非可视区域`内存在的列表项删除。

  - 计算当前`可视区域`起始数据索引(`startIndex`)
  - 计算当前`可视区域`结束数据索引(`endIndex`)
  - 计算当前`可视区域的`数据，并渲染到页面中
  - 计算`startIndex`对应的数据在整个列表中的偏移位置`startOffset`并设置到列表上

  1. 假定`可视区域`高度固定，称之为`screenHeight`

  2. 假定`列表每项`高度固定，称之为`itemSize`

  3. 假定`列表数据`称之为`listData`

  4. 假定`当前滚动距离`称之为`scrollTop`

     则可以推断出

     列表总高度`listHeight` = listData.length * itemSize

     可显示的列表项数`visibleCount` = Math.ceil(screenHeight / itemSize)

     数据的起始索引`startIndex` = Math.floor(scrollTop / itemSize)

     数据的结束索引`endIndex` = startIndex + visibleCount

     列表显示数据为`visibleData` = listData.slice(startIndex,endIndex)

     偏移量`startOffset` = scrollTop - (scrollTop % itemSize);

布局方案：就用相对定位和绝对定位

注意⚠️:  那如果 渲染Item中的高度是动态的，也就是说ItemSize可变，又该如何计算呢。

我们可以先设定一个预估高度渲染，然后获取真实高度再缓存

高速白屏的优化： 在可视区的上方和下方设定一个缓冲区

其他优化方案: 使用 `IntersectionObserver` 监听事件 可以只监听可视区域的变化，使用 `ResizeObserver`监听内容区域宽高变