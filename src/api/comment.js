import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs";

const comment = {
  //根据商品的id 查找到商品的评论信息
  GetAllRateByGoodId(params) {
    return axios.get(`${base.sq}/api/Comment/getAllRateByGoodsId`, {
      params: params,
    });
  },
  // 评论点赞
  AddCommenUserful(params){
    return axios.patch(`${base.sq}/api/Comment/AddCommenUserful`,qs.stringify(params))
  },
  // 取消赞
  removeCommenUserful(params){
    return axios.patch(`${base.sq}/api/Comment/removeCommenUserful`,qs.stringify(params))
  }
};

export default comment;
