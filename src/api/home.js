import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs"

const home = {
  //获取首页推荐区的信息
  getHomeREC(){
    return axios.get(`${base.sq}/api/Home/getHomeREC`)
  },
  getHomeShowGoods(params){
    return axios.get(`${base.sq}/api/Home/getHomeShowGoods`,{
      params: params,
    })
  }
}

export default home