<template>
  <div class="UnPaidCard">
    <el-card shadow="always">
      <shop-card :orderData="orderData">
        <div slot="shopName">等待付款</div>
      </shop-card>
      <div class="foot">
        <div class="foot-right">
          <van-button plain hairline round type="danger" @click="payOrder()">支付订单</van-button>
        </div>
        <div class="foot-left">
          <van-button plain hairline round type="primary" @click="Cancel()">取消订单</van-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import ShopCard from "./ShopCard";
import { Toast } from "vant";
export default {
  name: "UnPaidCard",
  props: ["orderData"],
  components: {
    ShopCard,
  },
  methods: {
    // 取消订单
    Cancel() {
      this.$emit('cancel',this.orderData[0].order_id)
      
    },
    payOrder() {
      this.$router.push("/myPayOrder/" + this.orderData[0].order_id);
    }
  }
};
</script>

<style scoped>
.el-card {
  width: 98%;
  margin: 5px auto;
}
.goods-right {
  float: right;
  margin-right: -54px;
  color: red;
}
.foot {
  /* width: 200px; */
  float: right;
  height: 50px;
}
.foot .foot-right,
.foot-left {
  float: right;
}
.foot .foot-left {
  margin-right: 5px;
}
.van-button {
  width: 100px;
}
</style>