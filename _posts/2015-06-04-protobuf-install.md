---
layout: post
category: Protobuf
title: Protobuf在Ubuntu14.04下的安装
tags: Protobuf automake openssl 
---

&emsp;&emsp;最近项目需要使用protobuf做序列化与反序列化的工作，一般来说，在CS模式的架构中，经常使用protobuf作为进程间通信的工具，相对于使用rest传递json串的方式来说，protobuf可以基于tcp传输，组包上具有得天独厚的优势，效率很高。而protoc编译器，便于在跨语言的进程之间使用。

<!--more-->

&emsp;&emsp;但是在项目中，仅仅使用protobuf作为序列化与反序列化的方式，仍然使用http进行发送，显得有点微微的蛋疼。在ubuntu的安装出了不少问题，以此记录。

<br />

## 1. protobuf源码安装

### 1.1 不支持https

&emsp;&emsp;从`https://github.com/google/protobuf`下载protobuf的源码，按照README中的说明，使用`./autogen.sh`去生成configure文件，autogen脚本的执行依赖于openssl，即是一种https的请求，而默认安装的curl，是未开启ssl支持的，从`curl -V`即可看到支持的请求类型。

&emsp;&emsp;从`http://curl.haxx.se/`下载libcurl的最新版，在configure阶段，加入对ssl的支持。从` http://www.openssl.org/`下载openssl的源码，编译安装，在curl目录中，通过 `sudo ./configure --with-ssl --with-libssl-prefix=/usr/local/ssl`开启ssl支持。之后make安装。

### 1.2 ./autogen.sh: 4: autoreconf: not found错误，

&emsp;&emsp;通过安装automake工具解决：`sudo apt-get install autoconf automake libtool`，正常的make安装protobuf即可。默认安装的是C++的package，包括了protoc编译器，若要继续安装python package，则进入python目录，依次执行`python setup.py build`，`python setup.py install`

### 1.3 protoc: error while loading shared libraries

&emsp;&emsp;protobuf的默认安装路径是/usr/local/lib，而/usr/local/lib 不在Ubuntu体系默认的 LD_LIBRARY_PATH 里，所以就找不到该lib，可以通过创建文件/etc/ld.so.conf.d/libprotobuf.conf 包含内容`/usr/local/lib `，输入命令`sudo ldconfig`更新缓存解决。

<br />

## 2. protobuf通信框架

&emsp;&emsp;一般protobuf结合tcp通信协议发挥其轻量的特性，在大规模网站架构中，使用较多，有效提高网络传输效率。百度开源的通信协议包，sofa-pbrpc，`https://github.com/BaiduPS/sofa-pbrpc/wiki`，做个记录。 
