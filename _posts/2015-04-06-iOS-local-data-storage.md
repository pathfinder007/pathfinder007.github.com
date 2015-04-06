---
layout: post
category: iOS-dev
title: iOS中本地持久化存储
tags: iOS
---


&emsp;&emsp;App中有一些数据需要在本地持久化存储，主要是涉及一些App个人私有的配置信息，比如当前版本号、需要离线浏览的文章、当前选择的是白天/夜间浏览模式、登陆数据等。而为了最大化页面加载，也有不少信息需要在本地就行存储。iOS中本地存储主要是三种方式，数据库(SQLite)、NSUserDefaults、plist文件。原来开发中，一直喜欢自己新建plist文件进行存储，使用key-value的格式，类似自己建xml格式的文档。如此好处仅仅是开发的时候可视化比较好，但是这样需要显示创建、读取文件，很麻烦。而NSUserDefaults才则不需要考虑这些东西，像读取字符串一样直接读取、存储，自动进行key-value存储，并将数据进行序列化，读取方便、占用空间小，相当于一个小型的key-value数据库。

<!--more-->

### 1. [NSUserDefaults standardUserDefaults]

&emsp;&emsp;用来记录需要永久存储的数据，不需要读写文件，而是保留到NSDictionary字典里，由系统保存到文件里。系统会自动将字典进行序列化，即二进制格式保存到该应用下的/Library/Preferences下的一个plist文件中。如果程序意外退出，数据不会被系统写入该文件，即数据的同步，系统有一个同步的时间点。为了确保数据写入，可以在每次设置需要写入的数据时，使用`[[NSUserDefaults standardUserDefaults] synchronize］`命令直接同步到文件里，来避免数据的丢失。

#### 1.1 iOS中获取应用的Documents路径：

{% highlight Objective-C %}

[[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject]

{% endhighlight %}

#### 1.2 NSUserDefaults判断key是否存在：

{% highlight Objective-C %}

NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
if ([userDefaults objectForKey: @"msg"] == nil) {
}

{% endhighlight %}

#### 1.3 NSUserDefaults数据存储：

{% highlight Objective-C %}

NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
[userDefaults setInteger: myInteger forKey: @"myInteger"];  
[userDefaults setFloat:   myFloat   forKey: @"myFloat"];  
[userDefaults setDouble:  myDouble  forKey: @"myDouble"];  
      
[userDefaults setObject:  myString     forKey: @"myString"];  
[userDefaults setObject:  myDate       forKey: @"myDate"];  
[userDefaults setObject:  myArray      forKey: @"myArray"];  
[userDefaults setObject:  myDictionary forKey: @"myDictionary"];  

[[NSUserDefaults sharedUserDefaults] synchronize]; //直接将数据写入

{% endhighlight %}

#### 1.4 NSUserDefaults数据读取:

{% highlight Objective-C %}

NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
NSInteger myInteger = [userDefaultes integerForKey: @"myInteger"]; 
float myFloat       = [userDefaultes floatForKey:   @"myFloat"];  
double myDouble     = [userDefaultes doubleForKey:  @"myDouble"];  
NSString *myString  = [userDefaultes stringForKey:  @"myString"];  
NSDate *myDate      = [userDefaultes valueForKey:   @"myDate"]; 
NSArray *myArray    = [userDefaultes arrayForKey:   @"myArray"];  
NSDictionary *myDictionary = [userDefaultes dictionaryForKey:@"myDictionary"];  

{% endhighlight %}

#### 1.5 列出NSUserDefaults中的全部数据:

{% highlight Objective-C %}

NSDictionary* defaults = [[NSUserDefaults standardUserDefaults] dictionaryRepresentation];

{% endhighlight %}
