<template>
  <div class="editPage">
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">信息修改</div>
    </nav-bar>
    <!-- 提示 -->
    <el-alert title="尊敬的用户您好：" type="warning" description="为了保障您的信息安全，请勿输入真实的身份证号" center show-icon></el-alert>
    <!-- 主体部分 -->
    <div class="edituser">
      <!-- 表单 -->
      <el-form :model="editUserData" ref="editUserRef" :rules="editRules" label-width="100px">
        <el-form-item label="登录名" prop="name">
          <el-input v-model="editUserData.name"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="CustomerName">
          <el-input v-model="editUserData.CustomerName"></el-input>
        </el-form-item>
        <el-form-item label="绑定手机" prop="phone">
          <el-input v-model="editUserData.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="IdentityCardNo">
          <el-input v-model="editUserData.IdentityCardNo"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="CustomerEmail">
          <el-input v-model="editUserData.CustomerEmail"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="Gender">
          <van-radio-group v-model="editUserData.Gender" direction="horizontal" class="userSex">
            <van-radio name = 0 >男</van-radio>
            <van-radio name = 1 >女</van-radio>
            <van-radio name = 2 >保密</van-radio>
          </van-radio-group>
        </el-form-item>

        <el-form-item label="生日" prop="Birthday">
          <el-date-picker
            v-model="editUserData.Birthday"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item size="large">
          <el-button @click="goback">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import SMSVerification from "components/common/SMSverification/SMSVerification";
import { Toast,Dialog  } from "vant";
export default {
  name: "EditPage",
  components: {
    NavBar,
    SMSVerification
  },
  created() {
    this.getUserData();
  },
  data() {
    //验证身份证
    var checksfz = (rule, value, callback) => {
      if (value) {
        let re = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
        if (re.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的身份证号"));
        }
      }
    };
    //验证邮箱
    var checkemil = (rule, value, callback) => {
      if (value) {
        let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (re.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的邮箱"));
        }
      }
    };
    return {
      editUserData: {
        name: "",
        IdentityCardNo: "",
        CustomerEmail: "",
        Birthday: "",
        Gender: 1,
        CustomerName: "",
        phone: ""
      },
      oldPhone: "", //原手机
      codeIsOK: false, //短信验证是否通过
      codetype: 3, //使用更改手机的短信模板
      editRules: {
        CustomerName: [
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        IdentityCardNo: [{ validator: checksfz, trigger: "blur" }],
        CustomerEmail: [{ validator: checkemil, trigger: "blur" }],
        name: [
          { required: true, message: "登录名不能为空", trigger: "change" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ]
      },
      // 时间选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  methods: {
    goback() {
      // 返回上一页
      Dialog.confirm({
        title: "确认要退出修改？",
        message: "退出后编辑过的内容将不保存"
      })
        .then(() => {
          this.$router.push("/detailPage");
        })
        .catch(() => {
          // on cancel
        });
    },
    // 表单提交
    onSubmit() {
       const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "提交中.....",
        forbidClick: true
      });
      this.$refs.editUserRef.validate(async result => {
        if (!result) {
          console.log("验证不通过");
          this.$message.error("信息有误");
          return false;
        } else {
          await this.$api.user
            .patchUserData({
              CustomerName: this.editUserData.CustomerName,
              IdentityCardNo: this.editUserData.IdentityCardNo,
              CustomerEmail: this.editUserData.CustomerEmail,
              Gender: this.editUserData.Gender,
              Birthday: this.editUserData.Birthday,
              Name: this.editUserData.name,
              Phone: this.editUserData.phone
            })
            .then(res => {
               Toast.clear();
              if (res.data.code !== 201) {
                return this.$message.error(res.data.msg);
              } else {
                this.$message.success("修改信息成功");
                return this.$router.push("/detailPage");
              }
            })
            .catch(err => {
               Toast.clear();
              return this.$message.error("网络异常，请稍后重试");
            });
        }
      });
    },

    //获取用户的信息
   getUserData() {
      this.$api.user
        .GetUserData()
        .then(res => {
          //console.log(res);
          if (res.data.code !== 200) {
            return;
          }
          this.editUserData.name = res.data.data.login_name;
          this.editUserData.IdentityCardNo = res.data.data.identity_card_no;
          this.editUserData.CustomerEmail = res.data.data.customer_email;
          this.editUserData.Gender = res.data.data.gender;
          this.editUserData.CustomerName = res.data.data.customer_name;
          this.editUserData.phone = res.data.data.mobile_phone;
          this.editUserData.Birthday = res.data.data.birthday;
          //this.userData = res.data.data;
          var reg = /(?<=).+(?=T)/;
          this.editUserData.Birthday = this.editUserData.Birthday.match(reg)[0];
          // console.log(this.editUserData);
        })
        .catch(res => {
          return this.$message.error("网络连接失败");
        });
    }
  }
};
</script>

<style>
.edituser {
  padding: 20px 20px;
  width: 100%;
  margin: 0 auto;
  background-color: #f6f6f6;
  /* height: 585px; */
}
.el-picker-panel [slot="sidebar"],
.el-picker-panel__sidebar {
  width: 80px;
}
.el-picker-panel [slot="sidebar"] + .el-picker-panel__body,
.el-picker-panel__sidebar + .el-picker-panel__body {
  margin-left: 80px;
}
.userSex{
  margin-top: 10px;
}
</style>