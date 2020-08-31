<template>
  <div class="SideBar">
    <van-row>
      <van-col span="5">
        <!-- 侧边导航栏 -->
        <van-sidebar v-model="activeKey" @change="onChange">
          <van-sidebar-item
            v-for="(item,index) in SideBarList"
            :key="index"
            :title="item.cat_name"
          />
        </van-sidebar>
      </van-col>
      <van-col span="19">
        <!-- 用于商品展示 -->
        <tab-control :titles="['综合','销量','新品']" ref="tabControl" @tbClick="tbClick"></tab-control>
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
          <goods-list :goods="showGoods"></goods-list>
          <ul v-if="isShowUpLoading">
            <li class="pullUp">
              <i class="el-icon-loading"></i>
              {{ pullUpMsg }}
            </li>
          </ul>
        </scroll>
        <!-- 回到顶部 -->
        <back-top ref="top" @click.native="backClick" v-show="isShowBackTop"></back-top>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import GoodsList from "../../goods/GoodsList";
import TabControl from "components/content/tabControl/TabControl";

import BackTop from "components/common/backTop/BackTop";
import Scroll from "components/common/scroll/scroll";
import { debounce } from "common/utils"; //防抖函数
import { Toast } from "vant";
export default {
  name: "SideBar",
  props: ["SideBarList"],
  data() {
    return {
      activeKey: 0, //激活的侧边栏
      goods: {
        syn: { page: 1, list: [] },
        sales: { page: 1, list: [] },
        new: { page: 1, list: [] },
        price: { page: 1, list: [] }
      }, //商品的展示信息
      pageSize:10,
      sortType: "syn", //选择的排序
      sideType: "", // 激活的侧边栏的分类id
      isShowLoading: false,
      pullUpMsg: "加载更多....",
      isShowUpLoading: false,
      // 是否显示 回到顶部按钮
      isShowBackTop: false
    };
  },
  components: {
    TabControl,
    GoodsList,
    Scroll,
    BackTop
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
      return this.goods[this.sortType].list;
    }
  },
  methods: {
    // 切换分类
    onChange(index) {
      this.listClear();
      let cat_name = this.SideBarList[index].cat_name;
      this.getCadGoods(cat_name);
    },
    //页面创建时进行的数据获取
    createdData() {
      let cat_name = this.SideBarList[0].cat_name;
      this.getCadGoods(cat_name);
    },
    // 切换排序
    // 切换显示的样式 价格、销量
    tbClick(index) {
      this.isPrice = false;
      switch (index) {
        case 0:
          // 综合
          this.sortType = "syn";
          break;
        case 1:
          // 销量
          this.sortType = "sales";
          break;
        case 2:
          // 价格
          this.sortType = "new";
          break;
        case 3:
          this.sortType = "price";
          //将价格显示器显示出来
          this.isPrice = true;
          break;
      }
      this.listClear()
      let cat_name = this.SideBarList[this.activeKey].cat_name;
      this.getCadGoods(cat_name);
    },
    listClear(){
       //接口前处理
      this.goods.syn.page = 1;
      this.goods.sales.page = 1;
      this.goods.new.page = 1;
      this.goods.price.page = 1;

      this.goods.syn.list = [];
      this.goods.sales.list = [];
      this.goods.new.list = [];
      this.goods.price.list = [];
    },
    // 获取展示的数据
    getCadGoods(cat_name) {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.pullUpMsg = "加载更多....";
      this.$api.goods
        .getGoods({
          goodsName: cat_name,
          page: this.goods[this.sortType].page,
          pageSize: this.pageSize,
          sortType: this.sortType
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 200) {
            this.code200();
            // this.goods[this.sortType].list = []
            this.goods[this.sortType].list.push(...res.data.data);
            this.goods[this.sortType].page += 1;
            return this.finish();
          }
          if (res.data.code === 404) {
            this.code404(res);
          }
          if (res.data.code === 405) {
            this.code405(res);
          }
        })
        .catch(err => {
          // loading.close();
          Toast.clear();
          Toast.fail("加载失败");
          // return this.$message.error("网络连接失败");
        });
    },
    code404(res) {
      this.pullDownMsg = "更新失败";
      this.tabIsShow = false;
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
      this.tabIsShow = true;
      this.isShowLoading = false;
      this.isShowUpLoading = false;
    },
    finish() {
      this.$refs.scroll.finishPullUp();
    },
    // 上拉加载更多 分页数据
    loadMore() {
      this.isShowUpLoading = true;
      this.pullDownMsg = "正在更新中...";
      let cat_name = this.SideBarList[this.activeKey].cat_name;
      this.getCadGoods(cat_name);
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
        // this.page = 1;
        this.goods[this.sortType].page = 1;
        let cat_name = this.SideBarList[this.activeKey].cat_name;
        this.getCadGoods(cat_name);
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
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: calc(100vh - 173px);
  /* position: absolute; */
  /* top: 66px; */
  bottom: 49px;
  left: 0;
  right: 0;
  /* background-color: #fff; */
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