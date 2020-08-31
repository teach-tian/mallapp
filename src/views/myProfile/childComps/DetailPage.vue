<template>
  <div class="detailPage">
    <!-- 头部区 -->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">个人信息</div>
      <div slot="right" @click="quit">
        <el-button type="text">退出</el-button>
      </div>
    </nav-bar>
    <!-- 用户详情信息区 -->
    <div class="user">
      <div class="applogo"></div>
      <!-- 用户头像 -->

      <!-- @click="upload" -->
      <div class="userImg">
        <el-upload
          class="img-btn"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadImg"
        >
          <el-button type="success" plain round size="mini">更改头像</el-button>
        </el-upload>
        <!-- <div class="userText">修改头像</div> -->
        <div class="userimgs">
          <img v-if="!progressFlag" class="head-img" :src="imageUrl" />
          <div v-show="progressFlag" class="head-img">
            <div class="progress">
              <el-progress :width="60" type="circle" :percentage="progressPercent"></el-progress>
            </div>
          </div>
          <!-- <img src="../../../assets/img/logo.png" width="60" alt /> -->
        </div>
      </div>
      <!--  -->
      <div class="zl">
        <div class="jczl">基础资料</div>
      </div>
      <div class="Info">
        <div class="fdata">
          <p class="userInfo username">
            <span>昵称：</span>
            <span class="value">{{userData.login_name}}</span>
          </p>
        </div>
        <div class="fdata">
          <p class="userInfo usersex">
            <span>姓名：</span>
            <!-- <span class="value">{{userData.login_name}}</span> -->
            <span class="value">{{userData.customer_name}}</span>
          </p>
        </div>
        <div class="fdata">
          <p class="userInfo usersex">
            <span>性别：</span>
            <span class="value" v-if="userData.gender === '0'">男</span>
            <span class="value" v-else-if="userData.gender === '1'">女</span>
            <span class="value" v-else>保密</span>
          </p>
        </div>
        <div class="fdata">
          <p class="userInfo usersex">
            <span>邮箱：</span>
            <span class="value">{{userData.customer_email}}</span>
          </p>
        </div>
        <div class="fdata">
          <p class="userInfo usersex">
            <span>手机号码：</span>
            <span class="value">{{userData.mobile_phone}}</span>
          </p>
        </div>
        <div class="fdata">
          <p class="userInfo usersex">
            <span>证件号：</span>
            <span class="value">{{userData.identity_card_no}}</span>
          </p>
        </div>
        <div class="fdata">
          <p class="userInfo usersex">
            <span>出生日期：</span>
            <span class="value">{{userData.birthday}}</span>
          </p>
        </div>

        <!-- 转到编辑页 -->
        <div class="btn">
          <el-button type="primary" @click="EditPage">编辑基础资料</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import base from "../../../api/base";

export default {
  name: "DetailPage",
  data() {
    return {
      //用户详细信息
      userData: {},
      //  上传头像的对话框
      dialogVisible: false,
      imageUrl: "",
      progressFlag: false,
      progressPercent: 0
    };
  },
  components: {
    NavBar
  },
  created() {
    this.getUserData();
  },
  methods: {
    // 修改头像
    upload() {
      this.dialogVisible = true;
    },
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
          var reg = /(?<=).+(?=T)/;
          this.userData.birthday = this.userData.birthday.match(reg)[0];
          this.imageUrl = this.userData.user_img
          //console.log(this.userData);
        })
        .catch(res => {
          return this.$message.error("网络连接失败");
        });
    },
    goback() {
      // 返回上一页
      this.$router.push('/profile');
    },
    quit() {
      this.$confirm("即将退出，是否确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          // 进行token清除 跳转到登录页
          window.sessionStorage.removeItem("appToken");
          this.$router.push("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    EditPage() {
      this.$router.push("/editPage");
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    uploadImg(f) {
      this.progressFlag = true;
      let formdata = new FormData();
      formdata.append("files", f.file);
      this.$http({
        url: `${base.sq}/api/UserInfo/UploadImg`,
        method: "post",
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
          token: window.sessionStorage.getItem("appToken")
        },
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent =
            (progressEvent.loaded / progressEvent.total) * 100;
        }
      })
        .then(res => {
          // console.log(res);
          if (res.data.code !== 201) {
            return this.$message.error("修改头像失败");
          } else {
            this.imageUrl = res.data.data;
            //console.log(this.imageUrl);

            if (this.progressPercent === 100) {
              this.progressFlag = false;
              this.progressPercent = 0;
            }
          }
        })
        .catch(error => {
          return this.$message.error('网络连接失败')
        });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style>
.detailPage {
  height: 100vh;
}
.user {
  background-color: #f6f6f6;
  /* height: 100vh; */
}
.applogo {
  height: 10px;
}
.userImg {
  /* text-align: center; */
  height: 74px;
  line-height: 74px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}
.userText {
  float: left;
  margin-left: 15%;
}
.userimgs {
  float: right;
  margin-right: 10%;
  border-radius: 50%;
  margin-top: -72px;
}
.userimgs img {
  line-height: 74px;
  margin-top: 4px;
}
.zl {
  height: 54px;
  border-bottom: 1px solid #e6e6e6;
}
.jczl {
  float: left;
  width: 100%;
  padding-left: 6%;
  color: #b2b2b2;
}
.userInfo {
  padding: 5px 30px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1.14rem;
  line-height: 50px;
}
.value {
  color: rgba(0, 0, 0, 0.6);
}
.Info {
  height: 100%;
  background-color: white;
  width: 100%;
}
.fdata {
  padding: 0 20px;
  overflow: hidden;
  /* position: relative; */
}
.btn {
  margin: 10px auto;
  width: 90%;
}
.btn .el-button {
  width: 100%;
}
.el-upload {
  padding-left: 28px;
}
.head-img {
  width: 60px;
}
.el-progress {
  width: 60px;
  margin-top: 5px;
}
</style>