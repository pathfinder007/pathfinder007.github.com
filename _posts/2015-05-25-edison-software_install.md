---
layout: post
category: Intel
title: Edison开发版上Linux系统基础软件安装
tags: Intel Edison 
---

&emsp;&emsp;Edison上安装的是一个定制的Linux系统，Yocto。相对于pcDuino平台改良版的Ubuntu，刚上手陌生了不少。而受限于处理器的性能，程序编译运行速度也比pcDuino的体验差。对于非操作IO方面的开发，在本地构建一个Edison的开发环境，在本地开发比较好，涉及到IO或者程序运行的时候，再scp到Yocto上即可。试着在系统上装了几个软件，没有了apt-get，加上处理器性能较低，从源码安装，装软件还是略微麻烦。

<!--more-->

<br />

* vim 安装：从http://www.vim.org/sources.php下载源码包，解压后直接通过make安装即可。
* git 安装：可以通过'opkg'命令安装软件，`opkg install git`即可以安装git。
* 在Intel官网，介绍了两种IDE的安装，Intel XDK loT Edition, Arduino IDE, Eclipse。之前一直以为是要将IDE安装在Edison上面，其实不然。由于开发版资源性能有限，可以将IDE安装在本地，程序编译好之后，下载到开发版上运行。对于pcDuino，也是一样的机制。在这一块，之前的使用有点问题。
