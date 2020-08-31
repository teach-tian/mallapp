export default {
  cartLength(state) {
    return state.carList.length;
  },
  cartList(state) {
    return state.carList;
  },
  //返回用户信息
  userData(state) {
    return state.userData;
  },
  //返回购买商品的数据
  getPayOrder(state) {
    let payOrder = {};
    payOrder.goodIds = state.goodIds;
    payOrder.goodsPrice = state.goodsPrice;
    payOrder.goodsAddr = state.goodsAddr;
    payOrder.isFormCart = state.isFormCart;
    return payOrder;
  },
  getGoodids(state){
    return state.goodIds
  },
  getGoodsNum(state){
    return state.goodsNum
  },
  // 返回订单信息
  getOrder(state){
    return state.subOrder
  },
  // 返回修改页面的数据
  geteditArea(state){
    return state.editArea
  },
  //获取是从哪个页面进入的详情页
  getFromPath(state){
    return state.fromPath
  },
  // 哪个页面进入的搜索页
  getFromSearch(state){
    return state.fromSearch
  },
  // 获取哪个页面进入的添加地址页面
  getFromArea(state){
    return state.fromArea
  },
  //返回服务器的订单信息
  getServe(state){
    return state.serveOrderInfo
  },
  //搜索页面正在进行搜索的商品
  getSearchGoods(state){
    return state.searchGoods
  },
  getAliFrom(state){
    return state.AliFrom
  },
  getGoodID(state){
    return state.goodID
  },
};
