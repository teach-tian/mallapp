import {request} from './request'
export function getDetail(iid){
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}
//商品对象
export class Goods{
  constructor(itemInfo,columns,service){
    this.title = itemInfo.title;
    this.price = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.discount = itemInfo.discountDesc;
    this.columns = columns;
    this.services = service;
    this.realPrice = itemInfo.lowNowPrice;
  }
}

export function getRecommend(){
  return request({
    url:'/recommend'
  })
}
