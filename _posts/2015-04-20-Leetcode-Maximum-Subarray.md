---
layout: post
category: Leetcode
title: Maximum Subarray
tags: Algorithm Leetcode
---

&emsp;&emsp;给定一个数组，找出其中和最大的子串长度。比如对于`[−2,1,−3,4,−1,2,1,−5,4]`，和最大的连续子串为`[4,−1,2,1]`，即最大的和为6.

<!--more-->

&emsp;&emsp;比较简单的一个题目，但是开始做的时候，没考虑好，陷入了一个死胡同，一直纠结设定一个cur指针，如何调整cur指针的位置。事实上，遍历一遍是肯定的，在遍历的过程中，纪录tSum的值，更新mSum的值。比较关键的一点就是，当前元素的值比tSum的值大时，直接tSum=nums[i]，相当于更新了cur指针的位置。

{% highlight C++ %}
//时间、空间复杂度都是O(n)

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int mSum = INT_MIN, tSum = 0;
        for (int i = 0; i < nums.size(); ++i) {
            tSum += nums[i];
            if (nums[i] > tSum)
                tSum = nums[i];
            mSum = tSum > mSum ? tSum : mSum;
        }
        return mSum;
    }
};
{% endhighlight %}