<template>
  <div class="foot">
    <img :src="imgUrl" alt="">
    <p> 湘ICP备19027633号</p>
  </div>
</template>

<script>
export default {
  name:'foot',
  data() {
    return {
      imgUrl:'https://www.upyun.com/static/img/%E6%A0%B7%E5%BC%8F%E5%9B%BE.7cf927c.png'
    }
  },
}
</script>

<style scoped>
.foot{
  width: 100%;
}
.foot p{
  font-size: 12px;
  text-align: center;
}
  .foot img{
    width: 200px;
    margin-left: 20%;
  }
</style>