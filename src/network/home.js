import {request} from "./request";
//首页广告
export function getHomeMultidata(){
  return request({
    url:'/home/multidata'
  })
}
//首页商品
export function getHomeGoods(type,page){
  return request({
    url:'/home/data',
    params:{
      type,
      page
    }
  })
}
