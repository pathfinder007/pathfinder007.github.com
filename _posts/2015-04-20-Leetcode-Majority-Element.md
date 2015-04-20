---
layout: post
category: Leetcode
title: Majority Element
tags: Algorithm Leetcode
---

&emsp;&emsp;Leetcode中的题目，似乎之前刷的时候没有这道题，大意就是一个给定长度为n的数组，找出其中出现次数大于n/2的元素，数组非空且一定存在这样的元素。

<!--more-->

&emsp;&emsp;看到题目，第一想法就是使用map，则遍历一遍数组，以元素为key，出现次数为value。如此，时间、空间复杂度都为O(n)。哈希表存在一个弊端，当数组增大时，会浪费很大的空间。先使用unordered_map给AC了，过程中发现Leetcode不支持hash_map，之前一直没留意map、unordered_map、hash_map的区别。事实上，STL中map/set都是基于红黑树实现，所以find的时间复杂度都为logn，而这一题遍历过程中，需要判断一个key是否存在，为了实现线性时间复杂度，find必须在O(1)内完成，因此使用map时，首选unordered_map，unordered_map的唯一弊端就是其元素存放是乱序的，对这一题，不存在影响。

&emsp;&emsp;印象中这一题，是利用n/2 这个特性，存在空间复杂度为O(1)的解法的。翻了一下Discuss，有一个很好的解法，先将major初始设置为num[0]，遍历一遍，当num[i]与major一致，则将count++，否则，count--，当count为0，则更新major的值。

### 1. 利用hash表实现


{% highlight C++ %}
//时间、空间复杂度都是O(n)

class Solution {
public:
    int majorityElement(vector<int> &num) {
        int len = num.size();
        unordered_map<int, int> mp;
        
        int maj = num[0];
        for (int i = 0; i < len; ++i) {
            if (mp.find(num[i]) != mp.end()) {
                mp[num[i]] ++;
                if (mp[num[i]] > len/2)    //注意奇数的情况下，若写成>=，则会出错。
                    return num[i];
            }
            else
                mp[num[i]] = 1;
        }
        return maj;
    }
};{% endhighlight %}


### 2. 一种空间复杂度为O(1)的解法

{% highlight C++ %}
//一个时间复杂度O(n)，空间复杂度O(1)的方法

class Solution {
public:
    int majorityElement(vector<int> &num) {
        int count = 1;
        int major = num[0];
        for (int i = 1; i < num.size(); ++i) {
            if (num[i] == major)
                count ++;
            else
                count --;
            if (count == 0) {
                major = num[i];
                count = 1;
            }
        }
        return major;
    }
};{% endhighlight %}