---
layout: post
category: sql
title: mysql基本操作
tags: aws Backend mysql python
---

&emsp;&emsp;项目涉及的环境的搭建，包括Nginx的基本配置，基本OK了，目前的方案，与S3的交互，都不使用Backend这边的Python模块去做，而交给Client以及Trainer/Predictor那边的C++模块，相当于在算法模块外面再包一层C++的接口，处理与Server的rest交互，以及与S3的交互。这几天先把与MySQL交互的Python接口封装好。

<!--more-->

&emsp;&emsp;很长一段时间没有做backend方面的工作了，不少东西都稍微有点生疏，很多基本的MySQL操作，居然都忘了。好在去年这个时候，在阿里云上，写过不少的SQL操作，拾起来倒挺快。

## 1. MySQL基本操作

{% highlight C++ %}
mysql -h ip -u user -p    //使用mysql cli连接远程MySQL数据库
show databases;    //列出server上所有的mysql数据库
use mysql;    //选择一个数据库
show tables;    //列出数据库中所有的数据表
create database abc;    //创建数据库
drop database abc;    //删除数据库
CREATE TABLE birth (name VARCHAR(20), sex CHAR(1), birth DATE, birthaddr VARCHAR(20));    //创建一个数据表 
describe birth;    //显示数据表的结构
insert into birth values (′mushsen′,′f′,′1990-10-19′,′china′);    //往数据表插入一条记录
select * from birth;    //查询表中所有的记录
delete from birth;    //删除表中所有的记录
update birth set birthaddr = "usa" where name = "mushsen";    //修改表中的字段
{% endhighlight %}

<br />

## 2. 通过txt文件插入数据库

&emsp;&emsp;通过文本文件插入数据库，当大批量数据时，可以先将需要插入的记录，批量写到txt文件中，每行包含一条记录，用tab分开，以通过一个简单的C脚本，将数据fprintf到一个文件中，并且按照create table时列出的列次序给出。

birth.txt 文件内容：
{% highlight Python %}
mushsen m 1990-10-19 china 　 
vera f 1990-05-12 china 
tom m 1980-09-02 usa
{% endhighlight %}

使用如下命令将birth.txt的内容装载到birth表中：
{% highlight SQL %}
load data local infile "birth.txt" into table birth;
{% endhighlight %}

当`load data local infile`报错，是本地mysql客户端的问题，在登录的时候，需要加入如下选项：
{% highlight SQL %}
mysql -h ip -u user --local-infile=1 -p
{% endhighlight %}

<br />

## 3. 数据库中文支持 

&emsp;&emsp;可以在创建数据库以及数据表时，指定字符编码实现，如下：

{% highlight Python %}
CREATE DATABASE `test`
CHARACTER SET 'utf8'
COLLATE 'utf8_general_ci';

CREATE TABLE `database_user` (
`ID` varchar(40) NOT NULL default '',
`UserID` varchar(40) NOT NULL default '',
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
{% endhighlight %}


