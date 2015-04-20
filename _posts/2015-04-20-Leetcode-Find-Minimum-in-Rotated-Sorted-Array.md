---
layout: post
category: Leetcode
title: Find Minimum in Rotated Sorted Array I/II
tags: Algorithm Leetcode
---

&emsp;&emsp;一个有序数组，以某一个点为轴，进行旋转，找出数组中最小的元素，其中I中数组没有重复元素，II中数组存在重复元素。

&emsp;&emsp;由于这是一个递增的数组，以数组中某一个点为轴进行旋转，则旋转的位置，会产生一个递减。因此最直观的方法，遍历一遍数组，找出递减的位置，即找到了最小值，时间复杂度为O(n)。而这一题很明显的，是典型的二分查找应用，O(n)的算法没什么意义。使用二分查找，可以达到O(logn)的时间复杂度，通过递归或者非递归实现。

<!--more-->

### 1. Find Minimum in Rotated Sorted Array I

#### 1.1 递归实现
{% highlight C++ %}
//时间复杂度O(logn)，递归解法

class Solution {
public:
    int binarySearch(vector<int> &nums, int lo, int hi) {
        if (hi-lo <= 1)
            return (nums[lo] < nums[hi]) ? nums[lo] : nums[hi];
        
        int mid = (lo+hi) >> 1;
        if (nums[mid] < nums[hi])
            return binarySearch(nums, lo, mid);
        else if (nums[mid] > nums[hi])
            return binarySearch(nums, mid+1, hi);
    }

    int findMin(vector<int>& nums) {
        return binarySearch(nums, 0, nums.size()-1);
    }
};
{% endhighlight %}
   
#### 1.2 非递归实现 
{% highlight C++ %}
//时间复杂度O(logn)，非递归解法

class Solution {
public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = nums.size()-1;
        while (lo < hi) {
            if (hi-lo <= 1)
                return (nums[lo] < nums[hi]) ? nums[lo] : nums[hi];
            
            int mid = (lo+hi) >> 1;
            if (nums[mid] < nums[hi])
                hi = mid;
            else if (nums[mid] > nums[hi])
                lo = mid+1;
        }
        return nums[lo];
    }
};
{% endhighlight %}


### 2. Find Minimum in Rotated Sorted Array II

#### 2.1 递归实现
{% highlight C++ %}
//时间复杂度O(logn)，递归解法

class Solution {
public:
    int binarySearch(vector<int> &nums, int lo, int hi) {
        //判断最小值的时刻，一定是将区间收缩到了1或者2个元素
        if (hi-lo <= 1)
            return (nums[lo] < nums[hi]) ? nums[lo] : nums[hi];
        
        int mid = (lo+hi) >> 1;
        if (nums[mid] > nums[hi])
            return binarySearch(nums, mid+1, hi);
        else if (nums[mid] < nums[hi])
            return binarySearch(nums, lo, mid);
        else
            return binarySearch(nums, lo, hi-1);
    }

    int findMin(vector<int>& nums) {
        return binarySearch(nums, 0, nums.size()-1);
    }
};
{% endhighlight %}
   
#### 2.2 非递归实现 
{% highlight C++ %}
//时间复杂度O(logn)，非递归解法

class Solution {
public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = nums.size()-1;
        while (lo < hi) {
            if (hi-lo <= 1)
                return (nums[lo] < nums[hi]) ? nums[lo] : nums[hi];
            
            int mid = (lo+hi) >> 1;
            if (nums[mid] < nums[hi])
                hi = mid;
            else if (nums[mid] > nums[hi])
                lo = mid+1;
            else 
                hi --;
        }
        return nums[lo];
    }
};
{% endhighlight %}
