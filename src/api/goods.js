import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs"
const goods = {
  getGoods(params) {
    return axios.get(`${base.sq}/api/Goods/getGoods`, {
      params: params,
    });
  },
  getGoodsByPrice(params) {
    return axios.get(`${base.sq}/api/Goods/GetGoodsByPrice`, {
      params: params,
    });
  },
  getGoodsInfo(params) {
    return axios.get(`${base.sq}/api/Goods/GetGoodsInfo`, {
      params: params,
    });
  },
  //添加收藏
  createFavorite(params){
    return axios.post(`${base.sq}/api/Goods/createFavorite`,qs.stringify(params))
  },
  // 进行商品收藏的移除
  removeFavorite(params){
    return axios.patch(`${base.sq}/api/Goods/removeFavorite`,qs.stringify(params))
  },
  //获取三级分类的信息
  getCatsTree(){
    return axios.get(`${base.sq}/api/Goods/getCatsTree`)
  },
  // 根据三级分类id 获得商城分类的展示信息
  getCadGoods(params) {
    return axios.get(`${base.sq}/api/Goods/getCadGoods`, {
      params: params,
    });
  },
  getSearchHot(){
    return axios.get(`${base.sq}/api/Goods/getSearchHot`)
  },
  //获取收藏夹
  getFav(params){
    return axios.get(`${base.sq}/api/Goods/getFav`,{
      params:params,
    })
  }
};

export default goods;
