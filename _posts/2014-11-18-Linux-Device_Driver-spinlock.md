---
layout: post
title: "Linux Device Driver——并发和竞争"
description: "Linux Device Driver 3rd阅读笔记（关于锁以及信号量机制）"
modified: 2014-11-18
category: Linux_Kernel
tags: Linux_Kernel
comments: true
share: true
---

### 1. 并发和竞争
* 实际产生竞争的情况
{% highlight C++ %}
       if (!dptr -> data[s_pos]) {
              dptr -> data[s_ops] = kmalloc(quantum, GFP_KERNEL);
              if (!dptr -> data[s_pos])
                   goto out;
         }
{% endhighlight %}         
* 假设两个进程（A，B）独立地试图写入同一个设备的相同偏移，进程同时到达if测试，如果被测试指针为NULL，每个进程都会决定分配内存且复制给dptr -> data[s_ops]，显然只会有一个赋值可以成功；
* 如果A先赋值，则将被B覆盖，结果指针指向B分配的内存，而A分配的内存被丢掉，但是并没有返回给系统，产生了内存泄漏；
* 并发源：多个用户空间进程的运行；SMP系统能够同时在多个处理器上执行代码；内核代码抢占，驱动代码可能在任何时间失去处理器；设备中断，内核中延迟代码执行的机制等；
* 竞争来自对资源的共享存取，驱动设计时，应该避免共享的资源，比如全局变量的使用；

<!--more-->

### 2. 信号量（旗标）
* 加锁，保证数据结构操作原子化；如果一个线程必须分配一个特殊内存块，这个分配必须在其他线程做测试之前，必须建立临界区，在任何给定时间只有一个线程可以执行代码；
* 一个Linux进程到达一个无法做进一步处理的地方时，阻塞，让出处理器直到某个时间被唤醒，进程通常在等待I/O完成时睡眠；
* 旗标：旗标是一个整数值，结合有一对函数，P和V。一个想要进入临界区的进程将在相关旗标上调用P，如果旗标值大于0，值减1且进程继续；如果旗标为0，进程必须等待别人释放旗标；解锁一个旗标通过调用V完成，递增旗标值，唤醒等待进程；
* 当旗标用作互斥，即阻止多个进程在同一临界区运行，值初始化为1。如此旗标在任何时候只能由单一进程或者线程持有。以这种方式持有旗标称为互斥锁，Linux中的旗标通常用作互斥锁；
* 旗标相关数据类型：struct semaphore；通常通过void sema_init(struct semaphore *sem, int val)对其初始化；
* 简化操作，互斥锁的声明和初始化：DECLARE_MUTEX(name); 将旗标变量初始化为1，也可以用于显示解锁；DECLARE_MUTEX_LOCKED(name);将旗标变量更改为0，即上锁状态；
* 在运行时间初始化：void init_MUTEX(struct semaphore *sem); void init_MUTEX_LOCKED(struct semaphore *sem);
* P函数称为down，3个版本，包括int down_interruptible(struct semaphore *sem);递减旗标并等待需要的时间；
* V函数为up，void up(struct semaphore *sem);up函数被调用，则调用者不再拥有旗标；

### 3. 自旋锁
* 大部分加锁通过自旋锁机制实现，自旋锁可以用在不能睡眠的代码中，例如中断处理；
* 一个自旋锁是一个互斥设备，只能有两个值，上锁和解锁；上锁，则代码进入临界区；如果该锁被别人获得，代码进入循环并反复检查该锁，直到可用，该循环即自旋锁的自旋部分；
* “测试并置位”操作必须以原子方式进行，以便只有一个进程能获得锁；必须避免在超线程处理器上死锁——实现多个虚拟CPU以共享一个单处理器核心和缓存的芯片；特性上说，自旋锁使用在SMP处理器上；
* 运行时初始化自旋锁：void spin_lock_init(spinlock_t *lock); 进入临界区之前获得锁：void spin_lock(spinlock_t *lock);
* 所有的自旋锁等待都是不可中断的，一旦调用spin_lock，将自旋到锁变为可用为止；释放一个锁：void spin_unlock(spinlock_t *lock);
* 自旋锁核心规则：在持有锁时，是原子性的，不能睡眠；不能因为任何原因放弃处理器，除了服务中断；当驱动请求自旋锁并进入临界区，中间某处驱动失去了处理器（调用copy_from_user使进程睡眠或者内核抢占），可见的将来该锁都不可能释放，某个别的进程想获得同一个锁，则最好情况下会等待很长时间，最坏情况系统可能完全死锁；
* 必须一直是尽可能短时间持有，确保其他进程自旋等待释放锁的时间不会太长；长时间自旋也阻止了当前处理器调度，高优先级进程不得不等待；

### 4. 信号量与自旋锁
* 信号量和读写信号量适合于保持时间较长的情况，它们会导致调用者睡眠，因此只能在进程上下文使用（因为中断的上下文不允许休眠） 
* 自旋锁适合于保持时间非常短的情况，因为一个被争用的自旋锁使得请求它的线程在等待重新可用时自旋，特别浪费处理时间，所以自旋锁不应该 被长时间持有。
* 如果被保护的共享资源只在进程上下文访问，使用信号量保护该共享资源非常合适；如果对共享资源的访问时间非常短，自旋锁也可以。但是如果被保护的共享资源需要在中断上下文访问（包括底半部即中断处理句柄和顶半部即软中断），就必须使用自旋锁。

