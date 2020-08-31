<template>
  <div>
    <swiper class="swiper-image">
    <swiper-item v-for="(item,index) in topImages" :key="index">
      <img v-lazy="item" alt="" @load="imgLoad">
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
  },
  methods: {
    //
    imgLoad(){
      this.$bus.$emit("DetailItemIamgLoad");
    }
  },
}
</script>

<style scoped>
  .swiper-image{
    height: 314px;
    overflow: hidden;
  }
  .swiper-image img{
    width: 100%;
    height: 100%;
  }
</style>