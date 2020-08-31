<template>
  <div class="setting">
    <nav-bar />
    <collapse />
    <exit />
    <foot />
  </div>
</template>

<script>
import NavBar from './childComps/NavBar'
import Collapse from './childComps/Collapse'
import Exit from './childComps/Exit'
import Foot from './childComps/Foot'
export default {
  name:'Setting',
  components:{
    NavBar,
    Collapse,
    Exit,
    Foot
  }
}
</script>

<style>

</style>