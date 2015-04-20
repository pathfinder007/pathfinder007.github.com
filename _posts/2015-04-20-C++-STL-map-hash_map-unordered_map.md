---
layout: post
category: C++
title: STL中的map、unordered_map、hash_map
tags: STL C++
---

&emsp;&emsp;在之前使用STL时，经常混淆的几个数据结构，特别是做Leetcode的题目时，对于使用哪一个map，一直没有太明确的概念，事实上，三个容器，有着比较大的区别.

<!--more-->

### 1. map

&emsp;&emsp;内部数据的组织，基于红黑树实现，红黑树具有自动排序的功能，因此map内部所有的数据，在任何时候，都是有序的。

### 2. hash_map

&emsp;&emsp;基于哈希表，数据插入和查找的时间复杂度很低，几乎是常数时间，而代价是消耗比较多的内存。底层实现上，使用一个下标范围比较大的数组来存储元素，形成很多的桶，利用hash函数对key进行映射到不同区域进行保存。

* 插入操作：得到key -> 通过hash函数得到hash值 -> 得到桶号(hash值对桶数求模) -> 存放key和value在桶内
* 取值过程：得到key -> 通过hash函数得到hash值 -> 得到桶号(hash值对桶数求模) -> 比较桶内元素与key是否相等 -> 取出相等纪录的value
* 当每个桶内只有一个元素时，查找时只进行一次比较，当很多桶都没有值时，查询更快。
* 用户可以指定自己的hash函数与比较函数。

### 3. unordered_map

&emsp;&emsp;C++ 11标准中加入了unordered系列的容器。unordered_map记录元素的hash值，根据hash值判断元素是否相同。map相当于java中的TreeMap，unordered_map相当于HashMap。无论从查找、插入上来说，unordered_map的效率都优于hash_map，更优于map；而空间复杂度方面，hash_map最低，unordered_map次之，map最大。

&emsp;&emsp;对于STL里的map容器，count方法与find方法，都可以用来判断一个key是否出现，count统计的是key出现的次数，因此只能为0/1，而find基于迭代器实现，以mp.end()判断是否找到要求的key。