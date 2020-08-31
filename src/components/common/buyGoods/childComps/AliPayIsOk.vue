<template>
  <div class="AliPayIsOK">
    <!-- 头部导航 -->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">支付结果</div>
    </nav-bar>
    <div>
      <van-notice-bar left-icon="volume-o" :scrollable="false">
        <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
          <van-swipe-item>支付完成?</van-swipe-item>
          <van-swipe-item>查询一下支付结果吧</van-swipe-item>
          <van-swipe-item>请先进行支付查询再前往订单详情页，防止订单重复支付</van-swipe-item>
        </van-swipe>
      </van-notice-bar>
    </div>
    <div class="bg-img">
      <img src="~/assets/img/category/zfb.jpg" alt />
    </div>
    <div class="btn">
      <p>
        <van-button
          color="linear-gradient(to right, #4bb0ff, #00AAEF)"
          size="large"
          @click="payCode()"
        >支付查询</van-button>
      </p>
      <p>
        <van-button
          color="linear-gradient(to right, #4bb0ff, #00AAEF)"
          size="large"
          @click="toOrder()"
        >前往订单页</van-button>
      </p>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { Toast } from "vant";
export default {
  name: "AliPayIsOK",
  components: {
    NavBar
    // OrderInfo
  },
  data() {
    return {
      orderData: [],
      order_num: [],
      payOrder: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.payOrder = this.$store.getters.getPayOrder;
      this.orderData.push(...this.$store.state.subOrder);
      //拼接字符串 按空格分隔
      this.orderData.forEach(item => {
        this.order_num += item.orderNumber + " ";
      });
    },
    goback() {
      // 返回上一页
      if (this.payOrder.isFormCart) {
        this.$router.push("/cart");
      } else {
        this.$router.push("/mydetail/" + this.payOrder.goodIds);
      }
    },
    // 查询支付状态
    payCode() {
      const loading = this.$loading({
        lock: true,
        text: "支付结果查询中....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$api.onlinePay
        .ExecuteAliPay({
          OutTradeNo: this.order_num,
          TradeNo: ""
        })
        .then(res => {
          loading.close();
          if (res.data.code === 201) {
            Toast.success(res.data.msg);
          } else {
            Toast.fail(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
          Toast.fail("服务器连接异常");
        });
    },
    toOrder() {
      this.$router.push("/order/2");
    }
  }
};
</script>

<style scoped>
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
.AliPayIsOK .bg-img img {
  width: 100%;
}
.AliPayIsOK p {
  text-align: center;
  margin-top: 5px;
}
.AliPayIsOK p .van-button {
  width: 85%;
}
.AliPayIsOK .btn {
  margin-top: 50px;
}
</style>