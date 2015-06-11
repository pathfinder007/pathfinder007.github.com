---
layout: post
category: Wechat
title: Wechat开发，与Server的接入步骤，验证成为开发者
tags: Wechat Python
---

&emsp;&emsp;之前开发ucaslife的时候，做了一些微信开发，已经是一年半以前的事情了，微信开放的接口越来越多，包括数据统计接口、微信小店、微信门店、设备功能接口等，可玩性也越来越强。而微信也逐渐成为国内第一大的用户流量入口。

<!--more-->

&emsp;&emsp;由于未来以及现在的需要，重新好好整理微信开发相关的东西，PHP始终是一门不怎么喜欢的语言，使用python/ruby重新开始走一遍微信开发的流程，当一个学习与巩固。

<br />

## 1. 在微信后台填写服务器配置

&emsp;&emsp;开发者需要依次完成：填写服务器配置（绑定业务处理的应用程序代码，微信将相应请求转发到开发者自己编写的业务处理代码）；验证服务器地址的有效性（一次性的操作，验证一次即可，即通过用户设定的token做身份标识符，微信后台与用户编写的Server做握手）；依据接口文档实现业务逻辑，即用户编写的Server。

### 1.1. 服务器配置

&emsp;&emsp;`http://mp.weixin.qq.com/`登陆后台，在公众平台后台管理页面 - 开发者中心页，点击“修改配置”按钮，填写服务器地址（URL）、Token和EncodingAESKey，对于Tornado来说，URL即对应一个业务处理的URL，用户用其接收微信消息和事件。Token由开发者自己填写，用作生成签名（验证代码与微信后台都需要填写，用于握手）。EncodingAESKey由开发者手动填写或随机生成，将用作消息体加解密密钥。

### 1.2. 验证服务器地址的有效性

&emsp;&emsp;开发者提交信息后，微信服务器发送GET请求到填写的服务器地址URL，GET请求携带signature、timestamp、nonce(random number)、echostr(random string) 4个参数，其中signature由token、timestamp、nonce生成，一块传到服务器，便于服务器根据自己记录的token与timestamp、nonce生成身份验证码，与signature做比对。

&emsp;&emsp;当服务器确定这次GET请求来自微信服务器，则原样返回echostr参数内容，接入生效，成为开发者成功，否则接入失败。

&emsp;&emsp;具体校验算法：将token、timestamp、nonce三个参数进行字典序排序；将三个参数字符串拼接成一个字符串进行sha1加密；开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。

### 1.3 依据接口文档实现业务逻辑

&emsp;&emsp;验证URL有效后，即可成为开发者，如果公众号类型为服务号（订阅号只能使用普通消息接口），可以在公众平台网站中申请认证，认证成功的服务号将获得众多接口权限。关于服务号与订阅号的区别，订阅号会被归入到Subscriptions中，而服务号会处于会话列表中。需要注意，验证代码只需要运行一次即可。

&emsp;&emsp;此后用户向公众号发送消息、或者产生自定义菜单点击事件时，微信服务器将转发消息和事件到开发者填写的服务器配置URL，然后开发者可以依据自身业务逻辑进行响应，例如回复消息等。发生错误时的全局返回码说明：`http://mp.weixin.qq.com/wiki/17/fa4e1434e57290788bde25603fa2fcbd.html`。

&emsp;&emsp;用户向公众号发送消息时，公众号方收到的消息发送者是一个OpenID，是使用用户微信号加密后的结果，每个用户对每个公众号有一个唯一的OpenID。即出于保证用户隐私考虑，不可逆加密。另外微信公众号接口只支持80端口。

&emsp;&emsp;还有一个UnionID，暂时没看明白是干嘛的，暂时应该也用不到，在此mark。

<br />

### 2. 身份验证

&emsp;&emsp;服务器后台直接在已有的Serve上加了一个接口，因此是Nginx+Tornado的配置，Nginx监听80端口，做htt服务器，Tornado做业务处理的服务器。但是Nginx+Tornado 的架构，身份验证通不过，怀疑是处理身份验证的Tornado监听的是8888端口，而非80端口的缘故，将Nginx取掉就好了，有待解决。

{% highlight Python %}
def get(self):                                                                                                                
	wh = wechatHandler.WechatHandler()
        
  	signature = self.get_argument('signature')
  	timestamp = self.get_argument('timestamp')
    nonce     = self.get_argument('nonce')
    echostr   = self.get_argument('echostr')                                                                                                                                        
                
    if wh.checksignature(signature, timestamp, nonce):
        self.write(echostr)
    else:
        self.write('fail')
{% endhighlight %}

<br />

{% highlight Python %}
def checksignature(self, signature, timestamp, nonce):
	args = []
    args.append('token')
    args.append(timestamp)
    args.append(nonce)
    args.sort()
    mysig = hashlib.sha1(''.join(args)).hexdigest()
    return mysig == signature
{% endhighlight %}

