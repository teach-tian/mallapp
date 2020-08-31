<template>
  <div id="appHome">
    <!-- exclude="Detail" -->
    <keep-alive >
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
  import MainTabBar from 'components/content/mainTabBar/MainTabBar'
  
  export default {
    name:'app',
    components :{
      MainTabBar
    }
    
  }
</script>

<style>
</style>