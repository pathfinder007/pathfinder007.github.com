---
layout: post
category: Leetcode
title: Find Peak Element 
tags: Algorithm Leetcode
---

&emsp;&emsp;按照题意，peak number即在一个数组中，比前后元素都大的数字。对于nums[-1], nums[n]，都认为值为无穷小。题目要求的时间复杂度为O(logn)，毫无疑问需要使用二分查找，解题有一个小trick，即对mid元素做判断是否为peak number，若否，往那边跳的问题。

<!--more-->

&emsp; &emsp;我们可以想象，当nums[mid] < nums[mid-1]时，即存在一个递减，只要前面存在一个递增，则找到一个peak number；当不存在，即一直 递减，则因为nums[-1] 为负无穷，无论无何，我们都可以找到一个递增的位置，也就是可以找到一个peak number。而对于nums[mid] < nums[mid+1]时，一样的考虑。有一点需要注意的是，我们考虑数组为两个元素的情况，则mid为0，当需要往后跳转时，mid必须+1，否则会陷入死循环；

* tips: 非递归解法while循环中，必须使用else if，不能直接if，因为可能存在多个peck number。否则会报错，很奇怪。


### 1. 递归解法

{% highlight C++ %}

class Solution { 
public:
    bool checkValid(vector<int> &nums, int idx) {
        if (idx == 0)
            return nums[idx] > nums[idx+1];
        else if (idx == nums.size()-1)
            return nums[idx] > nums[nums.size()-2];
        else
            return (nums[idx] > nums[idx-1] && nums[idx] > nums[idx+1]);
    }

    int binarySearch(vector<int> &nums, int lo, int hi) {
        int mid = (lo+hi) >> 1;
        if (checkValid(nums, mid))
            return mid;
        else if (mid != 0 && nums[mid] < nums[mid-1])
            return binarySearch(nums, lo, mid-1);
        else if (mid != nums.size()-1 && nums[mid] < nums[mid+1])
            return binarySearch(nums, mid+1, hi);
    }
    
    int findPeakElement(vector<int>& nums) {
        int lo = 0, hi = nums.size()-1;
        if (hi <= 0)
            return 0;
            
        return binarySearch(nums, lo, hi);
    }
};
{% endhighlight %}


### 2. 非递归解法

{% highlight C++ %}

class Solution {
public:
    bool checkValid(vector<int> &nums, int idx) {
        if (idx == 0)
            return nums[idx] > nums[idx+1];
        else if (idx == nums.size()-1)
            return nums[idx] > nums[nums.size()-2];
        else
            return (nums[idx] > nums[idx-1] && nums[idx] > nums[idx+1]);
    }
    
    int findPeakElement(vector<int>& nums) {
        int lo = 0, hi = nums.size()-1;
        if (hi <= 0)
            return 0;
        
        while (lo <= hi) {
            int mid = (lo+hi) >> 1;
            if (checkValid(nums, mid))
                return mid;
            
            else if (mid != 0 && nums[mid] < nums[mid-1])
                hi = mid - 1;
            else if (mid != nums.size()-1 && nums[mid] < nums[mid+1])
                lo = mid + 1;
        }
    }
};
{% endhighlight %}