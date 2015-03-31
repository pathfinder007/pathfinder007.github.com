---
layout: post
category: Python
title: Python中list的删除与清空
tags: Python
---

&emsp;&emsp;今天在写阿里的代码，涉及到大量的数据load进内存处理的操作，由于Python的list/dict都是使用自动引用计数的机制进行内存释放；而操作中经常需要将文件读入一个list，处理后扔到另一个list，再转存。当不手动释放list占据的内存时，内存泄漏严重。

<!--more-->

### 1. list的删除与清空

#### 1.1 list的删除
{% highlight Python %}
class Test(object):
	li = [1, 2, 3, 4]
	def func(self):
		del li

if __name__ == '__main__':
	t = Test()
	t.func()
{% endhighlight %}

&emsp;&emsp;如上代码，会报错，`AttributeError: 'Test' object attribute 'li' is read-only`.由于del li是完全删除这一个list，在成员函数中没办法直接删除一个类的成员变量。

#### 1.2 list的清空
{% highlight Python %}
class Test(object):
	li = [1, 2, 3, 4]
	def func(self):
		self.li[:] = []

if __name__ == '__main__':
	t = Test()
	t.func()
{% endhighlight %}

&emsp;&emsp;正确的清除一个list的方法，即list对象在内存中仍然存在，只是将里面的元素清空。


