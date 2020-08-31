<template>
  <div class="PayOrderIsOK">
    <!-- 头部导航 -->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">支付完成</div>
    </nav-bar>
    <div class="aui-back-box">
      <div class="aui-back-pitch">
        <img src="~assets/img/cart/icon-pitch.png" width="100" alt />
      </div>
      <div class="aui-back-title">
        <h2>支付成功</h2>
        <p>订单支付成功 请确认</p>
      </div>
      <!-- 订单详情 -->
      <!-- <orderInfo /> -->
      <br />
      <br />
      <div class="aui-back-button">
        <button @click="toOrder">查看订单</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
// import OrderInfo from "./OrderInfo";

export default {
  name: "PayOrderIsOK",
  components: {
    NavBar,
    // OrderInfo
  },
  methods: {
    goback() {
      let goods = this.$store.getters.getPayOrder;
      if (goods.isFormCart) {
        return this.$router.push("/cart");
      } else {
        return this.$router.push("/mydetail/" + goods.goodIds);
      }
    },
    toOrder(){
      //跳转到订单页
      this.$router.push('/order/2')
    }
  }
};
</script>

<style scoped>
.aui-back-box {
  height: auto;
  position: relative;
  overflow: hidden;
  text-align: center;
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
}

.aui-back-title {
  padding-top: 30px;
  padding-bottom: 40px;
}
.aui-back-title h2 {
  font-size: 16px;
  color: #333;
  padding-bottom: 5px;
}

.aui-back-title p {
  font-size: 14px;
}

.aui-back-button button {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #0d70ff;
  color: #fff;
  border: none;
  border-radius: 3px;
}
</style>