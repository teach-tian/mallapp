import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs"

const log = {
  //获取余额变动记录
  getBalanceLog(params) {
    return axios.get(`${base.sq}/api/Log/getBalanceLog`, {
      params: params,
    });
  },
  //获取用户积分变动记录
  getPointLog(params) {
    return axios.get(`${base.sq}/api/Log/getPointLog`, {
      params: params,
    });
  },
  //用户签到
  addPointFromSignIn(params) {
    return axios.get(`${base.sq}/api/Log/addPointFromSignIn`, {
      params: params,
    });
  },
}

export default log