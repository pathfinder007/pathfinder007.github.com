---
layout: post
category: Leetcode
title: Scramble String
tags: Algorithm Leetcode
---

&emsp;&emsp;据说是以前gg的一道面试题，字符串有很多二叉表示法，我们选择一个非叶子节点，将其左右孩子互换，即做了一次Scramble。判断两个字串是否符合。这个操作的重点是找了一个非叶子节点，将左右互换，即有一个点的分割，再互换。
将字符串进行二叉表示，即有一个递归分解的过程，可以使用递归。

<!--more-->

&emsp;&emsp;两个字符串相同的必备条件是含有相同的字符集，简单做法是排序后，判断是否相同，可以有效剪枝，大大减少递归次数。但是递归的时间复杂度为多项式级别。一般对于递归，都可以使用记忆化搜索的方法转化为非递归的实现。本题，DP是比较好的办法。

* 字符串长度为1时，两个字符必须完全相同；
* 字符串长度为2时，s1="ab", s2="ab"或者"ba"才行；
* 任意长度字符串时，将s1分解成a1，b1，s2分解成a2，b2，必须((a1~b1)&&(a2~b2))或者((a1~b2)&&(a2~b1))
* DP可以大大减少重复计算，使用一个三维数组，纪录dp[i][j][k]为s1[i, i+k-1]与s2[j, j+k-1]是否符合条件。

### 1. 递归做法，仅仅理清思路


{% highlight C++ %}
bool isScramble(string s1, string s2)
{   
    if (s1.size() != s2.size())
        return false;
    
    if (s1.size() == 1)
        return s1 == s2;
    
    string st1 = s1, st2 = s2;
    sort(st1.begin(), st1.end());
    sort(st2.begin(), st2.end());
        
    int len = s1.size();
    for (int i = 0; i < len; ++i) {
        if (st1[i] != st2[i])
            return false;
    }   
          
    bool ret = false;                                                                                                             
    for (int i = 1; i < len && !ret; ++i) {
        string s11 = s1.substr(0, i);
        string s12 = s1.substr(i, len-i);
        string s21 = s2.substr(0, i);
        string s22 = s2.substr(i, len-1);

        ret = isScramble(s11, s21) && isScramble(s12, s22);
        
        if (!ret) {
            s21 = s2.substr(len-i, i);
            s22 = s2.substr(0, len-i);
            ret = isScramble(s11, s21) && isScramble(s12, s22);
        }
    }
    return ret;
}
{% endhighlight %}


### 2. DP解法

{% highlight C++ %}
class Solution {
public:
    bool isScramble(string s1, string s2) {
        if (s1.size() != s2.size())
            return false;

        int len = s1.size();
            
        bool dp[len][len][len];
        memset(dp, false, sizeof(bool)*len*len*len);
        
        for (int k = 1; k <= len; ++k) {   
        	 //k==len的情况没注意
            for (int i = 0; i <= len-k; ++i) {   
            	//两层循环的结束条件没注意，由于是从i, j开始往后数k个，所以必须减去k
                for (int j = 0; j <= len-k; ++j) {
                    if (k == 1) {
                        dp[i][j][k] = (s1[i] == s2[j]);
                    }
                    else {
                        for (int l = 1; l < k; ++l) {
                            if ((dp[i][j][l] && dp[i+l][j+l][k-l]) || 
                            (dp[i][j+k-l][l] && dp[i+l][j][k-l])) {
                                dp[i][j][k] = true;
                                break;
                            }
                        }    
                    }
                }
            }
        }
        return dp[0][0][len];
    }    
};
{% endhighlight %}