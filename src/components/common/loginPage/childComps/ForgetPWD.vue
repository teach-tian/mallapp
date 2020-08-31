<template>
  <div>
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
    </nav-bar>
    <el-card>
      <el-alert title="忘记密码" type="info" center show-icon :closable="false"></el-alert>
      <!--  -->
      <el-steps :active="activeIndex - 0" align-center>
        <el-step title="身份验证"></el-step>
        <el-step title="密码重置"></el-step>
        <el-step title="重置完成"></el-step>
      </el-steps>
      <!-- tab 区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="100px"
        label-position="top"
        status-icon
      >
        <el-tabs type="border-card" v-model="activeIndex" :before-leave="beforeTabLeave">
          <el-tab-pane label="身份验证" name="0">
            <!-- 验证通过 在数据库中能够查找到该手机号 -->
            <el-form-item label="注册手机" prop="phone" ref="verifyPhone">
              <el-input
                v-model="editForm.phone"
                @blur="verifyPhone"
                placeholder="请输入注册用的手机"
                ref="input_phone2"
              ></el-input>
            </el-form-item>
            <!-- 短信验证码 -->
            <SMS-verification
              :phone="editForm.phone"
              :codeIsOK="codeIsOK"
              :phoneIsOK="phoneIsOK"
              @codeOk="codeOkP"
              :type="type"
            />
            <el-form-item>
              <el-button type="primary" @click="next1" class="next" :phoneIsOK="phoneIsOK">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="密码重置" name="1">
            <el-form-item label="新密码" prop="newPWD">
              <el-input
                v-model="editForm.pwd"
                type="password"
                placeholder="请输入新的密码"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repwd">
              <el-input
                v-model="editForm.repwd"
                type="password"
                placeholder="请确认新密码"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onsubmit" class="next">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="重置完成" name="2">
            <el-form-item>
              <el-alert title="密码重置成功" type="success" center show-icon description="重置密码成功，请返回登录"></el-alert>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="toLogin" class="next">返回登录</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import SMSVerification from "../../SMSverification/SMSVerification";
export default {
  name: "ForgetPWD",
  components: {
    NavBar,
    SMSVerification
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value) {
        let re = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
        if (re.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的手机号码"));
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (this.editForm.pwd === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.editForm.pwd !== "") {
          this.$refs.editForm.validateField("repwd");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (this.editForm.repwd === "") {
        callback(new Error("请再次输入密码"));
      } else if (this.editForm.repwd !== this.editForm.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 确定是哪个面板被激活
      activeIndex: "0",
      type: "Forget",
      // 重置是否完成
      editIsOK: false,
      //验证码 验证是否通过
      codeIsOK: false,
      // 修改的数据
      editForm: {
        pwd: "",
        repwd: ""
      },
      // 该手机号是否有注册 默认是没有
      phoneIsOK: false,
      // 验证规则
      editFormRules: {
        phone: [
          { required: true, message: "请输入注册手机", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        yzm: [{ required: true, message: "请输入注册手机", trigger: "blur" }],
        newPWD: [
          { validator: validatePass, trigger: "blur" }
          // { required: true, message: "请输入密码", trigger: "blur" }
        ],
        repwd: [
          { validator: validatePass2, trigger: "blur" }
          // { required: true, message: "请确认密码", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    goback(){
      this.$router.push({ path: "/LoginPage" });
    },
    //重置成功 返回登录
    toLogin() {
      this.$router.push({ path: "/LoginPage" });
    },
    //子组件发送完成验证
    codeOkP() {
      this.codeIsOK = true;
    },
    //切换验证
    beforeTabLeave(activeName, oldActiveName) {
      //判断是否经过手机号的验证 并准备进入重置选项
      if (oldActiveName === "0" && activeName === "1" && !this.codeIsOK) {
        this.$message.error("请先完成身份验证");
        return false;
      }
      if (
        oldActiveName === "0" &&
        activeName === "2" &&
        !this.codeIsOK &&
        !this.editIsOK
      ) {
        this.$message.error("请先完成身份验证");
        return false;
      }
      if (oldActiveName === "1" && activeName === "2" && !this.editIsOK) {
        this.$message.error("请完成密码重置");
        return false;
      }
      //不得回复操作
      if (oldActiveName === "2" && activeName === "0") {
        return false;
      }
      if (oldActiveName === "1" && activeName === "0") {
        return false;
      }
      if (oldActiveName === "2" && activeName === "1") {
        return false;
      }
    },
    // 进行手机号验证
    async verifyPhone() {
      if (!this.checkMobile(this.editForm.phone)) {
        return (this.phoneIsOK = false);
      }
      //this.codeIsOK = false;
      //验证通过 发送网络请求 判断是否存在该注册手机
      //发送网络请求
      await this.$api.user
        .verifyPhone({ phone: this.editForm.phone })
        .then(res => {
          if (res.data.code === 204) {
            //通过身份验证
            this.phoneIsOK = true
            return ;
          } else {
            this.codeIsOK = false;
            return (this.phoneIsOK = false);
          }
        })
        .catch(err => {
          loading.close();
          return this.$message.error("网络连接失败");
        });
    },
    onsubmit() {
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          console.log("验证不通过");
          return false;
          // 验证不通过
        }

        //console.log(this.editForm);
        this.$api.user
          .PatchPWD({
            phone: this.editForm.phone,
            LoginPassword: this.editForm.pwd
          })
          .then(res => {
            //console.log(res);
            if (res.data.code === 204) {
              this.editIsOK = true;
              this.activeIndex = "2";
              return;
            }
            return this.$message.error(res.data.msg);
          })
          .catch(err => {
            return this.$message.error("网络异常，请稍后重试");
          });
      });
    },
    verifynewPWD() {},
    // 验证手机号
    checkMobile(str) {
      let re = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
      if (re.test(str)) {
        return true;
      } else {
        this.$message.error("请输入正确的手机号");
        return false;
      }
    },
    //确认验证
    next1() {
      if (!this.codeIsOK) {
        return this.$message.error("请先完成短信验证");
      }
      if (!this.phoneIsOK) {
        console.log(this.phoneIsOK);
        
        return this.$message.error("未找到该用户信息");
      }
      //激活下一个面板
      this.activeIndex = "1";
    }
  }
};
</script>

<style >
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}

#sendCode-input {
  width: 140px;
}
.verifyPhone {
  width: 170px;
}
.next {
  width: 100%;
}
</style>