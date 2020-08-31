import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs"
import md5 from "js-md5";
const order = {
  //展示订单详情
  getOrderInfo(params) {
    return axios.get(`${base.sq}/api/Order/getOrderInfo`, {
      params: params,
    });
  },
  //从购物车进行的下单
  getGoodsInfoFromCart(params) {
    return axios.get(`${base.sq}/api/Order/getGoodsInfoFromCart`, {
      params: params,
    });
  },
  // 验证支付密码
  verifyPayPWD(params){
    params.paypwd = md5(params.paypwd);
    return axios.post(`${base.sq}/api/Order/verifyPayPWD`, qs.stringify(params));
  },
  //修改用户支付密码
  patchPayPWD(params){
    params.paypwd = md5(params.paypwd);
    return axios.patch(`${base.sq}/api/Order/patchPayPWD`, qs.stringify(params));
  },
  // 创建订单
  cretaeOrder(params){
    return axios.post(`${base.sq}/api/Order/cretaeOrder`, qs.stringify(params));
  },
  //订单支付
  payOrder(params){
    return axios.post(`${base.sq}/api/Order/payOrder`, qs.stringify(params));
  },
  //根据订单状态获取对应的订单信息
  getOrderByState(params) {
    return axios.get(`${base.sq}/api/Order/getOrderByState`, {
      params: params,
    });
  },
  // 签收订单
  PatchDelivery(params){
    return axios.patch(`${base.sq}/api/Order/delivery`, qs.stringify(params));
  },
  // 根据订单id获取订单信息
  getOrderById(params){
    return axios.get(`${base.sq}/api/Order/getOrderById`, {
      params: params,
    });
  },
   // 取消订单
   patchOrderToCancel(params){
    return axios.patch(`${base.sq}/api/Order/patchOrderToCancel`, qs.stringify(params));
  },
  // getCancel 获取取消订单时的文本显示内容
  getCancel(){
    return axios.get(`${base.sq}/api/Order/getCancel`);
  },
   // 删除订单
   patchOrderToDelete(params){
    return axios.patch(`${base.sq}/api/Order/patchOrderToDelete`, qs.stringify(params));
  },
  //根据订单id获得订单的详细信息
  getOrderInfoByID(params) {
    return axios.get(`${base.sq}/api/Order/getOrderInfoByID`, {
      params: params,
    });
  },
  //订单评论
  orderComment(params){
    return axios.post(`${base.sq}/api/Order/orderComment`, qs.stringify(params));
  },
}

export default order;