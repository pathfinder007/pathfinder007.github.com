---
layout: post
category: Protobuf
title: Protobuf在C++、Python环境下的应用
tags: Protobuf cpp python
---

&emsp;&emsp;Protobuf官方支持将proto文件编译成C++, Python, PHP的类，而利用一些开源类库，可以对ruby、php等常见的脚本语言进行支持。项目中需要使用Protobuf的地方，主要在于C++与C++之间的接口，以及Python与C++之间的接口。下面分别针对C++以及Python下的Protobuf，实现序列化及反序列化。

<!--more-->

## 1. user.proto

{% highlight C++ %}
package user;                                                                                      
message Person {
    required string name = 1;
    required int32 id = 2;
    optional string email = 3;
}
{% endhighlight %}

&emsp;&emsp;可以认为user是namaspace，而Person是这个命名空间之内的类。使用`protoc -I ./ - - cpp_out ./cpp user.proto`即可编译出C++所需要的user.pb.cc以及user.pb.h，其中-I指定proto所在的目录，cpp_out指定生成的类所在路径。

<br />

## 2. C++下的序列化与反序列化

### 2.1 测试代码

{% highlight C++ %}
#include "user.pb.h"                                                                                                                                                                    
#include <fstream>
#include <iostream>
//#include <unistd.h>

using namespace std;

void ListMsg(const user::Person & user)
{
    cout << user.name() << endl;
    cout << user.id() << endl;
    cout << user.email() << endl;
}

int main(void)
{   
    user::Person user1;
    user1.set_name("Mushsen");
    user1.set_id(8008);
    user1.set_email("mushsen@163.com");
    fstream output("./log", ios::out | ios::trunc | ios::binary);

    if (!user1.SerializeToOstream(&output)) {
         cerr << "Failed to write msg." << endl;
         return -1;
    }
    output.close();
    //slppe(1);

    user::Person user2;
    fstream input("./log", ios::in | ios::binary);
    if (!user2.ParseFromIstream(&input)) {
         cerr << "Failed to parse address book." << endl;
         return -1;
    }
    input.close();
    ListMsg(user2);
    return 0; 
}
{% endhighlight %}

&emsp;&emsp;注意input, output输入输出文件流一定要关闭，要不在读取的时候，由于并未刷新，将读不到数据，required字段没有值，报错。

### 2.2 相应的Makefile

{% highlight C++ %}
all: user                                                                                                                                                                               

clean:
      rm -f user  *.o  log  

user: user.pb.cc user.cpp
    g++  user.pb.cc user.cpp -o user  `pkg-config --cflags --libs protobuf`
{% endhighlight %}


<br />

## 3. Python下的序列化与反序列化

&emsp;&emsp;使用`protoc -I ./ - -python_out ./py user.ptoto`即可编译出python所需要的user_pb2.py文件，在需要使用的地方import即可。

{% highlight C++ %}
#!/usr/bin/env python                                                                                                                                                                   
#coding=utf-8

import user_pb2

person1 = user_pb2.Person()
person1.id = 7007
person1.name = "Mushsen"
person1.email = "mushsen@gmail.com"
person_serial = person1.SerializeToString()

print person_serial
print '------------'

person2 = user_pb2.Person()
person2.ParseFromString(person_serial)
print person2.id
print person2.name
print person2.email

{% endhighlight %}
