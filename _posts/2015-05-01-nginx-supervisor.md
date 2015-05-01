---
layout: post
category: nginx
title: ubuntu 14.04下进程管理工具supervisor安装
tags: nginx 高并发
---

&emsp;&emsp;supervisor的存在，主要是为了Nginx可以优雅的重启。作为一个进程管理工具，通过Supervisor启动其他进程，则其他进程都为其子进程。实现对特定的进程的守护（则其他进程不能设置为守护进程），在进程被挂起时，自动重启进程。

<!--more-->

<br />

### 1.Supervisor安装

&emsp;&emsp;可以安装在任何Unix系统，Ubuntu下可以通过`easy_install supervisor`进行安装。然后切换到root权限，通过`echo_supervisord_conf > /etc/supervisord.conf`创建配置文件，可以在其中更改所需要的配置。
&emsp;&emsp;修改配置，守护nginx进程，在`/etc/supervisord.conf`中添加以下信息：

{% highlight Python %}
[program:nginx]
command=/usr/local/nginx/sbin/nginx
priority=1
numprocs=1
autostart=true
autorestart=true
{% endhighlight %}


### 2.Supervisor守护Nginx测试 

* 指定配置文件，启动supervisord: `sudo supervisord -c /etc/supervisord.conf`，则根据配置文件的设置，nginx会被同时启动。
* 通过`sudo supervisorctl`可以进入supervidor的命令行工具（可以代替接下来提到的Web界面进行管理，控制守护程序的start/restart/stop），或者查看其守护的进程的状态。
* 查看守护进程状态: `ps -le | grep supervisord `
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_1.png" alt="">
</figure>
* 查看Nginx进程状态: `ps -le | grep nginx`
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_2.png" alt="">
</figure>
* 杀掉nginx进程: `killall nginx`
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_3.png" alt="">
</figure>
* 结果发现，nginx被重启，且pid被切换
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_4.png" alt="">
</figure>

### 3. 通过Web界面管理进程以及查看进程状态

&emsp;&emsp;通过配置文件的修改，supervisor通过web管理进程以及查看进程状态。如下所示：

{% highlight Python %}
[inet_http_server]         ; inet (TCP) server disabled by default
port=127.0.0.1:9001        ; (ip_address:port specifier, *:port for all iface)
username=admin             ; (default is no username (open server))
password=123               ; (default is no password (open server))
{% endhighlight %}

&emsp;&emsp;其中port的设置表示允许任何ip进行访问，也可以指定单个ip可以访问。保存配置之后，`supervisorctl reload`重启，通过配置文件中配置的`127.0.0.1:9001`，输入用户名密码，即可访问。 需要说明的是，supervisord只是一个进程守护程序，可以守护除Python之外的任何程序。因此并不需要设置superviord去守护后端处理业务的Tornado的python进程，只需要守护nginx进程进可。
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_5.png" alt="">
</figure>



		 
