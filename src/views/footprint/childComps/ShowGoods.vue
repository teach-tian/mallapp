<template>
  <div class="showGoods">
    <!-- 日期的选择 -->
    <van-cell title="请选择查看日期" :value="date" @click="show = true" />
    <van-calendar v-model="show" @confirm="onConfirm" />
    <show-goods-item v-for="(item,index) in goods" :goods-item="item" :key="index" />
  </div>
</template>

<script>
import { Calendar } from "vant";
import ShowGoodsItem from "./ShowGoodsItem";
export default {
  name: "ShowGoods",
  props: ["goods"],
  components: {
    ShowGoodsItem,
    Calendar
  },
  data() {
    return {
      date: "",
      show: false
    };
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.date = this.formatDate(date);
    }
  }
};
</script>

<style scoped>
.showGoods {
  display: flex;
  flex-flow: wrap;
  padding: 3px;
  justify-content: space-around;
}
</style>