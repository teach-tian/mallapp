<template>
  <div class="Shop">
    <div class="shop-bg">
  <shop-nav-bar :shopData="shopData"/>
    <shop-info :shopData="shopData"/>
    </div>
    
  </div>
</template>

<script>
import ShopNavBar from './childComps/ShopNavBar'
import ShopInfo from './childComps/ShopInfo'
export default {
  name:'Shop',
  components:{
    ShopNavBar,
    ShopInfo
  },
  data() {
    return {
      shopid:'', //店铺id
      shopData:[],//店铺数据
    }
  },
  created() {
    this.getShopId()
    this.getShopData()
  },
  methods: {
    // 获得路由传递的店铺id
    getShopId(){
      this.shopid = this.$route.params.shopid
    },
    // 获取店铺信息
    getShopData(){
      this.$api.shop.getShopData({
        shop_id:this.shopid
      }).then(res=>{
        if(res.data.code === 200){
          this.shopData = res.data.data
        }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
}
</script>

<style scoped>
.Shop .shop-bg{
  background-image: url("https://s11.mogucdn.com/mlcdn/c45406/190821_165fahfg67iei7g1aljdg3hb3ilhb_750x270.png_1300x9999.v1c7E.70.webp");
}

</style>