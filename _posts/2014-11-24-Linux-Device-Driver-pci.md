---
layout: post
title: "Linux Device Driver——内存分配"
description: "Linux Device Driver 3rd阅读笔记（PCI驱动基础）"
modified: 2014-11-24
category: Linux_Kernel
tags: Linux_Kernel
image:
  feature: abstract-1.jpg
comments: true
share: true
---

### PCI接口：
* PCI总线通过使用比ISA更高的时钟频率，获得更好的性能；时钟设置运行在25或者33MHz、66MHz甚至133MHz；
* PCI对接口板自动探测，没有跳线，并且在系统启动时自动配置；设备驱动必须能够存取设备中的配置信息以便完成初始化；
* 每个PCI外设有一个总线号、一个设备号、一个功能号标识，PCI规范允许单个系统占用多达256根总线，每个总线占用32个设备，每个设备可以
* 是一个最多具有8个功能的多功能卡，每个功能在硬件层次被一个16位地址标识；
* 如果需要多个PCI总线，可以通过PCI桥实现，PCI系统的实现是树状分布；和PCI外设相关的16-位硬件地址，隐藏在struct pci_dev结构中；
* PCI总线的I/O空间使用一个32位地址总线，而内存空间可以使用32位或者64位地址存取；系统启动时BIOS固件初始化PCI硬件，映射每个区到
* 不同地址来避免冲突，被映射的地址可以从配置空间读出，因此Linux驱动不需要使用探测读取设备，根据配置寄存器信息安全存取相应硬件；
* 每个设备的PCI(包括PCI Express设备)配置空间包含256Bytes，每个功能有4KB配置空间，配置空间排布标准化；配置空间的4个字节含有唯一
* 功能ID，因此驱动可以识别设备；即通过物理寻址找到设备的配置寄存器，根据寄存器信息进行正常的I/O存取；
* PCI接口标准相对ISA创新之处在于配置地址空间；

### 配置空间：
* PCI设备上电时，硬件保持未激活，内存和I/O端口都没有映射到计算机地址空间，即设备只能被配置；BIOS固件可以读写配置地址空间；
* 系统启动时，固件配置PCI外设，分配安全的位置给外设提供的地址区；驱动存取设备时，将其内存和I/O区域映射到处理器地址空间；
* 所有的PCI设备都有至少一个256-Bytes的地址空间，前64字节是标准的，剩下的依赖设备；
* venderID和deviceID标识一个设备，由PCI制造商分配，驱动使用这两个ID来查找设备；venderID有一个全球的注册，由供应商决定；
* __u32 vender, device指定一个设备的PCI供应商和设备ID，如果驱动可以处理任何供应商或者设备ID，这两个值应该为PCI_ANY_ID;
* PCI_DEVICE(vender, device)创建一个struct pci_device_id，该宏设置结构的供应商和设备成员为PCI_ANY_ID;

### 注册PCI驱动：
* struct pci_device_id结构可以告诉用户空间相应驱动支持哪些设备；
* PCI驱动必须创建主结构struct pci_driver，包含函数回调和变量，才能被正确注册到内核；
{% highlight C++ %}
const char *name；驱动名字，必须唯一，通常设置为和驱动模块名字相同；
const struct pci_device_id *id_table: 指向struct pci_device_id表的指针；
int (*probe)(struct pci_dev *dev, const struct pci_device_id *id): 指向PCI驱动中probe函数的指针，当它认为有一个这个驱动想要控制的struct pci_dev时，被PCI核心调用；
void (*remove)(struct pci_dev *dev): 指向对应的pci_dev被从系统中去除时调用的函数；
int (*suspend) (struct pci_dev *dev, u32 state): struct pci_dev被挂起时调用；函数可选；
int (*resume) (struct pci_dev *dev): pci_dev被恢复时调用；函数可选；
pci_register_driver(&pci_driver)注册struct pci_driver到PCI核心，若所有都成功注册，返回0，否则，返回负的错误码；
pci_unregister_driver(&pci_driver)注销内核中的struct pci_driver，绑定到这个驱动的PCI设备被去除，函数返回之前remove函数被调用；
{% endhighlight %}

### 使能PCI设备：
* 在驱动可存取PCI设备的任何设备资源之前(I/O区域或者中断)，驱动必须调用pci_enable_device函数；
* int pci_enable_device(struct pci_dev *dev); 唤醒设备；
* 函数将PCI配置空间的Command域的0位和1位置1，从而开启设备，即开启内存映射和I/O映射；还做开启中断的工作；

### 存取配置空间：
* 驱动探测到设备以后，常常需要读写3个地址空间，内存、端口、和配置；这是唯一找到设备被映射到内存和I/O空间位置的方法；
* CPU无法直接存取配置空间，为了存取配置空间，CPU必须读写PCI控制器中的寄存器，Linux提供标准接口存取配置空间；
* 对于驱动，配置空间可以通过8-bits, 16-bits, 或者32-bits数据传输来存取；
{% highlight C++ %}
int pci_read_config_byte(struct pci_dev *dev, int where, u8 *val);
int pci_read_config_word(struct pci_dev *dev, int where, u16 *val);
int pci_read_config_dword(struct pci_dev *dev, int where, u32 *val);
 {% endhighlight %}
* 以上函数从dev标识出的设备配置空间读取1个、2个或者4个字节；where参数是从配置空间开始处的字节偏移；取得的值通过val指针返回；
* 相对应的写配置空间函数：
{% highlight C++ %}
int pci_write_config_byte(struct pci_dev *dev, int where, u8 val); 
pci_write_config_word, pic_write_config_dword;
{% endhighlight %}

### 存取I/O和内存空间：
* 一个PCI设备实现6个I/O地址区，每个区域由内存区或者I/O区组成，大部分设备在内存区中实现其I/O寄存器；
* PCI_ADDRESS_0到 PCI_ADDRESS_5为配置空间的6个32位配置寄存器；内核中PCI设备的I/O区域集成在通用资源管理中，不必存取配置
*  变量知道设备映射到的内存或者I/O空间；
{% highlight C++ %}
unsigned long pic_resource_start(struct pic_dev *dev, int bar);	//函数返回某个bar的第一个地址(内存地址或者I/O端口号)；
unsigned long pic_resource_start(struct pic_dev *dev, int bar);	//函数返回某个bar的最后一个地址；
{% endhighlight %}

### PCI中断：
* Linux启动时，BIOS给设备分配唯一的中断号，中断号存储在PCI配置寄存器的60(PCI_INTERRUPT_LINE);
{% highlight C++ %}
result = pic_read_config_byte(dev, PCI_INTERTUPT_LINE, &myirq);
if (result) {
	/*deal with error.*/
}
{% endhighlight %} 
