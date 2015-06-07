---
layout: post
category: Ruby
title: Ruby中的一些语法概念
tags: Ruby
---

&emsp;&emsp;开始在luonet指导下搞ruby，之前稍微有过一些接触，语法各方面跟python差不多。ruby有rails，python有django，大同小异。主要是熟悉ruby语法之后对元编程以及ralis的熟悉。跟着`http://learnrubythehardway.org/book/`扫一遍cookbook。

<!--more-->

### 1. 对.rb文件中ASCII字符出问题的处理

&emsp;&emsp;在.rb文件头加入`# -*- coding: utf-8 -*-`即可，这点与python一样，指定文件的编码格式。

### 2. 单行以及多行注释

&emsp;&emsp;单行注释使用#, 多行注释使用`=begin =end`组成的块，这点与python使用`''' ''' `块不一样。

### 3. 自动进行运算

&emsp;&emsp;`#{}`会自动运算{}内的内容，并用运算结果替换`#{}`，比如：`puts "greater? #{5 > -2}"`，当在＃之前加入`\`则不会替换，原样输出。

### 4. 定义一个格式化的字符串

&emsp;&emsp;使用`#{}`也可以，但是可能多次需要以一个相同格式进行输出，定义一个formatter则显得更为直观。

{% highlight C++ %}
formatter = "%{first} %{second} %{third} %{fourth}"
puts formatter % {first: 1, second: 2, third: 3, fourth: 4}
puts formatter % {first: true, second: false, third: true, fourth: false}
puts formatter % {first: formatter, second: formatter, third: formatter, fourth: formatter}
{% endhighlight %}

### 5. 获取输入

&emsp;&emsp;需要注意print不带'\n'，而puts自带'\n'

{% highlight ruby %}
print "How old are you? "
age = gets.chomp   # 获取用户输入，直到'\n'出现
age = gets.chomp.to_i  # 将输入转成整数
{% endhighlight %}

### 6. 命令行输入参数

{% highlight ruby %}
first, second, third = ARGV

puts first
puts second
puts third
{% endhighlight %}
