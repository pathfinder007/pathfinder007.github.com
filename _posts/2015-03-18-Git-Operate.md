---
layout: post
category: Git
title: Git操作中切换本地账户
tagline: by Mushsen
tags: git
---

前段时间由于项目需要，一直往oschina上面wubin91的私有空间提交代码，懒得新建账户，就将本地的Git账户切换成了这个公共账号。今天在整Blog，才发现当时把本地的global设置给改了。而oschina和github，用的是一套机制。提交代码到github时，显示的不是自己账户提交，很不爽。翻了下资料，把本地的git设置给改了回来，留个备忘。

<!--more-->

### 1. git-config工具

Git提供了一个git config工具，专门用来配置或者读取相应的工作环境变量，这些环境变量，决定Git在各个环节的具体工作方式和行为，文档显示这些变量可以存储在三个地方：
* /etc/gitconfig文件：系统中对所有用户普遍适用的配置，git config --system 选项，读写的即是这个文件，但在Mac OS X上，该目录未找到这个文件；
* ~/.gitconfig 文件：只适用于当前用户，git config --global 选项，读写的就是这个文件；
* 当前项目Git目录中的配置文件，即.git/config 文件，这里的配置仅针对当前项目有效。每一个级别的配置都会覆盖上层的相同配置，所以 .git/config 里的配置会覆盖 /etc/gitconfig 中的同名变量；

### 2. 用户信息

个人的用户名称和电子邮件地址。这两条配置很重要，每次 Git 提交时都会引用这两条信息，说明是谁提交了更新，所以会随更新内容一起被永久纳入历史记录，对我来说，当时就是把user.email改成了wubin91的email账号，导致了账号切换的问题；

$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com

如果用了 --global 选项，那么更改的配置文件就是位于你用户主目录下的那个，以后你所有的项目都会默认使用这里配置的用户信息。如果要在某个特定的项目中使用其他名字或者电邮，只要去掉 --global 选项重新配置即可，新的设定保存在当前项目的 .git/config 文件里。
