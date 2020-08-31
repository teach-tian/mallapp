<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">
        <img src="~assets/img/home/LE_logo_2.png" style="width:80%" alt />
      </div>
    </nav-bar>
    <div @click="toSearch">
      <el-input placeholder="请输入需要搜索的商品">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <tab-control
      :titles="['流行','新款','精选']"
      ref="tabControl1"
      @tbClick="tbClick"
      class="tabControl"
      v-show="isTabFixd"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="scroll"
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
      <!-- <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper> -->
      <van-swipe class="my-swipe" height="215" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in banners" :key="index">
          <img height="215" v-lazy="item.slide_show_imgUrl" @load="swiperImageLoad" />
        </van-swipe-item>
      </van-swipe>
      <!-- <recommend-view :recommends="recommends"></recommend-view> -->
      <feature-view :homeRecList="homeRecList" />
      <tab-control :titles="['流行','新款','精选']" ref="tabControl2" @tbClick="tbClick"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
      <ul v-if="isShowUpLoading">
        <li class="pullUp">
          <i class="el-icon-loading"></i>
          {{ pullUpMsg }}
        </li>
      </ul>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
//子组件
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

//公共组件
import NavBar from "components/common/navbar/NavBar.vue";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/scroll";
import BackTop from "components/common/backTop/BackTop";

//功能组件
import { debounce } from "common/utils"; ////防抖函数

import { Toast, Dialog } from "vant";
export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        syn: { page: 1, list: [] },
        new: { page: 1, list: [] },
        sell: { page: 1, list: [] },
      },
      homeRecList: [],
      sortType: "syn",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixd: false,
      saveY: 0,
      //显示loading文字
      pullDownMsg: "",
      isShowUpLoading: false,
      pullUpMsg: "加载更多....",
      //是否显示loading
      isShowLoading: false,
      isLoad: false, //轮播图片是否加载完成
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.sortType].list;
    },
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
  created() {
    //请求首页商品数据
    this.searchGoods("syn");
    this.searchGoods("new");
    this.searchGoods("sell");
    // 请求首页广告与推荐区
    this.getHomeREC();
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    //监听itme图片加载完成
    this.$bus.$on("itemIamgLoad", () => {
      refresh();
    });
  },
  methods: {
    // 跳转到搜索页面
    toSearch() {
      this.$router.push("search/0");
    },
    // 获取推荐区的文本与ico
    getHomeREC() {
      this.$api.home
        .getHomeREC()
        .then((res) => {
          if (res.data.code === 200) {
            this.banners = res.data.data[1];
            this.homeRecList = res.data.data[0];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 事件监听
     */
    swiperImageLoad() {
      if (!this.isLoad) {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
        this.isLoad = true;
      }
    },
    tbClick(index) {
      switch (index) {
        case 0:
          this.sortType = "syn";
          break;
        case 1:
          this.sortType = "new";
          break;
        case 2:
          this.sortType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
      //
      // if (this.goods[this.sortType].list.lenght === 0) this.searchGoods();
      // 重新刷新一下scroll的高度
      // this.$refs.scroll.refresh();
    },
    //回到顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    //确认显示还是隐藏 回到顶部
    scroll(position) {
      //1. 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
      // 2.决定tabControl是否吸顶 (position:fiexd)
      this.isTabFixd = -position.y > this.tabOffsetTop;
    },
    //加载更多
    loadMore() {
      this.searchGoods(this.sortType);
    },

    /**
     *
     * 网络请求相关
     */
    // 搜索商品
    async searchGoods(type) {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      await this.$api.home
        .getHomeShowGoods({
          page: this.goods[type].page,
          pageSize: this.pageSize,
          sortType: type,
        })
        .then((res) => {
          Toast.clear();
          if (res.data.code === 200) {
            this.code200();
            // this.goods[this.sortType].list = []
            this.goods[type].list.push(...res.data.data);
            this.goods[type].page += 1;
            return this.finish();
          }
          if (res.data.code === 404) {
            this.code404(res);
          }
          if (res.data.code === 405) {
            this.code403(res);
          }
        })
        .catch((err) => {
          // loading.close();
          Toast.clear();
          Toast.fail("加载失败");
        });
    },
    code404(res) {
      this.pullDownMsg = "更新失败";
      this.tabIsShow = false;

      this.isShowUpLoading = false;
      Toast.fail(res.data.msg);
      return this.$refs.scroll.finishPullUp();
    },
    code403(res) {
      this.pullUpMsg = "没有更多了";
      setTimeout(() => {
        this.isShowUpLoading = false;
      }, 2000);
    },
    code200() {
      this.pullDownMsg = "更新成功";
      this.tabIsShow = true;

      this.isShowUpLoading = false;
    },
    finish() {
      this.$refs.scroll.finishPullUp();
    },
    handleToScroll(pos) {
      if (pos.y > 50) {
        this.isShowLoading = true;
        this.pullDownMsg = "正在更新中...";
      }
    },
    // 下拉刷新
    handleToTouchEnd(pos) {
      if (pos.y > 50) {
        this.$router.go(0);
      }
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
#home .van-swipe-item img {
  margin: 0 auto;
}
.content {
  /* height: 300px; */
  position: absolute;
  top: 93px;
  bottom: 49px;
  left: 0;
  right: 0;
  /* background-color: #fff; */
  overflow: hidden;
}
.tabControl {
  position: relative;
  z-index: 9;
  margin-top: -0.5px;
  background-color: #ffffff;
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
.nav-bar {
  height: 52px;
}
</style>