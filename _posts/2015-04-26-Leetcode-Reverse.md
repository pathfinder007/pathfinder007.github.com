---
layout: post
category: Leetcode
title: Reverse Nodes in k-Group 
tags: Algorithm Leetcode
---


&emsp;&emsp;给一个链表，每次反转k个节点，如果节点数不是k的倍数，最后剩下的节点不需要反转，只能操作节点，不能改变节点的值，使用常数空间。

&emsp;&emsp; 跟昨天做的`Reverse Linked List II`是一样的思路，即对于每k个节点，看成一组[m, n]，`Reverse Linked List II`只需要反转一组子链表，而这一题需要反转多组。

<!--more-->

&emsp;&emsp;需要注意的是，coding的时候，链表的题目，经常出不小心导致runtime error，主要是以下几个原因：

* 对于指针为NULL了，未做判断，还往下求next
* 比如这一题中的`n--, --n`，有的时候不注意，直接拿k去自减，自减后无法归位，导致下面一个while循环并不执行。 

<br />

{% highlight C++ %}
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        if (head == NULL || head -> next == NULL || k <= 1)
            return head;
            
        ListNode *preHead = new ListNode(-1);
        preHead -> next = head;
        
        ListNode *prev = preHead;
        ListNode *pCur = head;
        ListNode *p;
        
        int count = 0; 
        while (head != NULL) {
            head = head -> next;
            count ++;
        }
        
        int cycle = count / k;
        int n;
        for (int i = 0; i < cycle; ++i) {
            pCur = prev -> next;
            n = k;
            while (--n) {
                p = pCur -> next;
                pCur -> next = p -> next;
                p -> next = prev -> next;
                prev -> next = p;
            }
            
            //注意前面已经将k减到了0，此处不能使用k--
            n = k;
            while (n--)
                prev = prev -> next;
        }
        return preHead -> next;
    }
};
{% endhighlight %}