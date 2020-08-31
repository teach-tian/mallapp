<template>
  <div class="profile">
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      :handleToScroll="handleToScroll"
      :handleToTouchEnd="handleToTouchEnd"
    >
      <ul v-if="isShowLoading">
        <li class="pullDown">
          <i class="el-icon-loading"></i>
          {{ pullDownMsg }}
        </li>
      </ul>
	<section class="jq22-scrollView">
    <!-- 头部 -->
    <profile-head :userData="userData" @addPoint="under" @SignInPointIsOK="SignInPointIsOK"/>
		<!-- 积分 -->
    <profile-point :userData="userData"/>
    <!-- 订单 -->
    <profile-order :OrderData="userData"/>
		<!-- 广告 -->
    <profile-adve @toAdv="under"/>
		<!-- 常用功能 -->
    <profile-fun />
		<div style="height:100px;"></div>
	</section>
   </scroll>
  </div>
</template>

<script>
import profileHead from './childComps/ProfileHead'
import ProfileFun from './childComps/ProfileFun'
import ProfilePoint from './childComps/ProfilePoint'
import ProfileOrder from './childComps/ProfileOrder'
import ProfileAdve from './childComps/ProfileAdve'

import Scroll from "components/common/scroll/scroll";
import { Toast } from 'vant';
export default {
  name:'Profile',
  components:{
    profileHead,
    ProfileFun,
    ProfilePoint,
    ProfileOrder,
    ProfileAdve,
    Scroll
  },
  created() {
    this.getUserData()
  },
  data() {
    return {
      // 用户详细的数据
      userData: {},
      //显示loading文字
      pullDownMsg: "",
      //是否显示loading
      isShowLoading: false
    };
  },
   methods: {
    //获取用户的信息
    async getUserData() {
      await this.$api.user
        .GetUserData()
        .then(res => {
          //console.log(res);
          if (res.data.code !== 200) {
            return;
          }
          this.userData = res.data.data;
          //console.log(this.userData);
        })
        .catch(res => {
          return this.$message.error("网络连接失败");
        });
    },
    handleToScroll(pos) {
      if (pos.y > 50) {
        this.isShowLoading = true;
        this.pullDownMsg = "正在更新中...";
      }
    },
    handleToTouchEnd(pos) {
      if (pos.y > 50) {
        this.$api.user
          .GetUserData()
          .then(res => {
            if (res.data.code !== 200) {
              this.pullDownMsg = "更新失败";
              setTimeout(()=>{
                this.isShowLoading = false;
                this.$message.error("更新失败");
              },1000)
              return;
            }
            setTimeout(() => {
              this.pullDownMsg = "更新成功";
              this.userData = res.data.data;
              this.$message.success('更新成功')
              this.isShowLoading = false;
            }, 2000);
            //console.log(this.userData);
          })
          .catch(res => {
            this.isShowLoading = false;
            return this.$message.error("网络连接失败");
          });
      }
    },
    //模块未开发
    under(){
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "模块开发中，敬请期待",
        forbidClick: true,
      });
      setTimeout(()=>{
       Toast.clear();
      },1500)
    },
    SignInPointIsOK(){
      this.userData.isSignInPoint = false
      this.userData.user_point += 1
    }

  }
}
</script>

<style scoped>
/* @import "assets/css/profile.css"; */
@import url('../../assets/css/profile.css');
.content {
  height: (100vh - 49px);
  position: absolute;
  top: 0;
  bottom: 49px;
  left: 0;
  right: 0;
  /* background-color: #fff; */
  overflow: hidden;
}
.pullDown {
  margin: 0;
  padding: 16px;
  text-align: center;
  border: none;
}
.profile{
  height:100vh;
  width: 100%;
  background: #efefef;
    color: #666;
}
</style>