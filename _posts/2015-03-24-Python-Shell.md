---
layout: post
category: Python
title: Python中执行shell命令
tags: Python
---

&emsp;&emsp;早上在测试wget从EC2上面下载文件的速度，忘了在python中执行shell命令的方法，顺手查了查，做下备忘。

<!--more-->

### 1. os.system()函数

&emsp;&emsp;该函数得不到shell命令的输出，即可以显示执行结果，但是无法获取执行结果，操作空间不大。
{% highlight Python %}
import os
os.system('ls')
{% endhighlight %}

### 2. popen()方法

&emsp;&emsp;该方法可以得到命令执行后的结果是一个字符串，要自行处理，可以获取更多信息
{% highlight Python %}
import os
st = os.poen("ls").read()
a = st.split("\n")
for b in a:
	print b
{% endhighlight %}

### 3. commands模块

&emsp;&emsp;可以方便地取得命令的输出，包括标准和错误输出和执行状态位
{% highlight Python %}
import commands
a, b = commands.getstatusoutput('ls')
#其中a是退出状态，b是输出结果
{% endhighlight %}

