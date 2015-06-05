---
layout: post
category: Protobuf
title: Protobuf实现程序的配置文件管理
tags: Protobuf
---

&emsp;&emsp;程序中一般需要load一些参数列表，直接以一种自己约定的格式写在txt文件中，可读性不高且程序的通用性不强，换一个程序员，就没辙了；而xml这种方式一直是一种老旧且蛋疼的方法。使用protobuf通过rpc协议进行网络传输很爽，虽然这次无奈蛋疼地拿pb来作为http传输的包。通过pb来管理程序的配置文件，也是一个很好的思路，操作比较方便。

<!--more-->

&emsp;&emsp;为了提高网络传输的效率，pb序列化之后的数据为二进制存储，基本不可读。不过protobuf具有类似`google::protobuf::TextFormat`的接口，可以支持文本输出，如此，可以将pb作为一个简单的配置管理库。

## 1. config.proto

{% highlight C++ %}
package config;                                                                                                                   

message Configure
{
    required string host = 1;
    required uint32 port = 2;
}
{% endhighlight %}

<br />

## 2. 最终存储/读取的config.cfg

{% highlight C++ %}
host: "127.0.0.1"                                                                                                                 
port: 8080
{% endhighlight %}

<br />

## 3. C++对pb配置文件的存取

{% highlight C++ %}
#include "config.pb.h"                                                                                                            
#include <stdlib.h>  
#include <stdio.h>  
#include <errno.h>
#include <string.h>  
#include <iostream>  
#include <fcntl.h>  
#include <fstream>  
#include <cstdio>  
#include <google/protobuf/text_format.h>  
#include <google/protobuf/io/zero_copy_stream_impl.h>

using namespace std;

void save_config(string &file_name, string &contect)
{
    ofstream fout;
    fout.open(file_name.c_str(), ios::out| ios_base::ate);

    if (!fout.is_open()) {
        fprintf(stderr, "open config.cfg fail\n");
        exit(-1);
    }

    fout << contect <<endl;
    fout.flush();
	fout.close(); 
}

void load_config(string &file_name, config::Configure &config)
{
    int fd = open("config.cfg", O_RDONLY);

    if (fd < 0) {
        printf("open config.cfg failure:%s \n",strerror(errno));
        exit(-1);
    }

    google::protobuf::io::FileInputStream fileInput(fd);
    fileInput.SetCloseOnDelete(true);
    google::protobuf::TextFormat::Parse(&fileInput, &config);  
}

int main(void)
{
    config::Configure config;
    config.set_host("127.0.0.1");
    config.set_port(8080);

    string contect;
    google::protobuf::TextFormat::PrintToString(config, &contect);
    
    string file_name = "config.cfg";
    save_config(file_name, contect);    

    cout << "\n---------Save config done.-----------\n" << endl;

    config::Configure config2;
    load_config(file_name, config2);

    cout << "host: " << config2.host() << endl;
    cout << "port: " << config2.port() << endl;

    cout << "\n---------Load config done.-----------\n" << endl;
    return 0;
}  
{% endhighlight %}
