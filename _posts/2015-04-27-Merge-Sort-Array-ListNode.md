---
layout: post
category: Algorithm
title: 基于数组与链表的归并排序算法实现 
tags: Algorithm Interview
---


&emsp;&emsp;这两天在写链表相关的题目，不少数组操作，将数据结构换成链表之后，都会比较难以处理，主要是单向链表，没有了反向的指针，其实数组，可以将其与双向链表对应上。早上在写一个链表归并排序的题目，一直`runtime error`，很是头疼。故将数组、链表的归并排序递归以及非递归实现，做一个整理。

<!--more-->

&emsp;&emsp;我们都知道，归并排序是典型的时间复杂度为O(nlogn)的算法，而且算法时间复杂度很稳定，无论是平均复杂度还是最差时间复杂度，都是O(nlogn)，而虽然C++模版封装的很多排序算法都机遇快速排序，但是快速排序其实是不稳定的算法，一则元素的相对位置，在排序前后是不确定的（针对相同元素，划分元素随机选择的情况），而且元素基本有序的情况下，快速排序的时间复杂度会逼近O(n^2).

&emsp;&emsp;由于归并排序涉及循环的切分待排序数组，直到每组剩下一个/两个元素，因此递归实现是很直接的思路，但是涉及到logn层的递归，因此递归栈需要浪费O(logn)的stack空间，而非递归实现，就不存在这个问题，只需要浪费O(1)的空间。其中递归为自顶向下的方式，而非递归循环实现为自底向上的方式。
 
### 1. 数组的归并排序 
 
#### 1.1 基于数组的递归实现：

{% highlight C++ %}
void mergeArray(int num[], int start, int mid, int end, int tmp[]) {
    int i = start, j = mid+1;
    int k = 0;
    while (i <= mid && j <= end) {
        tmp[k++] = (num[i] < num[j]) ? num[i++] : num[j++];
    }
    
    while (i <= mid) {
        tmp[k++] = num[i++];
    }
    
    while (j <= end) {
        tmp[k++] = num[j++];
    }
    for (int i = 0; i < k; ++i) {
        num[start+i] = tmp[i];
    }
}

void mergeSort(int num[], int start, int end, int tmp[]) {
    if (start < end) {
        int mid = (start + end) >> 1;
        mergeSort(num, start, mid, tmp);
        mergeSort(num, mid+1, end, tmp);
        mergeArray(num, start, mid, end, tmp);
    }
}
{% endhighlight %}

<br />

#### 1.2 基于数组的非递归循环实现：

{% highlight C++ %}
int merge2(int num[], int lo, int hi, int step, int tmp[], int start)
{
    int i = lo, j = hi;
    int k = 0;
    while (i < lo+step && j < hi+step) {
        tmp[start+(k++)] = (num[i] < num[j]) ? num[i++] : num[j++];
    }
    
    while (i < lo+step) {
        tmp[start+(k++)] = num[i++];
    }
    
    while (j < hi+step) {
        tmp[start+(k++)] = num[j++];
    }
    
    for (int i = 0; i < k; ++i) {
        num[start+i] = tmp[start+i];
    }
    return  start+k;
}

void mergeSort2(int num[], int n, int tmp[]) {
    int cur, lo, hi;
    for (int step = 1; step < n; step <<= 1) {
        int start = 0;   //  注意这里
        cur = 0;
        while (cur < n) {
            lo = cur;
            hi = cur + step;
            cur = hi + step;
            start = merge2(num, lo, hi, step, tmp, start);
        }
    }
}
{% endhighlight %}

<br />

### 2. 链表的归并排序 

#### 2.1 基于链表的递归实现：

{% highlight C++ %}
//使用快速或者归并排序，主要问题是不能有反向指针。但是未必需要反向指针，归并排序的思想即先分割成
 //最小粒度，即一个或者两个一组，再逐渐增大粒度进行排序。
 
class Solution {
public:
    ListNode *merge(ListNode *h1, ListNode *h2) {
        if (h1 == NULL)
            return h2;
        if (h2 == NULL)
            return h1;
            
        if (h1 -> val < h2 -> val) {
            h1 -> next = merge(h1 -> next, h2);
            return h1;   
        }
        else { 
            h2 -> next = merge(h1, h2 -> next);
            return h2;
        }
    }

    ListNode* sortList(ListNode* head) {
        if (head == NULL || head -> next == NULL)
            return head;
            
        ListNode *p1  = head;
        ListNode *p2  = head;
        ListNode *pre = head;
        
        while (p2 != NULL && p2 -> next != NULL) {
            pre = p1;
            p1  = p1 -> next;
            p2  = p2 -> next -> next;
        }
        pre -> next = NULL;
        
        ListNode *h1 = sortList(head);
        ListNode *h2 = sortList(p1);
        
        return merge(h1, h2);
    }
};

{% endhighlight %}

<br />

#### 2.2 基于链表的非递归循环实现：

{% highlight C++ %}
class Solution {
public:
    ListNode *merge(ListNode *h1, ListNode *h2, ListNode *tail) {
        while (h1 && h2) {
            if (h1 -> val < h2 -> val) {
                tail -> next = h1;
                tail = tail -> next;
                h1 = h1 -> next;
            }
            else {
                tail -> next = h2;
                tail = tail -> next;
                h2 = h2 -> next;
            }
        }
        tail -> next = (h1 == NULL) ? h2 : h1;
        while (tail -> next != NULL)
            tail = tail -> next;
        return tail;
    }
    
    ListNode *split(ListNode *head, int step) {
        for (int i = 1; i < step && head; ++i) {
            head = head -> next;
        }
        if (head == NULL)
            return NULL;
            
        ListNode *p2 = head -> next;
        head -> next = NULL;
        return p2;
    }

    ListNode* sortList(ListNode* head) {
        if (head == NULL || head -> next == NULL)
            return head;
         
        int len = 0;
        ListNode *cur = head;
        while (cur) {
            len ++;
            cur = cur -> next;
        }
        
        ListNode *lo;
        ListNode *hi;
        ListNode *preHead = new ListNode(-1);
        preHead -> next = head;
        ListNode *tail = preHead;
        
        for (int step = 1; step < len; step <<= 1) {
            cur = preHead -> next;
            tail = preHead;
            while (cur) {
                lo   = cur;
                hi   = split(cur, step);  //返回的是第二段
                cur  = split(hi, step);    //此时将第二段从原链表上取下来
                tail = merge(lo, hi, tail);
            }    
        }
        return preHead -> next;
    }
};
{% endhighlight %}
