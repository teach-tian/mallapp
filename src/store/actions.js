import {
  ADD_COUNTER,
  ADD_TO_CART,
  ADD_UER_DATE,
  ADD_GOODIDS,
  ADD_GOODSPRICE,
  ADD_GOODSADDR,
  ADD_ISFORMCART,
  ADD_ORDERINFO,
  ADD_EDITAREA,
  ADD_PATH,
  ADD_FROM_AREA,
  ADD_GOODS_NUM,
  ADD_SERVE_ORDER_INFO,
  ADD_FROM_SEARCG,
  ADD_SEARCH_GOODS,
  ADD_ALI_FROM,
  ADD_GOOD_ID,
} from "./mutation-types";

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      //判断新添加的商品是否存在
      let oldProduct = context.state.carList.find(
        (item) => item.iid === payload.iid
      );
      //2.判断oldProduct是否有值
      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct);
        resolve("当前商品数量+1");
      } else {
        payload.count = 1;
        context.commit(ADD_TO_CART, payload);
        resolve("加入购物车成功");
      }
    });
  },
  //登录成功是添加用户信息到vuex
  addUserData(context, payload) {
    //console.log(context);
    context.commit(ADD_UER_DATE, payload);
    //console.log(payload);
  },
  //添加购买商品的信息
  addGoodIds(context, payload) {
    context.commit(ADD_GOODIDS, payload);
  },
  addGoodsPrice(context, payload) {
    context.commit(ADD_GOODSPRICE, payload);
  },
  addgoodsAddr(context, payload) {
    context.commit(ADD_GOODSADDR, payload);
  },
  addIsFormCart(context, payload) {
    context.commit(ADD_ISFORMCART, payload);
  },
  //添加订单信息
  addOrderInfo(context, payload) {
    context.commit(ADD_ORDERINFO, payload);
  },
  // 添加修改页面需要的数据
  addEditArea(context, payload) {
    context.commit(ADD_EDITAREA, payload);
  },
  //添加保存是哪个页面进入的详情页
  addPath(con, pay) {
    con.commit(ADD_PATH, pay);
  },
  //保存是哪个页面进入的添加地址
  addFromArea(context, payload) {
    context.commit(ADD_FROM_AREA, payload);
  },
  //保存商品购买的数量
  addGoodsNum(conx, pay) {
    conx.commit(ADD_GOODS_NUM, pay);
  },
  //保存服务器返回的订单信息
  addServe(context, payload) {
    context.commit(ADD_SERVE_ORDER_INFO, payload);
  },
  //保存进入搜索页的路由
  addPathSearch(con, pay) {
    con.commit(ADD_FROM_SEARCG, pay);
  },
  addSearchGoods(con, pay) {
    con.commit(ADD_SEARCH_GOODS, pay);
  },
  addAliFrom(con, pay) {
    con.commit(ADD_ALI_FROM, pay);
  },
  addGoodID(con, pay) {
    con.commit(ADD_GOOD_ID, pay);
  },
};
