---
layout: post
category: Algorithm
title: 青蛙跳台阶问题
tags: Algorithm Interview
---

1. 一只青蛙一次可以跳上 1 级台阶，也可以跳上2 级。求该青蛙跳上一个n 级的台阶总共有多少种跳法。
2. 一只青蛙一次可以跳上1级台阶，也可以跳上2 级……它也可以跳上n 级，此时该青蛙跳上一个n级的台阶总共有多少种跳法？

<!--more-->

### 1. 常规跳台阶

&emsp;&emsp;第一个问题，是一个dp问题，即第n级台阶，可以且仅可以由第n-1或者第n-2级台阶到达。则可以写出状态转移方程:
   
* n = 1, dp[n] = 1
* n = 2, dp[n] = 2
* n >= 3, dp[n] = dp[n-1] + dp[n-2] 

&emsp;&emsp;实际上，规律类似于婓波那契数列，如果补充一个dp[0] = 1的话，为一个标准的奜波那契数列；可以使用递归做法；dp相当于是递归的改进版本，即存储了中间结果，避免了重复的运算。

##### 非递归解法
{% highlight C++ %}
class Solution {
public:
  int jumpFloor(int number) {
    int dp[number+1];
        memset(dp, 0, sizeof(int)*(number+1));
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= number; ++i) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[number];
  }
};
{% endhighlight %}

##### 递归解法
{% highlight C++ %}
class Solution {
public:
	int jumpFloor(int number) {
        if (number == 1)
            return 1;
        else if (number == 2)
            return 2;
        else
            return jumpFloor(number-1) + jumpFloor(number-2);
		
	}
};
{% endhighlight %}


### 2. 变态跳台阶

&emsp;&emsp;复现跳的过程，找数学规律

* n = 1时，Fib(1) = 1
* n = 2时，Fib(2) = Fib(1) + Fib(0) = 2
* n = 3时，Fib(3) = Fib(0) + Fib(1) + Fib(2) = 4
* Fib(n) = Fib(n-1)+Fib(n-2)+Fib(n-3)+...+Fib(n-n) = Fib(0)+Fib(1)+Fib(2)+...+Fib(n-1)
* Fib(n-1) = Fib(0)+Fib(1)+Fib(2)+...+Fib(n-2)
* 两式相减得 Fib(n)-Fib(n-1) ＝ Fib(n-1) 

{% highlight C++ %}
class Solution {
public:
  int jumpFloorII(int number) {
    int dp[number+1];
        memset(dp, 0, sizeof(number+1));
        dp[1] = 1;
        dp[2] = 2;
         
        for (int i = 3; i <= number; ++i) {
            dp[i] = 2 * dp[i-1];
        }
        return dp[number];
  }
};
{% endhighlight %}