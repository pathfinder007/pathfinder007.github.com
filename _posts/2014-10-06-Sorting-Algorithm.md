---
layout: post
title: "Sorting algorithm"
description: "Summary of sorting algorithm, implement in C++"
modified: 2014-10-06
category: Algorithm
tags: Algorithm
image:
  feature: abstract-2.jpg
comments: true
share: true
---

### The first article, setup my blog.
&emsp;&emsp;之前一直有想法，搭一个独立博客，记录一下学习所得，顺便分享一些旅途中的经历，却一直没有下定决心。想着很多原来学习过程中总结过的东西，后来慢慢都丢了，未免有些遗憾。其实前几年还是挺喜欢写文章的，大都发布在各种社交网络，渐渐荒废。域名挑了个 lambda， 一则，这是希腊希腊字母，多年过去，我还是喜欢个性；二则，lambda象形所代表的孤独，低调，正应了了我的追求。是以为域名。

<!--more-->

### 几个概念
* 内排序：在排序过程中，待排序的所有记录全部被放置在内存中。
* 外排序：由于排序记录个数太多，不能同时放置在内存中，整个排序过程需要在内外存之间多次交换数据才能进行。
* 内排序算法分类：(依据排序过程中借助的主要操作)，插入排序, 交换排序, 选择排序, 交换排序。
* 复杂度为n**2：冒泡排序， 简单选择排序， 直接插入排序
* 复杂度为n**3/2：希尔排序
* 复杂度为nlogn：堆排序， 归并排序， 快速排序

### 冒泡排序

#### 排序方法
* 初始：R[1..n]为无序区
* 第一趟扫描：依次比较(R[n]，R[n-1])，(R[n-1]，R[n-2])，…，(R[2]，R[1])；对于每对气泡(R[j+1]，R[j])，若
R[j+1].key<R[j].key，则交换R[j+1]和R[j]的内容。第一趟扫描完毕，关键字最小的记录被放在最高位置R[1]上
* 第二趟扫描：扫描R[2..n]，扫描完毕时，“次轻”的气泡漂浮到R[2]的位置上，最后经过n-1趟扫描，得到有序区R[1..n]
* 小改进：若在某一趟排序中，未发现气泡位置的交换，则说明排序完毕。为此，可以引入一个布尔量exchange，每次排序开始前，
置为false，若排序过程中发生了交换，置为true，每趟排序结束检查exchange，若为false，则终止算法；否则继续。 

完整代码:
{% highlight C++ %}
void BubbleSort(int *list, int len) {
	int i, j, temp;
	int flag = 1;
	for(i = 0; i < len && flag; i++) {
		flag = 0;
		for(j = len; j > i; j--) {
			if(list[j-1] > list[j]) {
				temp = list[j-1];
				list[j-1] = list[j];
				list[j] = temp;
				flag = 1;
			}
		}
	}
}
{% endhighlight %}

### 简单选择排序

#### 排序方法
* 冒泡排序需要不断交换元素位置，交换函数经常使用，封装成函数调用，函数调用需要压栈弹栈，时间开销大。
而选择排序找到合适的关键字再做交换，移动一次就能完成相应关键字排序定位。

完整代码：
{% highlight C++ %}
void SelectSort(int *list, int len) {
    int i, j, temp, min;
    for(i = 0; i < len; i++) {
        min = i;
        for(j = i+1; j < len; j++) {
            if(list[j] < list[min]) {
                min = j;
            }   
        }       
        if(i != min) { 
            temp = list[i];
            list[i] = list[min];
            list[min] = temp;
        }
    }
}
{% endhighlight %}

### 直接插入排序

#### 排序方法
* 每次将一个待排序的记录，按其关键字大小插入到前面已经排好序的子序列中适当位置，直到全部记录插入完成。
* 设数组为a[0..n-1], 初始时，a[0]自成有序区；将a[i]并入a[0..i-1]形成a[0..i]的有序区间。

完整代码：
{% highlight C++ %}
void InsertSort(int *list, int len) {
	int i, j, temp;
	for(i = 1; i < len; i++) {
		if(list[i] < list[i-1]) {
			temp = list[i];
			for(j = i-1; j >= 0 && list[j] > temp; j--)
				list[j+1] = list[j];
			list[j+1] = temp;
		}
	}
}
{% endhighlight %}

### 希尔排序

#### 排序方法
* 实质是分组插入排序，又称为缩小增量排序，先将整个待排元素序列分割成若干子序列（由相隔某个增量的元素组成），
分别进行直接插入排序。待整个序列中元素基本有序（增量足够小），再对全体元素进行直接插入排序，在元素基本有序
的情况下，直接插入排序效率很高。
* R = [49, 38, 65, 97, 26, 13, 27, 49, 55, 4]，第一次gap为10 / 2 = 5，将数组分为5组，(49, 13), (38, 27)...
分组后为(13, 49), (27, 38)...
* R = [13, 27, 49, 55, 4, 49, 38, 65, 97, 26]，第二次gap为5 / 2 = 2，将数组分为2组，(13, 49, 4...)，(27, 55, 49...)，
进行直接插入排序后为：R = [4, 26, 13, 27, 38, 49, 49, 55, 97, 65]
* 第三次gap = 1，进行最后一次插入排序，得最终序列。

完整代码：
{% highlight C++ %}
void ShellSort(int *list, int len) {
	int i, j, temp, gap;
	for(gap = len / 2; gap > 0; gap /= 2)
		for(i = 0; i < gap; i++) {
			for(j = gap; j < len; j+=gap)
				if(list[j] < list[j-gap]) {
					int temp = list[j];
					int k = j - gap;
					while(k >= 0 && list[k] > temp) {
						list[k + gap] = list[k];
						k -= gap;
					}
					list[k + gap] = temp;
				}	
		}
}
{% endhighlight %}

### 堆排序

#### 相关知识
* 堆的概念：每个结点的值都大于或者等于其左右孩子结点的值，称为大顶堆；反之，小于或者等于，则为小顶堆。
* 堆的存储：数组存储，i结点的父结点下标为(i-1)/2，左右结点下标为2*i+1, 2*i+2.
* 堆的建立：数组具有对应树的表示形式，通过重新排列元素，可以建立一棵堆化的树。
* 插入元素：新元素加入表层，随后树被更新以恢复堆次序。每次插入都将元素放在数组末尾，由于新数据的父节点
到根结点为一个有序数列，故可以使用直接插入排序将该新数据并入有序区间中。
* 删除元素：删除总是发生在A[0]处，表中最后一个元素被用来填补空缺位置，结果树被更新以恢复堆条件。
* 堆排序：将数组堆化后，堆中0号元素是堆中最小元素，取出该元素再执行下堆的删除操作。实际实现上，堆用数组
模拟，故堆化数组后，第一次将A[0]与A[n-1]交换，再对A[0..n-2]恢复堆，第二次将A[0]与A[n-2]交换，再对A[0..n-3]
恢复堆，重复直到A[0]与A[1]作交换，故操作完成后整个数组有序。

#### 插入元素
{% highlight C++ %}
void MinHeapFixup(int *list, int i) {
    int j = (i - 1) / 2;
    int temp = list[i];
    while(j >= 0 && i != 0) {
        if(list[j] <= temp)
            break;
        list[i] = list[j];
        i = j;
        j = (i - 1) / 2;
    }
    list[i] = temp;
}
{% endhighlight %}

#### 删除元素
按定义，每次都只能删除第0个数据。为了便于重建堆，将最后一个数据的值赋给根结点，然后再从根结点开始进行一次
从上向下的调整。调整时先在左右儿子结点中找最小的，如果父结点比这个最小的子结点还小说明不需要调整了，反之
将父结点和它交换后再考虑后面的结点。相当于从根结点将一个数据的“下沉”过程。

{% highlight C++ %}
void MinHeapFixdown(int a[], int i, int n)
{
    int j, temp;
	temp = a[i];
	j = 2 * i + 1;
	while (j < n)
	{
		if (j + 1 < n && a[j + 1] < a[j])
			j++;

		if (a[j] >= temp)
			break;

		a[i] = a[j];
		i = j;
		j = 2 * i + 1;
	}
	a[i] = temp;
}
{% endhighlight %}

#### 堆化数组
{% highlight C++ %}
void MakeMinHeap(int a[], int n) {  
    for (int i = n / 2 - 1; i >= 0; i--)  
        MinHeapFixdown(a, i, n);  
}  
{% endhighlight %}

#### 排序方法
{% highlight C++ %}
void MinheapsortTodescendarray(int a[], int n)  
{  
    for (int i = n - 1; i >= 1; i--)  
    {  
        Swap(a[i], a[0]);  
        MinHeapFixdown(a, 0, i);  
    }  
}    
{% endhighlight %}

### 归并排序

#### 相关知识
* 利用分治法的思想实现排序，假设初始序列含有n个记录，则可以看作n个有序子序列，每个长度为1，
然后两两归并，得到n/2个长度为2或1的有序子序列，再两两归并，直到得到长度为n的有序序列。
* 可以有递归，非递归两种实现。

递归实现代码：

两个子序列归并操作：
{% highlight C++ %}
void MergeArray(int *list, int first, int mid, int last, int *temp) {
	int i = first, j = mid + 1;  
    int m = mid,   n = last;  
    int k = 0;    
    while (i <= m && j <= n)  
    {  
        if (list[i] <= list[j])  
            temp[k++] = list[i++];  
        else  
            temp[k++] = list[j++];  
    }  
    while (i <= m)  
        temp[k++] = list[i++];  
      
    while (j <= n)  
        temp[k++] = list[j++];  
      
    for (i = 0; i < k; i++)  
        list[first + i] = temp[i];  
} 
{% endhighlight %}

递归调用：
{% highlight C++ %}
void MergeSort(int *list, int first, int last, int *temp) {
	if (first < last)  
    {  
        int mid = (first + last) / 2;  
        MergeSort(list, first, mid, temp);
        MergeSort(list, mid + 1, last, temp);
        MergeArray(list, first, mid, last, temp);
    } 
	else
		temp[first] = list[first]; 
}
{% endhighlight %}

* 时间复杂度：每趟归并需要把有序序列进行两两归并，耗费O(n)时间，由完全二叉树深渡为logn,故
时间复杂度为nlogn
* 空间复杂度：归并过程中需要与原始记录序列同样数量的存储空间存放归并结果以及递归时深度为logn
的栈空间，空间复杂度为n+logn.

非递归实现归并排序：
* 递归过程是将待排序集合一分为二，直至排序集合就剩下一个元素位置，然后不断的合并两个排好序的数组。
* 非递归思想为，将数组中的相邻元素两两配对。用merge函数将他们排序，构成n/2组长度为2的排序好的子数组段，
然后再将他们排序成长度为4的子数组段，如此继续下去，直至整个数组排好序。

具体代码实现：
{% highlight C++ %}
void MergeSort2(int *list, int first, int last, int *temp, int len) {
    int s = 2;
    int i;
    while (s <= len) {
        i = 0;
        while (i + s <= len) {
            MergeArray (list, i, i+s/2-1, i+s-1, temp);
            i += s;
        }
        MergeArray (list, i, i+s/2-1, len-1, temp);
        s *= 2;
    }
    MergeArray (list, 0, s/2-1, len-1, temp);
}
{% endhighlight %}


### 快速排序

#### 相关知识
* 先从数列中取出一个数作为基准数；分区过程，将比其大的数放在右边，小的数放在左边。
* 再对左右空间重复此操作，直到各区间只有一个数。

#### 算法实现
* 从j开始向前找一个比X小或等于X的数。符合条件，挖出再填到上一个坑a[0]，i++;  这样一个坑a[0]就被搞定了，
但又形成了一个新坑，这次从i开始向后找一个大于X的数，符合条件，挖出再填到上一个坑中a[8]=a[3]; j--;
* 重复上面的步骤，先从后向前找，再从前向后找，最后将X填入最后一个坑中。

具体代码实现：

归并过程：
{% highlight C++ %}
int AdjustArray(int *list, int l, int r) {
	int i = l, j = r;
	int x = list[l];
	while (i < j) {
		while(i < j && list[j] >= x) 
			j--;  
		if(i < j) {
			list[i] = list[j]; 
			i++;
		}

		while(i < j && list[i] < x)
			i++;  
		if(i < j) {
			list[j] = list[i];
			j--;
		}
	}
	list[i] = x;
	return i;
}
{% endhighlight %}

递归过程：
{% highlight C++ %}
void QuickSort(int *list, int l, int r) {
	if (l < r) {
		int i = AdjustArray(list, l, r);
		QuickSort(list, l, i - 1); 
		QuickSort(list, i + 1, r);
	}
}
{% endhighlight %}

###Reference.
&emsp;&emsp;本文参考了&emsp;[结构之法 算法之道](http://blog.csdn.net/v_JULY_v) &emsp;以及 &emsp;[More Windows Blog](http://blog.csdn.net/morewindows/article) &emsp;的几篇文章，在此表示感谢。
