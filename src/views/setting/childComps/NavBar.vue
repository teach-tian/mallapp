<template>
  <div class="NavBar">
    <van-nav-bar title="设置"  left-arrow @click-left="onClickLeft" />
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