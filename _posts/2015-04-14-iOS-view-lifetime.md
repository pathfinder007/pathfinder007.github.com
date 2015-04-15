---
layout: post
category: iOS
title: iOS中View的生命周期
tags: iOS
---

现在写应用时，习惯完全通过代码进行布局，不使用nib文件，则  
`initWithNibName/awakeFromNib/initWithCoder`这一系列方法，都可以完全忽略。
基本上需要关注的涉及视图生命周期的是下面这些函数：  
`loadView/viewDidLoad/viewDidUnload/  
viewWillAppear/viewDidAppear/viewWillDisappear/viewDidDisappear`   
而一直对它们的执行顺序，能否覆写，了解得并不明确。

<!--more-->


### 1. 各个函数的执行顺序及功能:

#### 1.1 函数执行顺序 

{% highlight Objective-C %}

init -> viewDidLoad -> viewWillAppear -> viewDidAppear -> viewWillDisappear -> viewDidDisappear

{% endhighlight %}

#### 1.2 函数功能

* init－初始化程序
* viewDidLoad－加载视图
* viewWillAppear－UIViewController对象的视图即将加入窗口时调用
* viewDidApper－UIViewController对象的视图已经加入到窗口时调用
* viewWillDisappear－UIViewController对象的视图即将消失、被覆盖或是隐藏时调用
* viewDidDisappear－UIViewController对象的视图已经消失、被覆盖或是隐藏时调用
* viewVillUnload－当内存过低时，需要释放一些不需要使用的视图时，即将释放时调用
* viewDidUnload－当内存过低，释放一些不需要的视图时调用。


### 2. 各函数使用注意事项

&emsp;&emsp;原来一直把View的创建、数据的初始化，都放在ViewDidLoad中，实际上，View的创建，应该放在loadView函数中，而数据初始化，放在ViewDidLoad中。

#### 2.1 loadView

* loadView在控制器的view为nil的时候被调用。 此方法用于以编程的方式创建view的时候用到。
* loadView是使用代码生成视图的时候，当视图第一次载入的时候调用的方法。loadView方法可能在运行应用程序的某个时刻，被内存管理控制器调用， 如果设备内存不足的时候， view控制器会收到didReceiveMemoryWarning的消息。默认的实现是检查当前控制器的view是否在使用。如果它的view不在当前正在使用的viewhierarchy里面，且你的控制器实现了loadView方法，那么这个view将被release。

#### 2.2 ViewDidLoad

* 不论是从xib中加载视图，还是从loadview生成视图，都会被调用。进行View的配置，以及一些数据的初始化，http请求等。
* viewdidload是当程序第一次加载view时调用，以后都不会用到，而viewDidAppear是每当切换到view时就调用。
* 假设不使用xib文件对视图布局，那么loadView方法必须设置屏幕，并对任何子视图布局。每当继承一个具体的子类，例如UITableViewController或UITabBarController时，务必调用[super loadView]或者实现viewDidLoad。这样一来，在进行定制之前，父类可以对屏幕进行适当的设置。当代码基于具体的子类时，苹果的文档和示例代码鼓励使用viewDidLoad。

#### 2.3 viewDidUnload

* 收到内存警告，同时该视图并不在当前界面显示时候会被调用，此时该controller的view已经被释放并赋值为nil。
* 接下来应该把实例变量的子视图、其他的实例变量、http请求释放掉。因为当该为空后会重复之前的流程直到把view创建，若不将自己额外添加的子视图、各种类实例变量释放，这里便会重新再次创建，导致内存泄露了。
* 由于controller通常保存着view以及相关object的引用，所以你必须使用这个函数来放弃这些对象的所有权以便内存回收。但不要释放那些难以重建的数据。