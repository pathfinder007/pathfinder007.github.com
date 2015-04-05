---
layout: post
category: Python
title: Python Multiprocessing没有子进程通信的多进程操作
tags: Python
---

&emsp;&emsp;最近在写Python代码，程序主要就是涉及大文件的IO以及处理。当时在Mac上跑，自己即使的手动释放一下内存，还勉强可以跑，Mac的Swap比较大，虚拟内存用到16个G左右。而再移到台式机上面跑，8G的内存，不久就MemoryError了，怀疑是当时装系统时候设置的Swap太小的缘故。单进程/线程都不堪重负，更别说使用多进程来加速了。想到了邱大神在服务器上面开的100G内存的虚拟机，很久不用了，遂把代码扔上去，顺便稍微把代码用简单的多进程操作简单加了加速。

<!--more-->

### 1. 并行处理同一个任务
&emsp;&emsp;python的一个标准库，提供了Pool对象，通过进程池对象来管理和创建多个进程的worker，并收集这些worker返回的结果。使用Process类创建多个进程对象，并用start方法启动该进程；而join操作，可以阻塞进程，即该进程执行返回之后，再往下执行。

{% highlight Python %}
from multiprocessing import Process

class MultiProcess(object):
	target = []
	args   = []
	
	def __init__(self, tar, arg):
		self.target = tar
		self.args   = arg

	def multi_processing(sekf):
		jobs = []
		process_num = len(self.target)
		for i in xrange(process_num):
			p = multiprocessing.Process(target = self.target[i], args = self.args[i])
			jobs.append(p)
			p.start()
{% endhighlight %}

&emsp;&emsp;在程序中，主要涉及到，对某一个大文件，读入内存后，需要反复的遍历矩阵，而多次的遍历操作之间并没有数据依赖，可以据此，将多个任务分配到不同CPU上，并行操作，大大降低了无谓的时间消耗。



### 2. 共同完成同一个任务

&emsp;&emsp;为了更快的速度对一个大文件进行处理，可以多进程分块读取、处理一个文件。这时候，需要涉及到锁的使用，即保证每一个操作，都是原子操作。

{% highlight Python %}
import urlparse
import datetime
import os
from multiprocessing import Process, Queue, Array, RLock

WORKERS = 4
BLOCKSIZE = 0
FILE_SIZE = 0
FILE_NAME = '../data/tianchi_mobile_recommend_train_user.csv'
 
def getFilesize(file):
    """
        获取要读取文件的大小
    """
    global FILE_SIZE
    fstream = open(file, 'r')
    fstream.seek(0, os.SEEK_END)
    FILE_SIZE = fstream.tell()                                                                                                    
    fstream.close()

def process_found(pid, array, file, rlock):
    global FILE_SIZE
    global JOB
    global PREFIX
    """
        进程处理
        Args:
            pid  : 进程编号
            array: 进程间共享队列，用于标记各进程所读的文件块结束位置
            file : 所读文件名称
        各个进程先从array中获取当前最大的值为起始位置startpossition
        结束的位置endpossition (startpossition+BLOCKSIZE) if (startpossition+BLOCKSIZE)<FILE_SIZE else FILE_SIZE
        if startpossition==FILE_SIZE则进程结束
        if startpossition==0则从0开始读取
        if startpossition!=0为防止行被block截断的情况，先读一行不处理，从下一行开始正式处理
        if 当前位置 <= endpossition 就readline
        否则越过边界，就从新查找array中的最大值
    """
    fstream = open(file, 'r')
     
	while True:
        rlock.acquire()
        print 'pid%s' % pid, ','.join([str(v) for v in array])
        startpossition = max(array)            
        endpossition = array[pid] = (startpossition+BLOCKSIZE) if (startpossition+BLOCKSIZE)<FILE_SIZE else FILE_SIZE
        rlock.release()
         
        if startpossition == FILE_SIZE:  #end of the file
            print 'pid%s end' %(pid)
            break
        elif startpossition != 0:
            fstream.seek(startpossition)
            fstream.readline()
        pos = ss = fstream.tell()
        ostream = open('../proc_data/tmp_pid' + str(pid) + '_jobs' + str(endpossition), 'w')
        while pos < endpossition:
            #处理line
            line = fstream.readline()                        
            ostream.write(line)
            pos = fstream.tell()
 
        print 'pid: %s, startposition: %s, endposition: %s, pos: %s' %(pid, ss, pos, pos)
        ostream.flush()
        ostream.close()
        ee = fstream.tell()        
 
    fstream.close()

def main():
    global FILE_SIZE
    print datetime.datetime.now().strftime("%Y/%d/%m %H:%M:%S") 
     
    file = FILE_NAME
    getFilesize(file)
    print FILE_SIZE
     
    rlock = RLock()
    array = Array('l', WORKERS, lock=rlock)
    threads = []
    for i in range(WORKERS):
        p = Process(target = process_found, args = [i, array, file, rlock])
        threads.append(p)
 
    for i in range(WORKERS):
        threads[i].start()
     
    for i in range(WORKERS):
        threads[i].join()
 
    print datetime.datetime.now().strftime("%Y/%d/%m %H:%M:%S") 
 
if __name__ == '__main__':
    main()              
{% endhighlight %}

&emsp;&emsp;网上博客的代码，回头改成多进程分块读取一个文件，处理，再写入一块大内存的实现。由于是多进程分块处理，最好是不让多个进程竞争IO资源，则可以将每一块对应放到内存的一块地方，将这些内存块收集了，再输出文件。牺牲一些时间的情况下，尽可能减少进程切换带来的各种问题。


