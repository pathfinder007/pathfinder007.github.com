---
layout: post
title: "Linux Device Driver——内存分配"
description: "Linux Device Driver 3rd阅读笔记（关于内存分配）"
modified: 2014-11-24
category: Linux_Kernel
tags: Linux_Kernel
comments: true
share: true
---

### 1. kmalloc：
* 不清零获得的内存，分配的区在物理内存中连续；`void *kmalloc(size_t size, int flags)`;size为分配块的大小，flags为分配标志；
*  flags：GFP_KERNEL 分配代表运行在内核空间的进程进行，意味着调用函数代表一个进程执行一个系统调用，能够使当前进程在少内存情况下睡眠等待一页；内部通过调用`__get_free_pages`进行；
* 如果一个模块需要分配大块内存，最好使用面向页的技术；`__get_free_page(unsigned int flags)`;返回一个指向新页的指针，不清零该页；
* flags：GFP_ATOMIC kmalloc从一个进程上下文外部调用时，当前进程不被睡眠，内核试图保持一些空闲页满足原子的分配；
* Linux内核内存区：支持DMA操作内存区、普通内存、高端内存；
* 支持DMA操作内存区位于一个优先的地址范围，外设可以在此进行DMA存取，大部分健全平台，所有内存都在该区，在x86，DMA区在RAM的
*  前16MB。
* kmalloc和__get_free_pages返回的内存地址是虚拟地址，实际物理地址寻址仍然由MMU管理；

<!--more-->

### 2. vmalloc：
* 在虚拟内存空间分配一块连续内存区，尽管这些页在物理内存不连续，内核将其看作连续的地址范围；使用alloc_page调用获得每个页；
* vmalloc分配的地址只有在处理器的MMU之上才有意义，当驱动需要一个真正的物理地址时，无法使用vmalloc；只有在为一个大的只存在于软件中的顺序缓冲分配内存时，调用vmalloc，vmalloc比__get_free_pages开销更大，因为必须获取内存并建立页表；
* ioremap建立新页表，实际上不分配任何内存；返回值是一个特殊的虚拟地址，可以存取特定物理地址范围；虚拟地址最终通过iounmap释放；
* ioremap对于映射一个PCI缓冲的物理地址到虚拟内核空间；

### 3. 获得大空间的缓冲区：
* 大量连续内存缓冲区的分配容易失败，系统内存长时间会碎片化，常常出现真正的大内存区不可得；
* 如果需要一个物理上连续的大空间内存缓冲区，最好启动时请求内存进行分配，只有直接链接到内核的驱动可以这样做；

### 4. 与硬件通讯：
* 驱动是软件概念和硬件电路之间的抽象层，需要存取I/O端口和I/O内存；
* 数字I/O是一个输入/输出打开的最简单形式，写到设备的数据出现在输出管脚，处理器可以直接存取到输入管脚上的电平；
* PC通过读写外设的寄存器进行控制操作；一个设备的若干寄存器位于连续地址；
* 硬件级别上，内存区域和I/O区域没有概念上的区别，都通过在地址总线和控制总线发出信号来存取；
* 大部分PCI设备映射寄存器到一个内存地址区域，这种I/O存取内存更加有效；

### 5. 使用I/O端口：
* I/O端口是驱动跟设备通讯的方法，内核提供注册接口以允许去东莞声明需要的端口；接口中核心函数是request_region;
* struct resource *request_region(unsigned long first, unsigned long n, const char *name);
* 该函数告诉内核，要使用n个端口，从first开始，name参数是设备名，分配成功则返回非NULL；
* 驱动为硬件请求了需要使用的I/O端口范围之后，必须读/写到这些端口，

### 6. 使用I/O内存：
* 尽管I/O端口在x86世界流行，但设备通讯的主要机制是通过寄存器和设备内存的映射实现，即I/O内存，寄存器和内存之间的区别对软件透明；
* I/O内存是一个RAM区域，处理器使用I/O内存跨过总线存取设备；     
* 当处理器通过页表存取I/O内存，内核必须首先安排驱动可见的物理地址，即I/O操作之前调用ioremap做映射；
* 使用I/O内存区之前进行分配：struct resource *request_mem_region(unsigned long start, unsigned long len, char *name);
* 该函数分配一个len字节内存区；使用完毕调用release_mem_region进行释放；
* 不能直接引用从ioremap返回返回的地址指针，应当使用内核提供的存取函数进行I/O内存的存取：I/O读：unsigned int ioread8(void *addr); ioread16; ioread32; addr是从ioremap获得的地址，返回值从给定I/O内存读取；I/O写：void iowrite8(u8 value, void *addr); iowrite16; iowrite32;

### 7. 中断处理：
* 驱动只需要为其设备注册一个中断处理函数，中断到来时进行正确处理；
* 中断线资源有限，一个模块需要注册中断通道，不使用时进行释放；int request_irq(unsigned int irq, irqreturn_t (*handle)(int, void *, struct pt_regs *), unsigned long flags, const char *dev_name, void *dev_id);

### 8. 可移植性：
* 通常的C数据类型如int、long，在不同体系上大小不同；内核中经常使用的数据类型有自己的typedef语句，阻止了任何可移植性的问题；
* 使用内存时，一个内存页应该是PAGE_SIZE字节，不是4KB，页大小根据平台有4KB~64KB的可能性；
