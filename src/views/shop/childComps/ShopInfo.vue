<template>
<!-- :style="{'backgroundImage': 'url(' + shopData.bgImg + ')'}" -->
  <div class="ShopInfo" >
    <van-row>
      <van-col span="6">
        <van-image round :src="shopData.shopLogo" />
      </van-col>
      <van-col span="18">
        <p>{{shopData.shopName}}</p>
        <van-rate v-model="shopData.shopPiont" readonly />
        <p class="sell">
          <span>销量 {{shopData.sells}} | </span>
          <span>商品数 {{shopData.snum}}</span>
          </p>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: "ShopInfo",
  props: ["shopData"]
};
</script>

<style scoped>
.ShopInfo .van-col .van-image {
  width: 53px;
  height: 53px;
  margin-left: 25%;
}
.ShopInfo .sell{
  font-size: 12px;
}
</style>