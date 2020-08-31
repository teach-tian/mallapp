<template>
  <div>
     <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">{{orderData[1].shopName}}  > </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple goods-right" ><slot name="shopName"></slot></div>
        </el-col>
      </el-row>
      <van-card
        :num="orderData[2].num"
        tag="会员价"
        :price="orderData[2].goodsPrice"
        desc="描述信息"
        :title="orderData[2].goodsName"
        :thumb="orderData[2].goodsLogo"
        :origin-price="orderData[2].goodsOldPrice"
        @click="toCkeck()"
      />
  </div>
</template>

<script>
export default {
  name:'ShopCard',
   props:['orderData'],
   methods: {
     toCkeck(){
       console.log('准备前往详情');
       
     }
   },
}
</script>

<style scoped>
.goods-right{
  float: right;
  margin-right: -54px;
  color: red;
}
</style>