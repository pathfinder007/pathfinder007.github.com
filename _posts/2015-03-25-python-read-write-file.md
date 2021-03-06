---
layout: post
category: Python
title: Python读写大数据文件
tags: Python
---

&emsp;&emsp;一般的数据挖掘比赛，原始数据都存储在csv文件里面。而python，由于其方便好用的机器学习框架scikit-lenran，被普遍采用。对比了一下Python将文件载入内存的几种方法，感觉直接使用csv.reader速度相对较慢。

<!--more-->

### 1. csv.reader读取

&emsp;&emsp;之前一直`import csv`来进行csv文件的读写，但是数据量大的时候，载入内存的速度有点慢。但是类似`readline`，可以很方便的忽略头信息。当然写法非常不Pythonic
{% highlight Python %}
f = file(path, 'r')
reader = csv.reader(f)
reader.next()
for line in reader:
	process()
{% endhighlight %}

### 2. with...open读取文件
&emsp;&emsp;一种比较Pythonic的写法，with可以负责处理open和close文件，包括抛出内部异常等，而`for line in f`将文件对象`f`当作迭代对象，将自动处理IO缓冲和内存管理，读取大文件时效率更高，经测试，500MB左右的文件，载入内存的时间在25s左右。就是比较爽的是，为了忽略第一行的头信息，需要加个`count`做判断，虽然开销不大，但是很不爽。
{% highlight Python %}
with open(path, 'r') as f:
	for line in f:
		process()
{% endhighlight %}

### 3. fileinput处理
&emsp;&emsp;用到了Python的fileinput模块。
{% highlight Python %}
import fileinput
for line in fileinput.input([path]):
	process()
{% endhighlight %}

### 4. Python写文件
&emsp;&emsp;将文件内容载入内存，进行了一定的处理后，存储在list或者dict中，需要写回文件。
{% highlight Python %}
file_ptr = open(path, 'w')
for line in dataset:
	new_line = ','.join(line) + '\n'
	file_ptr.write(new_line)
file_ptr.close()
{% endhighlight %}
