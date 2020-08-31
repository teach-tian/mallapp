<template>
  <div class="NarBar">
    <van-nav-bar title="所有评价" left-text="返回" left-arrow @click-left="onClickLeft"  @click-right="onClickRight">
      <template #right>
        <van-icon name="replay" size="18" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
import { NavBar } from "vant";
export default {
  name: "NarBar",
  methods: {
    onClickLeft() {
      this.$router.push("/mydetail/" + this.$store.getters.getGoodID);
    },
    onClickRight(){
      this.$router.push('/emptyPage')
    }
  }
};
</script>

<style>
</style>