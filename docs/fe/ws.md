---
title: WebSocket
---
## WebSocket 实现聊天

端口: 80 443

* 创建 WebSocket 连接 -> `new WebSocket(url)`

* 常量 `CONNECTING -> 0`、`OPEN -> 1`、`CLOSING -> 2`、`CLOSED -> 3`

* `WebSocket.onopen` -> 连接成功，开始通讯

* `WebSocket.onmessage` -> 客户端接收服务端发送的消息

* `WebSocket.onclose` -> 连接关闭后的回调函数

* `WebSocket.onerror` -> 连接失败后的回调函数

* `WebSocket.readyState` -> 当前的连接状态

* `WebSocket.close` -> 关闭当前连接

* `WebSocket.send` -> 客户端向服务端发送消息

当刷新浏览器或关闭浏览器时，应断开与服务端的连接。

若浏览器与服务器断开连接，则进行重连，我们每 5s 重连一次，重连一定次数依旧不能成功，则断开连接。连接成功后将 limit 限制重置。

心跳检测是客户端与服务端约定一个规则进行通讯，如若在一定时间内收不到对方的消息，则连接断开，需进行重连。由于各浏览器机制不同，触发 onclose 时机也不同，故我们需要心跳检测来补充断线重连的逻辑。

🦅 WebSocket 并不是全新协议，而是利用 HTTP 协议来建立连接，故此连接需从浏览器发起，格式如下：

```http
GET wss://api.chat.deeruby.com/ HTTP/1.1
Host: api.chat.deeruby.com
Connection: Upgrade
Upgrade: websocket
Origin: https://chat.deeruby.com
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: dsRxU8oSxU2Jru9hOgf4dg==
```

* 请求头`Upgrade: websocket`和`Connection: Upgrade`表示这个连接将要被转换为 **WebSocket** 连接。

* `Sec-WebSocket-Version`指定了 **WebSocket** 的协议版本，如果服务端不支持该版本，需要返回一个`Sec-WebSocket-Version`header，里面包含服务端支持的版本号。

* `Sec-WebSocket-Key`与服务端`Sec-WebSocket-Accept`配套，用于标识连接。

🦅 随后，服务器若接受该请求，则做如下反应：

```http
HTTP/1.1 101 Switching Protocols 
Connection: upgrade 
Upgrade: websocket 
Sec-WebSocket-Accept: aAO8QyaRJEYUX2yG+pTEwRQK04w=
```

* 响应码 **101** 表示本次连接的 **HTTP** 协议将被更改，更改为 `Upgrade: websocket` 指定的 **WebSocket** 协议。
* `Sec-WebSocket-Accep` 是将 `Sec-WebSocket-Key` 跟 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 拼接，通过 **SHA1** 计算并转换为 **base64** 字符串。浏览器使用它来确保响应与请求相对应。



**WS中有HTTP的参与，需要先通过HTTP请求访问对方是否支持WebSocket**



> **无法模拟 WebSocket 握手**
>
> 我们不能使用 `XMLHttpRequest` 或 `fetch` 来进行这种 HTTP 请求，因为不允许 JavaScript 设置这些 header。



### [扩展和子协议](https://zh.javascript.info/websocket#kuo-zhan-he-zi-xie-yi)

WebSocket 可能还有其他 header，`Sec-WebSocket-Extensions` 和 `Sec-WebSocket-Protocol`，它们描述了扩展和子协议。

例如：

- `Sec-WebSocket-Extensions: deflate-frame` 表示浏览器支持数据压缩。扩展与传输数据有关，扩展了 WebSocket 协议的功能。`Sec-WebSocket-Extensions` header 由浏览器自动发送，其中包含其支持的所有扩展的列表。

- `Sec-WebSocket-Protocol: soap, wamp` 表示我们不仅要传输任何数据，还要传输 [SOAP](https://en.wikipedia.org/wiki/SOAP) 或 WAMP（“The WebSocket Application Messaging Protocol”）协议中的数据。WebSocket 子协议已经在 [IANA catalogue](https://www.iana.org/assignments/websocket/websocket.xml) 中注册。因此，此 header 描述了我们将要使用的数据格式。

  这个可选的 header 是使用 `new WebSocket` 的第二个参数设置的。它是子协议数组，例如，如果我们想使用 SOAP 或 WAMP：

  ```javascript
  let socket = new WebSocket("wss://javascript.info/chat", ["soap", "wamp"])
  ```

## [数据传输](https://zh.javascript.info/websocket#shu-ju-chuan-shu)

WebSocket 通信由 “frames”（即数据片段）组成，可以从任何一方发送，并且有以下几种类型：

- “text frames” —— 包含各方发送给彼此的文本数据。
- “binary data frames” —— 包含各方发送给彼此的二进制数据。
- “ping/pong frames” 被用于检查从服务器发送的连接，浏览器会自动响应它们。
- 还有 “connection close frame” 以及其他服务 frames。

在浏览器里，我们仅直接使用文本或二进制 frames。

**WebSocket `.send()` 方法可以发送文本或二进制数据。**

`socket.send(body)` 调用允许 `body` 是字符串或二进制格式，包括 `Blob`，`ArrayBuffer` 等。不需要额外的设置：直接发送它们就可以了。

**当我们收到数据时，文本总是以字符串形式呈现。而对于二进制数据，我们可以在 `Blob` 和 `ArrayBuffer` 格式之间进行选择。**

它是由 `socket.binaryType` 属性设置的，默认为 `"blob"`，因此二进制数据通常以 `Blob` 对象呈现。

[Blob](https://zh.javascript.info/blob) 是高级的二进制对象，它直接与 `<a>`，`<img>` 及其他标签集成在一起，因此，默认以 `Blob` 格式是一个明智的选择。但是对于二进制处理，要访问单个数据字节，我们可以将其改为 `"arraybuffer"`：



## [限速](https://zh.javascript.info/websocket#xian-su)

想象一下：我们的应用程序正在生成大量要发送的数据。但是用户的网速却很慢，可能是在乡下的移动设备上。

我们可以反复地调用 `socket.send(data)`。但是数据将会缓冲（储存）在内存中，并且只能在网速允许的情况下尽快将数据发送出去。

`socket.bufferedAmount` 属性储存了目前已缓冲的字节数，等待通过网络发送。

我们可以检查它以查看 socket 是否真的可用于传输。

```javascript
// 每 100ms 检查一次 socket
// 仅当所有现有的数据都已被发送出去时，再发送更多数据
setInterval(() => {
  if (socket.bufferedAmount == 0) {
    socket.send(moreData());
  }
}, 100);
```
**注意，WebSocket和socket没什么联系！**
> Socket套接字，是由**系统**提供用于网络通信的技术，是基于TCP/IP协议的网络通信的基本操作单元。基于Socket套接字的网络程序开发就是网络编程。
>
> socket是在应用层和传输层之间的一个抽象层，它把TCP/IP层复杂的操作抽象为几个简单的接口供应用层调用来实现进程在网络中通信。




## 浅谈SSE

### 什么是SSE ?

**SSE 全称：Server-Sent Events**

**SSE** 使用 **HTTP**协议，而 **HTTP** 协议无法由服务器主动推送消息，但有一种变通方式，即服务端向客户端声明，接下来发送的为流信息。其为一个连续发送的数据流，而不是一个一次性的数据包，故客户端不会关闭连接，而是一直等服务器发送新的数据流。**SSE** 就是通过这种机制，使用流信息向浏览器推送消息。

### 什么场景选用SSE ?

只需要服务器给客户端发送消息的场景时，SSE可胜任