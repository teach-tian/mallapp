<template>
  <div class="OrderComm">
    <!-- 头部 -->
    <van-sticky>
      <van-nav-bar
        title="商品评价"
        left-text="订单中心"
        right-text="发布"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      ></van-nav-bar>
    </van-sticky>
    <!-- 商品预展示 -->
    <!-- desc="描述信息" -->
    <van-card
      :num="orderData[2].num"
      tag="会员价"
      :price="orderData[2].goodsPrice"
      :title="orderData[2].goodsName"
      :thumb="orderData[2].goodsLogo"
      :origin-price="orderData[2].goodsOldPrice"
    />
    <!-- 评论主体 -->
    <el-card class="box-card">
      <div class="item">
        <!-- 星级选择 -->
        <van-row gutter="20" type="flex">
          <van-col span="8" class="text">描述相符</van-col>
          <van-col span="16">
            <van-rate v-model="value" />
          </van-col>
        </van-row>
      </div>
    </el-card>
    <!-- 评论 -->
    <el-card class="box-card">
      <!-- 文字评论区 -->
      <div class="comm">
        <van-field
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="200"
          :placeholder="placeholder"
          show-word-limit
        />
      </div>
      <!-- 图片上传 -->
      <van-uploader
        v-model="fileList"
        multiple
        :max-count="3"
        :after-read="afterRead"
        :max-size="5 * 1024 * 1024"
        :before-read="beforeRead"
        @oversize="oversizeMax"
      />
    </el-card>
    <!-- 店铺评分 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺评分</span>
      </div>
      <div>
        <van-row gutter="20" type="flex">
          <van-col span="8" class="text">物流服务</van-col>
          <van-col span="16">
            <van-rate v-model="wlvalue" />
          </van-col>
        </van-row>
        <van-row gutter="20" type="flex">
          <van-col span="8" class="text">服务态度</van-col>
          <van-col span="16">
            <van-rate v-model="fwvalue" />
          </van-col>
        </van-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Toast,Dialog  } from "vant";
import base from "../../../api/base";
export default {
  name: "OrderComm",
  components: {},
  data() {
    return {
      orderId: "",
      orderData: [],
      value: 5, //商品评分
      wlvalue: 5, //物流服务
      fwvalue: 5, //服务态度
      //图片上传预览
      fileList: [],
      imgURL: "", //服务器返回的图片地址
      message: "", //输入的文本
      placeholder: "宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧"
    };
  },

  created() {
    this.getOrderID();
    this.getOrderInfoByID();
  },
  methods: {
    //获得路由传来的订单id
    getOrderID() {
      this.orderId = this.$route.params.orderId;
    },
    //获得数据
    getOrderInfoByID() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "数据加载中.....",
        forbidClick: true
      });
      this.$api.order
        .getOrderInfoByID({
          order_id: this.orderId
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 200) {
            this.orderData = [];
            this.orderData.push(...res.data.data);
          } else {
            return this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          Toast.clear();
          console.log(err);
        });
    },
    oversizeMax() {
      Toast("文件大小限制5mb");
    },
    // 图片上传
    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      //开始上传到服务器
      let formdata = new FormData();
      formdata.append("files", file.file);
      this.$http({
        url: `${base.sq}/api/Order/UploaderImgToComment`,
        method: "post",
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
          token: window.sessionStorage.getItem("appToken")
        }
      })
        .then(res => {
          if (res.data.code === 201) {
            file.status = "";
            file.message = "上传成功";
            this.imgURL += res.data.data + " ";
          } else {
            file.status = "failed";
            file.message = "上传失败";
            this.$message.error(res.data.msg);
          }
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
          this.$message.error("服务器连接异常");
        });
    },
    // 返回布尔值
    beforeRead(file) {
      if (file.type !== "image/jpeg") {
        Toast("请上传 jpg 格式图片");
        return false;
      }
      return true;
    },
    // 返回 Promise
    asyncBeforeRead(file) {
      return new Promise((resolve, reject) => {
        if (file.type !== "image/jpeg") {
          Toast("请上传 jpgpng 格式图片");
          reject();
        } else {
          let img = new File(["foo"], "bar.jpg", {
            type: "image/jpeg"
          });
          resolve(img);
        }
      });
    },
    //返回
    onClickLeft() {
      Dialog.confirm({
        title: "确认要退出评价？",
        message: "退出后编辑过的内容将不保存"
      })
        .then(() => {
          this.$router.push("/order/3");
        })
        .catch(() => {
          // on cancel
        });
      
    },
    onClickRight() {
      if (this.message.length < 1) {
        return Toast("请填写评论");
      } else {
        this.orderComment();
      }
    },
    //评论的提交
    orderComment() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "提交中.....",
        forbidClick: true
      });
      this.$api.order
        .orderComment({
          fwvalue: this.fwvalue,
          msvalue: this.value,
          wlvalue: this.wlvalue,
          placeholder: this.message,
          orderId: this.orderId,
          imgURL: this.imgURL
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 201) {
            Toast("评论成功");
            setTimeout(()=>{
              this.$router.push("/order/3");
            },1000)
          } else {
          return  this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          Toast.clear();
          console.log(err);
          this.$message.error("服务器连接异常");
        });
    }
  }
};
</script>

<style scoped>
.text {
  text-align: center;
}
.comm {
  height: auto;
}
</style>