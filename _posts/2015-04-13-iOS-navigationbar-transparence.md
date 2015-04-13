---
layout: post
category: iOS-dev
title: iOS中通过UIView定义的导航栏实现滑动半透明效果
tags: iOS
---

&emsp;&emsp;iOS中，导航栏一般两种方式，或者使用系统自带的`UINavagationBar`，则导航栏会随着页面的push/pop有一个继承。或者不使用系统自带导航栏，自己定义一个UIView，绘制导航栏。最近在调整华商韬略的iOS客户端，在文章页面，想要实现导航栏的透明效果，而之前在人物列表页面，是实现了想要的透明效果的，即页面上滑到一定程度，设置透明效果，当下滑归位，去掉透明效果，如此相对容易，如下细说。而文章页面，整个是一个UIWebView，稍微麻烦一些。

<!--more-->

&emsp;&emsp;系统自带导航栏是自带透明效果的，而UIView可以通过设定alpha参数调整透明度，但是透明度调整之后，一直不是想要的效果，即从导航栏需要能够看到底下UIWebView的文字。几经折腾，找到一个不算完美的方案。 

### 1. 需要达到的导航栏效果

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_04_13_1.png" alt="">
</figure>

### 2. 整个页面是一个UITableView的情况

#### 2.1 页面展示效果

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_04_13_2.png" alt="">
</figure>   


#### 2.2 透明效果解决方案

&emsp;&emsp;很多的新闻展示类的App，整个页面即为一个UITableView，而设置UIView的alpha，要达到需要的效果，UITableView需要与上面的导航栏banner有重叠，透明展示效果只在重叠处具有。因此UITableView需要从竖直偏移为y的地方进行布局，而这样显然不行，导航栏会挡住需要展示的内容。有几个方案，解决这个问题。

* 由于页面需要下拉刷新功能，因此可以将refreshHeaderView，加在UITableView的header上面；
* 不需要下拉刷新功能时，可以自定义一个header，附着在banner的下方；

{% highlight Objective-C %}

//Init refresh header view
_refreshHeaderView = [[EGORefreshTableHeaderView alloc] initWithFrame:CGRectMake(0.0f, REFRESHHEIGHT, TSCREENW, REFRESHHEIGHT)];
_refreshHeaderView.delegate = self;
self.personTable.tableHeaderView = _refreshHeaderView;

{% endhighlight %}   


#### 2.3 UITableView滑动到一定程度时，实现透明效果

&emsp; &emsp; UITableView继承自UIScrollView，可以实现UIScrollViewDelegate中的两个方法，实现在这个控件在拖拽上滑的过程以及下滑归位之后需要实现的操作。

* `- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView`
* `- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView` 



{% highlight Objective-C %}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView{
    if (self.personTable.contentOffset.y > 5) {
        //[self.listViewDelegate setBannerAlpha: YES];
        //self.bannerisAlpha = YES;
        [self.banner setAlpha: 0.5f];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView{
    if (self.personTable.contentOffset.y < 5) {
        //[self.listViewDelegate setBannerAlpha: NO];
        //self.bannerisAlpha = NO;
        [self.banner setAlpha: 0.5f];
    }
}

{% endhighlight %}


### 3. 整个页面是一个UIWebView的情况

&emsp; &emsp;在之前的一个版本中，实现的是，在列表页面，上滑时，导航栏半透明，而文章详细页面，上滑时，直接将导航栏往上推，实现整个页面有效显示的最大化，参照知乎日报是类似的实现。现在想把导航栏固定，实现半透明效果。

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_04_13_3.png" alt="">
</figure>

&emsp; &emsp;整个页面，除了banner以及bottomView，整个是一个UIWebView，这个控件没有header的说法，而要实现透明效果，需要UIWebView与banner有一个重合。试了好几种方案，比如在页面上再扔一个UITableView/UIScrollView，再在上面布局，不起效果。只能暂时先实现一种比较丑陋的做法。在页面上滑倒需要实现banner透明的时候，将UIWebView的frame上移到与banner重合，上滑时看不出变化，但是下滑时，滑到最底部，需要将UIWebView的frame恢复，就有了一个比较突兀的下拉，考虑setFrame操作使用动画，解决这个问题。

{% highlight Objective-C %}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView{
    if (self.articleDetailWebView.scrollView.contentOffset.y > 5) {
        [self.articleDetailWebView setFrame: CGRectMake(0, STATUS_BAR_HEIGHT, TSCREENW, TSCREENH-STATUS_BAR_HEIGHT)];
        [self.banner setAlpha: 0.5f];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView{
    if (self.articleDetailWebView.scrollView.contentOffset.y < 5) {
        [self.articleDetailWebView setFrame: CGRectMake(0, NAVIHEIGHT, TSCREENW, TSCREENH-NAVIHEIGHT)];
        [self.banner setAlpha: 0.9f];
    }
}

{% endhighlight %}