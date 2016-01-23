---
layout: post
category: Hadoop
title: EC2上Hadoop集群搭建
tags: EC2 Hadoop Cluster 
---

&emsp;&emsp;日子总是过得很快，却近半年时间没有记录一篇博客，开发依然在做着，却少了很多整理的动力，最近开始做恶大规模机器学习相关的东西，需要在EC2上搭建Hadoop集群，做一记录。

<!--more-->

<br />

## 1. 一些Attention

* 在EC2上搭建Hadoop集群，可以先搭建小型集群，一个namenode，3个datanode，配好namenode、datanode的环境之后，存Image，之后要创建百个节点的cluster，从相应Image启动Instance，并修改namenode相关配置即可。
* 特别注意Security Group的问题，hadoop需要的端口是否都开放了，前期可以all traffic

<br />

## 2. Hadoop搭建步骤

### 2.1 EC2上set好相应的机器，
* 由于Elastic Ip在一个region似乎只能保留5个，所以Instance多了之后，这是个问题。
* `local$ sudo chmod 600 ~/.ssh/pem_key_filename`
* `local$ ssh -i ~/.ssh/pem_key_filename` 尝试登陆namenode


<br />

### 2.2 SSH免密码登录配置
* 配置`~/.ssh/config`,实现local免密码登录namenode
* 配置namenode到all datanode的免密码ssh
{% highlight C++ %}
namenode$ ssh-keygen -f ~/.ssh/id_rsa -t rsa -P ""
namenode$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa.pub | ssh datanode1 'cat >> ~/.ssh/authorized_keys'
cat ~/.ssh/id_rsa.pub | ssh datanode2 'cat >> ~/.ssh/authorized_keys'
cat ~/.ssh/id_rsa.pub | ssh datanode3 'cat >> ~/.ssh/authorized_keys'
{% endhighlight %}
* 之后可以从namenode免密码登录各个datanode，使用public dns或者private ip都可以

### 2.3 Hadoop2.7安装
* 可以使用ITerm2同时在多个机器安装环境（在一台机器安装环境之后存Image，从Image启动其他机器，是更好的方式）
{% highlight C++ %}
allnodes$ sudo apt-get update
allnodes$ sudo apt-get install openjdk-7-jdk
allnodes$ java -version
allnodes$ wget http://apache.mirrors.tds.net/hadoop/common/hadoop-2.7.1/hadoop-2.7.1.tar.gz -P ~/Downloads
{% endhighlight %}
* 解压后将hadoop-2.7.1 rename成hadoop并mv到/usr/local/下
* 增加haoop相关环境变量，`vim ~/.profile` 
{% highlight C++ %}
export JAVA_HOME=/usr
export PATH=$PATH:$JAVA_HOME/bin
export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/bin
export HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop
{% endhighlight %}
* `allnodes$ . ~/.profile`

### 2.4 Hadoop配置(All Node)
* `allnodes$ sudo vim $HADOOP_CONF_DIR/hadoop-env.sh`
{% highlight C++ %}
export JAVA_HOME=/usr
{% endhighlight %}

* `vim $HADOOP_CONF_DIR/core-site.xml`
{% highlight C++ %}
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://`namenode_public_dns`:9000</value>
  </property>
</configuration>
{% endhighlight %}

* `vim $HADOOP_CONF_DIR/yarn-site.xml`
{% highlight C++ %}
<configuration>
  <!-- Site specific YARN configuration properties -->
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property> 
  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>`namenode_public_dns`</value>
  </property>
</configuration>
{% endhighlight %}

* `allnodes$ sudo cp $HADOOP_CONF_DIR/mapred-site.xml.template $HADOOP_CONF_DIR/mapred-site.xml`
* `vim $HADOOP_CONF_DIR/mapred-site.xml`
{% highlight C++ %}
<configuration>
  <property>
    <name>mapreduce.jobtracker.address</name>
    <value>`namenode_public_dns`:54311</value>
  </property>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
</configuration>
{% endhighlight %}

<br />

### 2.5 Hadoop配置(Name Node)
* `vim /etc/hosts`
* namenode_hostname, like `ip-172-31-35-242`
{% highlight C++ %}
127.0.0.1 localhost
namenode_public_dns namenode_hostname
datanode1_public_dns datanode1_hostname
datanode2_public_dns datanode2_hostname
datanode3_public_dns datanode3_hostname

::1 ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
{% endhighlight %}

* `vim $HADOOP_CONF_DIR/hdfs-site.xml`
{% highlight C++ %}
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value>
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///usr/local/hadoop/hadoop_data/hdfs/namenode</value>
  </property>
</configuration>
{% endhighlight %}

* `namenode$ sudo mkdir -p $HADOOP_HOME/hadoop_data/hdfs/namenode`

* `namenode$ sudo touch $HADOOP_CONF_DIR/masters`
* `vim $HADOOP_CONF_DIR/masters`
{% highlight C++ %}
namenode_hostname
{% endhighlight %}

* `vim $HADOOP_CONF_DIR/slaves`
{% highlight C++ %}
datanode1_hostname
datanode2_hostname
datanode3_hostname
{% endhighlight %}

* `namenode$ sudo chown -R ubuntu $HADOOP_HOME`

<br />

### 2.6 Hadoop配置(Data Node)
* `vim $HADOOP_CONF_DIR/hdfs-site.xml`
{% highlight C++ %}
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///usr/local/hadoop/hadoop_data/hdfs/datanode</value>
  </property>
</configuration>
{% endhighlight %}

* `datanodes$ sudo mkdir -p $HADOOP_HOME/hadoop_data/hdfs/datanode`
* `datanodes$ sudo chown -R ubuntu $HADOOP_HOME`

<br />

## 3. Hadoop Start
* `namenode$ hdfs namenode -format`, all the data previous on it will lost
* `namenode$ $HADOOP_HOME/sbin/start-dfs.sh`

* 在浏览器打开`namenode_public_dns:50070`，查看Cluster的状态，应该有3个`Live Nodes`

* 启动`YARN`以及`MapReduce JobHistory Server`
{% highlight C++ %}
namenode$ $HADOOP_HOME/sbin/start-yarn.sh
namenode$ $HADOOP_HOME/sbin/mr-jobhistory-daemon.sh start historyserver
{% endhighlight %}

* `jps`查看namenode的状态
{% highlight C++ %}
namenode$ jps
JobHistoryServer
Jps
SecondaryNameNode
ResourceManager
NameNode
{% endhighlight %}

* `jps`查看datanode的状态
{% highlight C++ %}
datanodes$ jps
NodeManager
DataNode
Jps
{% endhighlight %}