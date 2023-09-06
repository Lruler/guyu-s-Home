import{_ as n,p as s,q as a,Z as p}from"./framework-1749bed7.js";const t="/guyu.inn/assets/koa-3907e32e.webp",e={},o=p('<p>koa与egg的中间件机制 <img src="'+t+`" alt=""></p><ul><li><p>中间件执行就像洋葱一样，最早use的中间件，就放在最外层。处理顺序从左到右，左边接收一个request，右边输出返回response</p></li><li><p>一般的中间件都会执行两次，调用next之前为第一次，调用next时把控制传递给下游的下一个中间件。当下游不再有中间件或者没有执行next函数时，就将依次恢复上游中间件的行为，让上游中间件执行next之后的代码</p></li></ul><p>大概源码实现</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 注意其中的compose函数，这个函数是实现中间件洋葱模型的关键</span>
<span class="token comment">// 场景模拟</span>
<span class="token comment">// 异步 promise 模拟</span>
<span class="token keyword">const</span> <span class="token function-variable function">delay</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 中间间模拟</span>
<span class="token keyword">const</span> <span class="token function-variable function">fn1</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">ctx<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">await</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> <span class="token function-variable function">fn2</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">ctx<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">await</span> <span class="token function">delay</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">await</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> <span class="token function-variable function">fn3</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">ctx<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> middlewares <span class="token operator">=</span> <span class="token punctuation">[</span>fn1<span class="token punctuation">,</span> fn2<span class="token punctuation">,</span> fn3<span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token comment">// compose 实现洋葱模型</span>
<span class="token keyword">const</span> <span class="token function-variable function">compose</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">middlewares<span class="token punctuation">,</span> ctx</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token function-variable function">dispatch</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">i</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> fn <span class="token operator">=</span> middlewares<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>fn<span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token keyword">return</span> Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>
    <span class="token keyword">return</span> Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token function">fn</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">dispatch</span><span class="token punctuation">(</span>i<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">compose</span><span class="token punctuation">(</span>middlewares<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>中间件是一个接收请求和响应对象的函数。换句话说，在应用程序的请求-响应循环中，这些函数可以访问各种请求和响应对象以及循环的下一个函数。中间件的 next 功能是借助一个变量来表示的，通常命名为 next。中间件功能最常执行的任务是：</p><ul><li>执行任何类型的代码</li><li>更新或修改请求和响应对象</li><li>完成请求-响应循环</li><li>调用堆栈中的下一个中间件</li></ul><h3 id="koa和express的中间件机制区别" tabindex="-1"><a class="header-anchor" href="#koa和express的中间件机制区别" aria-hidden="true">#</a> koa和express的中间件机制区别</h3><ul><li>koa是基于async await的洋葱圈模型</li><li>express是基于callback的线性模型 顺序执行</li></ul><h3 id="node如何实现异步io" tabindex="-1"><a class="header-anchor" href="#node如何实现异步io" aria-hidden="true">#</a> node如何实现异步IO</h3><p>在node中，I/O（输入输出）是异步非堵塞的关键，I/O操作通常比较耗时但不会独占CPU，典型的I/O比如文件读写，远程数据库读写，网络请求等，如果用同步API来进行I/O操作，在返回结果之前就只能等待，此时阻塞代码会霸占cpu，导致本进程所有代码都等待，而node.js里面的I/O API都是不会霸占CPU的（原因：node中的核心库libuv会将建立的所有I/O操作内容绑定到单个线程上。只要每个事件循环在不同的线程中，就可以运行多个事件循环，libuv为Node.js提供了跨平台、线程池、事件池、异步I/O等能力），所以是非阻塞的。拿JS中的setTimeout来打比方，当用户使用setTimeout时，JS会开辟出一个异步线程池，与主线程分开执行，结果就是之前的代码继续执行，setTimeout的代码延时执行，等成功后再调用主线程的方法</p><h3 id="pm2原理" tabindex="-1"><a class="header-anchor" href="#pm2原理" aria-hidden="true">#</a> PM2原理</h3><ul><li><p>PM2会有自己的主进程，他会将应用作为子进程再启动起来，启动子应用的方式是fork、和cluster两种。</p></li><li><p>PM2的核心就是PM2本身是一个主进程，他会将应用程序作为作为子进程启动（fork），然后通过进程间通信的方式来实现进程状态的管理。</p></li></ul>`,12),c=[o];function l(i,u){return s(),a("div",null,c)}const r=n(e,[["render",l],["__file","node-frame.html.vue"]]);export{r as default};