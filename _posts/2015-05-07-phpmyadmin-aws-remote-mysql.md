---
layout: post
category: sql
title: phpmyadmin管理aws上mysql
tags: aws Backend mysql
---

&emsp;&emsp;通过对phpmyadmin的配置，进行远程数据库的管理，主要包括，AWS EC2上面的本地数据库，以及AWS上RDS实例上的MySQL，本质上，其实是一样的，都是对远程数据库的管理。

<!--more-->

### 1. MySQL忘记root账户的解决办法

{% highlight Python %}
打开mysql的配置文件，`/etc/mysql/my.cnf`，在[mysqld]字段下加入一行`skip-grant-tables`
重启mysql服务，`sudo service mysql restart`
`mysql`空密码进入命令行管理
`use mysql`选择数据库
`update user set password=PASSWORD("new_pass") where user='root';`更改root账户的密码
`quit`退出
在配置文件中将`skip-grant-tables`注释掉
重启mysql服务，即更改了root密码
{% endhighlight %}

<br />

### 2. 配置phpmyadmin连接远程EC2上面的本地数据库

&emsp;&emsp;对于phpmyadmin/libraries/config.default.php，做如下修改：

{% highlight Python %}
$cfg['PmaAbsoluteUri'] = 'ec2_public_ip/phpmyadmin'
$cfg['Servers'][$i]['host'] = 'ec2_public_ip'
$cfg['Servers'][$i]['user'] = 'root'; 
$cfg['Servers'][$i]['password'] = 'your passwd';
{% endhighlight %}

<br />

### 3. 配置phpmyadmin连接AWS RDS实例上面的MySQL

&emsp;&emsp;phpmyadmin的配置默认只管理本地的mysql，因此登录界面也没有server的选择功能，可以通过配置`phpmyadmin/config.inc.php`，配置phpmyadmin可以管理多个Server上的数据库在配置文件中添加如下代码。
需要注意的是，加几个这样的代码块，就可以同时管理多少个Server上的Mysql数据库。
{% highlight php %}
 $i++;
/* Authentication type */
$cfg['Servers'][$i]['auth_type'] = 'cookie';
/* Server parameters */
/* RDS对应的Endpoint*/
$cfg['Servers'][$i]['host'] = 'xxxx.xxxxxxxxxxxx.ap-northeast-1.rds.amazonaws.com';
$cfg['Servers'][$i]['connect_type'] = 'tcp';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = false;
{% endhighlight %}

