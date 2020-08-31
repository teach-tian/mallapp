<template>
  <div>
    <div class="IsPaid">
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
        <goods-card v-for="(item,index) in orderData" :orderData="item" :key="index" @deliveryIsOK="deliveryIsOKP" @showDialog="showDialogP"/>
        <ul v-show="isShowUpLoading">
          <li class="pullUp">
            <i class="el-icon-loading"></i>
            {{ pullUpMsg }}
          </li>
        </ul>
      </scroll>
      <!-- 查看物流 -->
      <check-the-logistics ref="dialog" v-show="isShowDialog"/>
    </div>
  </div>
</template>

<script>
import GoodsCard from "../orderCard/IsPaidCard";
import CheckTheLogistics from './CheckTheLogistics'
import { debounce } from "common/utils"; //防抖函数
import Scroll from "components/common/scroll/scroll";
export default {
  name: "IsPaid",
  props: ["orderData"],
  data() {
    return {
      isShowLoading: false,
      isShowUpLoading: false,
      isShowBackTop: false,
      pullDownMsg: "",
      pullUpMsg: "",
      isShowDialog:false
    };
  },
  components: {
    GoodsCard,
    Scroll,
    CheckTheLogistics
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
      return this.$emit("handleToNew", 2);
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
        this.$emit("handleToTouchEnd", 2);
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
    finish() {
      this.$refs.scroll.finishPullUp();
    },
    //重新请求数据
  deliveryIsOKP(){
    this.$emit("handleToTouchEnd", 2);
  },
  //查看物流信息  value：订单id
  showDialogP(value){
    this.isShowDialog = true
    this.$refs.dialog.isShow()
  }
  },
  updated() {
    this.finish();
  },
  

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