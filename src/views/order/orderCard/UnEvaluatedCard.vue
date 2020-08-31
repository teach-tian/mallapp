<template>
  <div class="UnEvaluatedCard">
    <el-card shadow="always">
      <shop-card :orderData="orderData">
        <div slot="shopName">交易成功</div>
      </shop-card>
      <div class="foot">
        <div class="foot-right">
          <van-button plain hairline round type="primary" @click="ToCommt()">前往评价</van-button>
        </div>
        <div class="foot-left">
          <van-button plain hairline round type="danger">申请售后</van-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import ShopCard from "./ShopCard";
import { Toast } from 'vant';
export default {
  name: "UnEvaluatedCard",
  props: ["orderData"],
  components: {
    ShopCard
  },
  methods: {
    ToCommt() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "正在前往评价页.....",
        forbidClick: true
      });
      setTimeout(() => {
        Toast.clear();
        //进行页面的跳转
        this.$router.push("/orderComm/" + this.orderData[0].order_id);
      }, 1000);
    }
  }
};
</script>

<style scoped>
.el-card {
  width: 98%;
  margin: 5px auto;
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