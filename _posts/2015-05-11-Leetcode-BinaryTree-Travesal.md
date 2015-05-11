---
layout: post
category: Leetcode
title: 递归/非递归实现二叉树的前序、中序、后序遍历  
tags: Algorithm Leetcode TreeNode
---


&emsp;&emsp;前序、中序、后序遍历，二叉树常见的几种深度优先遍历算法。本文中依次实现其递归与非递归解法。对于递归解法来说，三种遍历方式的区别，仅仅在于在什么时候，读取当前节点的值。而非递归解法，前序与中序相似，后序遍历稍显麻烦。

<!--more-->

### 1. 前序遍历

### 1.1 递归解法：

{% highlight C++ %}
class Solution {
public:
    void travesal(TreeNode *root, vector<int > &ret) {
        if (root == NULL)
            return;
            
        ret.push_back(root -> val);
        
        if (root -> left)
            travesal(root -> left, ret);
            
        if (root -> right)
            travesal(root -> right, ret);
    }

    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> ret;
        if (root == NULL)
            return ret;
        travesal(root, ret);
        return ret;
    }
};
{% endhighlight %}

<br />

### 1.2 非递归解法：

{% highlight C++ %}
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> ret;
        stack<TreeNode *> st;
        if (root != NULL)
            st.push(root);
        
        TreeNode *cur;
        while (!st.empty()) {
            cur = st.top();
            st.pop();
            ret.push_back(cur -> val);
            if (cur -> right != NULL)
                st.push(cur -> right);
            if (cur -> left != NULL)
                st.push(cur -> left);
        }
        return ret;
    }
};
{% endhighlight %}

<br />

### 2 中序遍历

### 2.1 递归解法：

{% highlight C++ %}
class Solution {
public:
    void travesal(TreeNode *root, vector<int> &ret) {
        if (root == NULL)
            return;
            
        if (root -> left)
            travesal(root -> left, ret);
        
        ret.push_back(root -> val);
        
        if (root -> right)
            travesal(root -> right, ret);
    }

    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ret;
        if (root == NULL)
            return ret;
        travesal(root, ret);
        return ret;
    }
};
{% endhighlight %}

### 2.2 非递归解法：

{% highlight C++ %}
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ret;
        stack<TreeNode *> st;
        
        if (root == NULL)
            return ret;
        
        TreeNode *cur = root;
        while (!st.empty() || cur != NULL) {
            if (cur != NULL) {
                st.push(cur);
                cur = cur -> left;
            }
            else {
                cur = st.top();
                ret.push_back(cur -> val);
                st.pop();
                cur = cur -> right;
            }
        }
        return ret;
    }
};
{% endhighlight %}

<br />

### 3 后序遍历

### 3.1 递归解法：

{% highlight C++ %}
class Solution {
public:
    void travesal(TreeNode *root, vector<int> &ret) {
        if (root == NULL)
            return;
            
        if (root -> left)
            travesal(root -> left, ret);
            
        if (root -> right)
            travesal(root -> right, ret);
            
        ret.push_back(root -> val);
    }
    
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> ret;
        if (root == NULL)
            return ret;
        travesal(root, ret);
        return ret;
    }
};
{% endhighlight %}

### 3.2 非递归解法：

{% highlight C++ %}
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> ret;
        stack<TreeNode *> st;
        
        if (root != NULL)
            st.push(root);
            
        TreeNode *cur;
        while (!st.empty()) {
            cur = st.top();
            st.pop();
            ret.insert(ret.begin(), cur -> val);
            if (cur -> left)
                st.push(cur -> left);
            if (cur -> right)
                st.push(cur -> right);
        }
        return ret;
    }
};
{% endhighlight %}