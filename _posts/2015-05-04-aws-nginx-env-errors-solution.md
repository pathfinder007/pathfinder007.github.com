---
layout: post
category: AWS
title: 将Nginx环境从本地迁移到AWS错误以及解决方法
tags: AWS Nginx Tornado CGI
---

&emsp;&emsp;下午将本地的Nginx反向代理到Tornado，以及调用FastCGI接口的整个环境迁移到AWS上面，出现了一些问题，下面将问题以及解决方法做一个备忘。

<!--more-->

### 1.pcre make WARNING

{% highlight Python %}
Error: 安装 pcre WARNING导致报错 ‘aclocal-1.14’ is missing on your system
Solution: 通过touch *解决
{% endhighlight %}

### 2.pcre make错误

{% highlight Python %}
Error: make: *** No rule to make target `build', needed by `default'.  Stop.
Solution: 需要安装openssl以及libssl-dev
{% endhighlight %}

### 3.启动Nginx的错误

{% highlight Python %}
Error: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
Solution: 通过lsof -i :80查看80端口被占用的情况，可以发现aws上面虚拟机默认安装了apache，
并占用了80端口通过 sudo apt-get remove apache*完全卸载
{% endhighlight %}


### 4.AWS 公网IP问题

{% highlight Python %}
Error: 启动nginx后，将nginx配置文件中的server_name改成instance的ip（ifconfig获取），
在本地浏览器打开该ip，无法打开页面
Solution: 实际上ifconfig看到的不是公网ip，通过AWS的控制台中的`Running Instance`查看
Public IP可以查看到公网IP，在浏览器输入，即可打开nginx的欢迎页面。很奇怪，ping不通
{% endhighlight %}


### 5.AWS root权限问题

{% highlight Python %}
Error: 安装supervisord，将conf文件生成到/etc下时，一直没有权限，sudo也不行
Solution: 实际上，为了安全性考虑，ec2的root账户默认是关闭的，可以通过如下方式开启。
`sudo passwd root`设置root账户密码；
`sudo passwd --unlock root`启用root账户登录然后即可以通过`su root`进行切换
{% endhighlight %}


### 6.spawn-fcgi cmake 报错

{% highlight Python %}
Error: spawn-fcgi从本地scp到aws之后，cmake的时候，报错
Solution: CMakeCache的问题，没去理会，直接scp了一个干净的工程上去，解决
{% endhighlight %}

### 7.spawn-fcgi 绑定端口 报错

{% highlight Python %}
Error: spawn-fcgi: child exited with: 127
Solution: 缺少libfcgi.so.0引起，但却没有提示缺少，运行时报错。
通过ln -s /usr/local/lib/libfcgi.so.0 /usr/lib/建立软链接即可
{% endhighlight %}
