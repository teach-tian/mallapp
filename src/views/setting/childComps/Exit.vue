<template>
  <div class="exit">
    <el-card class="box-card">
      <div class="text item" @click="toLogin">切换账号</div>
    </el-card>
    <el-card class="box-card">
      <div class="text item" @click="quit">注销登录</div>
    </el-card>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      description="您可以做以下操作"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>

<script>
import { Dialog, ActionSheet } from "vant";
export default {
  name: "Exit",
  data() {
    return {
      show: false,
      actions: [{ name: "换个账号登录" }, { name: "注销当前登录" }]
    };
  },
  methods: {
    toLogin() {
      Dialog.confirm({
        title: "退出确认",
        message: "该操作将退出登录，是否确认?"
      })
        .then(() => {
          // 进行token清除 跳转到登录页
          window.sessionStorage.removeItem("appToken");
          this.$router.push("/");
        })
        .catch(() => {
          // on cancel
        });
    },
    quit() {
      this.show = true;
    },
    unsubscribe() {
      Dialog.confirm({
        title: "注销确认",
        message: "该操作将注销所有登录信息，是否确认?"
      })
        .then(() => {
          // 进行token清除 跳转到登录页
          window.sessionStorage.removeItem("appToken");
          // 清除登陆账号保存
          let value = "" + "," + "";
          this.$cookies.set("userLogin", value);
          // 清空搜索记录
          let list = [];
          localStorage.setItem("historyList", JSON.stringify(list));
          // 返回登录
          this.$router.push("/");
        })
        .catch(() => {
          // on cancel
        });
    },
    onSelect(action, index) {
      if (index === 0) {
        return this.toLogin();
      } else {
        return this.unsubscribe();
      }
    }
  }
};
</script>

<style scoped>
.exit .box-card {
  margin-top: 10px;
}
.exit .text {
  font-size: 14px;
  text-align: center;
}
</style>