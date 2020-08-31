<template>
  <div class="footprint">
    <nav-bar />
    <show-goods />
  </div>
</template>

<script>
import NavBar from './childComps/NavBar'
import ShowGoods from './childComps/ShowGoods'
export default {
  name:'Footprint',
  components:{
    NavBar,
    ShowGoods
  }
}
</script>

<style>

</style>