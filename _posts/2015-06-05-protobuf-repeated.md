---
layout: post
category: Protobuf
title: Protobuf中对于repeated字段的操作
tags: Protobuf cpp python
---

&emsp;&emsp;protobuf中，一个message可以认为是一个类，在protoc编译之后，会生成其内部各成员的set、get方法。而对于一个class内的元素，无外乎是单个元素，或者集合元素。这篇文章总结C++以及python下对protobuf中集合元素的序列化及反序列化操作。

<!--more-->

## 1. TaskInfo.proto

{% highlight C++ %}
package taskInfo;                                                                                                                 

message AcquireTrain {
    required int32 num = 101;
}

message TrainTasks {
    required bool enough = 102;
    required int32 num   = 103;

    message TaskKey {
        required string key = 104;
    }

    repeated TaskKey keys = 105;
}{% endhighlight %}

<br />

## 2. C++下的序列化与反序列化

### 2.1 测试代码

{% highlight C++ %}
#include "TaskInfo.pb.h"                                                                                                          
#include <fstream>
#include <sstream>
#include <iostream>
#include <unistd.h>
#include <string>

using namespace std;

void ListMsg(const taskInfo::TrainTasks &tasks) 
{
    cout << tasks.enough() << endl;
    cout << tasks.num() << endl;  
    for (int i = 0; i < tasks.keys_size(); ++i) {
        const taskInfo::TrainTasks::TaskKey &tKeys = tasks.keys(i);
        std::cout << tKeys.key() << std::endl; 
    }
}

int main(void)
{
    taskInfo::TrainTasks tasks;
    tasks.set_enough(1); 
    tasks.set_num(6);
    
    int N = 6;
    for (int i = 0; i < N; ++i) {
        taskInfo::TrainTasks::TaskKey *keys = tasks.add_keys();  
        
        std::stringstream ss;
        std::string str;
        ss << i;
        ss >> str;
        std::string key = "A01.0.tif-" + str;
        keys -> set_key(key);
    }

    fstream output("./log", ios::out | ios::trunc | ios::binary);

    if (!tasks.SerializeToOstream(&output)) {
         cerr << "Failed to write msg." << endl;
         return -1;
    }
    output.close();
    
    taskInfo::TrainTasks tasks_get;
	fstream input("./log", ios::in | ios::binary);   
    if (!tasks_get.ParseFromIstream(&input)) {
         cerr << "Failed to parse address book." << endl;
         return -1;
    }
    input.close();
    ListMsg(tasks_get);
    
    return 0;
}
{% endhighlight %}

### 2.2 相应的Makefile

{% highlight C++ %}
all: test                                                                                                                         

clean:
      rm -f test  *.o  log  

test: TaskInfo.pb.cc test.cpp
    g++  TaskInfo.pb.cc test.cpp -o test  -lprotobuf -lpthread
{% endhighlight %}

<br />

## 3. Python下的序列化与反序列化

{% highlight C++ %}
#!/usr/bin/env python                                                                                                                                                                                                                                               
#coding=utf-8

import TaskInfo_pb2

tasks = TaskInfo_pb2.TrainTasks()
tasks.enough = 1
tasks.num    = 10
for i in xrange(10):
    task_key = tasks.keys.add()
    task_key.key = "A01.0.tif-" + str(i)

task_serial = tasks.SerializeToString()

#print task_serial
print '------------'

tasks_get = TaskInfo_pb2.TrainTasks()
tasks_get.ParseFromString(task_serial)
print tasks_get.enough

print "sample number: " + str(len(tasks_get.keys))   #check if valid

for i in xrange(10):
    print tasks_get.keys[i].key
{% endhighlight %}
