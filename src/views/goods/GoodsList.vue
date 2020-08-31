<template>
  <div class="goods">
    <goods-list-item
      v-for="(item,index) in goods"
      :goods-item="item"
      :inputData="inputData"
      :key="index"
    />
  </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";

export default {
  name: "GoodsList",
  components: {
    GoodsListItem
  },
  props: ["goods", "inputData"]
};
</script>

<style scoped>
.goods {
  display: flex;
  flex-flow: wrap;
  padding: 3px;
  justify-content: space-around;
}
</style>