---
layout: post
category: Shell
title: Shell中的各种查找
tags: Shell
---

&emsp;&emsp;关于Shell中的各种查找命令，`find、locate、whereis、which`，不可谓不多，做个总结，方便查阅。

<!--more-->

### 1. find
&emsp;&emsp;当知道文件的大概文件名时，查找一个或者若干个想要的文件。

* `find -name filename`: 在当前目录/子目录下查找filename
* `find / -name filename`: 从root根路径开始，在所有子目录中查找filename，效率比较低，文件目录树的遍历
* `find -name file*`: 在当前目录/子目录下查找文件名以file开头的文件
* `find -name ‘*’ -size +1000k`: 查找任何大于1000k的文件
* `find / -type f -mmin -10`: 在系统中查找过去十分钟内编辑过的文件
* `find PCIe_src/ -type f -name "*.c" | xargs grep "edma_common.vh"`: 在PCIe_src/目录下的c文件中，查找字符串`edma_common.vh`

<br />

### 2. locate

&emsp;&emsp;`find -name`的另一种写法，但是比后者快很多。其不搜索具体目录，而是搜索一个数据库`/var/lib/locatedb`，数据库含有本地所有文件的信息，Linux系统自动创建这个数据库，并且每天更新一次，所以locate查找不到最近变更的文件，可以在使用之前，通过updatedb去手动更新数据库。

* `locate "*.png"`: 列出系统中所有的png文件后缀的文件
* `locate ~/m`: 列出主目录下所有以m开头的文件

<br />

### 3. whereis

&emsp;&emsp;只能用于程序名的搜索，而且只能搜索二进制文件（b文件）、man说明文件（参数-m）和源代码文件（参数-s）

<br />

### 4. which

&emsp;&emsp;which的作用是，在PATH变量指定的路径中，搜索某个系统命令的位置，并且返回第一个搜索结果；即使用which可以查看某个系统命令是否存在，以及执行的位置。

* `which supervisord`返回 `/usr/local/bin/supervisord`

<br />

### 5. type

&emsp;&emsp;type区分某个命令到底是shell自带还是shell外部的独立二进制文件提供。

* `type supervisord`返回 `/usr/local/bin/supervisord`
*  `type cd`返回`cd is a shell builtin`


