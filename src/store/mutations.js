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
} from './mutation-types'

export default {
  //商品累加
  [ADD_COUNTER](state,payload){
    payload.checked = true
    payload.count++
  },
  //购物车商品新添加
  [ADD_TO_CART](state,payload){
    payload.checked = true //属性 商品是否选中
    state.carList.push(payload)
  },
  //保存用户信息
  [ADD_UER_DATE](state,payload){
    state.userData.push(payload)
  },
  // 保存购买的商品信息
  [ADD_GOODIDS](state,payload){
    state.goodIds = payload
  },
  [ADD_GOODSPRICE](state,payload){
    state.goodsPrice = payload
  },
  [ADD_GOODSADDR](state,payload){
    state.goodsAddr = payload
  },
  [ADD_ISFORMCART](state,payload){
    state.isFormCart = payload
  },
  [ADD_ORDERINFO](state,payload){
    state.subOrder = payload
  },
  //添加修改页面需要的数据 
  [ADD_EDITAREA](state,payload){
    state.editArea = payload
  },
  //保存是哪个页面进入的详情页
  [ADD_PATH](state,payload){
    state.fromPath = payload
  },
  //保存是哪个页面进入的添加地址
  [ADD_FROM_AREA](state,payload){
    state.fromArea = payload
  },
  //添加商品的数量
  [ADD_GOODS_NUM](state,payload){
    state.goodsNum = payload
  },
  //添加服务器返回的订单信息
  [ADD_SERVE_ORDER_INFO](state,payload){
    state.serveOrderInfo = payload
  },
  //存储进入搜索页的
  [ADD_FROM_SEARCG](state,payload){
    state.fromSearch = payload
  },
  [ADD_SEARCH_GOODS](state,payload){
    state.searchGoods = payload
  },
  [ADD_ALI_FROM](state,payload){
    state.AliFrom = payload
  },
  [ADD_GOOD_ID](state,payload){
    state.goodID = payload
  }
}