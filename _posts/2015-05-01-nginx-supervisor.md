---
layout: post
category: nginx
title: Ubuntu 14.04下进程管理工具supervisor安装
tags: nginx 高并发
---

&emsp;&emsp;supervisor的存在，主要是为了Nginx可以优雅的重启。作为一个进程管理工具，通过Supervisor启动其他进程，则其他进程都为其子进程。实现对特定的进程的守护（则其他进程不能设置为守护进程），在进程被挂起时，自动重启进程。

<!--more-->

<br />

### 1.Supervisor安装

&emsp;&emsp;可以安装在任何Unix系统，Ubuntu下可以通过`easy_install supervisor`进行安装。然后切换到root权限，通过`echo_supervisord_conf > /etc/supervisord.conf`创建配置文件，可以在其中更改所需要的配置。
&emsp;&emsp;修改配置，守护nginx进程，在`/etc/supervisord.conf`中添加以下信息：

{% highlight Python %}
[program:nginx]    
command=/usr/local/nginx/sbin/nginx    ;要执行的命令，即启动需要守护的进程
priority=1                             ;优先级
numprocs=1                             ;启动的进程数目
autostart=true                         ;supervisor启动的时候是否随着同时启动
autorestart=true                       ;当supervisor程序crash的时候，这个进程会自动重启（很重要）
{% endhighlight %}

<br />

### 2.Supervisor守护Nginx测试 

* 指定配置文件，启动supervisord: `sudo supervisord -c /etc/supervisord.conf`，则根据配置文件的设置，nginx会被同时启动。
* 通过`sudo supervisorctl`可以进入supervidor的命令行工具（可以代替接下来提到的Web界面进行管理，控制守护程序的start/restart/stop），或者查看其守护的进程的状态。
* 查看守护进程状态: `ps -le | grep supervisord `
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_1.png" alt="">
</figure>
* 查看Nginx进程状态: `ps -le | grep nginx`
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_2.png" alt="">
</figure>
* 杀掉nginx进程: `killall nginx`
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_3.png" alt="">
</figure>
* 结果发现，nginx被重启，且pid被切换
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_4.png" alt="">
</figure>

<br />

### 3. 通过Web界面管理进程以及查看进程状态

&emsp;&emsp;通过配置文件的修改，supervisor通过web管理进程以及查看进程状态。如下所示：

{% highlight Python %}
[inet_http_server]         ; inet (TCP) server disabled by default
port=127.0.0.1:9001        ; (ip_address:port specifier, *:port for all iface)
username=admin             ; (default is no username (open server))
password=123               ; (default is no password (open server))
{% endhighlight %}

&emsp;&emsp;其中port的设置表示允许任何ip进行访问，也可以指定单个ip可以访问。保存配置之后，`supervisorctl reload`重启，通过配置文件中配置的`127.0.0.1:9001`，输入用户名密码，即可访问。
<figure>
	<img src="http://mhs-blog.qiniudn.com/2015_05_01_5.png" alt="">
</figure>

<br />

### 4. supervidor开机自启动

* `sudo supervisorctl stop <name>`可以停止一个进程，但是该进程还会重新启动；
* 要停止supervisord，直接ps查找到其对应的pid，`kill -9 pid`即可，其中-9的意思是，传递给进程的信号量为9，即强制，尽快终止进程；因为supervisord是以守护进程形式启动，所以将其kill之后，nginx依然顺利运行；当将supervisord设置成非守护进程，将其kill后，则nginx也停止运行；
* 注意启动supervisord的时候一定要使用root权限，因为该进程的启动会带动nginx进程的启动，而nginx进程有监听80端口的操作，必须root权限，否则supervisord守护的进程将无法启动；
* 对于Ubuntu系统来说，参考`http://blog.csdn.net/shanliangliuxing/article/details/15499891`的方法，新建文件/etc/init.d/supervisord中，并将文章末尾的脚本复制进去，执行以下命令，即将supervisord设置成了开机自启动；

{% highlight Python %}
sudo chmod +x /etc/init.d/supervisord
sudo update-rc.d supervisord defaults
sudo service supervisord start
{% endhighlight %}

<br />

`/etc/init.d/supervisord`文件内容：

{% highlight Python %}
#! /bin/sh
### BEGIN INIT INFO
# Provides:          supervisord
# Required-Start:    $remote_fs
# Required-Stop:     $remote_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Example initscript
# Description:       This file should be used to construct scripts to be
#                    placed in /etc/init.d.
### END INIT INFO
 
# Author: Dan MacKinlay <danielm@phm.gov.au>
# Based on instructions by Bertrand Mathieu
# http://zebert.blogspot.com/2009/05/installing-django-solr-varnish-and.html
 
# Do NOT "set -e"
 
# PATH should only include /usr/* if it runs after the mountnfs.sh script
PATH=/sbin:/usr/sbin:/bin:/usr/bin
DESC="Description of the service"
NAME=supervisord
DAEMON=/usr/local/bin/supervisord
DAEMON_ARGS=""
PIDFILE=/tmp/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME
 
# Exit if the package is not installed
[ -x "$DAEMON" ] || exit 0
 
# Read configuration variable file if it is present
[ -r /etc/default/$NAME ] && . /etc/default/$NAME
 
# Load the VERBOSE setting and other rcS variables
. /lib/init/vars.sh
 
# Define LSB log_* functions.
# Depend on lsb-base (>= 3.0-6) to ensure that this file is present.
. /lib/lsb/init-functions
 
#
# Function that starts the daemon/service
#
do_start()
{
	# Return
	#   0 if daemon has been started
	#   1 if daemon was already running
	#   2 if daemon could not be started
	start-stop-daemon --start --quiet --pidfile $PIDFILE --exec $DAEMON --test > /dev/null \
		|| return 1
	start-stop-daemon --start --quiet --pidfile $PIDFILE --exec $DAEMON -- \
		$DAEMON_ARGS \
		|| return 2
	# Add code here, if necessary, that waits for the process to be ready
	# to handle requests from services started subsequently which depend
	# on this one.  As a last resort, sleep for some time.
}
 
#
# Function that stops the daemon/service
#
do_stop()
{
	# Return
	#   0 if daemon has been stopped
	#   1 if daemon was already stopped
	#   2 if daemon could not be stopped
	#   other if a failure occurred
	start-stop-daemon --stop --quiet --retry=TERM/30/KILL/5 --pidfile $PIDFILE --name $NAME
	RETVAL="$?"
	[ "$RETVAL" = 2 ] && return 2
	# Wait for children to finish too if this is a daemon that forks
	# and if the daemon is only ever run from this initscript.
	# If the above conditions are not satisfied then add some other code
	# that waits for the process to drop all resources that could be
	# needed by services started subsequently.  A last resort is to
	# sleep for some time.
	start-stop-daemon --stop --quiet --oknodo --retry=0/30/KILL/5 --exec $DAEMON
	[ "$?" = 2 ] && return 2
	# Many daemons don't delete their pidfiles when they exit.
	rm -f $PIDFILE
	return "$RETVAL"
}
 
#
# Function that sends a SIGHUP to the daemon/service
#
do_reload() {
	#
	# If the daemon can reload its configuration without
	# restarting (for example, when it is sent a SIGHUP),
	# then implement that here.
	#
	start-stop-daemon --stop --signal 1 --quiet --pidfile $PIDFILE --name $NAME
	return 0
}
 
case "$1" in
  start)
	[ "$VERBOSE" != no ] && log_daemon_msg "Starting $DESC" "$NAME"
	do_start
	case "$?" in
		0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
		2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
	esac
	;;
  stop)
	[ "$VERBOSE" != no ] && log_daemon_msg "Stopping $DESC" "$NAME"
	do_stop
	case "$?" in
		0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
		2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
	esac
	;;
  #reload|force-reload)
	#
	# If do_reload() is not implemented then leave this commented out
	# and leave 'force-reload' as an alias for 'restart'.
	#
	#log_daemon_msg "Reloading $DESC" "$NAME"
	#do_reload
	#log_end_msg $?
	#;;
  restart|force-reload)
	#
	# If the "reload" option is implemented then remove the
	# 'force-reload' alias
	#
	log_daemon_msg "Restarting $DESC" "$NAME"
	do_stop
	case "$?" in
	  0|1)
		do_start
		case "$?" in
			0) log_end_msg 0 ;;
			1) log_end_msg 1 ;; # Old process is still running
			*) log_end_msg 1 ;; # Failed to start
		esac
		;;
	  *)
	  	# Failed to stop
		log_end_msg 1
		;;
	esac
	;;
  *)
	#echo "Usage: $SCRIPTNAME {start|stop|restart|reload|force-reload}" >&2
	echo "Usage: $SCRIPTNAME {start|stop|restart|force-reload}" >&2
	exit 3
	;;
esac
{% endhighlight %}




		 
