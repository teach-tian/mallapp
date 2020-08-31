<template>
  <div class="check-button" >
    <img src="~assets/img/common/xz.png" alt="" :class="{check: isCheck}">
  </div>
</template>

<script>
  export default {
    name: "CheckButton",
    props:{
      isCheck:{
        type:Boolean,
        default:false
      }
    }
  }
</script>

<style scoped>
  .check-button img{
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    vertical-align: middle;
    margin-bottom: 6px;
    margin-right: 6px;

  }
  .check {
    border-radius: 50%;
    background-color: red;
  }
</style>