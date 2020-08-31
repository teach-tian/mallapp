<template>
  <div v-if="Object.keys(detailInfo).length !==0" class="goods-info">
    <div class="info-desc clear-fix">
      <div class="start"></div>
      <div class="desc">{{detailInfo.desc}}</div>
      <div class="end"></div>
    </div>
    <div v-for="item1 in detailInfo.detailImage">
      <div class="info-key">{{item1.key}}</div>
      <div class="info-list">
        <img v-for="(item,index) in item1.list" :key="index" :src="item" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'DetailGoodsInfo',
  props:{
    detailInfo:{
      type:Object,
      default(){
        return {}
      }
    }
  }
}
</script>

<style scoped>
  .goods-info{
    padding: 20px 0;
    border-bottom: 5px solid #f2f5f8;
  }
  .info-desc{
    padding: 0 15px;
  }
  .info-desc .start,info-desc .end{
    position: relative;
  }
  .info-desc .start{
    float: left;
    width: 90px;
    background-color: #333;
    height: 1px;
  }
  .info-desc .end{
    float: right;
    width: 90px;
    background-color: #333;
    height: 1px;
  }
  .info-desc .start::before{
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #333;
    bottom: 0;
  }
  .info-desc .end::after{
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #333;
    margin-right: 10px;
    /* bottom: 0; */
  }
  .info-desc .end::after{
    right: 0;
  }
  .info-desc .desc{
    padding: 15px 0;
    font-size: 14px;
  }
  .info-key{
    margin: 10px 0 10px 15px;
    color: #333;
    font-size: 15px;
  }
  .info-list img{
    width: 100%;
  }
</style>