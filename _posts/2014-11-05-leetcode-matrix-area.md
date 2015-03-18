---
layout: post
title: "Leetcode:Maximal Rectangle"
description: "一个被0,1填充的二维数组，找1组成矩形区域的最大面积"
modified: 2014-11-05
category: Leetcode
tags: Leetcode
image:
  feature: abstract-6.jpg
comments: true
share: true
---

### Maximal Rectangle
* 给一个二维数组，用0，1填充，找出包含1的矩形的最大面积。

### 思路
* 开始想到的思路是，比较好的时间复杂度应该是n方，动态规划（似乎看到二维数组，首先就想到DP，估计跟最近做的几个二维DP的题目有关，还是得好好总结，建立方法论）。即f[i][j]纪录以matrix[i][j]为右下顶点的矩形的最大面积。但是这样出现了一个问题，到f[i][j]的转移方程没法写，无法从f[i-1][j]/f[i][j-1]得到，思维还是存在漏洞。
* 正确思路：这个题目应该跟一维数组时，求最大能够容纳的水容量，或者是两根柱子组成的面积最大，连续整数的最大长度这些题一个类型，只是把数组从一维变成了二维。这样的话，按照原来两遍夹逼的思路。两个全局的数组L，R，对每一列都适用，即纪录当前行位置，第j列的最大允许的左边界以及右边界。两个局部的指针left，right，纪录当前行每个位置的左边界与右边界。并且通过left与right去更新L，R数组。

<!--more-->

### 完整代码:
{% highlight C++ %}
class Solution {
public:
    int maximalRectangle(vector<vector<char> > &matrix) {
        if (matrix.empty())
            return 0;
        int m = matrix.size();
        int n = matrix[0].size();
        vector<int> H(n, 0);
        vector<int> L(n, 0);
        vector<int> R(n, n);
        int ret = 0;
        for (int i = 0; i < m; ++i) {
            int left = 0, right = n;
            for (int j = 0; j < n; ++j) {
                if (matrix[i][j] == '1') {
                    ++H[j];
                    L[j] = max(left, L[j]);
                }
                else {
                    left = j+1;
                    H[j] = 0;
                    L[j] = 0;
                    R[j] = n;
                }
            }
            for (int j = n-1; j >= 0; --j) {
                if (matrix[i][j] == '1') {
                    R[j] = min(right, R[j]);
                    ret = max(ret, H[j]*(R[j]-L[j]));
                }
                else {
                    right = j;
                }
            }
        }
        return ret;
    }
};
{% endhighlight %}
