---
layout: post
category: Leetcode
title: Find Minimum in Rotated Sorted Array 
tags: Algorithm Leetcode
---

&emsp;&emsp;一个有序数组，以某一个点为轴，进行旋转，找出数组中最小的元素，假定数组中没有重复元素.

<!--more-->

&emsp;&emsp;由于这是一个递增的数组，以数组中某一个点为轴进行旋转，则旋转的位置，会产生一个递减。因此最直观的方法，遍历一遍数组，找出递减的位置，即找到了最小值，时间复杂度为O(n)。而这一题很明显的，是典型的二分查找应用，使用二分查找，可以达到O(logn)的时间复杂度。

{% highlight C++ %}
//时间复杂度O(n)

class Solution {
public:
    int findMin(vector<int>& nums) {
        int ret = nums[0];
        for (int i = 0; i < nums.size()-1; ++i) {
            if (nums[i] > nums[i+1])
                return nums[i+1];
        }
        return ret;
    }
};
{% endhighlight %}


{% highlight C++ %}
//时间复杂度O(logn)

class Solution {
public:
    int binarySearch(vector<int>& nums, int left, int right) {
        if (nums[left] <= nums[right])
            return nums[left];
        else if (right - left == 1)
            return nums[right];
        
        int mid = (left + right) >> 1;
        //left increasing.
        if (nums[mid] > nums[left]) {
            if (nums[left] > nums[right])
                return binarySearch(nums, mid, right);
            else
                return nums[left];
        }
        //right increasing.
        else if (nums[mid] < nums[right]) {
            if (nums[left] > nums[right])
                return binarySearch(nums, left, mid);
            else
                return nums[left];
        }
    }

    int findMin(vector<int>& nums) {
        return binarySearch(nums, 0, nums.size()-1);
    }
};
{% endhighlight %}