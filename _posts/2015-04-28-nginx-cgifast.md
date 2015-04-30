---
layout: post
category: nginx
title: 在Ubuntu14.04上搭建配置nginx与FastCGI环境
tags: nginx 高并发
---

&emsp;&emsp;Nginx不支持外部程序的调用或者解析，包括php程序、python程序都不行，因此业务处理模块的调用，必须通过FastCGI接口来调用。FastCGI在Linux下是socket，为了调用CGI程序，还需要一个FastCGI的wrapper（启动另一个程序的程序），绑定在某个固定的socket。

<!--more-->

### 1 Nginx与FastCGI调用

&emsp;&emsp;FastCGI程序(fast common gateway interface) - 常驻型CGI程序，它是语言无关的、可伸缩架构的CGI开放扩展，其主要行为是将CGI解释器进程保持在内存中并因此获得较高的性能。nginx不能直接执行外部的cgi程序，需要使用FastCGI进程管理程序，才能调用FastCGI程序，比如lighttpd中的spawn-fastcgi。

&emsp;&emsp;当Nginx将CGI请求发送给这个socket的时候，通过FastCGI接口，wrapper接收到请求，然后派生出一个新的线程，这个线程调用解释器或者外部程序处理脚本并读取返回数据；接着，wrapper再将返回的数据通过FastCGI接口，沿着固定的socket传递给Nginx；最后，Nginx将返回的数据发送给客户端。这就是Nginx+FastCGI的整个运作过程，如下图所示：

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_04_28_2.png" alt="">
</figure> 

<br />

### 2. FastCGI环境部署与测试

#### 2.1 spawn_fastcgi的安装、部署与配置

* 从`https://github.com/lighttpd/spawn-fcgi`下载spawn-fcgi的安装包；
* 解压后`cmake .    make    make install`进行安装；
* 将可执行文件spawn-fcgi移动到nginx/sbin中

<br />

#### 2.2 fastcgi库的安装

* 下载`http://www.fastcgi.com/dist/fcgi.tar.gz`之后解压
* `./configure  make sudo make install`
* 在/usr/local/nginx下新建cgibin文件夹，cgi的可执行文件放在该目录下

<br />

#### 2.3 FastCGI的一个demo

{% highlight C++ %}
#include <fcgi_stdio.h>
#include <stdlib.h>
#include <unistd.h>                                                                                                                                                                     

int main() { 
    int count = 0;
    while (FCGI_Accept() >= 0) { 
        printf("Content-type: text/html\r\n"
                "\r\n"
                ""
                "FastCGI Hello!"
                "Request number %d running on host%s "
                "Process ID: %d\n", ++count, getenv("SERVER_NAME"), getpid());
    } 
    return 0;
}
{% endhighlight %}

<br />

* 通过`g++ cgidemo.cc -o cgidemo -lfcgi`进行编译；
* 将cgidemo移到上一步新建的cgibin目录下;
* 若提示缺少动态库libfcgi.so.0，建立一个软链接 ：ln -s /usr/local/libfcgi.so.0 /usr/lib/，执行idconfig更新；

<br />

#### 2.4 启动spawn-fcgi管理进程，绑定server，配置nginx转发请求

* `/usr/local/nginx/sbin/spawn-fcgi -a 127.0.0.1 -p 8088 -f /usr/local/nginx/cgibin/demo`启动spawn-fcgi进程，绑定server ip和端口（不要与nginx监听端口重合）；
* 查看一下9002端口是否已成功：netstat -na | grep 8088
*
更改nginx.conf配置文件，让nginx转发请求 
{% highlight C++ %}
在http节点的子节点-"server节"点中下添加配置
    location ~ \.cgi$ {
        fastcgi_pass 127.0.0.1:8088;
        fastcgi_index index.cgi;
        fastcgi_param SCRIPT_FILENAME fcgi$fastcgi_script_name;
        include fastcgi_params;
    }
{% endhighlight %}

* sudo killall nginx 停止nginx的所有进程
* sudo ./nginx重新启动，`http://localhost/cgidemo.cgi`即可访问刚才编写的cgidemo程序



