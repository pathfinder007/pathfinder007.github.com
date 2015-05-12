---
layout: post
category: Leetcode
title: 先序/中序，中序/后序遍历序列构建二叉树  
tags: Algorithm Leetcode TreeNode
---


&emsp;&emsp;二叉树的构建，前序以及后序遍历序列，都可以定位root节点，当遍历序列没有重复节点的情况下，以root节点为间隔，可以在中序遍历序列中作划分，递归调用，即可构建二叉树

<!--more-->

### 1 先序/中序遍历序列构建二叉树：

{% highlight C++ %}
//从preorder顺序取下节点node作为root，则inorder中以node分界，左边构成left，右边构成right，
 //递归调用求解即可
 
class Solution {
public:
    TreeNode *create(vector<int> &preorder, vector<int> &inorder, int ps, int pe, int is, int ie) {
        if (ps > pe)
            return NULL;
        
        int gap = is;
        TreeNode *node = new TreeNode(preorder[ps]);
        for (int i = is; i <= ie; ++i) {
            if (inorder[i] == node->val) {
                gap = i;    
                break;
            }
        }
        node -> left  = create(preorder, inorder, ps+1, ps+gap-is, is, gap-1);
        node -> right = create(preorder, inorder, pe-ie+gap+1, pe, gap+1, ie);   //下标这里容易出错
        return node;
    }

    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        return create(preorder, inorder, 0, preorder.size()-1, 0, inorder.size()-1);
    }
};{% endhighlight %}

<br />

### 2 中序/后序遍历序列构建二叉树：

{% highlight C++ %}
//与105相比，只是划分的方式不太一样
 
class Solution {
public:
    TreeNode *create(vector<int>& inorder, vector<int>& postorder, int is, int ie, int ps, int pe) {
        if (ps > pe)
            return NULL;
        
        TreeNode *node = new TreeNode(postorder[pe]);
        int gap = is;
        for (int i = is; i <= ie; ++i) {
            if (inorder[i] == node -> val) {
                gap = i;    
                break;
            }
        }
        node -> left  = create(inorder, postorder, is, gap-1, ps, ps+gap-is-1);
        node -> right = create(inorder, postorder, gap+1, ie, ps+gap-is, pe-1);
        return node;
    }

    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        return create(inorder, postorder, 0, inorder.size()-1, 0, postorder.size()-1);
    }
};
{% endhighlight %}