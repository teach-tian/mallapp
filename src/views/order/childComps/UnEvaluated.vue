<template>
<div>
  <div class="UnEvaluated" >
     <van-empty v-if="Object.keys(orderData).length === 0" description="您还没有相关订单" />
      <scroll
        class="content"
        ref="scroll"
        :pull-up-load="true"
        @pullingUp="loadMore"
      >
        <ul v-show="isShowLoading">
          <li class="pullDown">
            <i class="el-icon-loading"></i>
            {{ pullDownMsg }}
          </li>
        </ul>
        <goods-card v-for="(item,index) in orderData" :orderData="item" :key="index" />
        <ul v-show="isShowUpLoading">
          <li class="pullUp">
            <i class="el-icon-loading"></i>
            {{ pullUpMsg }}
          </li>
        </ul>
      </scroll>
    </div>
</div>
  
</template>

<script>
import GoodsCard from "../orderCard/UnEvaluatedCard";
import { debounce } from "common/utils"; //防抖函数
import Scroll from "components/common/scroll/scroll";
export default {
  name: "UnEvaluated",
  props: ["orderData"],
  data() {
    return {
      isShowLoading: false,
      isShowUpLoading: false,
      isShowBackTop: false,
      pullDownMsg: "",
      pullUpMsg: "",
      isShow:true
    };
  },
  components: {
    GoodsCard,
    Scroll
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    //监听itme图片加载完成
    this.$bus.$on("itemIamgLoad", () => {
      refresh();
    });
  },
  created() {
  },
  methods: {
    // 上拉加载更多 分页数据
    loadMore() {
      this.isShowUpLoading = true;
      this.pullUpMsg = "加载更多.....";
      //调用接口
      return this.$emit("handleToNew", 3);
    },
    handleToScroll(pos) {
      if (pos.y > 70) {
        this.isShowLoading = true;
        this.pullDownMsg = "释放刷新";
      }
    },
    close() {
      this.isShowLoading = false;
    },
    // 下拉刷新
    handleToTouchEnd(pos) {
      if (pos.y > 70) {
        this.pullDownMsg = "正在更新中...";
        this.$emit("handleToTouchEnd", 3);
        
        // this.$router.go(0);
      } else {
        this.pullDownMsg = "已取消";
      }
    },
    noAny() {
      this.pullUpMsg = "已经到底了";
      setTimeout(() => {
        this.isShowUpLoading = false;
      }, 1500);
    },
    //没有相关订单数据
    noData(){
      this.isShow = false
    },
    finish() {
      this.$refs.scroll.finishPullUp();
    }
  },
  updated() {
    this.finish();
  }
};
</script>

<style scoped>
.content {
  height: calc(100vh - 90px);
  overflow: hidden;
}
.pullDown {
  margin: 0;
  padding: 16px;
  text-align: center;
  border: none;
}
.pullUp {
  margin: 0;
  text-align: center;
  border: none;
}
</style>