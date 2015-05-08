---
layout: post
category: sql
title: 使用Python封装MySQL的CRUD操作API
tags:Backend mysql python
---

&emsp;&emsp;Python可以通过mysqldb模块进行mysql操作，整个RDS这一块的代码架构组织，设想是封装一个CRUD的类，对于不同的表操作，分别进行实例化。这样看来，似乎可以在一定程度上减少sql语句的冗余，代码组织更具层次性。

<!--more-->

&emsp;&emsp;本文实现项目中RDS操作最底层的CRUD封装。首先通过`sudo apt-get install python-mysqldb`安装mysqldb模块。需要注意的时候，Python代码中如果存在中文注释，需要在`#! /usr/bin/python`下添加`# -*- coding: UTF-8 -*-`，否则会因为编码问题报错。以下即为具体的CRUD底层接口实现：


{% highlight Python %}
import MySQLdb

class RdsApi(object):
    host   = 'your_ip'
    user   = 'your_name'
    passwd = 'your_passwd'
    port   = 3306
    db     = 'your_db' 
    table  = ''

 	def __init__(self, table):
        self.table = table


 	def build_connect(self):
        conn   = MySQLdb.connect(host = self.host, user = self.user, passwd = self.passwd, port = self.port)
        conn.select_db(self.db)                                                                                                                                                         
        cursor = conn.cursor()
        return (conn, cursor)


    def free_connect(self, conn, cursor):
        conn.commit()
        cursor.close()
        conn.close()


	def rdsSelectData(self, cond):
        """
        params: cond-data filter condition.
        """
        try:
            (conn, cursor) = self.build_connect()
            
            query  = 'select * from ' + self.table + ' where ' + cond
            count  = cursor.execute(query)
            result = cursor.fetchall()
            
            self.free_connect(conn, cursor)            
            return result
        
        except MySQLdb.Error, e:
            print 'MySQL Error %d: %s' % (e.args[0], e.args[1])


    def rdsInsertData(self, fmt, values):
        """
        params: values-string with format and data.
        """
        try:
            (conn, cursor) = self.build_connect()
            
            query  = 'insert into ' + self.table + ' values' + fmt
            cursor.execute(query, values)
       
            self.free_connect(conn, cursor)            
        
        except MySQLdb.Error, e:
            print 'MySQL Error %d: %s' % (e.args[0], e.args[1])

 def rdsUpdateData(self, cols, values, cond):
        """
        params: cols-list, columns to update; values-list, uodate values; cond-data filter condition.
        """
        try:
            (conn, cursor) = self.build_connect()
            
            query  = 'update ' + self.table + ' set '
            for i in xrange(len(values)):
                col_val = str(cols[i]) + '=' + '"' + str(values[i]) + '",'    
                query += col_val
            
            query =  query[:-1] + ' ' + cond
            cursor.execute(query)
        
            self.free_connect(conn, cursor)            
        
        except MySQLdb.Error, e:
            print 'MySQL Error %d: %s' % (e.args[0], e.args[1])


    def rdsDeleteData(self, cond):
        """
        params: cond-data filter condition.
        """
        try:
            (conn, cursor) = self.build_connect()
            
            query = 'delete from ' + self.table + '  where ' + cond
            cursor.execute(query)
        
            self.free_connect(conn, cursor)            

        except MySQLdb.Error, e:
            print 'MySQL Error %d: %s' % (e.args[0], e.args[1])       
{% endhighlight %}
                    