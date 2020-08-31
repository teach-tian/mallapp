<template>
  <swiper>
      <swiper-item v-for="item in banners" :key="item.acm">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="imageLoad">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
//轮播图
import {Swiper,SwiperItem} from 'components/common/swiper/index'
export default {
  name:'HomeSwiper',
  props:{
    banners:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      isLoad: false
    }
  },
  components:{
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad(){
      if(!this.isLoad){
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  }
}
</script>

<style scoped>

</style>