<template>
  <div></div>
</template>

<script>
export default {
  name: "emptyPage",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace(from.path);
    });
  }
};
</script>

<style>
</style>