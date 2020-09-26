# mallapp

## LE 购手机购物网站使用说明

#  搭配使用

#### 需要搭配使用仓库 [MallAPI](https://gitee.com/YGWG-LX/MallAPI)  的接口

[在线接口文档](https://october.w.eolinker.com/#/share/index?shareCode=ZsQNDF)

接口使用需将域名更改为 **http://www.hj0819.top:44369**

 #### [在线演示地址](http://hj0819.top)

请调整至手机模式查看（f12 ==》手机模式，推荐使用谷歌，屏幕大小：414x736，86%缩放）

测试账号：admin

测试密码： 123

购买密码：123456

支付宝沙箱账号：yoxhbc1142@sandbox.com，登录与支付密码：111111

2020-09-04更新说明：

1. 商品评论新增敏感词检测（词汇较少，例如："垃圾", "装逼"）
2. 登录、注册、发送验证码添加滑块验证，启用ssl证书

###### 项目运行图

1. 登录注册：

   | <img src="https://pic.downk.cc/item/5f19361514195aa5941975ea.png" alt="注册" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f1935da14195aa5941950a5.png" alt="登录" style="zoom:25%;" /> |
   | :----------------------------------------------------------: | :----------------------------------------------------------: |
   |                                                              |                                                              |

   

2. 项目内部运行图

   | <img src="https://pic.downk.cc/item/5f1935f614195aa5941964e3.png" alt="首页" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f1935f614195aa5941964df.png" alt="商城、分类" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f1935f614195aa5941964dd.png" alt="购物车" style="zoom:25%;" /> |
   | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
   | <img src="https://pic.downk.cc/item/5f1935f614195aa5941964e6.png" alt="个人中心" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193b3a14195aa5941d1820.png" alt="订单中心" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193b3a14195aa5941d1825.png" alt="商品评价" style="zoom:25%;" /> |
   | <img src="https://pic.downk.cc/item/5f193bef14195aa5941de611.png" alt="搜索页" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193bef14195aa5941de60e.png" alt="商品搜索" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f1935f614195aa5941964e1.png" alt="详情页" style="zoom:25%;" /> |
   | <img src="https://pic.downk.cc/item/5f193e2314195aa5941f1a82.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193e2314195aa5941f1a84.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193e2314195aa5941f1a88.png" style="zoom:25%;" /> |
   | <img src="https://pic.downk.cc/item/5f193e8514195aa5941f60b9.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193e8514195aa5941f60b9.png" style="zoom:25%;" /> |            *** ps:支付宝支付需要使用沙盒账号 ***             |

   

   ##### 项目结构(部分) ，，，api封装有接口

   | <img src="https://pic.downk.cc/item/5f193f5d14195aa5941fe412.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f5d14195aa5941fe40e.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f5d14195aa5941fe412.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f5d14195aa5941fe412.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f5614195aa5941fdfa1.png" style="zoom:25%;" /> |
   | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
   | <img src="https://pic.downk.cc/item/5f193f4114195aa5941fd264.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f4114195aa5941fd269.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f4114195aa5941fd267.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f5614195aa5941fdfa1.png" style="zoom:25%;" /> | <img src="https://pic.downk.cc/item/5f193f4114195aa5941fd26c.png" style="zoom:25%;" /> |

   

## 项目依赖的安装与使用

```
npm install
```

### 项目运行
```
npm run serve
```

### 项目打包
```
npm run build
```



### 项目模块：

1. 登录注册
   + 手机号注册，调用阿里云短信服务接口
   + 手机号是找回登录密码、支付密码的唯一验证
   + 登录密码、支付密码采用MD5加密方式
   + 后台会记录用户的登录ip、时间、浏览器类型、登录状态
2. 首页
   + 轮播区图片的展示，暂时未做轮播跳转地址的页面设计，所以仅作展示用
   + 分类选择区 ，从数据库获取到分类的标题与ico，点击跳转到搜索界面 并进行搜索，注意 该方式进行的搜索不会记录到搜索历史中
   + 热门、新款、最新商品推荐
3. 商场（分类）
   + 头部nav-bar可跳转到搜索页面
   + 左侧遍历数据库的第三级分类进行展示
   + 右侧对左侧标题的选择进行对应加载、显示
   + 可点击右侧对应展示的商品跳转到详情页面
4. 购物车
   + 用户可在详情页进行商品的购物车加购
   + 可进行购物车数量的添加与减少，最少一件 最多十件
   + 可进行购物车中商品的删除、结算
   + 结算时可选择单个结算与多个商品的结算，底部导航可对价格、数量 进行实时的计算
   + 删除时可选择单个删除与多个一同删除
   + 头部导航会统计购物车中商品的总数、采用分页展示，每次最多展示5条商品
5. 个人中心
   + 用户可查看自己的个人详情及相应的修改
   + 收货地址的管理
   + 浏览记录管理
   + 商品收藏的管理
   + 余额、积分变动详情
   + 每日签到
   + 订单的管理
6. 详情页
   + 商品详情的展示
   + 商品的购买、加购购物车与取消
   + sku属性展示（暂时只有默认的属性）
   + 用户购买评价、追评、回复的展示
   + 前往店铺 进行店铺商品的检索
   + 联系客服
7. 购买功能
   + 确定下单前可进行商品的确认、收货地址的修改、购买总数与总价的核算
   + 支付暂时仅支持支付宝网页支付与本商城的余额支付，余额支付的默认密码为123456，忘记密码可前往忘记页面进行密码重置（手机号需要与登录账户的注册手机一致），支付宝支付需要使用沙盒账户支付，普通账户会显示支付异常
   + 对于已创建，未完成支付的订单可前往个人中心的订单管理进行支付与取消，，在支付页面停留超过15分钟会自动跳转到订单管理中心
   + 使用支付宝支付时 在支付途中退出，也将跳转到订单管理中心
   + 支付宝支付完成 会跳转到支付验证页面，需要用户手动进行支付的验证（因为支付宝的异步通知需要内网穿透，我的穿透太慢 没法完成异步通知的调试，就选择了主动查询的方式向支付宝查询支付状态）

