<template>
  <div>
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{cartLength}})</div>
      <div slot="right" @click="edit" v-show="!isedit">管理</div>
      <div slot="right" @click="edit" v-show="isedit">完成</div>
    </nav-bar>
    <cart-goods-list
      ref="goodsList"
      @handleToNew="handleToNewP"
      :cartList="cartList"
      :isedit="isedit"
    ></cart-goods-list>
    <cart-bottom-bar :cartList="cartList" @deleteOk="deleteOkP" :isedit="isedit"></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { Toast } from "vant";

import CartGoodsList from "./childComps/CartGoodsList";
import CartBottomBar from "./childComps/CartBottomBar";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartGoodsList,
    CartBottomBar
  },
  data() {
    return {
      cartList: [],
      page: 1,
      pageSize: 5,
      cartLength: 0,
      isedit: false,
      product_id: ""
    };
  },
  activated() {
    //防止出现点击商品到详情页回来出现商品加载错误的情况
    this.page = 1;
    this.cartList = [];
    this.getCartInfo();
    this.getLenght();
  },
  methods: {
    // 进入编辑状态
    edit() {
      this.isedit = !this.isedit;
    },
    getCartInfo() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.cart
        .getCartInfo({
          page: this.page,
          pageSize: this.pageSize
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 200) {
            this.cartList.push(...res.data.data);
            this.$refs.goodsList.finish();
          } else if (res.data.code === 404) {
            //调用子组件中的方法 告诉用户已经加载完了，没有更多
            this.$refs.goodsList.noAny();
          }
        })
        .catch(err => {
          Toast.clear();
          Toast.fail('加载失败');
          this.$message.error("可能网络走神了");
        });
    },
    getLenght() {
      this.$api.cart
        .getCartLength()
        .then(res => {
          this.cartLength = res.data.data;
        })
        .catch(err => {
          this.$message.error("可能网络走神了");
        });
    },
    handleToNewP() {
      // console.log(this.page);
      this.page += 1;
      this.getCartInfo();
    },
    //删除成功，重新请求数据
    deleteOkP() {
      this.cartList = [];
      this.page = 1;
      this.getCartInfo();
      this.getLenght();
    }
  }
};
</script>

<style scoped>
</style>