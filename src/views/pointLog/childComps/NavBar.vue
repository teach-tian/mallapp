<template>
  <div class="NavBar">
    <van-nav-bar title="积分明细" left-text="返回" left-arrow @click-left="onClickLeft">
      <template #right>
        <van-icon name="replay" size="18" @click="onReplay"/>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    onClickLeft() {
      this.$router.push("/profile");
    },
    onReplay(){
      this.$router.push("/emptyPage")
    }
  }
};
</script>

<style>
</style>