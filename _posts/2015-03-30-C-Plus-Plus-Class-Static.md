---
layout: post
category: C++
title: C++中的静态成员
tags: C++ Interview
---

&emsp;&emsp;昨天斌哥介绍了一个准备IT面试的网站，牛客网，一个面向程序员的“猿题库”，做了两套C++的选择题，得分不是太理想，基本只能拿到60%的分数。是得根据做过的题目，慢慢整理知识点。

<!--more-->

### 1. 静态成员
* 静态成员的定义或声明需要加`static`修饰符，可以通过双冒号即<类名>::<静态成员名>使用
* 属于整个类的而不是某个对象，只存储一份供所有对象共用。使用静态成员变量实现多个对象之间的数据共享不会破坏隐藏的原则，保证了安全性还可以节省内存

### 2. 静态成员函数与非静态成员函数

#### 2.1 不能通过类名调用类的非静态成员函数
{% highlight C++ %}
class A
{
public:
	void init() {}
	static print() {}
};

void main()
{
	A::init();		//编译会出错
	A::print();
}
{% endhighlight %}

#### 2.2 可以通过类的对象调用类的静态与非静态成员函数
{% highlight C++ %}
void main()
{
	A a;
	a.init();		//编译会出错
	a.print();
}
{% endhighlight %}


#### 2.3 类的非静态成员函数可以调用静态成员函数
class A
{
public:
	void init() {
		print();
	}
	static print() {
		cout << m << endl;
	}
private:
	int m;
};

void main()
{
	A a;
	a.print();
}
{% endhighlight %}


### 3. 静态成员变量

#### 3.1 静态成员函数中不能使用类的非静态成员变量
class A
{
public:
	void init() {}
	static print() {
		cout << m << endl;
	}
private:
	int m;
};

void main()
{
	A a;
	a.print();
}
//会编译出错，静态成员函数属于整个类，类实例化对象之前就已经分配空间，而类的非静态成员必须在类实例化之后才有内存空间，相当于调用一个未声明的变量，出错。
{% endhighlight %}

#### 3.2 使用类的静态成员变量必须先初始化再使用
class A
{
public:
	A() {m++;}
	~A() {m--;}
	static print() {
		cout << m << endl;
	}
private:
	static int m;
};

void main()
{
	A a;
	a.print();
}
//编译不报错，连接时报错，类的静态成员变量在使用前必须先初始化，而且不能在类内初始化，可以在main函数之前使用`int A::m = 0`进行初始化，且不能在类内部进行初始化。
{% endhighlight %}
