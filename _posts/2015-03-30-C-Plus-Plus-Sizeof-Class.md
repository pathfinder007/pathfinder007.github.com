---
layout: post
category: C++
title: C++类的大小，sizeof(class)
tags: C++ Interview
---

&emsp;&emsp;面试题中经常遇到，定义一个类，或为空，或定义了几个内置类型的变量，或包含构造、析构函数、成员函数，问在32位/64位平台上，sizeof(class)的字节数。比较关键的几个考虑：

* 32位系统是4字节对齐，64位系统为8字节对齐；
* 空类，为了分配内存，字节数为1；
* 成员函数的字节数；
* 若包含虚函数，系统需要分配一个指向虚函数的指针vptr，32位系统，大小为4Byte

<!--more-->

&emsp;&emsp;以下讨论，都是使用g++编译的情况，当使用gcc编译时，关于内存对齐，主要是两个原则：

* 结构体的大小等于结构体内最大成员大小的整数倍
* 结构体内的成员的首地址相对于结构体首地址的偏移量是其类型大小的整数倍，比如说double型成员相对于结构体的首地址的地址偏移量应该是8的倍数
* 为了满足规则1和2编译器会在结构体成员之后进行字节填充
* 以上规则仅限于windows
{% highlight C++ %}
class A
{
	int a;
	short b;
	int c;
	char d;
};
//使用`gcc`编译时，按照以上规则，a占4个字节，b本应占2个字节，
//但由于c占4个字节，为了满足条件2，b多占用2个字节，为了满足条件1，
//d占用4个字节，一共16个字节。

class B
{
	double a;
	short b;
	int c;
	char d;
}
//在windows下，无论使用gcc、g++，结果都是24；而Linux/Mac下，任何编译器，都是20;
//使用`gcc`编译时，a占8个字节，b占2个字节，但由于c占4个字节，
//为了满足条件2，b多占用2个字节，即abc共占用8+4+4=16个字节,
//为了满足条件1，d将占用8个字节，一共24个字节。
{% endhighlight %}

### 1. 空类的大小

{% highlight C++ %}
class A
{
};
//sizeof(A)为1
{% endhighlight %}

&emsp;&emsp; 类的实例化，即在内存中分配一块地址，空类也会被实例化，因此编译器会为其隐含地添加一个Byte，空类实例化之后才能拥有独一无二的地址。

### 2. 一般非空类大小

{% highlight C++ %}
class A
{
	int a;
	char *p;
};
{% endhighlight %}

&emsp;&emsp; 在32位平台，`sizeof(A)`为8，int为4Byte，char指针亦为4Byte；若在class A里面再加一个char q，按照4字节对齐，即char q会占据4Byte，sizeof(A)为12；需要注意32位平台，sizeof(long)为4Byte，sizeof(long long)为8Byte；sizeof(void)为1，但是会报warning.

&emsp;&emsp; 而对于64位平台，地址对齐跟编译器相关，比如对于class A里面添加一个`long long c;`则sizeof(A)值为24;所以对齐方式，编译器占据决定性的作用；

#### 2.1 64位系统地址对齐的问题

&emsp;&emsp; 存在编译器的编译优化问题，对于一个class，实例化以后，其分配的地址空间应该是连续的，对于8字节对齐的变量，比如double，char*，则按8字节对齐，对于int、char等，则按4字节对齐。
{% highlight C++ %}
class A
{
public:
	A(void);
	virtual ~A(void);
private:
	char a;
	char b;
	double p;
	char *p;
};
//在32位平台，sizeof(A)为20，即4+4+8+4；而在64位系统，sizeof(A)为32；即
//8+4+8+8，凑够8的倍数，为32；
{% endhighlight %}

{% highlight C++ %}
class A
{
public:
	A(void);
	virtual ~A(void);
private:
	char a;
	double p;
	char b;
	char *p;
};
//在32位平台，sizeof(A)为24，即4+4+8+4+4；而在64位系统，sizeof(A)为40；即8+8+8+8+8；
{% endhighlight %}

### 3. 有虚函数的类

{% highlight C++ %}
class A
{
public:
	A(void);
	virtual ~A(void);
private:
	int a;
	char *p
};
{% endhighlight %}

&emsp;&emsp; 在32位平台，`sizeof(A)`为12，有虚函数的时候，该类型会生成一个虚函数表，并在该类型的每一个实例中添加一个指向需函数表的指针，在32位系统分配的指针大小为4Byte.


### 4. 有虚函数类的继承

{% highlight C++ %}
class B : public A
{
public:
	B(void);
	virtual ~B(void);
private:
	int b;
};
{% endhighlight %}

&emsp;&emsp; 在32位平台，`sizeof(B)`为16，即子类的大小为基类成员变量大小加上子类的大小。对于普通继承，子类和基类共享虚函数指针。

### 5. 虚继承

{% highlight C++ %}
class A
{
	int a;
}

class B : public virtual A
{
	int b;
	virtual void foo(){};
};
{% endhighlight %}

&emsp;&emsp; 虚继承时，派生类会生成一个指向虚基类表的指针，如果还有虚函数，不增加额外指针大小空间。在32位平台上，类B大小为12Byte，由于virtual的存在，额外增加一个4Byte的指针大小。