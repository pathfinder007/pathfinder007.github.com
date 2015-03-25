---
layout: post
category: Interview
title: 三道面试题
tags: Interview
---

### 1. 题目来源
&emsp;&emsp;今天问了下xiaobo面X公司的Data Mining内推实习生的算法题，说是三道，都挺简单，但是陷阱不少，没准备的话会跪。随手做了一下，树的深度有限遍历，需要写出递归与非递归版本；strcpy的实现；二维链表转成一维链表，这个二维链表是不是十字链表？这个需要具体和面试官确定，即是不是一个node4个指针，第i行最后一个node的right指针指向第i+1行的第一个node；除此之外，主要抓着项目问，以及一些Linux的基本操作，MapReduce的基础等，没有问机器学习的模型。

<!--more-->

### 2. 树的深度优先遍历
&emsp;&emsp;最经典、最简单的树相关问题，可以有先序、中序、后序三种，中序稍微麻烦一点；对于非递归做法，只是使用stack来模拟递归的操作。

#### 2.0 二叉树的结构定义
{% highlight C++ %}
struct TreeNode {
	int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
{% endhighlight %}


#### 2.1 递归版本
{% highlight C++ %}
class Solution {
public:
    vector<int> preorderTraversal(TreeNode *root) {
        vector<int> ret;
        dfs(root, ret);
        return ret;
    }
    
    void dfs(TreeNode *root, vector<int> &ret) {
        if (root == NULL)
            return;
        ret.push_back(root -> val);
        dfs(root -> left, ret);
        dfs(root -> right, ret);
    }
};
{% endhighlight %}

#### 2.2 非递归版本I
{% highlight C++ %}
class Solution {
public:
    vector<int> preorderTraversal(TreeNode *root) {
        vector<int> ret;
        stack<TreeNode *> st;
        if (root == NULL)
            return ret;
            
        TreeNode *cur = root;
        st.push(cur);
        
        while (!st.empty()) {
            cur = st.top();
            ret.push_back(cur -> val);
            st.pop();
            if (cur -> right)
                st.push(cur -> right);
            if (cur -> left)
                st.push(cur -> left);
        }
        
        return ret;
    }
};
{% endhighlight %}

#### 2.3 非递归版本II
{% highlight C++ %}
class Solution {
public:
    vector<int> preorderTraversal(TreeNode *root) {
        vector<int> ret;
        stack<TreeNode *> st;
        if (root == NULL)
            return ret;
        TreeNode *cur = root;
        while (cur != NULL || !st.empty()) {
            while (cur) {
                ret.push_back(cur -> val);
                st.push(cur);
                cur = cur -> left;
            }
            cur = st.top() -> right;
            st.pop();
        }
        return ret;
    }
};
{% endhighlight %}

### 3. strcpy函数的具体实现
&emsp;&emsp;C语言中char数组相关的操作，例如strcpy、strlen等，经常在面试中出现，即实现这些最基本的函数，这样的题目，存在很多的陷阱，真正考察一个coder的基本功。看到题目，只想到了字符数组的复制，检查指针是否为空，但是却没有考虑到，这个函数是有返回值的，那么为什么要设置一个返回值呢？这是一个问题。下面查资料所得，应该把相关的基本函数的实现，整理一下。

* strcpy函数的原型：`char *strcpy(char *strDest, const char *strSrc);`
* 既然已经可以把strSrc复制给strDest，为什么函数还需要返回值？为了实现链式表达式，例如`int len = strlen(strDest, "hello");`

{% highlight C++ %}
char *strcpy(char *strDest, char *strSrc)
{
	assert((strDest != NULL) && (strSrc != NULL));
	char *addr = strDest;
	while ((*strDest++ = *strSrc++) != '\0')
		;
	return addr;
}
{% endhighlight %}

tips:
* 如果不检查指针的有效性，说明答题者不注重代码的健壮性；
* 如果检查指针有效性时使用`((!strDest)||(!strSrc))`或`(!(strDest&&strSrc))`，说明答题者对C语言中类型的隐式转换没有深刻认识。在本例中`((!strDest)`是将`char *`转换为`bool`即是类型隐式转换，这种功能虽然灵活，但更多的是导致出错概率增大和维护成本升高；
* NULL == strDest常量写在表达式的左边，如果将表达式写错了，写成了赋值，则马上报错；反之，当漏写了 一个=，变成了strDest  = NULL，则检查不出错误来。

