---
layout: post
category: Leetcode
title: 二叉树从根到叶子是否存在和为给定值的路径  
tags: Algorithm Leetcode TreeNode
---


&emsp;&emsp;给一颗二叉树和一个整数，判断该二叉树是否有一条从根到叶子的路径，路径上的和为给定的和。通过BFS、DFS都可以做，按照题目性质，DFS应该是更合适的解法。

<!--more-->

### 1 BFS：

{% highlight C++ %}
class Solution {
public:
    bool hasPathSum(TreeNode* root, int sum) {
        if (root == NULL)
            return false;
        
        stack<pair<TreeNode *, int> > st;
        st.push(pair<TreeNode *, int>(root, root->val));
        
        int curSum = 0;
        while (!st.empty()) {
            TreeNode *cur = st.top().first;
            curSum = st.top().second;
            st.pop();
            //注意题目要求到叶子节点，如果是从根到任意节点，这里做变化即可
            if (cur -> left == NULL && cur -> right == NULL && curSum == sum)  
                return true;
            
            if (cur -> left) {
                st.push(pair<TreeNode *, int>(cur -> left, curSum+cur->left->val));
            }
            if (cur -> right) {
                st.push(pair<TreeNode *, int>(cur -> right, curSum+cur->right->val));
            }
        }
        return false;
    }
};
{% endhighlight %}

<br />

### 2 递归DFS：

{% highlight C++ %}
class Solution {
public:
    bool hasPathSum(TreeNode* root, int sum) {
        if (root == NULL)
            return false;
        
        if (root -> left == NULL && root -> right == NULL)
            return root -> val == sum;
        
        return hasPathSum(root -> left, sum - root->val) || hasPathSum(root -> right, sum - root->val);
    }
};
{% endhighlight %}

<br />

### 3 后根遍历DFS：

{% highlight C++ %}
class Solution {
public:
    bool hasPathSum(TreeNode* root, int sum) {
        stack<TreeNode *> st;
        TreeNode *cur = root;
        TreeNode *pre = NULL;
        
        int curSum = 0;
        while (cur || !st.empty()) {
            while (cur != NULL) {
                st.push(cur);
                curSum += cur -> val;
                cur = cur -> left;
            }
            
            cur = st.top();
            if (cur -> left == NULL && cur -> right == NULL && curSum == sum)
                return true;
            
            if (cur -> right != NULL && cur -> right != pre) {
                cur = cur -> right;
            }
            else {
                pre = cur;
                st.pop();
                curSum -= cur -> val;
                cur = NULL;  
                // 这里需要注意，会进入这里的，则cur的子节点都已经处理过，而st.top()的子节点已经入栈
            }
        }
        return false;
    }
};
{% endhighlight %}
