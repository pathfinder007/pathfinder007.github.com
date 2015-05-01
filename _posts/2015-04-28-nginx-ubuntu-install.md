---
layout: post
category: nginx
title: Ubuntu14.04下安装Nginx
tags: nginx 高并发
---

&emsp;&emsp;aws上面开的Instance为Ubuntu 14.04，下面记录在ubuntu 14.04上搭建一个Nginx服务器，通过浏览器`localhost`可以访问的过程

<!--more-->

### 1.1 PCRE依赖库安装

&emsp;&emsp;nginx rewrite依赖PCRE包，需要先编译安装PCRE库，一个perl语言的兼容正则表达式第三方库。可以通过`ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/`下载`pcre-8.35.tar.gz`, 然后安装，pcre安装之后的动态库文件位于`/usr/local/lib`中。

{% highlight Python %}
./configure
make
sudo make install
{% endhighlight %}

<br />

### 1.2 Nginx源码安装

&emsp;&emsp;从`http://nginx.org/download/`下载`nginx-1.8.0.tar.gz`，然后通过make方式安装，若未安装pcre依赖库，会报错，可以通过先安装pcre库或者禁用rewrite功能解决，推荐前者。安装成功后，Nginx的目录为`/usr/local/nginx`.Nginx主要的配置文件为conf下的nginx.conf，启动文件为sbin下的nginx。

&emsp;&emsp;启动nginx并访问localhost验证安装成功，结果报错如下：`./nginx: error while loading shared libraries: libpcre.so.1: cannot open shared object file: Error 40`。通过`ldd $(which /usr/local/nginx/sbin/nginx)`查看该可执行文件依赖的库文件，可以发现，其他的动态库文件so都在lib下找到，而libpcre.so.1未找到，事实上该动态库在第一步安装了PCRE依赖库之后，存在于/usr/local/lib中，通过`ln -s /usr/local/lib/libpcre.so.1 /lib`建立软链接，即可正常启动Nginx

<br />

### 1.3 Nginx的启动、停止、重启
* 启动，直接./运行sbin/nginx即可
* 重启，`sudo ./nginx -s reload`
* 停止，通过`ps -ef | grep nginx`查询nginx的主进程号可以发现一共有两个进程，一个master，一个worker（由于配置文件中设置的process为1，因此一个worker）.通过`sudo kill -QUIT pid`即可停止Nginx.`当在nginx.conf中配置process的个数之后，相应的worker数目会增多，而master为1个不会有变化。
*  改变配置之后，通过./nginx -t测试一下配置是否有问题，没有问题再./nginx -s reload重启服务器。
*  将nginx.conf中server_name改成nginx部署机器所在ip，既可以实现外网访问

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_04_28.png" alt="">
</figure> 