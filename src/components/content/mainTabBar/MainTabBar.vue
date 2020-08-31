<template>
  <tab-bar>
      <!-- activeColor="red" 更改字体颜色-->
     <tab-bar-item path="/home" activeColor="red">
       <img slot="item-icon" src="@/assets/img/tabbar/home.png" alt="">
       <img slot="item-icon-active" src="@/assets/img/tabbar/home1.png" alt="">
       <div slot="item-text">首页</div>
     </tab-bar-item>
     <tab-bar-item path="/category">
       <img slot="item-icon" src="@/assets/img/tabbar/shop.png" alt="">
       <img slot="item-icon-active" src="@/assets/img/tabbar/shop1.png" alt="">
       <div slot="item-text">商城</div>
     </tab-bar-item>
     <tab-bar-item path="/cart">
       <img slot="item-icon" src="@/assets/img/tabbar/cart.png" alt="">
       <img slot="item-icon-active" src="@/assets/img/tabbar/cart1.png" alt="">
       <div slot="item-text">购物车</div>
     </tab-bar-item>
     <tab-bar-item path="/profile">
       <img slot="item-icon" src="@/assets/img/tabbar/my.png" alt="">
       <img slot="item-icon-active" src="@/assets/img/tabbar/my1.png" alt="">
       <div slot="item-text">我的</div>
     </tab-bar-item>
    </tab-bar>
</template>

<script>
  import TabBar from 'components/common/tabbar/TabBar.vue'
  import TabBarItem from 'components/common/tabbar/TabBarItem.vue'

export default {
  name:'MainTabBar',
  components:{
      TabBar,
      TabBarItem
    }
}
</script>

<style>

</style>