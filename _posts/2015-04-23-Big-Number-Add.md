---
layout: post
category: Algorithm
title: 链表表示的大数加法 
tags: Algorithm Interview
---

&emsp;&emsp; 来自企鹅的题目，大数加法，两个单向链表，未知长度，不能将链表翻转、不能使用数组，不能修改链表，需要O(n)的时间复杂度。

&emsp;&emsp;大数加法的变种，一般都以数组/链表的形式出现。主要是进位的处理。对这一题来说，比较麻烦的就是，数据的高位在链表头位置，而链表只能通过头指针进行遍历。不能使用一个stack，先遍历链表，将各个节点入栈，然后依次出栈并相加。不能使用数组，即限制了这种方法的使用。

<!--more-->

&emsp;&emsp;题目的难点主要在于两个节点和为9时候的处理。我们知道，两个一位整数相加，考虑上一位的进位，向前的进位也只能是0或者1两种情况，考虑类似`34567+65433`的case，后面往前的进位，会影响每一位的结果。因此需要着重考虑的就是某一对应位的两个节点和为9的情况，很可能需要再做特殊处理。可以记录第一个为9的节点，当在后面发现有进位，则从该节点开始，再往后调整各位的情况，直到发生进位的节点。

<br />

### 1. ListNode结构体
<br />
{% highlight C++ %}
struct ListNode {
	int val;
  	ListNode *next;
  	ListNode(int x): val(x), next(NULL) {}
};
{% endhighlight %}

<br />

### 2. 新建链表
<br />
{% highlight C++ %}
ListNode *buildListNode(int vals[], int n) {
  	ListNode *head  = new ListNode(vals[0]);
  	ListNode *ptr   = head;
  	for (int i = 1; i < n; ++i) {
    	ListNode *node = new ListNode(vals[i]);
    	ptr -> next = node;
    	ptr = ptr -> next;
  	}
  	return head;
}
{% endhighlight %}

<br />

### 3. 链表表示的大数相加，head节点为高位
<br />
{% highlight C++ %}
ListNode *BigNumberAdd(ListNode *head1, ListNode *head2) {
    if (head1 == NULL) return head2;
    if (head2 == NULL) return head1;
   
    int len1 = 0, len2 = 0;
    ListNode *lNum = head1, *sNum = head2;
    
    while (lNum != NULL) {
        len1 ++;
        lNum = lNum -> next;
    }
    while (sNum != NULL) {
        len2 ++;
        sNum = sNum -> next;
    }

    int delta = abs(len1 - len2);

    lNum = (len1 > len2) ? head1 : head2;
    sNum = (len1 > len2) ? head2 : head1;
    
    ListNode *head = new ListNode(lNum->val);
    ListNode *ptr  = head;
    lNum = lNum -> next;
    
    while (delta > 1) {
        ListNode *node = new ListNode(lNum->val);
        ptr -> next = node;
        ptr = ptr -> next;
        lNum = lNum -> next;
        delta --;
    }

	ListNode *ninePrev;
    ListNode *prev;
    bool flag = false;
    int locSum;                                                                                                                   
    int carry;
    
    while (lNum != NULL) {
        locSum = lNum->val + sNum->val;
        ListNode *sumNode = new ListNode(locSum);
        prev = ptr;
        ptr->next = sumNode;
        ptr = ptr->next;

        if (locSum == 9 && !flag) {
            ninePrev = prev;
            flag = true;
        }
        else if (locSum < 9) {
            flag = false;
            ninePrev = NULL;
        }
        else if (locSum > 9) {
            if (ninePrev != NULL) {
                ninePrev->val += 1;
                ninePrev = ninePrev->next;
                while (ninePrev != ptr) {
                     ninePrev->val = 0;
                     ninePrev = ninePrev->next;
                }
                ninePrev = NULL;
                flag = false;
            }
            else {
                carry = locSum / 10;
                prev->val += carry;
            }
            locSum = locSum % 10;
            ptr->val = locSum;
        }
        lNum = lNum->next;
        sNum = sNum->next;
    }
    return head;
}
{% endhighlight %}

<br />