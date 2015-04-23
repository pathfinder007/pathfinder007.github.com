---
layout: post
category: Leetcode
title: Largest Rectangle in Histogram/Maximal Rectangle 
tags: Algorithm Leetcode
---

&emsp;&emsp; Leetcode中求面积的两个相对比较难的题目，其中`Largest Rectangle in Histogram`给定n个元素的数组，每个元素为柱子的高度，宽度均为1，计算柱子组成的矩形的最大面积；`Maximal Rectangle`给一个二维数组，元素为0/1，找出包含1的最大的方形区域。

&emsp;&emsp;对于第一道题，穷举的时间复杂度为O(n^2)，可以通过减枝满足AC的要求；也可以使用栈来优化算法，达到O(n)的时间复杂度。很多需要进行时间复杂度优化的问题都可以通过栈或者是哈希表加以解决；而对于后者，开始想到了纪录一个矩形块的左右边界的方法，但没有具体想明白，可以通过逐层对每个元素，纪录左右边界以及有效高度的方法，类似DP。

<!--more-->

### 1. Largest Rectangle in Histogram

<br />

#### 1.1 Solution1 

&emsp; &emsp;依次以每个柱子为右边界，穷举左边界，更新最大值，为O(n^2)，可以通过减枝，降低复杂度，即对于每个height[k-1] <= height[k]以height[k]为右边界得到的结果肯定大，可以掠过，即只考虑height[k－1] > height[k]的k-1.

<br />
{% highlight C++ %}
class Solution {
public:
    int largestRectangleArea(vector<int>& height) {
        int n = height.size();
        if (n == 0)
            return 0;
        if (n == 1)
            return height[0];
            
        int maxArea = height[n-1];
        for (int i = n-1; i >= 0; --i) {
            if (i != n-1 && height[i] <= height[i+1])
                continue;
            int area = height[i];
            int minH = height[i];
            for (int j = i; j >= 0; --j) {
                minH = min(minH, height[j]);
                area = max(area, minH*(i-j+1));
                maxArea = max(area, maxArea);
            }
        }
        return maxArea;
    }
};
{% endhighlight %}

<br />

#### 1.2 Solution2

&emsp;&emsp;当序列递增时，入栈，直到遇到一个递减的元素，逐渐出栈，同时计算面积，直到遇到比当前元素小的栈内元素，将当前元素入栈。由于计算面积的条件是当前元素比栈顶元素小，那么涉及到一个问题，以最后一个元素为边界的面积怎么计算？可以在输入的height数组中添加一个0，确保最后一个元素可以弹出计算但是该方法，对于完全递减的数组，时间复杂度仍然为O(n^2);


{% highlight C++ %}
class Solution {
public:
    int largestRectangleArea(vector<int>& height) {
        int ret = 0;
        height.push_back(0);
        
        stack<int> st;
        
        for (int i = 0; i < height.size(); ) {
            if (st.empty() || height[i] > height[st.top()]) {
                st.push(i++);
            }
            else {
                int tmp = st.top();
                st.pop();
                ret = max(ret, height[tmp] * (st.empty() ? i : i - (st.top()+1)));
            }
        }
        return ret;
    }
};
{% endhighlight %}

<br />

### 2. Maximal Rectangle

&emsp;&emsp;转化成dp问题，逐行扫描，纪录每个元素对应的最大矩形块的left、right边界以及height值，逐点更新macRect的值。

<br />

{% highlight C++ %}
class Solution {
public:
    int maximalRectangle(vector<vector<char> > &matrix) {
        if (matrix.empty())
            return 0;
        const int m = matrix.size();
        const int n = matrix[0].size();
        
        int lo[n], hi[n], height[n];
        fill_n(lo, n, 0);
        fill_n(hi, n, n);
        fill_n(height, n, 0);
        
        int maxArea = 0;
        for (int i = 0; i < m; ++i) {
            int curLo = 0, curHi = n;
            for (int j = 0; j < n; ++j) {
                if (matrix[i][j] == '1')
                    height[j] ++;
                else
                    height[j] = 0;
            }
            for (int j = 0; j < n; ++j) {
                lo[j] = (matrix[i][j] == '1') ? max(lo[j], curLo) : 0;
                curLo = (matrix[i][j] == '1') ? curLo : j+1;
            }
            for (int j = n-1; j >= 0; --j) {
                hi[j] = (matrix[i][j] == '1') ? min(hi[j], curHi) : n;
                curHi = (matrix[i][j] == '1') ? curHi : j;
            }
            for (int j = 0; j < n; ++j) {
                if (matrix[i][j] == '1')
                    maxArea = max(maxArea, height[j]*(hi[j]-lo[j]));
            }
        }
        return maxArea;
    }
};
{% endhighlight %}