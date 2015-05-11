---
layout: post
category: Leetcode
title: 从一个有序链表构建二叉检索树  
tags: Algorithm Leetcode ListNode
---


&emsp;&emsp;由有序链表构建二叉检索树。很长时间没有接触树的题目，没有什么做题的感觉。题目应该从二叉检索树的特点入手，即一颗树，或者为空，或者其左子树的值都小于根节点，右子树的值都不小于其根节点，且左右子树都为二叉检索树。可想而知，若中序遍历一颗二叉检索树，则可以得到一个有序序列，即题目要求是根据加了约束的中序遍历序列，构建二叉树（并不是任意一颗树，都可以只通过中序遍历序列构建）。

<!--more-->

&emsp;&emsp;由于树是一种递归的结构，因此通过递归来解决树的问题，是一个天然的思路。可以通过快慢指针先找到中间元素，以中间元素为root，将序列划分，前半部分构建左子树，右半部分构建右子树。

### 1.1 链表结构：

{% highlight C++ %}
struct ListNode {
	int val;
	ListNode *next;
	ListNode(int x): val(x), next(NULL) {}
};
{% endhighlight %}

<br />

### 1.2 树的结构

{% highlight C++ %}
struct TreeNode {
	int val;
	TreeNode *left;
	TreeNode *right;
	TreeNode(int x): val(x), left(NULL), right(NULL) {}
};
{% endhighlight %}

<br />

### 1.3 有序链表到二叉检索树的构建

{% highlight C++ %}
class Solution {
public:
    TreeNode* sortedListToBST(ListNode* head) {
        if (head == NULL)
            return NULL;
        if (head -> next == NULL)
            return new TreeNode(head -> val);
            
        ListNode *slow = head;
        ListNode *fast = head;
        ListNode *prev;
        while (fast != NULL && fast -> next != NULL) {
            prev = slow;
            slow = slow -> next;
            fast = fast -> next -> next;
        }
        prev -> next = NULL;
        
        TreeNode *root  = new TreeNode(slow -> val);
        TreeNode *left  = sortedListToBST(head);
        TreeNode *right = sortedListToBST(slow -> next);
        root -> left  = left;        
        root -> right = right;
        return root;
    }
};
{% endhighlight %}