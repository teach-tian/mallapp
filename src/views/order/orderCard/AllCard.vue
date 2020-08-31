<template>
  <div class="AllCard">
    <!--  //订单状态： 0未付款、1已付款、，2未评价，3已评价，4售后申请，5已完成售后，6已删除,7已取消 -->
    <el-card shadow="always" v-show="orderData[0].order_state === '2'">
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
    <el-card shadow="always" v-show="orderData[0].order_state === '1'">
      <shop-card :orderData="orderData">
        <div slot="shopName">卖家已发货</div>
      </shop-card>
      <div class="foot">
        <div class="foot-right">
          <van-button plain hairline round type="danger" @click="delivery()">确认收货</van-button>
        </div>
        <div class="foot-left">
          <van-button plain hairline round type="primary" @click="CheckTheLogistics()">查看物流</van-button>
        </div>
      </div>
    </el-card>
    <!--  -->
    <el-card shadow="always" v-show="orderData[0].order_state === '0'">
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
    <!--  -->
    <el-card shadow="always" v-show="orderData[0].order_state === '7'">
      <shop-card :orderData="orderData">
        <div slot="shopName">已取消</div>
      </shop-card>
      <div class="foot">
        <div class="foot-right">
          <!-- <van-button plain hairline round type="danger">支付订单</van-button> -->
        </div>
        <div class="foot-left">
          <van-button plain hairline round type="primary" @click="delteOrder()">删除订单</van-button>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" v-show="orderData[0].order_state === '3'">
      <shop-card :orderData="orderData">
        <div slot="shopName">已评价</div>
      </shop-card>
      <div class="foot">
        <div class="foot-right">
          <!-- <van-button plain hairline round type="danger">支付订单</van-button> -->
        </div>
        <div class="foot-left">
          <!-- <van-button plain hairline round type="primary" @click="delteOrder()">删除订单</van-button> -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import ShopCard from "./ShopCard";
import { Toast, Dialog } from "vant";
export default {
  name: "AllCard",
  props: ["orderData"],
  components: {
    ShopCard,
    [Dialog.Component.name]: Dialog.Component
  },
  methods: {
    // 签收订单
    delivery() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "签收中.....",
        forbidClick: true
      });
      this.$api.order
        .PatchDelivery({
          order_id: this.orderData[0].order_id
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 201) {
            //发送到父组件 进行刷新
            // 本来是打算移除数组元素进行移除显示的，，但是数组的层级有点多 不太好拿 且容易出现错误，不方便维护
            // 所以改为刷新 重新请求数据
            //签收成功 前往评价页面
            const toast = Toast.loading({
              duration: 0, // 持续展示 toast
              message: "签收成功，跳转中.....",
              forbidClick: true
            });
            setTimeout(() => {
              Toast.clear();
              //进行页面的跳转
              this.$router.push("/orderComm/" + this.orderData[0].order_id);
            }, 1000);
            // this.$emit('deliveryIsOK')
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          Toast.clear();
          // console.log(err);
          this.$message.error("网络连接异常");
        });
    },
    //前往支付订单
    payOrder() {
      this.$router.push("/myPayOrder/" + this.orderData[0].order_id);
    },
    // 取消订单
    Cancel() {
      this.$emit("cancel", this.orderData[0].order_id);
    },
    delete() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "订单删除中.....",
        forbidClick: true
      });
      this.$api.order
        .patchOrderToDelete({
          order_id: this.orderData[0].order_id
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 201) {
            //删除成功
            return this.$emit("deleteIsOK", this.orderData[0].order_id);
          } else {
            return this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          Toast.clear();
          return this.$message.error("服务器连接异常，请稍后再试");
        });
    },
    //删除订单
    delteOrder() {
      Dialog.confirm({
        title: "删除确认",
        message: "是否确认删除该订单？"
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {});
    },
    // 查看物流
    CheckTheLogistics() {
      this.$emit("showDialog", this.orderData[0].order_id);
    },
    //前往评价页
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
    //
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