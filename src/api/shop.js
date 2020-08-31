import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs"; 

const shop = {
  getShopData(params){
    return axios.get(`${base.sq}/api/Shop/getShopData`,{
      params:params
    })
  }
}

export default shop