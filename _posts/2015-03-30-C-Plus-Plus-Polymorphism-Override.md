---
layout: post
category: C++
title: C++中 的多态与覆盖
tags: C++ Interview
---

&emsp;&emsp;C++中的多态与覆盖一直是容易混淆的概念，多态即一个接口，多种方法，程序在执行时才决定调用的函数，OOP的核心概念，通过虚函数来实现，虚函数允许子类重新定义成员函数：而子类重新定义父类的做法称为覆盖；只有重写了虚函数才算多态；而重载则是允许有多个同名的函数，而这些函数的参数列表不同，允许参数个数不同，参数类型不同，或者两者都不同。编译器会根据这些函数的不同列表，将同名的函数的名称做修饰，从而生成一些不同名称的预处理函数，来实现同名函数调用时的重载问题。但这并没有体现多态性。

<!--more-->

&emsp;&emsp;多态的目的即实现接口重用，不论传递过来的究竟是那个类的对象，函数都能够通过同一个接口调用到适应各自对象的实现方法。最常见的用法就是声明基类的指针，利用该指针指向任意一个子类对象，调用相应的虚函数，可以根据指向的子类的不同而实现不同的方法。如果没有使用虚函数的话，即没有利用C++多态性，则利用基类指针调用相应的函数的时候，将总被限制在基类函数本身，而无法调用到子类中被重写过的函数。因为没有多态性，函数调用的地址将是一定的，而固定的地址将始终调用到同一个函数，这就无法实现一个接口，多种方法的目的。

### 1. 一个面试题

{% highlight C++ %}
#include<iostream>
using namespace std;

class A
{
public:
	void foo()
	{
		printf("1\n");
	}
	virtual void fun()
	{
		printf("2\n");
	}
};
class B : public A
{
public:
	void foo()
	{
		printf("3\n");
	}
	void fun()
	{
		printf("4\n");
	}
};
int main(void)
{
	A a;
	B b;
	A *p = &a;
	p->foo();
	p->fun();
	p = &b;
	p->foo();
	p->fun();
	return 0;
}
{% endhighlight %}

* 第一个p->foo()和p->fuu()，本身是基类指针，指向的又是基类对象，调用的都是基类本身的函数，输出结果就是1、2。
*  第二个输出结果就是1、4。p->foo()和p->fuu()是基类指针指向子类对象，正式体现多态的用法，p->foo()由于指针是个基类指针，指向是一个固定偏移量的函数，此时指向的就只能是基类的foo()函数的代码，因此输出的结果还是1。而p->fun()指针是基类指针，指向的fun是一个虚函数，由于每个虚函数都有一个虚函数列表，此时p调用fun()并不是直接调用函数，而是通过虚函数列表找到相应的函数的地址，根据指向的对象不同，函数地址也将不同，这里将找到对应的子类的fun()函数的地址，输出的结果会是子类的结果4。

### 2. 隐藏规则

隐藏即指派生类的函数屏蔽了与其同名的基类函数：

* 如果派生类的函数与基类的函数同名，但是参数不同。此时，不论有无virtual
关键字，基类的函数将被隐藏（注意别与重载混淆）.
* 如果派生类的函数与基类的函数同名，并且参数也相同，但是基类函数没有virtual
关键字。此时，基类的函数被隐藏.

### 3. 纯虚函数

&emsp;&emsp; 纯虚函数是在基类中声明的虚函数，它在基类中没有定义，但要求任何派生类都要定义自己的实现方法。在基类中实现纯虚函数的方法是在函数原型后加“=0”： `virtual void funtion()=0` 

&emsp;&emsp; 引入原因：在很多情况下，基类本身生成对象是不合情理的，因此引入虚函数概念，则编译器要求在派生类中必须予以重写以实现多态性。同时含有纯虚拟函数的类称为抽象类，它不能生成对象。

&emsp;&emsp; 多态性：编译时多态性 - 重载函数实现；运行时多态性 - 虚函数实现。
