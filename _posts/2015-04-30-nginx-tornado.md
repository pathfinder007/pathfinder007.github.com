---
layout: post
category: nginx
title: 在Ubuntu14.04上搭建配置nginx与Tornado反向代理
tags: nginx 高并发
---

&emsp;&emsp;上一节已经在Ubuntu 14.04上部署了Nginx服务器，Nginx是一个高效的Web服务器及代理服务器，Tornado是一个基于epoll的异步非阻塞的Web开发框架，通常使用Nginx做为Web服务器时，都会以FastCGI模式，而我们从开发、调试、运维的角度考虑，使用了反向代理的模式，Tornado作为主要的业务服务器，同时Nginx可以通过FastCGI做一些特殊业务和负载均衡的处理。而supervisor是一个守护进程软件，可以把Linux上众多的守护进程集中在supervisor进行统一管理。

<!--more-->

<br />

### 1 Tornado简介及部署 

&emsp;&emsp;Tornado为facebook的一个开源项目，当初为了friendfeed而搭建，目前这个项目已经下线。和现有的主流Web服务器框架有着明显区别，是非阻塞的服务器，得力于其非阻塞的方式以及epoll的运用，Tornado每秒可以处理数以千计的连接。

&emsp;&emsp;首先在`http://www.tornadoweb.org/en/stable/index.html`下载最新版本的tornado，通过以下方式安装，

{% highlight Python %}
tar xvzf tornado-4.1.tar.gz
cd tornado-2.0
python setup.py build
sudo python setup.py install
{% endhighlight %}


&emsp;&emsp;为了使用Tornado的所有功能，需要安装PycURL以及simplejson，Ubuntu下可以通过
`sudo apt-get install python-pycurl`安装.


&emsp;&emsp;tornado安装目录下有一个demo目录，里面有一些应用的示例demo，包括一个类S3的基于本地文件的文件存储服务器。我们进入helloworld目录下，`python helloworld.py`运行，即可通过浏览器中localhost:8888进行访问（我们设定的监听端口为8888）。事实上，无论py文件放在哪里，将其运行后，都可以正常访问，这也是Tornado不同于Apache的地方，不必有一个固定的/var/www/目录存放代码。

<br />

### 2 Nginx与Tornado连接，配置反向代理环境

&emsp;&emsp;一般的情况下，不管是VPS还是其他的基于Linux的服务器，必须搭建一个Web Server监听80端口(http默认端口)，而Tornado服务进程监听在808*内部端口（可以启动多个进程）。由于Nginx是一个轻量、快速、安全的Server，一般选择Nginx作为反向代理，监听80端口并转发请求到后端的其他业务处理Server，比如Tornado。当将图片等一些静态资源缓存在前端的Nginx，可以节约内存以及CPU资源。

&emsp;&emsp;为什么Tornado需要Nginx做一层反向代理？大概是这样的。Tornado为单线程的Web服务器，一个Req如果阻塞了IO，进程挂起，无法接受新的Req；可以通过多进程在一定程度上改善IO被阻塞的情况，但是多进程本来就极其消耗资源。而一般会阻塞IO大文件，大多数都是静态文件，所以有了在前面挂一层Nginx来缓存静态文件的思路，原始初衷是为了避免Tornado产生IO阻塞。

&emsp;&emsp;实现Tornado的反向代理，主要通过Nginx的配置文件选项完成，下面针对配置了一个worker的Nginx反向代理，对相应的配置文件进行说明。关于`/logs/nginx.pid`文件，在Nginx实例启动时，会将相应进程的pid在该文件进行记录，所以reload重启时，直接读取该文件中的进程pid，进行重启。因此killall之后，没法重启。

&emsp;&emsp;基本配置代码如下，启动一个Tornado的应用，其监听8888端口，重启Nginx，监听80端口，则可以通过127.0.0.1访问Nginx，反向代理到后端的Tornado服务器。

{% highlight Python %}
worker_processes  1; # 开启的worker进程数目                                                                        

# 全局错误日志以及PID文件
error_log  logs/error.log;
pid        logs/nginx.pid;

events {
    worker_connections  1024;  #单个worker process进程允许的最大连接数目
    use epoll;  #多路复用IO的一种方式，可以大大提高Nginx性能
}

http {
    # Enumerate all the Tornado servers here 
    upstream helloworld {
        server 127.0.0.1:8888; #多个server的时候，即实现负载均衡，可以配置相应的权值。
    }

    server {
        listen 80;
 
        location ^~ /static/ {
            root /var/www;
            if ($query_string) {
                expires max;
            }
        }
        location = /favicon.ico {
            rewrite (.*) /static/favicon.ico;
        }
        location = /robots.txt {
            rewrite (.*) /static/robots.txt;
        }
 
        location / {
            proxy_pass_header Server;
            proxy_set_header Host $http_host;
            proxy_redirect off;  #关闭重定向
            proxy_set_header X-Real-IP $remote_addr;  #转发ip等http头信息
            proxy_set_header X-Scheme $scheme;
            # 配置反向代理到的后端server，可以使用http://127.0.0.1:8888
            proxy_pass http://helloworld;      #需要与前面匹配
        }
    }
}
{% endhighlight %}




