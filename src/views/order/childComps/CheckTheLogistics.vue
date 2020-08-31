<template>
  <div class="CheckTheLogistics">
    <el-dialog title="物流查询" :visible.sync="dialogVisible" width="80%">
      <!-- 时间线展示 -->
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.timestamp"
          >{{activity.content}}</el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CheckTheLogistics",
  data() {
    return {
      dialogVisible: false,
      activities: [
        {
          content: "订单创建时间",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          // icon: "el-icon-more"
        },
        {
          content: "订单支付时间",
          timestamp: "2018-04-03 20:46",
          type: "primary",
        },
        {
          content: "商品出库",
          timestamp: "2018-04-03 20:46",
          size: "large",
          type: "primary",
        },
        {
          content: "运输中....",
          timestamp: "2018-04-03 20:46",
          type: "primary",
        },
        {
          content: "已签收",
          timestamp: "2018-04-04 20:46",
           color: "#0bbd87",
        }
      ]
    };
  },
  methods: {
    isShow() {
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style>
</style>