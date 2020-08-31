import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例 

const code = {
  //获取短信验证码
  getCode(params){
    return axios.get(`${base.sq}/api/SMSCode/GetCode`, {
      params: params,
    });
  }
}

export default code