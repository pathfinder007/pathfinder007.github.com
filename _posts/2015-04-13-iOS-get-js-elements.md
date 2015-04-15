---
layout: post
category: iOS
title: iOS中获取UIWebView中加载页面的元素
tags: iOS
---

&emsp;&emsp;iOS中，一般使用UIWebView加载来自后台的文章页面，而在涉及分享功能时，经常需要从加载的页面中获取图片或者通用的说，某一个`javascript element`的值，即涉及到iOS与javascript的交互，项目中用到了几个方法，记录。

<!--more-->

### 1. 获取打开页面的URL

{% highlight Objective-C %}

NSString *url = [_articleDetailWebView stringByEvaluatingJavaScriptFromString: 
@"document.location.href”];

{% endhighlight %}

### 2. 以id获取标签下的元素

{% highlight Objective-C %}

NSString *shareTitle = [_articleDetailWebView stringByEvaluatingJavaScriptFromString:@"document.getElementById('url_read_article').innerText"];

{% endhighlight %}

获取到

{% highlight javascript %}

<div class="url_read_article" id="url_read_article" style="display:none">
http: mrt.hsmrt.com/server/show_iphone.php?id=433
</div>

{% endhighlight %}

中的 

`http: mrt.hsmrt.com/server/show_iphone.php?id=433`

### 3. 获取某一个tag下的src等属性

{% highlight Objective-C %}

    NSString *topImg = [_articleDetailWebView stringByEvaluatingJavaScriptFromString: @"document.getElementsByTagName('img')[0].src"];

{% endhighlight %}

获取到

{% highlight javascript %}

`<img class="top_img" src="http://mrt.hsmrt.com/app/pics/433/index_sma_img.jpeg">`

{% endhighlight %}

中img标签中的src属性的值，即

`http://mrt.hsmrt.com/app/pics/433/index_sma_img.jpeg`；

由于`getElementsByTagName`返回的是一个元素列表，故需要根据具体的html页面布局取相应的值，或者通过`getElementById/getElementByClass`进行一些限定。
