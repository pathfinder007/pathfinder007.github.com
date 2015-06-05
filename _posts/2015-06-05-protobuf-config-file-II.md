---
layout: post
category: Protobuf
title: Protobuf实现程序的配置文件管理
tags: Protobuf
---

&emsp;&emsp;protobuf配置文件中多层嵌套，或者多组参数的情况。

<!--more-->

## 1. config.proto

{% highlight C++ %}
package config;                                                                                                                   

message student
{
    required string name = 1;
    required int32  age  = 2;
    optional string addr = 3;
}

message classes
{
    required string name    = 1;
    repeated student member = 2;
}
{% endhighlight %}

<br />

## 2. 最终存储/读取的config.cfg

{% highlight C++ %}
name: "Communication 2004"                                                                                                        
member {
  name: "flyan338"
  age: 26
  addr: "china"
}
member {
  name: "likeliu"
  age: 25
  addr: "china"
}
member {
  name: "gaoy"
  age: 24
  addr: "American"
}
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

void load_config(string &file_name, config::classes &cs)
{
    int fd = open("config.cfg", O_RDONLY);

    if (fd < 0) {
        printf("open config.cfg failure:%s \n",strerror(errno));
        exit(-1);
    }

    google::protobuf::io::FileInputStream fileInput(fd);
    fileInput.SetCloseOnDelete(true);
    google::protobuf::TextFormat::Parse(&fileInput, &cs);  
}

int main(void)
{
    config::classes cs;
    cs.set_name("Communication 2004");
    
    config::student* t = cs.add_member();
    
    t->set_name("flyan338");
    t->set_age(26);
    t->set_addr("china");
    
    t = cs.add_member();
    t->set_name("likeliu");
    t->set_age(25);
    t->set_addr("china");
 
    t = cs.add_member();
    t->set_name("gaoy");
    t->set_age(24);
    t->set_addr("American"); 
    
    // protobuf to string
    string contect;
    google::protobuf::TextFormat::PrintToString(cs, &contect);
    
    string file_name = "config.cfg";
    save_config(file_name, contect);    

    cout << "\n---------Save config done.-----------\n" << endl;

    config::classes cs2;
    load_config(file_name, cs2);

    for (int i = 0; i < cs2.member_size(); ++i) {
        cout << "name: " << cs2.member(i).name() << " | ";
        cout << "age: " << cs2.member(i).age() << " | ";
        cout << "addr: " << cs2.member(i).addr() << endl;
    }

    cout << "\n---------Load config done.-----------\n" << endl;
    return 0;
}                
{% endhighlight %}
 

