<template>
  <div class="shopNavBar">
    <van-nav-bar :title="shopData.shopName" left-text="返回" @click-left="onLeft" @click-right="OnRight" left-arrow>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
import { NavBar } from 'vant';
export default {
  name: "ShopNavBar",
  props:['shopData'],
  components: {
    NavBar
  },
  data() {
    return {};
  },
  methods: {
    onLeft() {
      window.history.back();
      // this.$router.push('/' + this.$store.getters.getFromPath )
    },
    OnRight(){
      console.log(12);
    }
  }
};
</script>

<style scoped>
.detail-nvbar {
  position: relative;
  z-index: 8;
  background-color: #ffffff;
}
.title {
  display: flex;
  font-size: 14px;
}
.title-item {
  flex: 1;
}
.active {
  color: var(--color-hight-text);
}
.back img {
  width: 20px;
  height: 20px;
  margin-top: 12px;
  margin-left: 12px;
}
</style>