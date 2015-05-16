---
layout: post
category: Linux
title: ubuntu内核安装卸载
tags: Ubuntu Kernel
---

&emsp;&emsp;ubuntu下新内核的安装，冗余内核的卸载步骤。

<!--more-->


### 1.内核编译安装

{% highlight Python %}
make mrproper 清理内核源码中多次编译产生的残渣
make menuconfig 打开图像界面，配置内核
make -j8 开8个线程，编译内核
make modules_install
make install 安装内核

cp arch/x86/boot/bzImage /boot/
cp System.map /boot/     将编译生成的文件拷贝到/boot/目录下 
sudo mkinitramfs 3.18.5 -o /boot/initrd.img-3.18.5 建立镜像文件
sudo update-initramfs -c -k 3.18.5     
sudo update-grub2     更新修改系统引导配置
cd /boot/grub
vim grub可以查看引导程序(boot loader)的配置文件；
{% endhighlight %}

<br />

### 2.内核卸载清理 

{% highlight Python %}
dpkg —get-selections | grep linux 列出系统安装的内核，带image的项
sudo apt-get remove linux-image-内核版本
sudo apt-get remove linux-headers-内核版本    自动删除内核文件，释放磁盘空间
{% endhighlight %}