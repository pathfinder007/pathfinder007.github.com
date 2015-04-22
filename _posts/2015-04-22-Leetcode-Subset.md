---
layout: post
category: Leetcode
title: Subsets I/II 
tags: Algorithm Leetcode
---

&emsp;&emsp; 给定一个vector容器存放的整形数组，返回所有的子集，要求子集中的元素为非递减排列；其中I中的元素没有重复，II中可能存在重复元素。

&emsp;&emsp;开始看到题目，第一感觉就是dfs，但是似乎这一题，又不算标准的dfs。当数组中没有重复元素时，对于长度为n的数组，子集有2^n个，即对于每个元素，都可以选择加入或者不加入。则可以先将数组排序，再依次将每个元素加入已生成的子集中。

<!--more-->

### 1. subset

&emsp; &emsp;在没有重复元素时，可以考虑，先将空数组加入结果集合ret，再将S数组中的元素依次加入ret中已有的子集中。为了保证每个子集内部元素的有序，先通过sort函数对传入的数组排序。

#### 1.1 Solution1
{% highlight C++ %}

class Solution { 
public:
    vector<vector<int> > subsets(vector<int> &S) {
        sort(S.begin(), S.end());
        vector<vector<int> > ret;
        vector<vector<int> > :: iterator it;
        vector<int> empty;
        ret.push_back(empty);
        
        for (int i = 0; i < S.size(); ++i) {
            //注意，内存循环不能使用ret，否则ret一直在增大，将会死循环
            vector<vector<int> > append = ret;
            for (it = append.begin(); it != append.end(); ++it) {
                it->push_back(S[i]);
                ret.push_back(*it);
            }
        }
        return ret;
    }
};
{% endhighlight %}

#### 1.2 Solution2 递归DFS

&emsp;&emsp;关于dfs，关键的理解就是，在取得了若干个元素的基础上，先尽可能将能取的元素取进来，然后逐渐从后往前移除，每移除一个元素，则跳过该位置，从该位置之后的一个位置，再往后取，直到取尽。

{% highlight C++ %}

class Solution { 
public:
    void helper(vector<int> &S, vector<vector<int> > &ret, vector<int> &tmp, int startIdx) {
        ret.push_back(tmp);
        
        for (int i = startIdx; i < S.size(); ++i) {
            tmp.push_back(S[i]);
            helper(S, ret, tmp, i+1);
            tmp.pop_back();
        }
    }

    vector<vector<int> > subsets(vector<int> &S) {
        sort(S.begin(), S.end());
        vector<vector<int> > ret;
        vector<int> tmp;
        helper(S, ret, tmp, 0);
        return ret;
    }
};
{% endhighlight %}

### 2. subset II

&emsp;&emsp;在数组中元素存在重复时，仍然按照没有重复元素时候的处理方法。有两个思路可以借鉴。

* 可以在排序后，将重复出现的元素串看成一个元素，对于其他元素，可以有加入/不加入两种选择，而对于这类特殊元素，可以有加入0个、1个，直到多个的选择;
* 当出现重复元素时，为了避免生成的结果集合有重复，能插入的，只是在上一次生成的子集。

#### 2.1 Solution1

{% highlight C++ %}

public:
    vector<vector<int> > subsetsWithDup(vector<int> &S) {
        sort(S.begin(), S.end());
        vector<vector<int> > ret;
        vector<int> empty;
        ret.push_back(empty);
        
        int count = 1;
        
        for (int i = 0; i < S.size();) {
            vector<vector<int> > append = ret;
            while (i+count < S.size() && S[i] == S[i+count]) {
                count ++;
            }
            
            for (int j = 0; j < append.size(); ++j) {
                for (int k = 0; k < count; ++k) {
                    append[j].push_back(S[i]);
                    ret.push_back(append[j]);
                }
            }
            i += count;
            count = 1;
        }
       return ret;
    }
};
{% endhighlight %}


#### 2.2 Solution2

{% highlight C++ %}

class Solution {
//可以通过记录上一次ret的size，与这一次的size，即可获取新加入的subset块，关键是在什么地方更新size值
public:
    vector<vector<int> > subsetsWithDup(vector<int> &S) {
        sort(S.begin(), S.end());
        vector<vector<int> > ret;
        vector<int> empty;
        ret.push_back(empty);
        
        int startIdx;
        int size = 0;
        for (int i = 0; i < S.size(); ++i) {
            vector<vector<int> > append = ret;
            startIdx = (i != 0 && S[i] == S[i-1]) ? size : 0;
            size = append.size();
            for (int j = startIdx; j < size; ++j) {
                append[j].push_back(S[i]);
                ret.push_back(append[j]);
            }
        }
        return ret;
    }
};
{% endhighlight %}


#### 2.3 Solution3 递归DFS

{% highlight C++ %}

class Solution {
public:
    void helper(vector<int> &S, vector<vector<int> > &ret, vector<int> &tmp, int startIdx) {
        ret.push_back(tmp);
        
        for (int i = startIdx; i < S.size(); ++i) {
            if (i > startIdx && S[i] == S[i-1]) 
                continue;
            tmp.push_back(S[i]);
            helper(S, ret, tmp, i+1);
            tmp.pop_back();
        }
    }

    vector<vector<int> > subsetsWithDup(vector<int> &S) {
        sort(S.begin(), S.end());
        vector<vector<int> > ret;
        vector<int> tmp;
        helper(S, ret, tmp, 0);
        
        return ret;
    }
};
{% endhighlight %}
