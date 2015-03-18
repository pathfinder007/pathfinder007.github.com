---
layout: post
title: "Leetcode:First Missing Positive(Bucket Sort)"
description: "First Missing Positive的两种时间复杂度O(n)的解法."
modified: 2014-11-05
category: Leetcode
tags: Leetcode
image:
  feature: abstract-5.jpg
comments: true
share: true
---

### First Missing Positive
* 给一个未排序的整形数组，找出缺失的第一个正整数。算法需要满足O(n)的时间复杂度以及使用恒定的空间。
* 输入：A[] = {1, 2, 0}, n = 3 return 3.
* 输出：A[] = {3, 4, -1, 1}, n = 4 return 2.

<!--more-->

### 思路
* 直觉：未排序整形数组，要达到O(n)的时间复杂度，直觉使用map。扫一遍，建立map，同时找出最大值。第二次扫，找出缺失的正整数。如此，为O(n)的时间复杂度以及O(n)的空间复杂度，Accepted，时间60ms.
* 另一思路：桶排序，即充分利用数组的索引，达到map的作用。数组的第i个索引位置，应该存放的元素应该是i+1, 当把能放到正确位置的元素都放好，再扫一遍，得出需要的解，时间复杂度为O(n), 空间复杂度为O(1)，Accepted，时间12ms.
* 第二种思路，充分利用已有的存储空间，空间复杂度得以优化。而且直接在数组上操作，map为数组上层的封装，使用STL，效率还是要差了一些。故第二种思路的时间性能也更高。

### 使用map的思路，完整代码:
{% highlight C++ %}
class Solution {
public:
    int firstMissingPositive(int A[], int n) {
        map<int, int> mp;
        int max_num = A[0];
        for (int i = 0; i < n; ++i) {
            mp[A[i]] = i;
            max_num = A[i] > max_num ? A[i] : max_num;
        }
        for (int i = 1; i <= max_num; ++i)
            if (mp.find(i) == mp.end())
                return i;
        return max_num+1;
    }
};
{% endhighlight %}

### 使用桶排序的方法，完整代码:
{% highlight C++ %}
class Solution {
public:
    void bucketSort(int A[], int n) {
        for (int i = 0; i < n; ++i)
            while (A[i] != i+1) {
                if (A[i] <= 0 || A[i] > n || A[i] == A[A[i]-1])
                    break;
                swap(A[i], A[A[i]-1]);
            }
    }

    int firstMissingPositive(int A[], int n) {
        bucketSort(A, n);
        for (int i = 0; i < n; ++i)
            if (A[i] != i+1)
                return i+1;
        return n+1;
    }
};
{% endhighlight %}
