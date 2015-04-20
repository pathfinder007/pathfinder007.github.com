---
layout: post
category: Leetcode
title: Search in Rotated Sorted Array I/II
tags: Algorithm Leetcode
---

&emsp;&emsp;给定一个有序数组，以某一个支点做旋转；给定一个target，找出该数组中是否存在该target.其中I数组没有重复元素，若存在，则返回元素索引，反之，返回-1。II数组中存在重复元素，存在返回True，否则返回False。

&emsp;&emsp;这一题O(n)的写法，几行代码就写出来了，但是显然题目是要考察二分查找，O(n)的解法没什么意义。二分查找，时间复杂度为O(logn)，其中第二题中，存在重复元素的情况下，主要可能存在A[lo] == A[mid]同时A[mid] == A[hi]的情况，这点是需要特别注意的地方，可以通过逐步收缩right/left的位置将这个影响因素排除。

<!--more-->

### 1. Search in Rotated Sorted Array I

#### 1.1 递归解法

{% highlight C++ %}

class Solution {
public:
    int binarySearch(int A[], int target, int lo, int hi) {
        int mid = (hi+lo) >> 1;
        if (A[mid] == target)
            return mid;
        if (hi-lo <= 1 && A[hi] != target && A[lo] != target)
            return -1;
            
        else if (A[mid] < A[hi]) {
            if (A[mid] < target && A[hi] >= target)
                return binarySearch(A, target, mid+1, hi);
            else
                return binarySearch(A, target, lo, mid-1);
        }
        else {
            if (A[mid] > target && A[lo] <= target)
                return binarySearch(A, target, lo, mid-1);
            else
                return binarySearch(A, target, mid+1, hi);
        }
    }

    int search(int A[], int n, int target) {
        int lo = 0, hi = n-1;
        return binarySearch(A, target, lo, hi);
    }
};
{% endhighlight %}


#### 1.2 非递归解法

{% highlight C++ %}

class Solution {
public:
    int search(int A[], int n, int target) {
        int lo = 0, hi = n-1;
        while (lo < hi) {
            int mid = (hi+lo) >> 1;
            if (A[mid] == target)
                return mid;
            
            else if (A[mid] < A[hi]) {
                if (A[mid] < target && A[hi] >= target)
                    lo = mid+1;
                else
                    hi = mid-1;
            }
            else {
                if (A[mid] > target && A[lo] <= target)
                    hi = mid-1;
                else
                    lo = mid+1;
            }
            
        }
        return (A[lo] == target) ? lo : -1;
    }
};
{% endhighlight %}


### 1. Search in Rotated Sorted Array II

#### 2.1 递归解法

{% highlight C++ %}

class Solution {
//关键点就是，比较的时候，先选定mid与两端进行比较，在mid与hi相等时候，可以通过hi--排除掉重复元素.
public:
    bool binarySearch(int A[], int target, int lo, int hi) {
        int mid = (lo+hi) >> 1;
        if (A[mid] == target)
            return true;
        if (hi-lo <= 1 && A[hi] != target && A[lo] != target)
            return false;
            
        if (A[mid] < A[hi]) {
            if (A[mid] < target && target <= A[hi])
                return binarySearch(A, target, mid+1, hi);
            else
                return binarySearch(A, target, lo, mid-1);
        }
        else if (A[mid] > A[hi]) {
            if (A[mid] > target && A[lo] <= target)
                return binarySearch(A, target, lo, mid-1);
            else
                return binarySearch(A, target, mid+1, hi);
        }
        else
            return binarySearch(A, target, lo, hi-1);
    }

    bool search(int A[], int n, int target) {
        int lo = 0, hi = n-1;
        return binarySearch(A, target, lo, hi);
    }
};
{% endhighlight %}


#### 2.2 非递归解法

{% highlight C++ %}

class Solution {
//关键点就是，比较的时候，先选定mid与两端进行比较，在mid与hi相等时候，可以通过hi--排除掉重复元素.
public:
    bool search(int A[], int n, int target) {
        int lo = 0, hi = n-1;
        while (lo < hi) {
            int mid = (lo+hi) >> 1;
            if (A[mid] == target)
                return true;
            else if (A[mid] < A[hi]) {
                if (target > A[mid] && target <= A[hi])
                    lo = mid+1;
                else
                    hi = mid-1;
            }
            else if (A[mid] > A[hi]) {
                if (target < A[mid] && target >= A[lo])
                    hi = mid-1;
                else
                    lo = mid+1;
            }
            else
                hi --;
        }
        return A[lo] == target;
    }
};
{% endhighlight %}