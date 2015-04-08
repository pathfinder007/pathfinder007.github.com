---
layout: post
category: Interview
title: C字符串相关库函数的实现
tags: C++ Interview
---

&emsp; &emsp;笔试面试中经常出现让实现基础的字符数组操作相关的函数，这些函数的实现，简单，却很多陷阱，考察思维的严谨以及基础知识的扎实。越来越感受到，很多编程的小细节，能够很好地反应一个程序员的水平以及修养。甚至是从代码风格，小到一个空格是否需要，括号的组织，好吧，我是强迫症。

<!--more-->


### 1. strlen函数

&emsp;&emsp;求一个char数组存储的字符串的长度，对于`char *str[] ="abc";`来说，长度为4，最后会加上一个'\0'，但是strlen会忽略'\0'的存在，即到该字符结束，以此，可以实现strlen；   

* 当函数参数有指针时，记得进行有效性的检查。
* assert断言的使用，需要引入<assert.h>头文件.
{% highlight C++ %}
int strlen(const char *str)
{
	assert(str != NULL);
	int len = 0;
	while ( *(str++) != '\0') {
		len ++;
	}
	return len;
}
{% endhighlight %}


### 2. strcmp函数

&emsp;&emsp;比较两个C语言字符串的大小，；   

* 当函数参数有指针时，记得进行有效性的检查。
* assert断言的使用，需要引入<assert.h>头文件.
{% highlight C++ %}
int strcmp(const char *dst, const char *src)
{
	assert(NULL != dst && NULL != src);
	while ( *dst && *src && ( *dst == *src)) {
		dst ++;
		src ++;
	}
	return *dst - *src;
}
{% endhighlight %}


### 3. strcat函数

&emsp;&emsp;连接两个字符串，对于dst串，利用'\0'找到末尾，再将src拼接上来即可；   

{% highlight C++ %}
char *strcat(char *dst, const char *src)
{
	assert(dst != NULL && src != NULL);
	char *addr = dst;
	while ( *adr != '\0') {
		addr ++;
	}
	while (( *addr++ = *src++) != '\0');
	return dst;
}
{% endhighlight %}


### 4. strcat函数

&emsp;&emsp;连接两个字符串，对于dst串，利用'\0'找到末尾，再将src拼接上来即可；   

{% highlight C++ %}
char *strcat(char *dst, const char *src)
{
	assert(dst != NULL && src != NULL);
	char *addr = dst;
	while ( *adr != '\0') {
		addr ++;
	}
	while (( *addr++ = *src++) != '\0');
	return dst;
}
{% endhighlight %}


### 5. strcpy函数

&emsp;&emsp;字符串全拷贝；   

{% highlight C++ %}
char *strcpy(char *dst, const char *src)
{
	assert(dst != NULL && src != NULL);
	char *addr = dst;
	while (( *dst++ = *src++) != '\0');
	return addr;
}
{% endhighlight %}


### 6. strncpy函数

&emsp;&emsp;字符串拷贝，可以指定拷贝的长度；   

{% highlight C++ %}
char *strncpy(char *dst, const char *src, int n)
{
	assert(dst != NULL && src != NULL);
	char *addr = dst;
	while (n-- > 0 && *src != '\0')
		*dst ++ = *src ++;
	return addr;
}
{% endhighlight %}


### 7. memcpy函数

&emsp;&emsp;内存拷贝，需要考虑内存有重叠的情况，据此决定从前往后复制或者从后往前复制；   

{% highlight C++ %}

void *memcpy(void *dst, const void *src, unsigned int count)
{
	assert(dst != NULL && src != NULL);
	void *addr = dst;
	if (dst < src || (char *)dst >= (char *)src+count) {
		while (count --) {
			*(char *)dst = *(char *)src;
			dst = (char *)dst+1;
			src = (char *)src+1;
		}
	}
	else {
		dst = (char *)dst + count - 1;
		src = (char *)src + count - 1;
		while (count --) {
			*(char *)dst = *(char *)src;
			dst = (char *)dst - 1;
			src = (char *)src - 1;
		}
	}
	return addr;
}

{% endhighlight %}



