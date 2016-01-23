---
layout: post
category: Linux
title: Linux下使用crontab创建定时任务
tags: Linux Crontab 
---

&emsp;&emsp;项目中用到了crontab做定时任务，定时任务应该是Web开发中比较常见的一种机制，比如某个状态被Locked住，一定时间后，需要将其release。而Linux提供了方便简单的命令，即可实现这一功能。

<!--more-->

<br />

## 1. Crontab相关命令

* 查看当前用户的定时任务：`crontab -l`
* 修改、删除、新增定时任务：`crontab -e`
* 注释掉定时任务：#
* 删除定时任务：`crontab -r`
* ubuntu下，crontab重启 `sudo /etc/init.d/cron restart`

<br />

## 2. 定时任务格式

59 23 * * * /home/oracle/scripts/alert_log_archive.sh > /dev/null 2 > &1

* 第一列C1：分钟1-59
* 第二列C2：小时1-23
* 第三列C3：日    1-31
* 第四列C4：月    1-12
* 第五列C5：星期 0-6
* 第六列C6：Command

C1-C5通过组合方式决定执行脚本的频率，最小频率为每分钟一次，Cn可以用*; */n; T1-T2; a, b, c四种形式

* C1为*表示每分钟执行，C2为*表示每小时执行
* C1为*/n表示每n分钟时间间隔执行，C2为*/n表示每n小时执行
* C1为T1-T2表示从第T1分钟到第T2分钟这段时间执行，C2为T1-T2表示从第T1小时到第T2小时这段时间执行
* C1为a，b，c表示第a，b，c分钟都要执行，C2为a，b，c表示第a，b，c小时执行

<br />

## 3. 定时任务例子

{% highlight C++ %}
//每天23点59执行
59 23 * * * command

//每5分钟执行
*/5 * * * * command

//周一到周五每天下午20:00执行
0 20 * * 1-5 command
{% endhighlight %}