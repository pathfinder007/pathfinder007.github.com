---
layout: post
title: "Neural Network Accelerator II"
description: "Dianao: A Small-Footprint High-Throughput Accelerator for Ubiquitous Machine-Learning."
modified: 2014-10-06
category: Machine_Learning
tags: Machine_Learning
image:
  feature: abstract-11.jpg
comments: true
share: true
---

### 写在前面
&emsp;&emsp;这段时间由于工作需要，研究了一下ASPLOS'14的Best Paper，"Dianao: A Small-Footprint High-Throughput Accelerator for Ubiquitous Machine-Learning." 这是中国大陆的学者首次获得 CCF 推荐的体系结构领域 A 类会议的最佳论文奖。而此前,ASPLOS 最佳论文 奖一直被美国卡耐基梅隆大学、德州大学奥斯丁分校、微软等 8 个欧美著名研究机构所垄断。下面结合这篇文章，写写阅读摘要。

<!--more-->

### 神经网络协处理器的发展.
&emsp;&emsp;现在的大多数协处理器研究者，关注的都是如何有效提高神经网络运算的效率。现今的深度神经网络，在规模上差别很大。寒武纪1号神经网络协处理器，强调存储对协处理器性能，功耗的决定性影响，通过一种优化的访存方式，解决了访存瓶颈问题。在台积电 65nm 工艺下,寒武纪 1 号主频可达 0.98GHz、性能 452 GOPS、功耗 0.485W、面积约为 3mm2。也就是说，它可以在通用处理器核 1/10 的面积和功耗开销下，达到通用处理器核 100 倍以上的人工神经网络处理速度。即便和最先进的 GPU 相比, 寒武纪 1 号的人工神经网络处理速度也不落下风，而其面积和功耗远低于 GPU 的 1/100。这样一个小面积，大吞吐量的机器学习协处理器，有着广泛的系统及产品级的应用前景。

&emsp;&emsp;当处理器架构发展到异构多核，无论从提高运算性能还是降低功耗的角度来说，设计协处理器，都是一个广泛采用的解决方案。那么，在什么应用领域，有了设计协处理器的需求？是在很多对高性能运算有迫切需求的应用领域，从图像，视频，语音识别到自动翻译领域，商业分析，以及各种各样依赖于机器学习技术的领域。在大部分的领域，都有机器学习的用武之地，CNN/DNN在过去几年成为了最火的机器学习算法，很多的应用领域，都可以套用深度学习的模型，取得良好的效果。即一种算法，可以解决若干应用问题，这是一个独特的设计神经网络协处理器的时机，为几种主流的算法，定制专用的运算平台，这是一个潜力巨大的未占领市场。

&emsp;&emsp;如今，大多数的深度学习运算任务，都在多核SIMD处理器，GPU集群或者FPGA上面执行，这是目前为止比较常用的解决方案。而有一些研究者已经提出了使用协处理器实现CNN或者MLP算法。协处理器应用的其他领域，像图像识别，也有用ASIC设计的方法实现卷积神经网络，或者其他典型的神经网络算法。但是这些协处理器实现，都是着眼于如何高效地实现运算，但它们或者因为设计简单，忽略了内存传输方面地问题，或者直接把协处理器通过DMA加到了内存上。并没有解决通用处理器集群运行神经网络算法受限的访存瓶颈问题。

### 神经网络训练问题

&emsp;&emsp;我们都知道，神经网络算法的训练代价很大，无论是浅层神经网络的随机梯度下降，还是深度学习的Wake-Sleep，在大量样本的情况下，都需要特别长的模型训练时间。于是很多的神经网络算法研究者，有了提高训练效率的需求，当然，这只是一小部分的市场。而有更多的最终用户，需要更好的产品体验，诸如图像识别，语音识别，广告推荐，等等。而深度学习在这些领域，受限于硬件瓶颈，还并未得到很好的应用。这是一块巨大的市场。一个革新的硬件平台，可以大大加速深度学习技术在各个领域的应用。

&&emsp;&emsp;很多时候，我们都强调在线训练，在线调整模型的重要性，实际上，目前的大多数业界机器学习应用，都尚未做到在线实时调整模型，似乎也没有这个必要。毕竟增加小量样本的情况下，进行模型训练，有一个精确度与代价的权衡问题。我们会发现，在电商购买了某商品以后，多天之后，其网站还会给我们推荐同样的商品，这应该是模型并未重新训练的结果。一般大样本训练的模型，都会在增加新样本以后，通过一种增量训练的方法，调整模型(增量训练的方法，一直还没有去调研，mark一下)。所以，在线训练，对目前的深度学习应用来说，并不是显得那么的重要。

### CNN/DNN 一般结构
 &emsp;&emsp;CNN/DNN算法，由一系列的各种层组成，并按序列执行，各层可以认为相对独立，层与层之间全连接或者部分连接。每一个layer包括若干sub-layer，叫 feature map。总的来说，有三种layers，convolutional 以及pooling layers，在网络顶层有一个由若干layer组成的classifier。对于浅层网络MLP来说，由输入层，输出层以及若干隐含层组成。而深度神经网络的隐含层可以有各种变化，诸如RBM，LRN，CONV，MLP，POOLING等。在顶层是由若干层组成的分类器(果断时间好好整理整理深度学习模型，再作具体研究，本文只专注于论文内容，作适当延伸)。	
 
#### 卷积层
&emsp;&emsp;	卷积层的作用，对输入特征做映射，因此输入输出feature map之间并不是全连接。设想输入是一个图片，卷积是一个2D变换，输入图片的一个子区域Kx*Ky，以及一个相同维数的变换矩阵。变换矩阵(kernel values)是输入输出之间卷积层的突触权重。一个输入层通常包含多个feature map，而输出feature map通常通过对同样窗口大小的输入feature map做卷积得到。对于一个卷积层，pooling层，分类器级联的网络，kernel是3D，Kx*Ky*Ni，Ni是输入的feature map数目，在一些情况下，连接是稀疏的，即不是所有的输入feature map都对最终的输出feature map有贡献。通常一个非线性函数用于卷积层输出，例如tanh(x).

####POOLING层
&emsp;&emsp;Pooling层的作用，是统计临近数据集合的信息。以图像为例，倾向于只包含给定窗口大小或者一定尺度的显著的图像信息。重要的作用就是降低feature map的维数。每一个feature map都是独立的进行pooling，即2D pooling，而不是3D。卷基层和pooling层交替结合成为一个深度结构，顶层通常是一个分类器，线性或者是两层感知器。分类器通常聚集所有feture map，故而在这一层没有feature map的概念。

###小型神经网络的硬件实现
&emsp;&emsp;最自然的把神经网络映射到硬件上的想法就是所有的神经元和突触都布局在硬件上，内存只是用来输入数据以及储存结果。简单地把软件神经元/突触全映射，所以硬件实现可以匹配概念上的神经网络。每个神经元都由逻辑电路实现，突触由锁存器或者RAM实现。这样地结构可以满足一些神经元与突触数目较小的小型神经网络，提供较大的速率与较小的功耗，因为数据的移动距离较小（比起从内存搬数据）。无论对于从一层到另一层的神经元，或者对于从一个突触锁存到相应神经元，都是如此。这样的结构，对于90-10-10的感知器来说，执行时间15ns，能耗为通用处理器的1/974. 

&emsp;&emsp;但是，面积，功耗，延迟都是随着神经元数目呈二次方增长。我们综合出了一个ASIC神经网络，算出了它们的面积，延时，功耗。每个神经元执行如下操作，将输入神经元与突触相乘，将神经元对应的这些和进行相加，然后进行sigmoid变换。16*16 layer需要0.71mm，32*32 layer需要2.66mm。设想当神经元是成千上万的时候，一个硬件全映射的神经网络，面积是不可想像的，所以这样的实现对大型神经网络并不适合。
<figure>
	<img src="http://mhs-blog.qiniudn.com/map.jpg" alt="">
	<figcaption>软硬件神经元一一映射神经网络的 能耗-输入/输出神经元数目 关系图.</figcaption>
</figure>

###寒武纪1号大型神经网络协处理器实现
####整体架构
&emsp;&emsp;寒武纪1号包括4个主要模块，控制处理器模块（CP）负责取指令，并配置
整个加速器的运行。神经网络计算功能部件（NFU）负责具体的神经网络计算。两个神经元缓存（NB）暂存正在处理的神经层及其依赖的神经层上神经元的数据。此外，还有一个突触缓存（SB）负责暂存正在处理的神经层及其依赖的神经层之间突触的数据。 
<figure>
	<img src="http://mhs-blog.qiniudn.com/hanwuji-1.jpg" alt="">
	<figcaption>寒武纪1号整体架构图.</figcaption>
</figure>

#### 将神经元/突触权值分布式存储于片上 RAM ，优化数据搬运
&emsp;&emsp;在运算开始阶段，突触/神经元初始权值通过主内存分别传入 SB 以及 NBin 两个 Buffer 中；运算阶段，通过控制处理器的指令，将相应的突触/神经元权值取到运算部件 NFU 中执行，并将执行结果送回 Buffer ；神经网络运算完毕，再将运算结果传回主内存。即神经网络运算过程中，只有 SB, NBin 以及 NBout 三个 Buffer与运算部件 NFU 有数据交互，并且为每个 Buffer 分别配置一个 DMA，并且独立存储指令请求，可以极大限度地进行指令预取而不用担心冲突情况的发生，有效地降低了访存延迟。相对于传统的 CPU/GPU 架构，数据搬运消耗只是采用通用处理器基于 Cache 层次数据搬运次数的1/30 ~ 1/10，极大限度缩短了数据传输路径长度。

&emsp;&emsp;不同数据权值的分块存储，好处有如下两点。首先，避免了不同数据类型混在一块，造成的带宽利用率不高/数据读写效率不高的问题。比如，NBin 以及 NBout 的宽度为 Tn*2 Bytes, SB 的宽度为 Tn*Tn*2 Bytes. 如果数据存储在一块，当设计为 Tn*2 Bytes 的宽度，则SB的值无法一次取出，增加了延迟。当设计为Tn*2 Bytes, 会造成很大的带宽浪费，增加了能耗。其次，节省了解决冲突问题所需要的消耗。为了降低延迟，当数据不加区分存储在 Cache 中，Cache端口带宽必须设计为Tn*Tn*2 Bytes，则Cache的面积太大，为了解决冲突，需要增加更多的判断逻辑，会增加功耗或者延迟，降低了神经网络运算效率。

#### 旋转Buffer设计，软件神经元复用硬件神经元，支持任意规模神经网络
&emsp;&emsp;为了解决软件神经元复用硬件神经元，将 NBin Buffer 设计成了一个旋转Buffer，神经网络各层的输入权值在Buffer中进行分块存储，使用完毕即覆盖。则随着神经网络层次深度的增加，NBin Buffer也有能力处理。通过复用硬件神经元的方式，使得寒武纪神经网络协处理器可以支持任意规模的深度学习算法。

#### 线性插值实现传输函数，高可配置性
&emsp;&emsp;NFU运算单元为三层设计，第一层为突触/神经元权值地乘法操作，第二层为加法树，实现部分和。第三层为传输函数地实现，通过线性插值的方式实现，因而可以实现诸如sigmoid的各种非线性传输函数。这样的分层次运算单元结构，通过指令的配置，可以模拟 MLP, CONVOLUTION, POOLING, LRN, RBM等各种形态的神经网络传输层，保证了神经网络的高可配置性。 

#### 16-bit 定点运算代替320bit 浮点运算
&emsp;&emsp;保证精度的同时，降低运算部件的复杂度，降低面积以及功耗。在运算部件的设计中，我们发现，当使用32-bit 的浮点操作与16-bit 的定点操作，对于 UCI 基准数据集，误差率分别为0.0311以及0.0337，误差率相差不大。而16-bit定点乘法器面积和功耗均为32-bit浮点乘法器的近1/7，由此可见，在能够保证正确率的情况下，使用16-bit的定点运算部件，是一个更好的选择。这也在一定程度上降低了我们设计的面积以及功耗。

### Summary
&emsp;&emsp;看论文过程中大概纪录了一下关键点。感觉这个设计，最大的创新点，就是片山分块存储不同的权值到Buffer中，在保证了带宽使用效率的同时，还避免了考虑Cache冲突的问题。以及旋转Buffer的设计，使得软件神经元可以复用硬件神经元( 这点还没怎么看明白)。文章的核心内容就是，要使得突触权值尽量靠近要使用它的神经元。关于定点运算模拟浮点运算的操作，以及使用线性插值生成各种传输函数这两点，应该是很基本的，自己原来都不了解，还是功力不够。
