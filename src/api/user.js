/**
 * article模块接口列表
 */
import base from "./base"; // 导入接口域名列表
import axios from "../network/http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
//导入md5加密模块 不知为什么全局挂载的有问题
import md5 from "js-md5";

const user = {
  // 检查用户名是否可用
  LoginName(params) {
    return axios.get(`${base.sq}/api/Verify/LoginName`, {
      params: params,
    });
  },
  // 检查手机号是否可用
  verifyPhone(params) {
    return axios.get(`${base.sq}/api/Verify/GetPhone`, {
      params: params,
    });
  },
  // post提交  登录
  login(params) {
    //md5加密
    params.LoginPassword = md5(params.LoginPassword);
    return axios.post(`${base.sq}/api/LoginPage/Login`, qs.stringify(params));
  },
  //   注册登录用户
  AddLogin(params) {
    params.LoginPassword = md5(params.LoginPassword);
    return axios.post(
      `${base.sq}/api/LoginPage/AddLogin`,
      qs.stringify(params)
    );
  },
  //修改用户密码 通过注册手机号码定位用户
  PatchPWD(params) {
    params.LoginPassword = md5(params.LoginPassword);
    return axios.patch(
      `${base.sq}/api/LoginPage/PatchPWD`,
      qs.stringify(params)
    );
  },
  //获取用户的详情数据
  GetUserData() {
    return axios.get(`${base.sq}/api/UserInfo/getUserData`);
  },
  //获取用户的ip地址
  GetUserIP() {
    return axios.post(`apis/cityjson?ie=utf-8`, {});
  },
  //上一个接口访问不了 改为下面的这个
  GetUserIPNew() {
    return axios.get(`http://myip.ipip.net/`);
  },
  //修改用户基础资料
  patchUserData(params) {
    return axios.patch(
      `${base.sq}/api/UserInfo/patchUserData`,
      qs.stringify(params)
    );
  },
  //   添加收货地址
  AddArea(params) {
    return axios.post(`${base.sq}/api/UserInfo/addArea`, qs.stringify(params));
  },
  //获取用户的收货地址
  GetUserArea() {
    return axios.get(`${base.sq}/api/UserInfo/getArea`);
  },
   //修改用户的收货地址
   patchUserArea(params) {
    return axios.patch(
      `${base.sq}/api/UserInfo/patchArea`,
      qs.stringify(params)
    );
  },
   //修改用户的收货地址为删除状态
   deleteArea(params) {
    return axios.patch(
      `${base.sq}/api/UserInfo/deleteArea`,
      qs.stringify(params)
    );
  },
};
export default user;
