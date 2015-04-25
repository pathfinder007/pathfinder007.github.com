---
layout: post
category: Leetcode
title: Reverse Linked List II 
tags: Algorithm Leetcode
---

&emsp;&emsp; 即给定一个链表，以及两个位置m，n，将从第m个节点到第n个节点的链表进行反转。要求最好是只扫描一次链表，以及in-place去做。比如，对于`1->2->3->4->5->NULL, m = 2 and n = 4`，反转后返回`1->4->3->2->5->NULL`。

&emsp;&emsp;开始想到的方法是，使用一个栈，从m到n，将节点的值入栈，然后再扫一遍链表，从m到n，再将值依次出栈，更改节点元素值即可。如此，有两个不好的地方，首先，多开辟了存储空间，最坏情况下，需要浪费O(n)的存储空间；再者，需要遍历两次。

<!--more-->

&emsp;&emsp;比较好的方法，应该是，使用prev节点定位m节点之前的位置，定位后不动，pCur节点定位m节点，p节点为m下一个节点；逐渐将p节点拆下来，插入prev和pCur之间即可。为了考虑m位于head节点的情况，在前面自己加一个0节点；需要拆的节点为n-m个。

### 1. 使用stack实现

<br />
{% highlight C++ %}
class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int m, int n) {
        if (head == NULL || (m < 0 && n < 0))
            return head;
        
        stack<int> st;
        
        ListNode *ptr = head;
        int count = 1;
        while (ptr != NULL) {
            if (count >= m && count <= n)
                st.push(ptr->val);
            else if (count > n)
                break;
            ptr = ptr -> next;
            count ++;
        }
        
        ptr = head;
        count = 1;
        while (ptr != NULL) {
            if (count >= m && count <= n && !st.empty()) {
                ptr -> val = st.top();
                st.pop();
            }
            else if (count > n)
                break;
            ptr = ptr -> next;
            count ++;
        }
        return head;
    }
};
{% endhighlight %}

<br />

### 1. 一个one-pass的解法

<br />
{% highlight C++ %}
class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int m, int n) {
        if (head == NULL || (m < 0 && n < 0))
            return head;
        
        ListNode *preHead = new ListNode(0);
        preHead -> next = head;
        n -= m;  //要拆下重组的节点数目

        ListNode *prev = preHead;
        while (--m)
            prev = prev -> next;   //可以加上对NULL的判断，保证m的合法
            
        ListNode *pCur = prev -> next;
        while (n--) {
            ListNode *p = pCur -> next;
            pCur -> next = p -> next;  //拆下p
            p -> next = prev -> next;
            prev -> next = p;  //插入p
        }
        return preHead -> next;
    }
};
{% endhighlight %}