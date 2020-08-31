<template>
  <div id="content">
    <nav-bar class="home-nav">
      <div slot="center">
        <img src="~assets/img/home/LE_logo_2.png" style="width:80%" alt />
      </div>
    </nav-bar>
    <!--头部-->
    <div class="content-header clearfix">
        <a href="javascript:;" 
        :class="{'current':isShow}"
        @click="tabClick()"
        >登录</a>
        <a href="javascript:;"
        @click="tabRegister()" 
        :class="{'current':!isShow}"
        >注册</a>
    </div>
    <!--内容-->
    <div class="content-body">
        <login v-if="isShow" @toZC='tabRegister'></login>
        <register v-else @zcOK='tabClick'></register>
        <foot />
    </div>
</div>
</template>

<script>
  import Login from './childComps/Login'
  import Register from './childComps/Register'
  import foot from './childComps/foot'
  import NavBar from "components/common/navbar/NavBar.vue";

  export default {
    name:'LoginPage',
    components:{
      Login,
      Register,
      NavBar,
      foot
    },
    data() {
      return {
        // 确定是显示登陆还是注册 true为登陆状态
        isShow:true,
      }
    },
    methods: {
      tabClick(){
        this.isShow = true
      },
      tabRegister(){
        this.isShow  = false
      },
    },
  }
</script>

<style scoped>
  @import url('~assets/css/LoginPage.css');
  .text-style{
    color: red;
  }
  .nav-bar{
    height: 52px;
  }
</style>