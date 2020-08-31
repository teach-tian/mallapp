<template>
  <div class="findPayPWD">
    <!-- 头部导航 -->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">找回支付密码</div>
    </nav-bar>
    <!-- 主体 -->
    <el-card>
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="100px"
        label-position="top"
        status-icon
      >
        <el-form-item label="注册手机" prop="phone" ref="verifyPhone">
          <el-input v-model="editForm.phone" placeholder="请输入注册用的手机" ref="input_phone2"></el-input>
        </el-form-item>
        <!-- 短信验证码 -->
        <SMS-verification
          :phone="editForm.phone"
          :codeIsOK="codeIsOK"
          :phoneIsOK="phoneIsOK"
          @codeOk="codeOkP"
          :type="type"
        />
        <el-form-item label="新密码">
          <!-- <el-input v-model="editForm.pwd" type="password" placeholder="请输入新的密码" autocomplete="off"></el-input> -->
          <!-- 密码输入框 -->
        <van-password-input
          :value="editForm.pwd"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
           gutter="10"
        />
        </el-form-item>
       
        <!-- 数字键盘 -->
        <van-number-keyboard
          :show="showKeyboard"
          @input="onInput"
          @delete="onDelete"
          @blur="showKeyboard = false"
         
        />
        <el-form-item>
          <el-button type="primary" @click="onsubmit" class="next">密码找回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import SMSVerification from "../../SMSverification/SMSVerification";

export default {
  name: "FindPayPWD",
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
    return {
      type: "Forget",
      // 重置是否完成
      //验证码 验证是否通过
      codeIsOK: false,
      // 修改的数据
      editForm: {
        pwd: "",
      },
      showKeyboard: false,//数字键盘是否显示
      // 该手机号是否有注册 默认是没有
      phoneIsOK: true,
      // 验证规则
      editFormRules: {
        phone: [
          { required: true, message: "请输入注册手机", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        yzm: [{ required: true, message: "请输入注册手机", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    goback() {
      // 返回上一页
      this.$router.back(-1);
    },
    onInput(key) {
      this.editForm.pwd = (this.editForm.pwd + key).slice(0, 6);
    },
    onDelete() {
      this.editForm.pwd = this.editForm.pwd.slice(0, this.editForm.pwd.length - 1);
    },
    //子组件发送完成验证
    codeOkP() {
      this.codeIsOK = true;
    },
    onsubmit() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          this.$message.error("请完成验证");
          return false;
        }
        if (!this.codeIsOK) {
          this.$message.error("请完成手机验证");
          return false;
        }
        if( this.editForm.pwd.length !== 6){
           this.$message.error("请正确输入密码");
          return false;
        }
        // 发送网络请求 开始修改密码
        await this.$api.order
          .patchPayPWD({
            phone: this.editForm.phone,
            paypwd: this.editForm.pwd
          })
          .then(res => {
            console.log(res);
            if (res.data.code === 201) {
              this.$message.success(res.data.msg);
              return this.$router.go(-1); //后退到支付页面
            } else {
              return this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
            return this.$message.error("网络异常，请稍后重试");
          });
      });
    },
    // 验证手机号
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

<style scoped>
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
.findPayPWD {
  background-color: #F7F8FA;
}
.findPayPWD .el-card{
  background-color: #F3F3F3;
}
</style>