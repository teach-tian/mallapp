<template>
  <div v-html="detailInfo" class="goods-info">{{detailInfo}}</div>
</template>

<script>
export default {
  name: "DetailGoodsInfo",
  props: ["detailInfo"]
};
</script>

<style>
.goods-info {
  padding: 20px 0;
  border-bottom: 5px solid #f2f5f8;
}
.graphic-pic{
  width: 100%;
}
.graphic-pic img{
  width: 100%;
}
</style>