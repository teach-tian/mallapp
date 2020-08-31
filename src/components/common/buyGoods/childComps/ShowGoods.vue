<template>
  <div class="showgoods">
    <div class="divHeight"></div>
    <div class="aui-flex">
      <div class="aui-shop-item">
        <img v-lazy="shopInfo.shopLogo" alt />
      </div>
      <div class="aui-shop-item-arrow">{{shopInfo.shopName}}</div>
    </div>
    <div class="aui-commodity-bg">
      <div class="aui-flex">
        <div class="aui-commodity-img">
          <img v-lazy="goodsInfo.goodsLogo" alt />
        </div>
        <div class="aui-flex-box">
          <h4>{{goodsInfo.goodsName}}</h4>
          <p>原价：{{goodsInfo.goodsOldPrice}}</p>
          <br />
          <span class="aui-barter-time">七天退换</span>
        </div>
        <div>
          <br />
          <h5>￥{{goodsInfo.goodsPrice}}</h5>
          <p class="aui-sml-text">X{{num}}</p>
        </div>
      </div>
    </div>
    <div class="aui-flex aui-insurance-box b-line">
      <div class="aui-insurance-img">
        <img src="~/assets/img/cart/yxf.png" alt />
      </div>
      <div class="aui-flex-box">
        <h4>运费险</h4>
        <h5>确认收货前退货可理赔</h5>
      </div>
      <div>
        <h5>￥15.00</h5>
        <p class="aui-sml-text">X1</p>
      </div>
    </div>
    <div class="aui-cp-edu b-line">
      <div class="aui-san-sml"></div>
      <div class="aui-flex aui-flex-ed">
        <div class="aui-flex-box">
          商品总价
          <em>￥69.99</em>
        </div>
      </div>
      <div class="aui-flex aui-flex-ed">
        <div class="aui-flex-box">
          运费 (快递)
          <em>￥0.00</em>
        </div>
      </div>
      <div class="aui-flex aui-flex-ed">
        <div class="aui-flex-box">
          运费险(卖家赠送)
          <em>￥0.00</em>
        </div>
      </div>
    </div>
    <div class="aui-flex aui-flex-ed">
      <div class="aui-flex-box" style="color:#333; font-size:15px;">
        商品小计
        <em style="color:#333">￥{{(goodsInfo.goodsPrice * num).toFixed(2)}}</em>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowGoods",
  data() {
    return {
      goodsInfo: {},
      shopInfo: {},
      num: 1, //购买的数量，默认为1，购物车过来的需要进行修改
    };
  },
  props: ["dataInfo",],
  created() {
    (this.goodsInfo = {}), (this.shopInfo = {});
    this.getGoodsInfo();
  },
  methods: {
    getGoodsInfo() {
      this.goodsInfo = this.dataInfo[0];
      this.shopInfo = this.dataInfo[1];
      this.num = this.dataInfo[2] ?? this.$store.getters.getGoodsNum ?? 1
    }
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
}
.box-card {
  width: 98%;
  margin: 10px auto;
}
.aui-shop-item img {
  border-radius: 50%;
}
.aui-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 15px;
    position: relative;
}
.aui-flex-box {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: #333;
    /* width: 100%; */
}
.aui-shop-item {
    width: 25px;
    height: 25px;
    margin-right: 5px;
}

.aui-shop-item img {
    width: 100%;
    height: auto;
    display: block;
    border: none;
}

.aui-shop-item-arrow {
    position: relative;
    font-size: 14px;
    color: #333;
}

.aui-shop-item-arrow:after {
    content: " ";
    display: inline-block;
    height: 8px;
    width: 8px;
    border-width: 2px 2px 0 0;
    border-color: #949494;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: -13px;
    border-radius: 1px;
}

.aui-commodity-img {
    width: 85px;
    height: 85px;
    margin-right: 5px;
}

.aui-commodity-img img {
    width: 100%;
    height: auto;
    display: block;
    border: none;
}

.aui-barter-time {
    border: 1px solid #ff5306;
    color: #ff5306;
    font-size: 13px;
    border-radius: 3px;
    background: #fff1ec;
    padding: 2px 5px;
}
.aui-pay-change .aui-flex {
    padding: 20px 30px;
    color: #fff;
}
.aui-commodity-bg .aui-flex {
    -webkit-box-align: initial;
    -webkit-align-items: initial;
    align-items: initial;
}

.aui-flex-box p {
    font-size: 12px;
    color: #999;
    padding: 5px 0;
}

.aui-pay-change .aui-flex-box p {
    color: #fff;
}

.aui-insurance-img {
    width: 25px;
    height: 25px;
    margin-right: 5px;
}

.aui-insurance-img img {
    width: 100%;
    height: auto;
    display: block;
    border: none;
}

.aui-insurance-box .aui-flex-box h5 {
    color: #999999;
}

.aui-sml-text {
    font-size: 12px;
    padding-top: 5px;
}

.aui-flex-ed em {
    float: right;
    font-style: normal;
    color: #999999;
}

.aui-cp-edu {
    position: relative;
    padding: 10px 15px;
}

.aui-cp-edu .aui-flex {
    padding: 2px 0;
    color: #999;
}

.aui-cp-edu .aui-flex-box {
    color: #999;
}

.aui-san-sml {
    position: absolute;
    bottom: 0;
    right: 27px;
    width: 0;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    border-bottom: 10px solid #e5e5e5;
}

.aui-flex-text-sml p {
    color: #666666;
    font-size: 12px;
}

.aui-flex-text-sml p em {
    font-style: normal;
    padding-right: 5px;
}

.aui-btn-copy {
    border: 1px solid #ddd;
    font-size: 12px;
    padding: 2px 10px;
    border-radius: 2px;
}

.aui-confirm-flex {
    position: relative;
    line-height: 40px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}

.aui-confirm-flex .aui-modify-btn {
    position: relative;
    text-align: center;
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 0 2px;
    font-size: 0.8rem;
    color: #191919;
    height: 45px;
    line-height: 45px;
}
</style>