<template>
  <div class="LogItem">
    <el-card class="box-card" v-show="Object.keys(PointLog).length !== 0">
      <div slot="header" class="clearfix">
        <span>积分变动详情</span>
      </div>
      <div v-for="(item,index) in PointLog" :key="index" class="text item">
        <van-row>
          <van-col span="16">
            <h3>{{item.title}}</h3>
            <br />
            <p>{{item.create_time | showDate}}</p>
          </van-col>
          <van-col span="8">
            <p v-if="item.source === 3 || item.source === 4" class="pay">-{{item.change_point}}</p>
            <p v-else class="nopay">+{{item.change_point}}</p>
          </van-col>
        </van-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from "@/common/utils";
export default {
  name: "LogItem",
  props: ["PointLog"],
  filters: {
    showDate: function(value) {
      let date = new Date(value * 1000);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>

<style scoped>
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
    border-bottom: 1px solid #EDECEC;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .LogItem .pay{
    color: red;
  }
 .LogItem .nopay{
    color: rgb(28, 160, 28);
  }
</style>