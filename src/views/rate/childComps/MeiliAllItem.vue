<template>
  <div class="MeilAll">
    <!-- 评论区 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 用户头像与名称区 -->
        <div class="info-user">
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <img v-lazy="commentData.user_img" alt />
              </div>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple">
                <div class="user-name">
                  <el-row :gutter="20">
                    <el-col :span="5">
                      <span>{{commentData.user_name}}</span>
                    </el-col>
                    <el-col :span="15">
                      <el-rate
                        v-model="commentData.msvalue"
                        disabled
                        show-score
                        text-color="#ff9900"
                      ></el-rate>
                    </el-col>
                  </el-row>
                </div>
                <p class="time">{{commentData.audit_time | showDate }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <!-- 评论主体区 -->
        <div class="info-detail">
          <p>{{commentData.content}}</p>
          <!-- 评论附带的图片展示 -->
          <div class="info-imgs">
            <img v-lazy="item" alt="评论图片" v-for="(item,index) in commentData.imgURL" />
          </div>
        </div>
        <!-- 追评区 -->
      </div>
      <el-row :gutter="24">
        <el-col :span="14">
          <p>浏览 {{commentData.hot_num}} 次</p>
        </el-col>
        <el-col :span="10">
          <p>
            <el-row :gutter="20">
              <el-col :span="10">
                <span class="good">
                  <van-icon name="chat-o" />
                  &nbsp&nbsp {{commentData.replies_num}}
                </span>
              </el-col>
              <el-col :span="10">
                <!-- 已点赞 -->
                <span class="good is-give-like" v-show="commentData.is_good" @click="RemoveLike()">
                  <van-icon name="good-job-o" />
                  &nbsp&nbsp {{commentData.is_useful}}
                </span>
                <!-- 未点赞 -->
                <span class="good" v-show="!commentData.is_good" @click="GiveLike()">
                  <van-icon name="good-job-o" />
                  &nbsp&nbsp {{commentData.is_useful}}
                </span>
              </el-col>
            </el-row>
          </p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from "@/common/utils";
import { Toast } from "vant";
export default {
  name: "MeilAll",
  data() {
    return {
      value: 3,
    };
  },
  props: ["commentData"],
  filters: {
    showDate: function (value) {
      let date = new Date(value * 1000);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    // 点赞
    async GiveLike() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "点赞中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      await this.$api.comment
        .AddCommenUserful({
          comment_id: this.commentData.comment_id - 0,
        })
        .then((res) => {
          Toast.clear();
          if (res.data.code === 201) {
            this.commentData.is_useful += 1;
            this.commentData.is_good = true;
          } else {
            Toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          Toast.clear();
          Toast.fail("服务器异常");
        });
    },
    // 取消点赞
    async RemoveLike() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "点赞中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      await this.$api.comment
        .removeCommenUserful({
          comment_id: this.commentData.comment_id - 0,
        })
        .then((res) => {
          Toast.clear();
          if (res.data.code === 201) {
            this.commentData.is_useful -= 1;
            this.commentData.is_good = false;
          } else {
            Toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          Toast.clear();
          Toast.fail("服务器异常");
        });
    },
  },
};
</script>

<style>
.MeilAll .el-card__header {
  padding: 0 0;
}
.MeilAll .good {
  margin-left: 5px;
}
.is-give-like {
  color: red;
}
.MeilAll .comment-info {
  /* padding: 5px 12px; */
  color: #333333;
  /* border-bottom: 5px solid #f2f5f8; */
}
.MeilAll .header-title {
  font-size: 12px;
  float: left;
}
.MeilAll .info-user {
  padding: 10px 5px 5px;
}
.MeilAll .info-user img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
.MeilAll .info-user .user-name {
  font-size: 15px;
}
.MeilAll .info-user .time {
  font-size: 12px;
  margin-top: 10px;
}
.MeilAll .info-detail {
  padding: 0 5px 15px;
}
.MeilAll .info-detail p {
  font-size: 14px;
  line-height: 1.5;
  color: #777777;
}
.MeilAll .info-detail .info-other {
  font-size: 12px;
  margin-top: 10px;
  color: #999999;
}
.MeilAll .info-other .date {
  margin-right: 8px;
}
.MeilAll .info-imgs {
  margin-top: 10px;
}
.MeilAll .info-imgs img {
  width: 70px;
  height: 70px;
  margin-right: 5px;
}
.MeilAll .good {
  text-align: center;
}
</style>