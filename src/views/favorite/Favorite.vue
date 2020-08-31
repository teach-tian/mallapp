<template>
  <div class="favorite">
    <nav-bar />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="scroll"
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
      <show-goods :goods="showGoods" />
      <ul v-if="isShowUpLoading">
        <li class="pullUp">
          <i class="el-icon-loading"></i>
          {{ pullUpMsg }}
        </li>
      </ul>
    </scroll>
    <!-- 回到顶部 -->
    <back-top ref="top" @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "./childComps/NavBar";
import ShowGoods from './childComps/ShowGoods'

import BackTop from "components/common/backTop/BackTop";
import Scroll from "components/common/scroll/scroll";
import { debounce } from "common/utils"; //防抖函数
import { Toast } from "vant";
export default {
  name: "Favorite",
  components: {
    NavBar,
    Scroll,
    BackTop,
    ShowGoods,
  },
  data() {
    return {
      page: 1,
      pageSize: 15,
      sortType: "syn", //选择的排序
      sideType: "", // 激活的侧边栏的分类id
      isShowLoading: false,
      pullUpMsg: "加载更多....",
      isShowUpLoading: false,
      pullDownMsg:'下拉刷新',
      // 是否显示 回到顶部按钮
      isShowBackTop: false,
      goods: []
    };
  },
  // 监听打开
  activated() {
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
  },
  //监听离开
  deactivated() {
    //保存Y值
    this.saveY = this.$refs.scroll.scroll.y;
  },
  computed: {
    showGoods() {
      return this.goods[this.sortType].list;
    }
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
  computed: {
    showGoods() {
      return this.goods;
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    getGoods(){
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.pullUpMsg = "加载更多....";
      this.$api.goods.getFav({
        page:this.page,
        pageSize:this.pageSize
      }).then(res=>{
        Toast.clear();
        if(res.data.code === 200){
          this.page +=1
          this.code200();
          this.goods.push(...res.data.data)
          this.finish();
        }
        else if (res.data.code === 404) {
            this.code404(res);
          }
        else if (res.data.code === 405) {
            this.code405(res);
          }
      }).catch(err=>{
        Toast.clear();
        Toast.fail('服务器连接异常');
      })
    },
    // 上拉加载更多 分页数据
    loadMore() {
      this.isShowUpLoading = true;
      this.pullUpMsg = "加载更多...";
      this.getGoods();
    },
    handleToScroll(pos) {
      if (pos.y > 75) {
        this.isShowLoading = true;
        this.pullDownMsg = "释放刷新...";
      }
    },
    // 下拉刷新
    handleToTouchEnd(pos) {
      if (pos.y > 70) {
        // this.page = 1;
         this.isShowLoading = true;
        this.pullDownMsg = "正在更新中...";
        this.page = 1;
        this.goods = []
        this.getGoods();
      }
    },
    //确认显示还是隐藏 回到顶部
    scroll(position) {
      //1. 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
    },
    // 返回顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    code404(res) {
      this.pullDownMsg = "更新失败";
      this.isShowLoading = false;
      this.isShowUpLoading = false;
       Toast.fail(res.data.msg);
      return this.$refs.scroll.finishPullUp();
    },
    code405(res) {
      this.pullUpMsg = "没有更多了";
      setTimeout(() => {
        this.isShowUpLoading = false;
      }, 2000);
    },
    code200() {
      this.pullDownMsg = "更新成功";
      this.isShowLoading = false;
      this.isShowUpLoading = false;
    },
    finish() {
      this.$refs.scroll.finishPullUp();
    },
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