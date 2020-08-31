/**
 * api接口的统一出口
 */
// 用户 接口
import user from "./user";
//短信发送接口
import code from "./code";
// 商品 接口
import goods from "./goods";
//购物车 接口
import cart from "./cart";
//订单
import order from "./order"
//首页
import home from './home'
//店铺
import shop from './shop'
// 在线支付 支付宝，微信
import onlinePay from './onlinePay'
//记录（支付记录，余额 积分变动记录）
import log from './log'
//评论
import comment from './comment'
// 其他模块的接口……

// 导出接口
export default {
  user,
  code,
  goods,
  cart,
  order,
  home,
  shop,
  onlinePay,
  log,
  comment
  // ……
};
