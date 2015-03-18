---
layout: post
category: Interview
title: link list cycle
tags: Interview
---

### 1. 题目来源
&emsp;&emsp;今天宿舍哥们去面X公司的内推实习生，说二面时上来就两道算法题，30分钟写完。一道是Leetcode上的原题，即判断一个链表是否有环，若有环，找出环开始的位置；还有一道题目为字符串压缩，即给出"aaabbbbccccc"，return "3a4b5c"，两道题目都比较简单；；最近在按分类刷Leetcode，即将完成String的部分，特意把Linked List Cycle I/II找出出来，提前做一下，两道题在Leetcode上面AC率都比较高。

<!--more-->

### 2. 思路
* 经典的快慢指针题目，有环，则相遇；无环，快指针最终会为NULL；
* 而找出环开始的位置，则需要画图，将距离在图上标注一下得出，快指针以慢指针两倍的速度往前走，当二者相遇，则将快指针放在相遇的节点，慢指针拉回原点，二者以相同速度，再相遇的位置，即为环开始的位置；

#### 2.1 Linked List Cycle I:
{% highlight C++ %}
class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head;
        ListNode *fast = head;
        while (fast != NULL && fast -> next != NULL) {
            fast = fast -> next -> next;
            slow = slow -> next;
            if (fast == slow)
                return true;
        }
        return false;
    }
};
{% endhighlight %}

#### 2.2 Linked List Cycle II:
{% highlight C++ %}
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        ListNode *fast  = head;
        ListNode *slow  = head;
        while (fast != NULL && fast -> next != NULL) {
            fast = fast -> next -> next;
            slow = slow -> next;
            if (fast == slow)
                break;
        }
        if (fast == NULL || fast -> next == NULL)
            return NULL;
        
        slow = head;
        while (slow != fast) {
            slow = slow -> next;
            fast = fast -> next;
        }
        return slow; 
    }
};
{% endhighlight %}
