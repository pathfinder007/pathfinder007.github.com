---
layout: post
category: iOS
title: iOS中清理缓存的实现
tags: iOS
---

&emsp;&emsp;App开发中，经常涉及到清理Cache的功能，特别对于新闻展示类的App，为了提高页面加载速度，大量的数据，需要在本地缓存，当缓存没有一个比较规范的自动清理机制时，会造成程序占用空间越来越大的情况，实时给用户展示当前缓存数据的大小，让用户决定是否手动清理，是一个比较好的机制。最近也给华商韬略的iOS版本，加入了这一功能。

<!--more-->

&emsp;&emsp;

### 1. 新版华商韬略客户端设置页面:

<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_04_14_1.png" alt="">
</figure>

### 2. iOS App中的目录结构及功能

#### 2.1 iOS App目录结构

&emsp;&emsp;出于数据安全性的考虑，一个应用拥有自己独立的目录，用来写入应用的数据或者首选项参数。应用安装后，会有对应的home目录，home内的子目录功能如下：

* AppName.app 存放应用程序自身
* Documents/ 存放用户文档和应用数据文件
* Library/    应用程序规范的顶级目录，用于存放应用的文件，不宜存放用户数据文件，和Document一样会被itunes同步，但不包括Caches
* /Library/Preferences/ 这里存放程序规范要求的首选项文件
* Library/Cache/ 保存应用的持久化数据，用于应用升级或者应用关闭后的数据保存，不会被itunes同步，所以为了减少同步的时间，可以考虑将一些比较大的文件而又不需要备份的文件放到这个目录下
* tmp/ 保持不需要持久化的应用数据，应用关闭户，数据被清除

&emsp;&emsp;可见，我们关于数据的操作来说，主要需要涉及的就是Documents/，以及Library/Cache/，之前一直对Cache目录的理解有点偏差，认为会被应用程序自动清理，其实不然。如果是在启动中需要使用的数据文件，可以放置在Library/Caches/下面，不建议放在Documents目录下，该目录下会备份，耗时。

#### 2.2 获取应用的各个目录

{% highlight Objective-C %}

//获取Cache路径
NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
NSString *path = [paths objectAtIndex:0];

//获取Documents路径
paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
path  = [paths objectAtIndex:0];

{% endhighlight %}

### 3. 清理Cache功能的实现


&emsp;&emsp;为了实现离线阅读，需要在本地Cache大量的数据文件，而这些数据文件一般放在Caches目录下，即通常所说的收藏的文章。而其他一些需要清理的Cache，也位于该大目录下面，则需要遍历Caches目录，同时忽略一些特定的文件夹，进行文件大小的统计，进而展现给用户当前Cache的大小。

#### 3.1 遍历应用的某个目录并统计大小

{% highlight Objective-C %}

- (float)checkTmpSize
{
    float totalSize = 0;
    NSString *path = [self getCachePath];
    NSDirectoryEnumerator *fileEnumerator = [[NSFileManager defaultManager] enumeratorAtPath: path];
    
    for (NSString *fileName in fileEnumerator) {
        NSString *filePath  = [path stringByAppendingPathComponent: fileName];
        NSDictionary *attrs = [[NSFileManager defaultManager] attributesOfItemAtPath: filePath error: nil];
        unsigned long long length = [attrs fileSize];
        
        if([[[fileName componentsSeparatedByString: @"/"] objectAtIndex: 0] isEqualToString: @"URLCACHE"])
            continue;
        
        totalSize += length / 1024.0 / 1024.0;
    }
    return  totalSize;
}

{% endhighlight %} 

#### 3.2 清理NSURLCache缓存的数据

&emsp;&emsp;开发中，一般基于NSURLCache来实现数据的Cache，NSURLCache会在Caches目录下，以Bundle Identifier为文件夹名建立Cache的存放路径。可以将该目录下的文件remove，实现清理Cache的功能。而如果使用了SDWebImageManager进行图片加载，也可以顺便使用其封装的清理memory/disk的方法，清理其缓存的数据。

{% highlight Objective-C %}

- (void)clearCache
{
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    [manager.imageCache clearDisk];
    [manager.imageCache clearMemory];
    NSString *identifier = [[NSBundle mainBundle] bundleIdentifier];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *base_path = [self getCachePath];
    NSString *path = [NSString stringWithFormat: @"%@/%@", base_path, identifier];
    [fileManager removeItemAtPath: path error: nil];
    
    tmpSize = [self checkTmpSize];
    [self.tableView reloadData];
}

{% endhighlight %}