<template>
  <div class="aui-bar-footer">
    <div class="aui-flex">
      <div class="aui-flex-box">
        应付金额：
        <em>￥{{(goodsInfo.totalPrice).toFixed(2)}}</em>
      </div>
      <div class="aui-flex-box">
        共计：
        <span>x{{goodsInfo.totalNum}} 件</span>
      </div>
      <div class="aui-btn-button">
        <button class="pay" @click="toPay()">去支付</button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { Toast, Notify } from "vant";
export default {
  name: "OrderBottom",
  props: ["dataInfo", "goodsId"],
  data() {
    return {
      goodsInfo: {
        totalPrice: 0,
        totalNum: 0,
        areaData: {},
        addr: "",
      },
    };
  },
  methods: {
    imputed() {
      // 防止多余的计算，可能会进行多次组件的加载
      this.goodsInfo.totalPrice = 0;
      this.goodsInfo.totalNum = 0;
      this.dataInfo.forEach((item) => {
        this.goodsInfo.totalPrice +=
          item[0].goodsPrice *
          (item[2] ?? this.$store.getters.getGoodsNum ?? 1);
        this.goodsInfo.totalNum +=
          item[2] ?? this.$store.getters.getGoodsNum ?? 1;
      });
    },
    //前往订单支付
    toPay() {
      // 判断是否选择了收货地址
      // 提取出vux中存储的地址信息
      this.areaData = _.cloneDeep(this.$store.getters.geteditArea);
      // 判断是否有选择收货地址
      let arr = Object.keys(this.areaData);
      if (arr.length === 0) {
        // 此时还没有收货地址
        return Notify({ type: "danger", message: "请先选择收货地址" });
      }
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "订单创建中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      //将价格添加到vux中
      this.$store.dispatch("addGoodsPrice", this.goodsInfo.totalPrice);
      this.addr =
        this.areaData.province +
        " " +
        this.areaData.city +
        " " +
        this.areaData.district +
        " " +
        this.areaData.address +
        " ";
      //  进行用户地址的拼接，不保存用户的地址id 防止用户收货地址修改或删除 造成订单不可查询
      let consignee_addr =
        this.areaData.name + "," + this.areaData.phone + "," + this.addr;
      //判断是否是购物车来的 isFormCart
      let isFcart = this.$store.getters.getPayOrder;
      //获得需要购买的商品数
      let payNum = this.$store.getters.getGoodsNum;
      //创建订单
      this.$api.order
        .cretaeOrder({
          price: this.goodsInfo.totalPrice,
          consignee_addr: consignee_addr,
          goodsId: this.goodsId,
          isFcart: isFcart.isFormCart,
          num: payNum,
        })
        .then((res) => {
          Toast.clear();
          if (res.data.code === 201) {
            //创建成功 取出订单信息，并保存到vux中
            let info = [];
            info.push(...res.data.data);
            this.$store.dispatch("addOrderInfo", info);
            return this.$router.push("/payOrder");
          } else {
            return Notify({ type: "danger", message: res.data.msg });
          }
        })
        .catch((err) => {
          Toast.clear();
          return Notify({ type: "danger", message: "网络连接错误" });
        });
    },
  },
};
</script>

<style scoped>
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
.pay {
  margin: 0;
  font: inherit;
  color: inherit;
  outline: none;
  background: none;
  border: none;
}
.aui-bar-footer {
  line-height: 52px;
  height: 52px;
  background: #fff;
  box-shadow: 0 -2px 10px #ddd;
}

.aui-btn-button {
  background: #f21956;
  padding: 0 25px;
  color: #fff;
  font-size: 14px;
}

.aui-bar-footer .aui-flex {
  padding: 0;
}

.aui-bar-footer {
  padding-left: 15px;
}

.aui-bar-footer .aui-flex-box em {
  font-style: normal;
  color: #f21956;
}
</style>