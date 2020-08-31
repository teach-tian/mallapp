<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    // 解决浏览器刷新vuex数据丢失问题
    if (sessionStorage.getItem("store")) {
      //页面加载前读取sessionStorage里的状态信息
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    window.addEventListener("beforeunload", () => {
      //在页面刷新前将vuex里的信息保存到sessionStorage里
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  }
};
</script>
<style>
@import "assets/css/base.css";
#app {
  margin: auto 0;
}
</style>