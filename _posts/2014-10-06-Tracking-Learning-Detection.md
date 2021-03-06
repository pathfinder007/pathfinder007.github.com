---
layout: post
title: "Tracking Learning Detection"
description: "TLD, a object Tracking framework, summary from a paper in computer version."
modified: 2014-10-06
category: CV
tags: CV
image:
  feature: abstract-3.jpg
comments: true
share: true
---

### TLD简介.
&emsp;&emsp;TLD是一个可以实现在线学习、适应长时追踪的系统，这是英国萨里大学的捷克学生Zdenek Kalal在其攻读博士学位期间提出的一种新的单目标长时间跟踪算法，当时和尹叔两个人，借着作者在2010年发表的CVPR Best Paper "P-N Learning: Bootstrapping Binary Classifiers by Structural Constraints", ZK关于TLD这个长时追踪系统，发了好几篇顶会，在作者 [主页](http://personal.ee.surrey.ac.uk/Personal/Z.Kalal/) 上可以寻得。参照CSDN上, [zouxy09](http://blog.csdn.net/zouxy09/article/details/7893011) 等人的博客，借着作者开放的 [Matlab && C++ 混编](https://github.com/zk00006/OpenTLD) 源代码，深入研究了一下这个框架。当时几乎把全部源码注释了一下，本着作者开放源代码的精神，将TLD的实现过程，简要记录一下。

<!--more-->

### Bounding Box Scan
&emsp;&emsp;首先，在第一帧，在图像上圈出要追踪的物体，然后进行全图像的一个扫描，代码中选取了21种尺度，每种尺度均进行上下左右10%的平移，在图像上打网格，用一个6xn的数组存储所有的样本，每一列6个参数，前4个为样本左上角以及右下角的4个坐标，后两个参数分别为样本所处的尺度特征的指针以及该尺度下每一行样本的数目。在我们的实验中，我的摄像头设置为640x480px，圈出的物体为52x132px. 我们一共得到121841个样本。

### Generate Features
&emsp;&emsp;特征的提取，文章中作者称采用2bitBP进行提取，而代码中，其实是采用了1bitBP，作者文章是10年发的，代码是11年开源的，我猜作者是对精确度与计算复杂度之间做了一个权衡。实际上采用1bitBP进行特征提取，TLD的效果已经非常好。我们知道作者采用的核心分类器，随机蕨，每一层都是一个点对的比较，1bitBP，就是说，每一层取图像上的两个点进行比较，左边点比右边点颜色深，为1，否则为0，这就是一个特征的生成。由下图可以看出，作者提取的点对，都是在同一水平或者同一竖直方向上。在这一步对于10*10的随机蕨，用一个40*10的数组对特征提取的点坐标进行记录，存储是归一化的值，这样可以很方便地求取在任何尺度下，需要提取点对的具体坐标值。
<figure>
	<img src="http://mhs-blog.qiniudn.com/gene_f.png" alt="">
	<figcaption>Generate Features display.</figcaption>
</figure>

### Generate Postive && Negtive Data
&emsp;&emsp;接下来，对第一帧图像生成正负样本，首先计算扫描图像所得的每个patch与所选bounding box的重合度，选取重叠度小于0.2且方差比bounding box方差的50\%大的patch，作为负样本，赋予标签0.选取重叠度大于0.6的10样本，作为正样本，将其每个正样本进行20次仿射，正负1\%尺度变换，正负10旋转，方差为5的高斯噪声，一共得到200个正样本，赋予标签1. 这些即是作者文章中所说的，带标签的样本。

### Initialize Random Ferns
&emsp; &emsp;然后将带标签的正负样本，均分为两份，一份用作训练，一份测试，对随机蕨进行初始化。最终每个patch均会落入某一个叶子节点，用一个10位的二进制码表示。最后统计每个叶子节点的正负样本数以及正样本所占的比率，得到每个叶子节点为正样本的后验概率。再将测试样本依次通过各个fern，对于正样本，若10个fern产生的比率均值小于0.5，则判断错误，给相应的叶子节点正样本数加1，这个过程，可以反复测试，集合分类器的性能便能逐步提高，所以初始化时要花大量的时间，为了性能，在这一部也可以只用正样本进行初始化，毕竟每一帧，都会重复这样的学习过程。
<figure>
	<img src="http://mhs-blog.qiniudn.com/random_forest.png" alt="">
	<figcaption>Random Forest.</figcaption>
</figure>

&emsp;&emsp;在扫描图像所得的patch中，找出一个与bounding box重叠度最高的正样本，加上bounding box，在负样本中挑出50个，均进行归一化处理，0均值，单位方差，最终变为255*1的一维列向量，这个归一化处理，我觉得是为了降低光照的影响。将这些样本作为最近邻分类器的样本集，作者文章中提到，之前这个级联分类器只用了方差分类器与随机蕨，后来才在最后级联了一个最近邻分类器，可见这个分类器应该对系统性能，产生了比较大的影响。

### Nearest Neighbor Classifier
&emsp;&emsp;最近邻分类器的作用，对通过随机蕨且被正确分类的patch，分别求其与最近邻分类器样本集中各个样本之间的归一化互相关系数(NCC)，若与正样本或者负样本之间的NCC均值大于0.95，则将该样本加入该样本集，表明TLD又学到了物体的一个新外观或者是学到了又一个背景图片。随着TLD系统运行时间的增加，这个样本集会逐渐增大，追踪检测性能提高的同时也对机器硬件提出了一个更大的要求。作者代码中计算NCC是调OpenCV的函数。
<figure>
	<img src="http://mhs-blog.qiniudn.com/ncc.png" alt="">
	<figcaption>NCC Calculation.</figcaption>
</figure>

### Tracking and Evaluation
&emsp;&emsp;对于追踪，以5px的间隔在第I帧的bounding box中取一个10x10的点阵。通过LK光流法对每个点进行追踪，为每个点建立FB error与NCC，并分别求出FB error与NCC的均值，找出FB error比均值小，NCC比均值大的点。找出的这些点即为置信度高的点，据此在第J帧图像上建立新的bounding box.当FB error的均值大于10px，表明追踪太不稳定，或者当bounding box出了图像边界，追踪失败。当追踪成功，为建立置信度模型，将检测到的bounding box作归一化处理，得到一个255x1的列向量，通过求NCC评估conf1，当conf1较大，则将valid置1，即追踪的bounding box可信。

### Detection
&emsp;&emsp;对于检测，求图像的积分图与二次积分图，进而求每个patch块的方差，当其比bounding box方差的一半要小，则方差分类器将其过滤掉，这个阶段大约过滤掉一半的patch。对于通过方差分类器的patch，输入集合分类器，对每一棵fern，该patch均会落入一个叶子节点，由WEIGHT数组即可知道其为正样本的后验概率，10个fern求均值，返回给该patch在conf中对应位置。当样本检测完毕，寻找置信度大于阀值的patch返回100个置信度最大的。再将其通过最近邻分类器，找出置信度最大的一个patch，作为检测到的bounding box。

### Finding a result  
&emsp;&emsp;当追踪与检测同时有效，对检测所得的boxes，计算其两两之间overlap之和，根据重叠度对所得boxers进行最近邻聚类，并求每个聚类与追踪所得box的overlap以及置信度均值。找重合度小于0.5且置信度大于追踪所得结果置信度的聚类，即置信度高且远离追踪轨迹的检测结果。如果找到了一个这样的聚类，则对追踪器重新进行初始化，即将该box作为初始的追踪box，该box的置信度作为追踪器的置信度阀值。如果不只找到一个这样的聚类，即图像上有超过一个远离追踪位置的地方，有正样本聚集，找与追踪所得box的overlap超过0.7的检测box，用这些box的平均结果对追踪器进行重新初始化，即将该求得的box位置作为初始的追踪box。

&emsp;&emsp;若追踪失败，检测有效，则将检测所得的patch聚类，若只有一个聚类，则用其检测到的bounding box对追踪器进行重新初始化；否则，认为检测失败。

&emsp;&emsp;若检测失败但是追踪有效，则进行P-N learning，即对检测器进行更新。首先判断追踪所得box的置信度(tldNN)，当其与所选bounding box的相似度度小于0.5或者其box方差较小，不对检测器更新。否则，以追踪所得box为bounding box，在该帧图像上生成正样本，赋予标签1。与初始化时做法完全相同。仍然是找10个patch，不过仿射变换做10次。在该帧图像上生成负样本，赋予标签0，即与追踪所得box重叠度小于0.2且置信度最高的100个patch。计算追踪所得box与检测所得box的重合度，对重合度小于0.2的，亦作为负样本，对检测器进行更新，与初始化时机制相同。

### Summary
&emsp;&emsp;以上，就是TLD的具体实现，作者的这个思路，还是很清楚的，主要有两个缺陷，TLD的学习需要时间，物体外观变化剧烈，且不再变回来，TLD将丢失物体，正负样本集是一个逐渐增大的过程，随着追踪的深入，对机器的性能要求很高，并没有一个很好的抛弃已学习到正负样本集的机制。
