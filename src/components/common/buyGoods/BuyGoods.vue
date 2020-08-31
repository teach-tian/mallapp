<template>
  <div class="buyGoods">
    <!-- 头部导航 -->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">确认订单</div>
    </nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3">
      <!-- 收货地址的选择 -->
      <location @click.native="toArea" :addr="addr" :areData="areData" />
      <!-- 这里是展示商品预览信息的 -->
      <show-goods v-for="(item,index) in Info" :dataInfo="item" :key="index" />
    </scroll>
    <order-bottom ref="order" :dataInfo="Info" :goodsId="goodsId" />
  </div>
</template>

<script>
import Location from "./childComps/Location";
import ShowGoods from "./childComps/ShowGoods";
import OrderBottom from "./childComps/OrderBottom";

import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/scroll";
import { Toast, Notify } from "vant";

export default {
  name: "BuyGoods",
  components: {
    NavBar,
    Scroll,
    Location,
    ShowGoods,
    OrderBottom,
  },
  data() {
    return {
      goodsId: "",
      Info: {},
      isFromCart: false,
      page: 1,
      pageSize: 1, //因为是按默认地址进行的排序，所以只需要取第一条即可
      areData: {}, //存储默认地址
      payOrder: {}, //vux中保存的信息
      addr: "",
    };
  },
  created() {
    this.alterID();
  },
  updated() {
    // 用于给子组件传地址
    this.joinAddr();
    //当页面信息更新完成 调用子组件的方法 进行价格的计算
    this.$refs.order.imputed();
  },
  beforeRouteEnter(to, from, next) {
    // 购物车过来的，则需要查询购物车表的信息 获得商品选中的数量
    if (from.fullPath === "/cart") {
      next((vm) => {
        vm.isFromCart = true;
        vm.getGoodsInfoFromCart();
        vm.addPay();
        vm.getArea();
      });
    }
    // 来自详情页
    else if (from.fullPath.split("/")[1] === "mydetail") {
      next((vm) => {
        //因为当钩子执行前，组件实例还没被创建
        // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
        //当前组件的实例
        //获取信息
        vm.isFromCart = false;
        vm.getOrderInfo();
        vm.addPay();
        vm.getArea();
      });
    } else {
      next((vm) => {
        vm.getOrderInfo();
      });
    }
  },
  methods: {
    alterID() {
      // 保存goodsId,,,当是从购物车那过来的，则会传递一个由商品id组成传递字符串，按' '分隔
      this.goodsId = this.$route.params.goodsId;
      //取出vux中的值 防止用户刷新后出现无法回退操作
      setTimeout(() => {
        this.payOrder = this.$store.getters.getPayOrder;
      }, 500);
    },
    goback() {
      // 返回上一页
      if (this.payOrder.isFormCart) {
        this.$router.push("/cart");
      } else {
        this.$router.push("/mydetail/" + this.payOrder.goodIds);
      }
    },
    joinAddr() {
      this.areData = this.$store.getters.geteditArea;
      this.addr =
        this.areData.province +
        " " +
        this.areData.city +
        " " +
        this.areData.district +
        " " +
        this.areData.address +
        " ";
    },
    //通过购物车进行的购买，，需要获取购物车中商品的数量
    async getGoodsInfoFromCart() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      await this.$api.order
        .getGoodsInfoFromCart({
          goodsid: this.goodsId,
        })
        .then((res) => {
          Toast.clear();
          if (res.data.code === 200) return (this.Info = res.data.data);
        })
        .catch((res) => {
          Toast.clear();
          return Notify({ type: "danger", message: "网络连接错误" });
        });
    },
    async getOrderInfo() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      await this.$api.order
        .getOrderInfo({
          goodsid: this.goodsId,
        })
        .then((res) => {
          Toast.clear();
          if (res.data.code === 200) return (this.Info = res.data.data);
        })
        .catch((res) => {
          Toast.clear();
          return Notify({ type: "danger", message: "网络连接错误" });
        });
    },
    // 获取用户的地址
    async getArea() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      await this.$api.user
        .GetUserArea({
          params: {
            page: this.page,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          Toast.clear();
          if (res.data.code === 200) {
            // 将用户的地址保存到vux中
            return this.$store.dispatch("addEditArea", res.data.data[0]);
          }
        })
        .catch((err) => {
          Toast.clear();
          Notify({ type: "danger", message: "网络连接错误" });
        });
    },
    addPay() {
      this.$store.dispatch("addGoodIds", this.goodsId);
      this.$store.dispatch("addIsFormCart", this.isFromCart);
    },
    //前往选择收货地址的面板
    toArea() {
      this.$router.push("/selectArea/" + this.goodsId);
    },
  },
};
</script>

<style scoped>
.buyGoods .wrapper {
  height: calc(100vh - 96px);
  /* position: absolute; */
  top: 44px;
  /* bottom: 49px; */
  left: 0;
  right: 0;
  /* background-color: #fff; */
  overflow: hidden;
}
</style>