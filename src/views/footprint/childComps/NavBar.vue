<template>
  <div class="NavBar">
    <van-nav-bar title="我的足迹" left-text="返回" left-arrow @click-left="onClickLeft" />
  </div>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    onClickLeft() {
      this.$router.push('/profile')
    }
  }
};
</script>

<style>
</style>