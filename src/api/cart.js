import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs";

const cart = {
  addCart(params) {
    return axios.post(`${base.sq}/api/Cart/addCart`, qs.stringify(params));
  },
  getCartLength(){
    return axios.get(`${base.sq}/api/Cart/getCartLength`)
  },
  getCartInfo(params){
    return axios.get(`${base.sq}/api/Cart/getCart`,{
      params:params
    })
  },
  pathCartChecked(params){
    return axios.patch(`${base.sq}/api/Cart/pathCartChecked`, qs.stringify(params));
  },
  deleteCart(params){
    return axios.patch(`${base.sq}/api/Cart/DeleteCart`, qs.stringify(params));
  },
  patchCartNum(params){
    return axios.patch(`${base.sq}/api/Cart/patchCartNum`, qs.stringify(params));
  },
};

export default cart;
