---
layout: post
category: Ruby
title: Ruby中的文件操作
tags: Ruby
---

ruby的相关文件操作。

* close 关闭文件
* read 读取整个文件内容
* readline 读取文件的一行，通过移动文件指针实现
* truncate 做字段截断
* write('stuff') 将字段写入文件

<!--more-->


### 1. 文件读取

{% highlight ruby %}
filename = ARGV.first
txt = open(filename)
puts txt.readline
puts "-----------"
puts txt.readline
{% endhighlight %}

<br />

### 2, 文件写入

{% highlight ruby %}
filename = "test.txt"
txt = open(filename, 'w')
line = "line in test.txt"
txt.write(line)
txt.write("\n")
txt.close
{% endhighlight %}


