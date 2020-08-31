<template>
  <div>
    <swiper class="swiper-image">
    <swiper-item v-for="(item,index) in topImages" :key="index">
      <img :src="item" alt="">
    </swiper-item>
  </swiper>
  </div>
</template>

<script>
 import {Swiper,SwiperItem} from 'components/common/swiper'

export default {
  name:'DetailSwoper',
  components:{
    Swiper,
    SwiperItem
  },
  props:{
    topImages:{
      type:Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped>
  .swiper-image{
    height: 414px;
    overflow: hidden;
  }
  .swiper-image img{
    width: 100%;
    height: 100%;
  }
</style>