<template>
  <div class="history">
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">搜索历史</van-divider>
    <scroll class="content" ref="scroll">
      <van-cell
        v-for="(item,index) in historyList"
        :key="index"
        :title="item"
        @click="clickHistory(item,index)"
      >
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="close" style="line-height: inherit;" @click="deleteHis(index)" />
        </template>
      </van-cell>
      <van-button plain hairline type="info" @click="clearHistory()">清空历史记录</van-button>
    </scroll>
    
  </div>
</template>

<script>
import Scroll from "components/common/scroll/scroll";
export default {
  name: "SearchHistory",
  props: ["historyList"],
  components: {
    Scroll
  },
  methods: {
    clickHistory(item, index) {
      this.$emit("clickHistory", item, index);
    },
    deleteHis(index) {
      this.$emit("deleteHis", index);
    },
    clearHistory() {
      this.$emit("clearHistory");
    }
  }
};
</script>

<style scoped>
.history .content {
  height: 400px;
  left: 0;
  right: 0;
  /* background-color: #fff; */
  overflow: hidden;
}
.history .van-button {
  width: 60%;
  margin-left: 20%;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>