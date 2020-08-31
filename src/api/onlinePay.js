import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs"

const onlinePay = {
  //手机网页 支付宝支付
  appWebPay(params){
    return axios.post(`${base.sq}/api/Alipay/appWebPay`,qs.stringify(params))
  },
  //手机网页 支付宝支付 查询支付状态
  ExecuteAliPay(params){
    return axios.post(`${base.sq}/api/Alipay/ExecuteAliPay`,qs.stringify(params))
  },
}

export default onlinePay