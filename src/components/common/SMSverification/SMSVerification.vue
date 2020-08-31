<template>
  <div class="s1 msg-code">
    <!-- prop="code" -->
    <el-form-item label="短信验证码" >
      <el-row>
        <el-col :span="16">
          <el-input id="sendCode-input" @blur="testCode" v-model="code" placeholder="请输入验证码"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            id="code"
            type="primary"
            :disabled="isDisabled"
            @click="sendCode"
          >{{buttonText}}</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "SMSVerification",
  data() {
    return {
      buttonText: "发送验证码",
      isDisabled: false, // 是否禁止点击发送验证码按钮
       //标识是否发送短信
      flag: false,
      code:'',
      //从服务器拿到的验证码
      authCode:'',
    };
  },
  //codeIsOK 验证是否通过 默认为false
  props:['phone','codeIsOK','codeType','phoneIsOK','type'],
  methods: {
    // <!--发送验证码-->
    async sendCode() {
      //console.log(222);
      if(!this.phoneIsOK && this.type == 'Register'){
        return this.$message.error('该手机号已注册')
      }
      //这里可能不需要吧，不然当网络不好时上一步验证将有问题，进而无法验证这里
      if(!this.phoneIsOK && this.type == 'Forget'){
        
        return this.$message.error('未找到该用户信息')
      }
      let tel = this.phone;
      if (this.checkMobile(tel)) {
        // 验证通过 可进行验证码的发送
        await this.$api.code.getCode(
          {
            phone : this.phone,
            codeType : this.codeType
          }
        ).then(res =>{
          // console.log(res);
          if(res.data.code != 200){
            return this.$message.error('发送失败，请稍后再试！')
          }
          // 如果发送成功 取出服务器返回的验证码
          this.authCode = res.data.msg
        }).catch(err => {
          return this.$message.error("是不是姿势不对，换个优雅的姿势吧");
        });
        
        let time = 60;
        this.buttonText = "已发送";
        this.isDisabled = true;
        this.flag = true;
        if (this.flag) {
          this.flag = false;
          let timer = setInterval(() => {
            time--;
            this.buttonText = time + " 秒";
            if (time === 0) {
              clearInterval(timer);
              this.buttonText = "重新获取";
              this.isDisabled = false;
              this.flag = false;
            }
          }, 1000);
        }
      }
    },
    // 验证手机号
    checkMobile(str) {
      let re = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
      if (re.test(str)) {
        return true;
      } else {
        // this.$message.error("请输入正确的手机号");
        return false;
      }
    },
    //验证码校验
    testCode(){
      //console.log(this.code);
      if(this.authCode === null){
        return this.$message.error('请输入验证码！')
      }
      //隐式转换下 保证下统一类型
      if(this.authCode - 0 !== this.code - 0){
        return this.$message.error('验证码不正确！')
      }
      //发送一个事件出去 提示已完成验证
      this.$emit('codeOk')
    }
  }
};
</script>

<style>
#code {
  margin-left: 5px;
}
</style>