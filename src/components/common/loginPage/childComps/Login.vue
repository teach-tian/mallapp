<template>
  <div id="login" class="dom">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      label-width="60px"
      :rules="loginFormRules"
      label-position="top"
      status-icon
    >
      <div class="s1">
        <el-form-item label="账号" prop="LoginName">
          <el-input
            v-model="loginForm.LoginName"
            name="LoginName"
            type="text"
            placeholder="请输入登录账号"
          ></el-input>
        </el-form-item>
      </div>
      <div class="s1">
        <el-form-item label="密码" prop="LoginPassword">
          <el-input
            v-model="loginForm.LoginPassword"
            name="LoginPassword"
            type="password"
            placeholder="请输入登录密码"
          ></el-input>
        </el-form-item>
      </div>
      <div class="s2" @click="remPWD">
        <input type="checkbox" id="remCheck" checked />
        <span>记住密码</span>
      </div>
      <el-button class="btn" @click="onSubmit" type="primary">登 录</el-button>
    </el-form>
    <div class="dom-footer">
      <div class="login-another">
        <a href="#" @click="toForgetPWD">找回密码</a>
        <span>|</span>
        <span>还没有注册帐号?</span>
        <a href="#" @click="toRegister">立即注册</a>
      </div>
      <!-- <third-platform></third-platform> -->
    </div>
  </div>
</template>

<script>
import ThirdPlatform from "./ThirdPlatform";
//获取用户登录设备
import * as sysTool from "assets/js/systemTool";
import { Toast } from "vant";

export default {
  name: "Login",
  components: {
    ThirdPlatform,
  },
  created() {
    this.getIp2();
    this.getuserLogin();
  },
  data() {
    return {
      //判断是否记住密码
      isremCheck: true,
      loginForm: {
        LoginName: "",
        LoginPassword: "",
      },
      userData: {
        login_ip: "", //ip
        login_area: "", //地区
        login_brower: "", //浏览器
        login_os: "", // 操作系统
      },
      // 表单验证
      loginFormRules: {
        LoginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        LoginPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 3,
            max: 18,
            message: "长度在 3 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //判断用户是否选择了记住密码，如果是 则取出
    getuserLogin() {
      if (this.$cookies.isKey("userLogin")) {
        let login = this.$cookies.get("userLogin");
        let arr = login.split(",");
        //存入表单
        this.loginForm.LoginName = arr[0];
        this.loginForm.LoginPassword = arr[1];
      }
    },
    toRegister() {
      this.$emit("toZC");
    },
    remPWD() {
      //修改复选框状态
      this.isremCheck = !this.isremCheck;
      document.getElementById("remCheck").checked = this.isremCheck;
    },
    // 前往 修改密码
    toForgetPWD() {
      this.$router.push("/forgetPWD");
    },
    // 登录 表单拦截
    async onSubmit() {
      await this.$refs.loginFormRef.validate(async (result) => {
        if (!result) {
          // console.log("验证不通过");
          return false;
        } else {
          //登录显示loading
          const loading = this.$loading({
            lock: true,
            text: "验证中.....",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.5)",
          });
          this.$api.user
            .login({
              LoginName: this.loginForm.LoginName,
              LoginPassword: this.loginForm.LoginPassword,
              LoginIp: this.userData.login_ip,
              LoginArea: this.userData.login_area,
              LoginBrower: this.userData.login_brower,
              LoginOs: this.userData.login_os,
            })
            .then((res) => {
              //console.log(res);
              //关闭登录显示
              loading.close();
              if (res.data.code !== 200) {
                //console.log(res);
                // 登录失败 提示失败原因
                return this.$message.error(res.data.msg);
              }
              // 否则登录成功 取出数据 存到vueX中
              const userData = {};
              userData.loginName = res.data.data.Login_name;
              userData.userImg = res.data.data.User_img;
              //添加到vuex中
              this.$store.dispatch("addUserData", userData).then((cg) => {
                // this.$message.success(res.data.msg);
                //提取登录令牌token 存到 系统中sessionStorage
                window.sessionStorage.setItem(
                  "appToken",
                  res.data.tnToken.tokenStr
                );
                //如果选择了记住密码，则将用户的登录名 密码存入cookie
                if (this.isremCheck) {
                  let value =
                    this.loginForm.LoginName +
                    "," +
                    this.loginForm.LoginPassword;
                  this.$cookies.set("userLogin", value, "7d"); //有效期为七天
                }
                // 跳转到主页
                const toast = Toast.loading({
                  duration: 0, // 持续展示 toa
                  message: "登入中...",
                  forbidClick: true,
                  loadingType: "spinner",
                });
                this.$router.push({ path: "/home" });
                //console.log(res);
              });
            })
            .catch((err) => {
              loading.close();
              console.log(err);
              return this.$message.error("服务器连接异常");
            });
        }
      });
    },
    //获取用户的登录ip
    async getIP() {
      //调用搜狐的api 获取用户登录ip
      await this.$api.user.GetUserIP({}, {}).then((res) => {
        //使用正则表达式截取返回的值 ，然后转换成json格式
        let flage = JSON.parse(res.data.match(/\{[^\}]+\}/)[0]);
        this.userData.login_ip = flage.cip;
        this.userData.login_area = flage.cname;
      });
      //获取到用户的 设备
      this.userData.login_brower = sysTool.GetCurrentBrowser();
      this.userData.login_os = sysTool.GetOs();
    },
    //新的ip查询接口
    async getIp2() {
      await this.$api.user
        .GetUserIPNew()
        .then((res) => {
          let flage = res.data.trim().split("来");
          //再次提取ip地址
          let ip = flage[0].match(/：(\S*)/);
          //提取一下地址
          let are = flage[1].replace(/\s+/g, ""); //去除全部空格
          let cname = are.match(/：(\S*)/);
          this.userData.login_ip = ip[1];
          this.userData.login_area = cname[1];
        })
        .catch((err) => {
          console.log(err);
        });
      //获取到用户的 设备
      this.userData.login_brower = sysTool.GetCurrentBrowser();
      this.userData.login_os = sysTool.GetOs();
    },
  },
};
</script>

<style>
</style>