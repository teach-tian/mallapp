<template>
  <div class="SearchHot">
    <van-divider content-position="left">全网热搜</van-divider>
    <div class="hot">
      <van-tag plain v-for="(item,index) in SearchHotList" :key="index" size="large" @click="click(item,index)">{{item}}</van-tag>
    </div>
    
  </div>
</template>

<script>
export default {
  name:'SearchHot',
  props:['SearchHotList'],
  methods: {
    click(item,index){
     this.$emit('hotClick',item)
    }
  },
}
</script>

<style scoped>
.SearchHot .hot{
  width: 85%;
  margin: 0 auto;
}
.SearchHot .hot .van-tag{
  margin: 3px 7px;
}
</style>