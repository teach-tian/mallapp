<template>
  <div>
    <div class="comment-info" v-if="Object.keys(commentInfo).length !== 0">
      <div class="info-header">
        <div class="header-title">买家评价 {{commentInfo[0].comment_sum}}</div>
        <div class="header-more" @click="toMore">
          更多 > 
          <i class="arrow-right" />
        </div>
      </div>
      <!-- 用户评论的展示 展示两条 -->
      <div v-for="(item,index) in commentInfo" :key="index">
        <div class="info-user">
          <img v-lazy="item.comment_body.user_img" alt />
          <span>{{ item.comment_body.user_name }}</span>
        </div>
        <div class="info-detail">
          <p>{{ item.comment_body.content }}</p>
          <div class="info-imgs">
            <img :key="index" v-lazy="item" alt v-for="(item, index) in item.comment_img" />
          </div>
          <div class="info-other">
            <span class="date">{{ item.comment_body.audit_time | showDate }}</span>
            <span>颜色：默认 尺码：默认</span>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-info" style="color: red;" v-else>暂无用户评论</div>
  </div>
</template>
<script>
import { formatDate } from "@/common/utils";
export default {
  name: "DetailCommentInfo",
  props: {
    commentInfo: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  filters: {
    showDate: function(value) {
      let date = new Date(value * 1000);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    toMore() {
      // return this.$toast.show("模块未开发，敬请期待", 1500);
      return this.$emit("toRate")
    }
  }
};
</script>

<style scoped>
.comment-info {
  padding: 5px 12px;
  color: #333333;
  border-bottom: 5px solid #f2f5f8;
}
.info-header {
  line-height: 50px;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.header-title {
  font-size: 12px;
  float: left;
}
.header-more {
  font-size: 13px;
  float: right;
  margin-right: 10px;
}
.info-user {
  padding: 10px 0 5px;
}
.info-user img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
.info-user span {
  font-size: 15px;
  position: relative;
  top: -15px;
  margin-left: 10px;
}
.info-detail {
  padding: 0 5px 15px;
}
.info-detail p {
  font-size: 14px;
  line-height: 1.5;
  color: #777777;
}
.info-detail .info-other {
  font-size: 12px;
  margin-top: 10px;
  color: #999999;
}
.info-other .date {
  margin-right: 8px;
}
.info-imgs {
  margin-top: 10px;
}
.info-imgs img {
  width: 70px;
  height: 70px;
  margin-right: 5px;
}
</style>