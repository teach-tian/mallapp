<template>
  <div class="detail-nvbar">
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.png" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in titles" 
          class="title-item" :class="{active: index === currentIndex}"
          @click="titleClick(index)">
           {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  

export default {
  name: 'DetailNavBar',
  components :{
    NavBar
  },
  data() {
    return {
      titles:['商品','评论','详情','推荐'],
      currentIndex: 0
    }
  },
  methods: {
    titleClick(index){
      this.currentIndex = index
      this.$emit('titleClick',index)
    },
    backClick(){
      this.$router.back()
    }
  },
}
</script>

<style scoped>
.detail-nvbar{
  position: relative;
  z-index: 8;
  background-color: #ffffff;
}
  .title{
    display: flex;
    font-size: 14px;
  }
  .title-item{
    flex: 1;
  }
  .active{
    color: var( --color-hight-text);
  }
  .back img{
    width: 20px;
    height: 20px;
    margin-top: 12px;
    margin-left: 12px;
  }
</style>