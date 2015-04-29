---
layout: post
category: Leetcode
title: Reorder List  
tags: Algorithm Leetcode
---


&emsp;&emsp;改变一个链表的顺序，从`L0->L1->L2...->Ln变成L0->Ln->L1->Ln-1...`,in-place并且不能改变节点的值。比较经典的链表相关题目。涉及到链表的切分、反转以及拼接。

<!--more-->

{% highlight C++ %}
//第一想法，将链表全部反转，得一个新链表，再将两个链表拼起来，取前一半。但不是in-place
//这个思路是对的，不能新增加节点，可以将链表拆成两个，将后者进行反转，再将两个链表拼接
//不能改变元素的值，限制了不能使用stack存储，只能纯链表操作

 
class Solution {
public:

    ListNode *splitList(ListNode *head) {
        ListNode *fast = head;
        ListNode *slow = head;
        ListNode *prev = head;
        
        while (fast != NULL && fast -> next != NULL) {
            prev = slow;
            fast = fast -> next -> next;
            slow = slow -> next;
        }
        prev -> next = NULL;
        return slow;
    }
    
    ListNode *reverse(ListNode *head) {
        if (head == NULL || head -> next == NULL)
            return head;
        
        ListNode *prev  = NULL;
        ListNode *pCur  = head;
        ListNode *pNext = NULL;
        
        while (pCur != NULL) {
            pNext = pCur -> next;
            pCur -> next = prev;
            prev = pCur;
            pCur = pNext;
        }
        return prev;
    }

    void reorderList(ListNode *head) {
        if (head == NULL || head -> next == NULL)
            return;
        
        ListNode *p1 = head;
        ListNode *p2 = splitList(head);
        p2 = reverse(p2);
        
        ListNode *next1 = p1;
        ListNode *next2 = p2;
        ListNode *prev  = p1;
        while (p1 != NULL && p2 != NULL) {
            next1 = p1 -> next;
            next2 = p2 -> next;
            p1 -> next = p2;
            p2 -> next = next1;
            prev = p2;
            p1 = next1;
            p2 = next2;
        }
        
        while (p2 != NULL) {
            prev -> next = p2;
            prev = prev -> next;
            p2 = p2 -> next;
        }
    }
};
{% endhighlight %}