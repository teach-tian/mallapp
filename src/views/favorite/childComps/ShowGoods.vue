<template>
  <div class="showGoods">
    <show-goods-item v-for="(item,index) in goods" :goods-item="item" :key="index" />
  </div>
</template>

<script>
import ShowGoodsItem from './ShowGoodsItem'
export default {
  name:'ShowGoods',
  props:['goods'],
  components:{
    ShowGoodsItem
  }
}
</script>

<style scoped>
.showGoods{
    display: flex;
    flex-flow: wrap;
     padding: 3px;
     justify-content: space-around;
  }
</style>