---
layout: post
category: AWS
title: SSH登录AWS上的EC2以及SCP操作
tags: AWS EC2
---

&emsp;&emsp;3月底的时候，当时有做一个基于aws的高性能Web Server项目的意向。就开始对aws S3以及EC2进行了一定的调研，并做了一些测试。后来项目后延，这个事情暂时搁置。5月中旬左右将会正式开展，想了一下，得把以前一些有用的东西重拾一下，稍微搭建一个小系统，尽量缩短正式开始时候的工期。

<!--more-->


### 1.AWS相关服务

&emsp;&emsp;亚马逊的云服务，应该是目前提供的云服务最完备、接口最好用的地方。但是在国内，可能会涉及到被墙的问题，但是如果核心链路是国外到国内的下行链路，即这一条通道对在线率的要求高，而上行通道在线率可以有一定的妥协，在这一点上来看，问题倒不是太大。比较简单的一个场景，当上行链路被墙，下行链路通畅，数据仍然可以从aws上的Server打到client，可以通过client做一定的本地存储，将由于上行链路被墙产生的数据阻塞，在链路恢复时，同步到Server即可，在一定程度上规避被墙的问题。在这个问题上，不管链路暂时是否通畅，VPN应该都是必不可少的工具，行云是一个不错的选择。

&emsp;&emsp;主要需要使用的服务包括AWS的EC2，即弹性计算云服务，每一个实例为一个虚拟机，定制好自己的系统、配置之后，可以完全像操作本地的虚拟机一样去操作。对于EC2多存放的机房，可以自己选择，对于Client主要在国内的应用场景来说，东京或者新加坡，是比较好的选择，也可以通过VPN所设定的位置，进行相应的实例位置选择。

&emsp;&emsp;S3为AWS主要的存储服务，提供类似键值对的存储，S3的存储位置不能选择。而对于S3上数据的操作，可以通过AWS提供的SDK进行处理，对于使用Python作为主要的backend语言的业务场景来说，AWS提供了boto的SDK，而由于很多业务场景，需要在Server上面使用Tornado等框架，Github上不少人对此进行了整合，比如botocore、botornado是被提到比较多的两个repo。


### 2.EC2相关 

&emsp;&emsp;需要说明的是，AWS提供了一年的免费试用，注册账号，绑定一张信用卡即可。虽然免费提供的EC2很弱，使用起来略卡，但人家免费，似乎并不能多要求什么。提供的操作系统包括Amazon Linux、Red Hat、SUSE Linux、Ubuntu、Windows。惯用Ubuntu，故选择的也是Ubuntu 14.04的64bit Server版本。AWS提供的免费版本配置如下，实际生产环境中，可以选择更好的配置：

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_04_1.png" alt="">
</figure>

&emsp;&emsp;EC2提供了AMI的接入机制，大概就是，尽量不使用root账号进行登录，提供了一定的权限管理手段，对于不同的用户，根据其具体权限、可接触的资源，提供不同的AMI证书，这点上来说，倒是跟本地的用户管理，是一个思路。需要注意的是，实例在使用的过程中，可以不宕机进行包括内存、存储等一系列的动态扩展，都可以通过AWS的Web操作界面进行。实例新建之后，可以下载登录需要的证书文件，为一个pem文件。这也是AWS跟一般的本地ssh操作不一样的地方，需要在参数中带上证书，才能进行登录验证，而不需要使用用户名、密码。

&emsp;&emsp;目前我使用的是AWS账户的证书进行访问，实际上，更好的做法是，使用`AWS Identity and Access Management (IAM)`创建IAM用户，再将该用户添加到具有管理权限的IAM组或授予此用户管理权限。


### 3.SSH登录以及SCP操作

&emsp;&emsp;之前直接食用AWS的账户证书进行EC2的访问，ssh以及scp脚本如下：

{% highlight Python %}
ssh -i mushsen.pem ubuntu@ec2-54-199-189-171.ap-northeast-1.compute.amazonaws.com
{% endhighlight %}

{% highlight Python %}
scp -i mushsen.pem -r "$1"  ubuntu@ec2-54-199-189-171.ap-northeast-1.compute.amazonaws.com:/home/ubuntu/
{% endhighlight %}
