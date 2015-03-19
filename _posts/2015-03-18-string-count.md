---
layout: post
category: Interview
title: 字符串统计
tags: Interview
---

### 1. 题目来源
&emsp;&emsp;来自X公司的实习生面试题，即给定一个string s ＝ "abcabcabcbcc"，return "3a4b5c";

<!--more-->

### 2. 思路
* 第一反应就是，ASCII字符一共只有256个，使用一个数组模拟map，扫一遍string，纪录每个字符出现的次数；则再次便利数组，将count不为0的字符与其count组成string返回即可；估计是最近刷string的条件反射；如此，不管string的长度是多少，算法的时间复杂度为O(n)，而空间复杂度为常熟，即256；
* 使用数组模拟map的话，最后需要将int往ASCII转，是否有方法？使用map，就没有这个困惑，但是不是有点杀猪用牛刀？
***
* 按照王神的说法，这题是做数据压缩，压缩的意思就是，一样的字符，应该是连续的，不可能出现"abcabc"这样的情况；所以这一题的话，直接扫一遍字符串，并作统计、拼接字符串就ok;

#### 2.1 使用map纪录字符出现的次数，字符串统计:
{% highlight C++ %}
class Solution {
public:
   string stringCount(string s)
	{
    	map<char, int> mp;
    	map<char, int> :: iterator it;
    	for (int i = 0; i < s.size(); ++i) {                                                                                          
        	mp[s[i]] ++;
    	}

    	string ret;
    	for (it = mp.begin(); it != mp.end(); ++it) {
        	if (it -> second > 0) {
            	char count = it -> second + '0';
            	ret.push_back(count);
            	ret.push_back(it->first);
        	}
    	}
    	return ret;
	}
};
{% endhighlight %}

#### 2.2 字符串压缩:
{% highlight C++ %}
class Solution {
public:
    string stringCompress(string s)
	{           
    	string ret;
    
    	int count = 1;
    	for (int i = 1; i < s.size(); ++i) {
        	if (s[i] == s[i-1]) {
            	count ++;
            	if (i == s.size()-1) {
                	ret += (count + '0');                                                                                             
                	ret += s[i];
            	}
       		}
        	else {
            	ret += (count+ '0');
            	ret += s[i-1];
            	count = 1;
        	}
    	}
    	return ret;
	}
};
{% endhighlight %}
