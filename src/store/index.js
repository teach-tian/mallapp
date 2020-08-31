import Vue from "vue";
import Vuex from "vuex";

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

const state = {
  //购物车数据
  carList: [],
  // 是否开启请求加载
  isLoading: true,
  editArea:{}, //保存修改的数据 在修改页面取出
  // 服务器返回的订单信息
  subOrder:[],
  searchGoods:'', //搜索的商品
  fromSearch:'', //存储哪个页面进入的搜索页
  fromPath:'',  //存储是从哪个页面进入的详情页
  //登录数据
  userData:[],
  //  需要购买的商品数据,,,当保存的是对象时会进行覆盖，最后只省一两个值
  goodIds: "", //需要购买的商品id，字符串 以空格分隔
  goodsNum:0, //购买的数量
  goodsPrice: 0, //商品的价格
  goodsAddr: "", //收货地址
  isFormCart: false, //是否是购物车过来的，如果是则需要进行数据库购物车的处理
  fromArea:'', //记录是从哪个页面进入的地址添加
  serveOrderInfo:{},  //服务器返回的订单信息
  AliFrom:'', //支付宝返回的数据 HTML代码
  goodID:'', //商品的id，用于评论、店铺的回退定位
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {},
});
