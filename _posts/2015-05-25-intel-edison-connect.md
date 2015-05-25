---
layout: post
category: Intel
title: Edison开发版连接
tags: Intel Edison 
---

&emsp;&emsp;之前稍微玩过一下puDuino，即俗称的超树莓派，拥有丰富的IO资源，基于Arduino开源平台。使用的是国产的处理器，使用ARM的授权IP，主频大概1GHz，内存1GB，运行一个改良版的Ubuntu系统，用户体验非常好。最近拿了一个Intel去年针对智能硬件领域推出的处理器Edison，其其包括Mini breakout board版本（只有一个SD卡大小），以及针对Arduino平台进行了定制，即Arduino expansion board版本（见下图），开发资源与Arduino的一套东西类似。

<!--more-->

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_25_01.jpg" alt="">
</figure>


## 1.Edison Arduino expansion board连接

### 1.1 设备连接

&emsp;&emsp;如果是新买的产品，首先需要将Intel Edison board与Arduino expansion board连接，即将Edison对应的CPU模块针脚插到expansion board的相应位置上。这样的设计，便于更换CPU。电源为7v～15V的DC电源，我拿的是一个9V的电源，在board上的电源接口为正常的的DC接口，而puDuino则直接是 micro-USB接口做电源。

&emsp;&emsp;与Laptop的连接：

* 将DC连到电源，board上的绿色指示灯会呈常亮状态
* 将两个micro-USB与Laptop的USB进行连接
* 将USB与micro-USB中间的microswitch移到micro-USB一侧

&emsp;&emsp;通过Terminal连接Edison

* Edison通过USB与Laptop连接（为什么需要连接两个USB？当只连接一个USB时，找不到设备），由于Unix系统对串口设备免驱动，因此当使用windows系统时，还需要安装相应的驱动程序，具体可以参照`https://software.intel.com/en-us/installing-drivers-for-intel-edison-board-with-windows`
* `ls /dev/tty.usbserial-* `可以看到我们的Edison设备 
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_25_02.png" alt="">
</figure>

### 1.2 MAC OS X/Ubuntu与Edison连接

* 使用screen工具与设备连接，使用screen连接，运行程序时可以方便地查看程序的输出结果。`screen -L /dev/tty.usbserial-A402ISYE 115200 –L`，Enter之后会出现黑屏，连续单击两次Enter键，即可进入Login界面，直接输入root，即可登录成功。需要说明的是，Edison一类的硬件开发版，需要直接操作底层的GPIO等资源，因此一般需要直接食用root登录。

* Ubuntu 通过screen连接Edison，`sudo screen /dev/ttyUSB0 115200`

<br />

### 2.通过WiFi连接Edison

&emsp;&emsp;输入以下命令，进行WiFi配置，`configure_edison --wifi`，如果配置失败，则需要刷新固件；Edison会开始扫描可用的WiFi网络，并列出； 选择序号、输入密码，即可以进行连接；成功的状态返回如下：
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_25_03.png" alt="">
</figure>

&emsp;&emsp;连接网络成功后，可以通过在同一网络的Laptop中ping该Edison的ip，或者在浏览器中，输入192.168.2.3，访问该Edison；若连接存在问题；则可以通过在Edison中通过以下命令进行网络重置。
{% highlight Python %}
ifconfig usb0 down
ifconfig wlan0 down
ifconfig wlan0 up
{% endhighlight %}

<br />

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_25_04.png" alt="">
</figure>

<br />

### 3. 存在的问题

&emsp;&emsp;每次断开之后，都需要`configure_edison --wifi`重新连接wifi，pcDuino有网口，因此不存在这个问题。screen连接，意外断开之后，会存在一些类似拖屏的行为。直接使用ssh连接应该会比较好。
