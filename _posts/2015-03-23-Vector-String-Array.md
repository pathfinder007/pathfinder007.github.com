---
layout: post
category: C++
title: Vector与String数组的转换
tags: C++
---

&emsp;&emsp;读入一组 string 类型的数据,并将它们存储在 vector 中。接着,把该 vector 对象复制给一个字符指针数组。为 vector 中的 每个元素创建一个新的字符数组,并把该 vector 元素的数据复制到相应的字符 数组中,最后把指向该数组的指针插入字符指针数组。

<!--more-->

### Vector与String数组的转换

{% highlight C++ %}
#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
	vector<string> svec;
    string str;// 输入 vector 元素
	cout << "Enter strings:(Ctrl+Z to end)" << endl;
    while (cin >> str)
        svec.push_back(str); 
    
    // 创建字符指针数组
    char **parr = new char*[svec.size()];

    // 处理 vector 元素
    size_t ix = 0;
    for (vector<string>::iterator iter = svec.begin(); iter != svec.end(); ++iter, ++ix) {
        // 创建字符数组
        char *p = new char[(*iter).size()+1];
        // 复制 vector 元素的数据到字符数组
        strcpy(p, (*iter).c_str());
        // 将指向该字符数组的指针插入到字符指针数组
        parr[ix] = p;
    }

    // 释放各个字符数组
    for (ix =0; ix != svec.size(); ++ix)
        delete [] parr[ix];
    // 释放字符指针数组
    delete [] parr;
    
    return 0;
}
{% endhighlight %} 

### 外层循环中不使用typedef定义的类型，遍历二维数组元素
{% highlight C++ %}
#include <iostream>
using namespace std;
int main() {
    //3 个元素,每个元素是一个有4个 int 元素的数组
    int ia[3][4] = \{\{1, 2, 3, 4\}, \{5, 6, 7, 8\}, \{9, 10, 11, 12 \}\};

    int (*p)[4];
    for (p = ia; p != ia + 3; ++p)
        for (int *q = *p; q != *p + 4; ++q)
            cout << *q << endl;
            
    return 0;
}
{% endhighlight %}
