---
layout: post
category: AWS
title: AWS上S3基本操作
tags: AWS S3
---

&emsp;&emsp;AWS提供了一套自己的SDK，对于使用Python作为主要Backend语言来说，需要通过boto的接口，来进行S3的操作。操作主要涉及到S3的连接、bucket的建立以及删除，数据的存储、读取、删除操作。

<!--more-->


### 1.基本头文件

{% highlight Python %}
import time
import math
import os
import boto
from boto.s3.key import Key                                                                                                       
from boto.s3.connection import Location
from filechunkio import FileChunkIO
{% endhighlight %}

### 2.Bucket的建立与删除 

&emsp;&emsp;以当前时间戳为key，避免bucket重复，建立之后，插入一个简单的字符串键值对，之后读取。
{% highlight Python %}
def create_del_bucket():
    s3 = boto.connect_s3()
    bucket = s3.create_bucket('mhs-demo-%s' % int(time.time()))
    key = bucket.new_key('mhs')
    key.set_contents_from_string("Hello World!")
    time.sleep(2)
    print key.get_contents_as_string()
    key.delete()
    bucket.delete()
{% endhighlight %}


### 3.判断一个Bucket是否存在

{% highlight Python %}
def is_bucket_exists(conn):
    bucket = 'mhs_img_bucket'
    valid  = conn.lookup(bucket)
    if valid is None:
        print "No such bucket."
    else:                                                                                                                         
        print bucket + " exists."
{% endhighlight %}


### 4.上传/下载一张图片，测试速度

{% highlight Python %}
def up_down_img():
    conn = boto.connect_s3()
    bucket = conn.create_bucket('mhs-%s' % int(time.time()))
    k = Key(bucket)
    k.key = 'mhs0323'
    
    img_path = 'IMG_0541.JPG'
    img_size = os.stat(img_path).st_size 
    print "img size: " + str(img_size)

    print "start uploading img..."
    start_up = int(time.time())
    k.set_contents_from_filename('IMG_0541.JPG')
    end_up = int(time.time())
    up_time = end_up - start_up
    print "upload time: "  + str(up_time)
    print "upload speed: " + str(img_size * 1.0 / (1024 * up_time))

    print "start downloading img..."
    start_down = int(time.time())
    k.get_contents_to_filename('s3_0541.jpeg')
    end_down = int(time.time())
    down_time = end_down - start_down
    print "download time: " + str(down_time)
    print "download speed: " + str(img_size * 1.0 / (1024 * down_time))
    
    k.delete()
    bucket.delete()
{% endhighlight %}
