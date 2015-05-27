---
layout: post
category: Leetcode
title: 二叉树的最大深度  
tags: Algorithm Leetcode TreeNode
---


&emsp;&emsp;求二叉树的最大深度，比较简单的一个题目，使用DFS、BFS都可以，关键是空间复杂度的优化。

<!--more-->

### 1 递归DFS，使用logn：

{% highlight C++ %}
class Solution {
public:
    void depth(TreeNode *root, int level, int &maxL) {
        maxL = max(level, maxL);
        
        if (root -> left)
            depth(root -> left, level+1, maxL);
        
        if (root -> right)
            depth(root -> right, level+1, maxL);
    }

    int maxDepth(TreeNode* root) {
        if (root == NULL)
            return 0;
        
        int maxL = 0;
        depth(root, 1, maxL);
    
        return maxL;
    }
};
{% endhighlight %}

<br />

### 2 非递归DFS，使用2n的空间：

{% highlight C++ %}
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root == NULL)
            return 0;
            
        stack<pair<TreeNode *, int> > st;
        st.push(pair<TreeNode *, int>(root, 1));
        int maxL = 0;
        while (!st.empty()) {
            TreeNode *cur = st.top().first;
            int cur_level = st.top().second;
            st.pop();
            maxL = max(cur_level, maxL);
            
            if (cur -> left)
                st.push(pair<TreeNode *, int>(cur -> left, cur_level+1));
            if (cur -> right)
                st.push(pair<TreeNode *, int>(cur -> right, cur_level+1));
        }
        return maxL;
    }
};{% endhighlight %}

<br />

### 3 非递归DFS，使用n的空间：

{% highlight C++ %}
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root == NULL)
            return 0;
            
        queue<TreeNode *> q;
        q.push(root);
        int res = 0;
        while (!q.empty()) {
            res ++;
            for (int i = 0, n = q.size(); i < n; ++i) {
                TreeNode *cur = q.front();
                q.pop();
                if (cur -> left)
                    q.push(cur -> left);
                if (cur -> right)
                    q.push(cur -> right);
            }
        }
        return res;
    }
};
{% endhighlight %}
