---
layout: post
title: "Leetcode:2Sum, 3Sum, 3Sum, 3Sum Closet 4Sum"
description: "Leetcode中2Sum, 3Sum, 3Sum Closet, 4Sum总结"
modified: 2014-11-02
category: Leetcode
tags: Leetcode
image:
  feature: abstract-1.jpg
comments: true
share: true
---

### 题目含义.
&emsp;&emsp;Leetcode 的Array相关题目，Two Sum，3Sum，3Sum Closet，4Sum。都是给定一个整形数组(以vector形式给出)，给定一个target number。在数组里找出若干个数，使得和为target number，或者最接近target number。返回满足条件的数组元素或者元素索引。

<!--more-->

### Two Sum
* 给一个整形数组，一个target，找两个元素，使得和为target，返回这两个元素的位置。
* 输入：numbers = {2, 7, 11, 15}, target = 9
* 输出：{1, 2} 

### 几个想法
* 错误思路：开始想到的思路，排序后，通过两边指针夹逼的形式，排序复杂度为nlogn，两边夹逼复杂度为n。但是这题要求返回元素位置，而排序改变了元素。自然想到使用map，存储元素位置，但是既然使用了map，这题还得nlogn的复杂度，显然不太科学。于是有了下面的思路。

* 正确思路：通过一个map存储纪录每个元素的位置。扫一遍数组，对每一个元素，计算gap，然后在map中查找，key为gap的位置是否存在。由于在map中执行find操作，时间复杂度为1，故整体时间复杂度为n, Accepted.

### 完整代码:
{% highlight C++ %}
class Solution {
public:
    vector<int> twoSum(vector<int> &numbers, int target) {
        vector<int> ret;
        int len = numbers.size();
        map<int, int> mp;
        for (int i = 0; i < len; ++i)
            mp[numbers[i]] = i; 
        
        for (int i = 0; i < len; ++i) {
            int gap = target - numbers[i];
            if (mp.find(gap) != mp.end() && mp[gap] != i) {
                ret.push_back(i+1);
                ret.push_back(mp[gap]+1);
                break;
            }
        }
        return ret;
    }
};
{% endhighlight %}

### 3Sum Closet
* 给一个整形数组，一个target，找三个元素，使得和最接近给定的target，输出最接近的值。假设只有一个解。
* 输入：num = {-1, 2, 1, 4}, target = 1
* 输出：2

### 几个想法
* 错误思路：开始想的是，通过Two Sum的方法进行延伸，既然是找3个数，可以通过一个map，纪录每两个数的和，便将3Sum 转化为Two Sum的问题来解决。
   1. map的建立，时间复杂度为n^2
   2. 通过map与pair配合的方式进行存储，map<int, pair<int, int> >
   3. 总的时间复杂度为n^2，瓶颈为map的建立
   4. 在数据量大的时候，超时

* 正确思路：该题不用返回索引，首先排序，再通过左右夹逼的方式，时间复杂度也是n^2，但是却Accepted.
   应该是单纯的数组操作，比之封装在其上的数据结构，还是有性能优势

### 完整代码:
{% highlight C++ %}
class Solution {
public:
    int threeSumClosest(vector<int> &num, int target) {
        int sum = num[0] + num[1] + num[2];
        int gap = abs(sum - target);
        int min_gap = gap;
        int ret = 0;
        sort(num.begin(), num.end());
        for (auto a = num.begin(); a != prev(num.end(), 2); ++a) {
            auto b = next(a);
            auto c = prev(num.end(), 1);
            while (b < c) {
                sum = *a + *b + *c;
                gap = sum - target;
                if (abs(gap) <= min_gap) {
                    ret = sum;
                    min_gap = abs(gap);
                }
                if (gap == 0)
                    return ret;
                else if (gap > 0)
                    c--;
                else
                    b++;
            }
        }
    
        return ret;
        
    }
};
{% endhighlight %}

### 3Sum
* 给一个整形数组，找三个元素，使得和为0.找出所有满足条件的解，每个元素只能取用一次。
* 返回的解(元素)，元素必须非递减，即(a, b, c)，其中a<= b <= c
* 输入：{-1, 0, 1, 2, -1, 4}
* 输出：{(-1, 0, 1), (-1, -1, 2)}

### 几个想法
* 错误思路：开始想到的是，照搬3Sum Closet的想法，两边夹逼。这题的关键是，要求输出的解无重复，而给定的输入数组有重复。
   1. 对于第一个for循环，每一次循环开始，纪录a的值。每个循环，判断a的值，如果与上一次的a相同，相同则continue。但是忽略了b，c也可能重复。结果有重复。
   2. 先不管重复情况，完全按照两边夹逼的方法，得到一个有重复的解，然后去重，即通过sort()将结果vector中的元组排序，再通过unique将重复元素扔到vector后面，即begin位置为没有重复的元组最后一个位置，对vector进行erase操作，将重复的删除。而这也是vector去重的一般方法。结果超时。

* 正确思路：回到错误思路1，即两边夹逼，对于a, b, c，均判断是否与上一个值相等，若想等，则continue。形式上有三个循环嵌套，但是平均复杂度，仍然为n^2，Accepted.

### 完整代码:
{% highlight C++ %}
class Solution {
public:
    vector<vector<int> > threeSum(vector<int> &num) {
        vector<vector<int> > ret;
        if (num.size() < 3)
            return ret;
        
        sort(num.begin(), num.end());
        for (auto a = num.begin(); a != prev(num.end(), 2); ++a) {
            if (a != num.begin() && *a == *(a-1))
                continue;
            auto b = next(a);
            auto c = prev(num.end(), 1);
            while (b < c) {
                int target= *a + *b + *c;
                if (target == 0) {
                    ret.push_back({*a, *b, *c});
                    ++b;
                    while (*b == *(b-1))
                        ++b;
                    --c;
                    while (*c == *(c+1))
                        --c;
                }
                else if (target > 0)
                    --c;
                else
                    ++b;
            }
        }
        return ret;
    }
};
{% endhighlight %}

### 4Sum
* 给一个整形数组，一个target，找四个元素，使得和为target.找出所有满足条件的解，每个元素只能取用一次。
* 输入：num = {1, 0, -1, 0, -2, 2}, target = 0.
* 输出：{(-1, 0, 0, 1), (-2, -1, 1, 2), (-2, 0, 0, 2)}

### 几个想法
* 错误思路：从做前面几题的情况来看，这题如果使用左右夹逼的方式，最小时间复杂度为n^3，应该会超时。于是想到了map。
   1. 先两层循环嵌套扫数组，纪录两两元素的和，value为两个元素的索引。考虑到一个和可能对应多个元素对，value使用了value，数据结构为map<int, vector<pair<int, int> > >，相当于把4Sum问题转化成了3Sum问题。请注意，只是相当于。
   2. 再次两层循环嵌套扫数组，如果a与上次元素相同，跳过，对b，亦如此。计算gap，在map中寻找key为gap的位置是否存在，从vector中取出另外两个值的索引。结果超时。个人猜测是map,pair, vector 搭建的数据结构，严重影响了C++的效率。
   
 * 正确思路：先排序，map形式仍然为map<int, vector<pair<int, int> > >，通过约定找出不符合条件的value，直接跳过。
   1. 第二次两层循环嵌套扫数组，求出gap。由于map中每个value的第一个索引肯定小于第二个索引(先排序，再建map)，而第二次扫数组时的两个值，num[i], num[j]，也是前一个值小于后一个值。则建立一个约定，num[i] < num[j] < num[tmp[k].first] < num[tmp[k].second或者num[tmp[k].first] < num[tmp[k].second < num[i] < num[j]，对于不满足条件的值，跳过。
   2. 这样的思路，可能出现的重复，主要在于，数组中可能有重复元素，则在map的建立时，某一些key对应的value(vector)中，是存在重复的。
   3. 最后对结果vector去重，Acceptd.不过这种方法，运行时间比较长，leetcode上给出的时间在756ms. 在数组建立时进行有效去重，或者第二次循环嵌套扫描时先进行去重，应该会有所提高。
   
{% highlight C++ %}
class Solution {
public:
    vector<vector<int> > fourSum(vector<int> &num, int target) {
        vector<vector<int> > ret;
        if (num.size() < 4)
            return ret;
        sort(num.begin(), num.end());
        map<int, vector<pair<int, int> > > mp;
        
        for (int i = 0; i < num.size(); ++i)
            for (int j = i+1; j < num.size(); ++j) {
                int index = num[i] + num[j];
                mp[index].push_back(make_pair(i, j));
            }
        
        int gap = 0;
        for (int i = 0; i < num.size(); ++i) {
            for (int j = i+1; j < num.size(); ++j) {
                gap = target - num[i] - num[j];
                if (mp.find(gap) == mp.end())
                    continue;
                auto tmp = mp[gap];
                for (int k = 0; k < tmp.size(); ++k) {
                    //if (i <= tmp[k].second)
                    //    continue;
                    //ret.push_back({num[tmp[k].first], num[tmp[k].second], num[i], num[j]});
                    if (j >= tmp[k].first)
                        continue;
                    ret.push_back({num[i], num[j], num[tmp[k].first], num[tmp[k].second]});
                    
                }
            }
        }
        
        sort(ret.begin(), ret.end());
        ret.erase(unique(ret.begin(), ret.end()), ret.end());
        return ret;
    }
};
{% endhighlight %}
