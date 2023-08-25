---
title: 数据库
---
+ Mysql以表格形式存储 关系型 SQL操作 数据存在硬盘里面
+ Redis以Key value形式存储 非关系型 NOSQL 数据存在内存里面
+ Mongodb以文档形式存储 类似Json  非关系 NOSQL 数据在硬盘里面
+ Mysql和Mongodb 可以理解我Excel和word的区别

Redis是一个开源（BSD许可）的，基于内存的数据结构存储系统，它可以用作数据库、缓存和消息中间件，是现在最受欢迎的 NoSQL 数据库之一。

其具备如下特性：

- 速度快
  - 单节点读110000次/s，写81000次/s
  - 基于内存运行，性能高效
  - 用 C 语言实现，离操作系统更近
- 持久化
  - 数据的更新将异步地保存到硬盘（RDB 和 AOF
- 多种数据结构
  - 不仅仅支持简单的 key-value 类型数据
  - 还支持：字符串、hash、列表、集合、有序集合
- 支持多种编程语言等等

### Redis 典型使用场景

**缓存**

缓存可以说是Redis最常用的功能之一了， 合理的缓存不仅可以加快访问的速度，也可以减少后端数据库的压力。

**排行系统**

利用Redis的列表和有序集合的特点，可以制作排行榜系统，而排行榜系统目前在商城类、新闻类、博客类等等，都是比不可缺的。

**计数器应用**

计数器的应用基本和排行榜系统一样，都是多数网站的普遍需求，如视频网站的播放计数，电商网站的浏览数等等，但这些数量一般比较庞大，如果存到关系型数据库，对MySQL或者其他关系型数据库的挑战还是很大的，而Redis基本可以说是天然支持计数器应用。

**（视频直播）消息弹幕**

直播间的在线用户列表，礼物排行榜，弹幕消息等信息，都适合使用Redis中的SortedSet结构进行存储。

例如弹幕消息，可使用`ZREVRANGEBYSCORE`排序返回，在Redis5.0中，新增了`zpopmax`，`zpopmin`命令，更加方便消息处理。

Redis的应用场景远不止这些，Redis对传统磁盘数据库是一个重要的补充，是支持高并发访问的互联网应用必不可少的基础服务之一。