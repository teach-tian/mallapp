<template>
<div class="bottom-bar">
    <div class="bar-item bar-left">
      <div @click="toService">
        <img src="~assets/img/common/kf.png" class="icon service" />
        <span class="text">客服</span>
      </div>
      <div @click="pushCart">
        <img src="~assets/img/common/cart.png" class="icon shop" />
          <span class="text">购物车</span>
      </div>
      <div @click="addEnshrine">
        <img src="~assets/img/common/sc4.png" class="icon select" />
        <span class="text">收藏</span>
      </div>
    </div>
    <div class="bar-item bar-right">
      <div class="cart" @click="addCart">加入购物车</div>
      <div class="buy" @click="buyClick">购买</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name:'DetailBottomBar',
  methods: {
    addCart(){
      this.$emit("addCart")
    },
    buyClick(){
      this.$emit("buyClick")
    },
    addEnshrine(){
      this.$emit("addEnshrine")
    },
    toService(){
      this.$emit("toService")
    },
    //跳转到购物车
    pushCart(){
      this.$router.replace('/cart')
    }
  },
  computed: {
   //将getters中的 cartLength映射到该处
  //  ...mapGetters({
  //    length:'cartLength'
  //  })
 },
}
</script>

<style scoped>
  .cartSum{
    position: fixed;
    left: 28%;
    z-index: 9;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background-color: red;
    color: #fff;
    border-radius: 50%;
  }
  .bottom-bar {
  /* position: relative; */
  position: fixed;
  z-index: 10;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 49px; 
  display: flex;
  text-align: center;
  background-color: white;
  z-index: 10;
  }
  .bar-item{
    flex: 1;
    display: flex;
  }
  .bar-item>div{
    flex: 1;
  }
  .bar-left .tex{
    font-size: 13px;
  }
  .bar-left .icon{
    display: block;
    width: 22px;
    height: 22px;
    margin: 4px auto 3px;
  }
  .bar-left .service{
    background-position: 0 -54px;
  }
  .bar-left .shop{
    background-position: 0 98px;
  }
  .bar-right{
    font-size: 15px;
    color: white;
    line-height: 49px;
  }
  .bar-right .cart{
    background-color: #ffe817;
    color: black;
  }
  .bar-right .buy{
    background-color: #eb4868;
  }

</style>