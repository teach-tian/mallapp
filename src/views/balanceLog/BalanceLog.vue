<template>
  <div class="balanceLog">
    <nav-bar />
    <div v-show="Object.keys(BalanceLog).length === 0">
      <van-empty description="您还没有相关记录" />
    </div>
    <div>
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
        <log-item :BalanceLog="BalanceLog" />
        <ul v-if="isShowUpLoading">
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
import NavBar from "./childComps/NavBar";
import LogItem from "./childComps/LogItem";

import Scroll from "components/common/scroll/scroll";
// 功能组件
import { debounce } from "common/utils"; //防抖函数
import { Toast } from "vant";
export default {
  name: "BalanceLog",
  data() {
    return {
      page: 1,
      pageSize: 10,
      BalanceLog: [],
      isShowLoading: false,
      isShowUpLoading: false,
      isShowBackTop: false,
      pullDownMsg: "",
      pullUpMsg: "加载更多....."
    };
  },
  components: {
    NavBar,
    LogItem,
    Scroll
  },
  activated() {
    this.$refs.scroll.refresh();
  },
  created() {
    this.getBalanceLog();
  },
  methods: {
    getBalanceLog() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.log
        .getBalanceLog({
          page: this.page,
          pageSize: this.pageSize
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 200) {
            this.page += 1;
            this.BalanceLog.push(...res.data.data);
          } else if (res.data.code === 405) {
            this.pullUpMsg = "没有更多了";
            setTimeout(() => {
              this.isShowUpLoading = false;
            }, 1500);
          } else {
            Toast.fail(res.data.msg);
          }
          this.finish();
        })
        .catch(err => {
          Toast.clear();
          Toast.fail("服务器连接异常");
        });
    },
    // 上拉加载更多 分页数据
    loadMore() {
      this.isShowUpLoading = true;
      this.pullUpMsg = "加载更多...";
      this.getBalanceLog();
    },
    handleToScroll(pos) {
      if (pos.y > 70) {
        this.isShowLoading = true;
        this.pullDownMsg = "释放更新...";
      }
    },
    // 下拉刷新
    handleToTouchEnd(pos) {
      if (pos.y > 60) {
        this.$router.push("/emptyPage");
      }
    },
    // 返回顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    noAny() {
      this.pullUpMsg = "已经到底了";
      setTimeout(() => {
        this.isShowUpLoading = false;
      }, 1500);
    },
    finish() {
      this.$refs.scroll.finishPullUp();
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: calc(100vh - 46px);
  position: absolute;
  top: 46px;
  bottom: 3px;
  left: 0;
  right: 0;
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
.back-top {
  border: 1px solid red;
}
</style>