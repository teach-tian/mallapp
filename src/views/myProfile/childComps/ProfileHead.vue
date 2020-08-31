<template>
  <div class="profileHead">
    <div class="jq22-take-head">
      <div class="jq22-flex jq22-flex-one">
        <div class="jq22-take-user" @click="detailPage">
          <img :src="userData.user_img" alt />
        </div>
        <div class="jq22-flex-box" @click="detailPage">
          <h2>{{userData.login_name}}</h2>
          <h2>
            <span>{{userData.customer_name}}</span>
            <span v-if="userData.gender - 0 === 0 ">先生</span>
            <span v-else-if="userData.gender - 0 ===1 ">女士</span>
          </h2>
          <span>
            <i class="icon icon-phone"></i>
            {{userData.mobile_phone}}
          </span>
        </div>
        <div class="jq22-take-button" @click="getPoint()">
          <button>
            <span v-if="userData.isSignInPoint">签到领积分</span>
            <span v-else>已签到</span>
          </button>
        </div>
      </div>
      <div class="jq22-flex jq22-flex-two" @click="addPoint()">
        <div class="jq22-flex-box">
          <h3>每天领红包，年卡仅0.12元/天</h3>
        </div>
        <div class="jq22-go-button">
          <button>立即开通</button>
        </div>
      </div>

      <img src="~assets/img/profile/images/head.png" alt />
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "profileHead",
  props: ["userData"],
  methods: {
    //跳转到个人详情页
    detailPage() {
      this.$router.push({ path: "/detailPage" });
    },
    //领取积分
    getPoint() {
      if (!this.userData.isSignInPoint) {
        return Toast.fail("今日已签到，明天再来吧！");
      }
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "签到中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.log
        .addPointFromSignIn()
        .then(res => {
          Toast.clear();
          if (res.data.code === 201) {
            //签到成功
            return this.$emit("SignInPointIsOK");
          } else {
            return Toast.fail(res.data.msg);
          }
        })
        .catch(err => {
          Toast.clear();
          return Toast.fail("服务器连接异常！");
        });
    },
    addPoint() {
      this.$emit("addPoint");
    }
  }
};
</script>

<style scoped>
.jq22-take-button button {
  display: inline-block;
  line-height: 30px;
}
.jq22-take-button span,
.jq22-take-button i {
  line-height: 30px;
}
</style>