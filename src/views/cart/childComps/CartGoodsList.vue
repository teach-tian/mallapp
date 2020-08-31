<template>
  <div class="cart-list">
    <scroll
      class="content"
      ref="scroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
      :handleToScroll="handleToScroll"
      :handleToTouchEnd="handleToTouchEnd"
    >
      <ul v-if="isShowLoading">
        <li class="pullDown">
          <i class="el-icon-loading"></i>
          {{ pullDownMsg }}
        </li>
      </ul>
      <cart-goods-list-item v-for="(item,index) in cartList" :key="index" :product="item" :isedit="isedit"></cart-goods-list-item>
      <ul v-if="isShowUpLoading">
        <li class="pullUp">
          <i class="el-icon-loading"></i>
          {{ pullUpMsg }}
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
import CartGoodsListItem from "./CartGoodsListItem";

import Scroll from "components/common/scroll/scroll";
// 功能组件
import { debounce } from "common/utils"; //防抖函数
export default {
  name: "CartGoodsList",
  props: ["cartList",'isedit'],
  data() {
    return {
      isShowLoading: false,
      isShowUpLoading: false,
      isShowBackTop: false,
      pullDownMsg: "",
      pullUpMsg: "加载更多....."
    };
  },
  components: {
    Scroll,
    CartGoodsListItem
  },
  activated() {
    this.$refs.scroll.refresh();
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    //监听itme图片加载完成
    this.$bus.$on("itemIamgLoad", () => {
      refresh();
    });
  },
  methods: {
    // 上拉加载更多 分页数据
    loadMore() {
      this.isShowUpLoading = true;
      // this.pullDownMsg = "正在更新中...";
      //调用接口
      return this.$emit("handleToNew");
    },
    handleToScroll(pos) {
      if (pos.y > 60) {
        this.isShowLoading = true;
        this.pullDownMsg = "正在更新中...";
      }
    },
    // 下拉刷新
    handleToTouchEnd(pos) {
      if (pos.y > 60) {
        this.$router.go(0);
      }
    },
    // 返回顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    noAny(){
      this.pullUpMsg = '已经到底了'
      setTimeout(()=>{
        this.isShowUpLoading = false
      },1500)
    },
     finish() {
      this.$refs.scroll.finishPullUp();
    },
  }
};
</script>

<style scoped>
.content {
  /* margin-top: 44px; */
  height: calc(100vh - 49px - 84px);
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