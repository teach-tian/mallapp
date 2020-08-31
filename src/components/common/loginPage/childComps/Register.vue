<template>
  <div>
    <el-form
      ref="RegisterFormRef"
      :model="RegisterForm"
      label-width="60px"
      :rules="RegisterFormRules"
      label-position="top"
      status-icon
    >
      <div class="s1">
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="RegisterForm.phone"
            name="phone"
            type="text"
            placeholder="注册手机为找回密码的唯一凭证"
            @blur="verifyPhone"
            ref="input_phone"
          ></el-input>
        </el-form-item>
      </div>
      <div class="s1">
        <el-form-item label="登录名" prop="LoginName">
          <el-input
            v-model="RegisterForm.LoginName"
            name="LoginName"
            type="text"
            placeholder="中、英文均可, 不超过12个字符"
            @blur="testName"
            ref="input_description"
          ></el-input>
        </el-form-item>
      </div>
      <div class="s1">
        <el-form-item label="密码" prop="LoginPassword">
          <el-input
            v-model="RegisterForm.LoginPassword"
            name="LoginPassword"
            type="password"
            placeholder="3-18位英文、数字、符号, 区分大小写"
          ></el-input>
        </el-form-item>
      </div>
      <!-- 短信验证码 组件 -->
      <SMS-verification
        :phone="RegisterForm.phone"
        :codeIsOK="codeIsOK"
        :codeType="codeType"
        @codeOk="codeOkP"
        :phoneIsOK="phoneIsOK"
        :type="type"
        ref="sms"
      />
      <el-form-item class="btns">
        <el-button type="primary" @click="onSubmit" id="zc">注册</el-button>
      </el-form-item>
    </el-form>
    <div class="dom-footer">
      <!-- <third-platform /> -->
    </div>
  </div>
</template>

<script>
import ThirdPlatform from "./ThirdPlatform";
import SMSVerification from "../../SMSverification/SMSVerification";

export default {
  name: "Register",
  components: {
    ThirdPlatform,
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
    return {
      //注册数据
      RegisterForm: {
        LoginName: "",
        LoginPassword: ""
      },
      //告诉短信组件 是哪个组件需要发送短信
      type:'Register',
      //验证码 验证是否通过
      codeIsOK: false,
      //短信模板
      codeType: 0,
      // 登录名是否可用
      nameIsOK: false,
      // 该手机号是否有注册 默认是没有
      phoneIsOK: false,
      //注册预验证
      RegisterFormRules: {
        LoginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        LoginPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 3,
            max: 18,
            message: "长度在 3 到 18 个字符",
            trigger: ["blur", "change"]
          }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入注册手机", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //子组件发送完成验证
    codeOkP() {
      this.codeIsOK = true;
    },
    // 进行注册
    onSubmit() {
      this.$refs.RegisterFormRef.validate(async result => {
        if (!result) {
          console.log("验证不通过");
          return;
        } else {
          //这里再次判断登录名是否可用
          if (!this.nameIsOK) {
            this.$message.error("登录名被占用，请更改");
            return false;
          }
          //进行验证码的验证
          if(!this.codeIsOK){
            this.$message.error("请完成身份验证！");
            return false;
          }
          //验证通过，准备发送请求进行注册
          await this.$api.user
            .AddLogin({
              LoginName: this.RegisterForm.LoginName,
              LoginPassword: this.RegisterForm.LoginPassword,
              phone: this.RegisterForm.phone
            })
            .then(res => {
              if (res.data.code !== 201) {
                this.$message.error("注册失败：" + res.data.msg);
              }
              this.$message.success("注册成功");
              //刷新当前页面
              location.reload();
            });
        }
      });
    },
    //判断登录名是否可用
   testName() {
      if (
        this.RegisterForm.LoginName !== null &&
        this.RegisterForm.LoginName !== ""
      ) {
        //发送网络请求
       this.$api.user
          .LoginName({ LoginName: this.RegisterForm.LoginName })
          .then(res => {
            if (res.data.code === 404) {
              //404 证明登录名可用
              return (this.nameIsOK = true);
            }
            this.$refs.input_description.focus(); //焦点聚集
            this.$message.error(res.data.msg);
            //console.log(res);

            this.nameIsOK = false;
          });
      }
    },
    //发送请求 验证手机号是否已注册
    verifyPhone() {
      if (!this.checkMobile(this.RegisterForm.phone)) {
        return (this.phoneIsOK = false);
      }
      //发送网络请求
     this.$api.user
        .verifyPhone({ phone: this.RegisterForm.phone })
        .then(res => {
          if (res.data.code === 200) {
            return (this.phoneIsOK = true);
          }
          this.$refs.input_phone.focus(); //焦点聚集
          this.$message.error(res.data.msg);
          //console.log(res);
          return (this.phoneIsOK = false);
        });
    },
    //手机号格式验证
    checkMobile(str) {
      let re = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
      if (re.test(str)) {
        return true;
      } else {
        this.$message.error("请输入正确的手机号");
        return false;
      }
    }
  }
};
</script>

<style>
#zc {
  width: 100%;
}
</style>