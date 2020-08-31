<template>
  <div class="search">
    <!-- 头部信息 -->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">商品搜索</div>
    </nav-bar>
    <!-- 搜索框 -->
    <div>
      <van-search
        v-model="inputData"
        show-action
        label="商品名"
        placeholder="请输入商品关键词"
        input-align="center"
        maxlength="20"
        @search="onclick"
        @cancel="onclick"
        @focus="searchName"
        @blur="blur"
      >
        <template #action>
          <div @click="onclick">搜索</div>
        </template>
      </van-search>
      <!-- 热搜 -->
      <search-hot v-show="isSearch" :SearchHotList="SearchHotList" @hotClick="hotClick" />
      <!-- 搜索历史 -->
      <search-history
        v-show="pastHistory"
        :historyList="historyList"
        @deleteHis="deleteHis"
        @clickHistory="clickHistory"
        @clearHistory="clearHistory"
      />
    </div>
    <!-- 有商品信息时进行商品展示 -->
    <div v-show="!isSearch">
      <!-- 展示样式 排序的样式 -->
      <tab-control
        v-show="tabIsShow"
        :titles="['综合','销量','新品','价格']"
        ref="tabControl"
        @tbClick="tbClick"
      ></tab-control>
      <!-- 价格选择 -->
      <price-select
        :goodsName="inputData"
        @newData="newDataP"
        @code404c="code404"
        @code403c="code403"
        v-show="isPrice"
      ></price-select>
      <!-- 商品展示 -->
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
        <goods-list :goods="showGoods" :inputData="inputData"></goods-list>
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
  </div>
</template>

<script>
import GoodsList from "../goods/GoodsList";
import PriceSelect from "./childComps/PriceSelect";
import SearchHistory from "./childComps/SearchHistory";
import SearchHot from "./childComps/SearchHot";

// 公共组件
import TabControl from "components/content/tabControl/TabControl";
import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/scroll";
import BackTop from "components/common/backTop/BackTop";

// 功能组件
import { debounce } from "common/utils"; //防抖函数
import { Toast, Dialog } from "vant";
export default {
  name: "Search",
  components: {
    PriceSelect,
    GoodsList,
    NavBar,
    TabControl,
    Scroll,
    BackTop,
    Dialog,
    SearchHistory,
    SearchHot
  },
  data() {
    return {
      //输入框中的信息展示 后期优化方案：将文本替换为用户上次输入的文本
      searchTxt: "请输入需要搜索的商品",
      // 输入框的数据绑定 用于信息查找
      inputData: "",
      isPrice: false,
      pullUpMsg: "加载更多....",
      isShowUpLoading: false,
      // 是否显示 回到顶部按钮
      isShowBackTop: false,
      // 搜索得到的商品数据
      goods: {
        syn: { page: 1, list: [] },
        sales: { page: 1, list: [] },
        new: { page: 1, list: [] },
        price: { page: 1, list: [] }
      },
      tabIsShow: false,
      isShowLoading: false,
      page: 1,
      pageSize: 20,
      sortType: "syn",
      isSearch: true, //是否是搜索状态
      pastHistory: false, //历史记录默认不显示,有搜索记录才显示
      newArr: [],
      list: [], //存到本地的搜索记录
      isdel: false, //标记为正在进行移除历史的操作
      historyList: [], //搜索历史的展示信息
      SearchHotList: [] //热搜信息 暂无接口信息 进行模拟
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getname();
      let path = from.fullPath.split("/")[1];
      if (path !== "mydetail" && path !== "") {
        vm.$store.dispatch("addPathSearch", from.fullPath.split("/")[1]);
      }
    });
  },
  created() {
    this.getNewArr();
    this.getSearchHot();
  },
  methods: {
    goback() {
      // console.log( this.goods.syn.list.length);
      // if(this.isSearch && this.goods.syn.list.length !== 0){
      //    return this.isSearch = false
      // }
      //
      // console.log(this.$store.getters.getFromSearch);
      this.$router.push("/" + this.$store.getters.getFromSearch);
    },
    // 焦点离开时
    blur() {
      // this.isSearch = false;
      this.isdel = false;
      // this.pastHistory = false;
    },
   async getSearchHot(){
    await this.$api.goods.getSearchHot().then(res=>{
        if(res.data.code === 200){
          this.SearchHotList = res.data.data
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //提取路由传的值
    getname() {
      let name = this.$route.params.name;
      // 数据置空
      if (name - 0 !== 0 &&  name !== this.inputData) {
        this.inputData = "";
        this.goods.syn.page = 1;
        this.goods.sales.page = 1;
        this.goods.new.page = 1;
        this.goods.price.page = 1;

        this.goods.syn.list = [];
        this.goods.sales.list = [];
        this.goods.new.list = [];
        this.goods.price.list = [];
        this.inputData = name;
        
        this.searchGoods();
        this.isSearch = false;
      }
    },
    //点击热搜进行的搜索
    hotClick(item) {
      this.inputData = item;
      this.onclick();
    },
    // 清空所有的搜索历史
    clearHistory() {
      Dialog.confirm({
        title: "清空确认",
        message: "该操作将清空所有历史记录，请确认"
      })
        .then(() => {
          let list = [];
          localStorage.setItem("historyList", JSON.stringify(list));
          this.historyList = [];
          this.newArr = [];
          // this.isSearch = false;
          this.pastHistory = false;
        })
        .catch(() => {});
    },
    //点击搜索
    async onclick() {
      // 数据置空
      this.goods.syn.page = 1;
      this.goods.sales.page = 1;
      this.goods.new.page = 1;
      this.goods.price.page = 1;

      this.goods.syn.list = [];
      this.goods.sales.list = [];
      this.goods.new.list = [];
      this.goods.price.list = [];

      this.pastHistory = false; //每次点击搜索后历史记录就隐藏

      if (this.inputData !== "") {
        //判断输入框的值
        // 每次搜索的值push到新数组里
        this.newArr.push(this.inputData);

        this.newArr = this.unique(this.newArr); //调用unique方法去重
        this.list = [];

        for (let i = this.newArr.length; i > 0; i--) {
          //数组倒序  最新输入的排在最上面
          this.list.push(this.newArr[i - 1]);
        }

        if (this.list.length > 10) {
          //最多保存10条
          this.list = this.list.slice(0, 10);
        }
        localStorage.setItem("historyList", JSON.stringify(this.list)); //存localStorage
        let arrlist = JSON.parse(localStorage.getItem("historyList"));
        this.historyList = arrlist;
      }
      //发送网络请求
      await this.searchGoods();
      this.isSearch = false;
    },
    //测试使用  尝试解决刷新页面时历史记录重新开始
    getNewArr() {
      if (localStorage.getItem("historyList"))
        this.newArr = JSON.parse(localStorage.getItem("historyList"));
    },
    //去重方法封装
    unique(arr) {
      return arr.filter(function(item, index, arr) {
        return arr.indexOf(item, 0) === index;
      });
    },
    // 点击文本框输入 输入框聚集焦点时
    searchName() {
      this.isSearch = true;
      this.isdel = false;
      if (localStorage.getItem("historyList")) {
        //historyList有值才执行接下来的操作
        let arrlist = JSON.parse(localStorage.getItem("historyList"));
        this.historyList = arrlist;
        if (this.historyList.length !== 0) {
          this.pastHistory = true; //有值显示历史记录
        }
      } else {
        this.pastHistory = false;
      }
    },
    // 点击历史记录直接搜索
    async clickHistory(item, index) {
      if (this.isdel) return;
      this.pastHistory = false;
      this.isSearch = false;
      //接口前处理
      this.goods.syn.page = 1;
      this.goods.sales.page = 1;
      this.goods.new.page = 1;
      this.goods.price.page = 1;

      this.goods.syn.list = [];
      this.goods.sales.list = [];
      this.goods.new.list = [];
      this.goods.price.list = [];

      this.inputData = item;
      await this.searchGoods(); //调用搜索接口
      let listIndex = index;

      this.historyList.splice(0, 0, this.historyList[listIndex]); //每次点击记录被点击的展示在最前面
      this.historyList = this.unique(this.historyList); // 去重

      localStorage.setItem("historyList", JSON.stringify(this.historyList)); //新数组储存
    },
    //点击删除记录
    deleteHis(index) {
      this.isdel = true;
      Dialog.confirm({
        title: "删除确认",
        message: "确认删除该历史记录?"
      })
        .then(() => {
          if (isNaN(index) || index >= this.historyList.length) {
            return false;
          }
          this.historyList.splice(index, 1);
          localStorage.setItem("historyList", JSON.stringify(this.historyList)); //保存删除后的新数组
          let arrlist = JSON.parse(localStorage.getItem("historyList"));
          this.historyList = arrlist; //重新赋值
          this.newArr = arrlist;
          if (this.historyList.length === 0) {
            this.pastHistory = false;
          }
        })
        .catch(() => {
          // on cancel
        });
    },

    // 搜索商品
    async searchGoods() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      await this.$api.goods
        .getGoods({
          goodsName: this.inputData,
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
            this.code403(res);
          }
        })
        .catch(err => {
          // loading.close();
          Toast.clear();
          Toast.fail("加载失败");
          return this.$message.error("网络连接失败");
        });
    },
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
      // this.goods[this.sortType].list = []
      this.searchGoods();
      // 重新刷新一下scroll的高度
      this.$refs.scroll.refresh();
    },
    // 上拉加载更多 分页数据
    loadMore() {
      this.isShowUpLoading = true;
      this.pullDownMsg = "正在更新中...";
      // this.page += 1;
      //调用接口
      this.searchGoods();
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
        this.searchGoods();
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
      this.tabIsShow = false;
      this.isShowLoading = false;
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
      this.isShowLoading = false;
      this.isShowUpLoading = false;
    },
    finish() {
      this.$refs.scroll.finishPullUp();
    },
    //价格筛选数据添加
    newDataP(value) {
      //置空
      this.goods["price"].list = [];
      this.goods["price"].list.push(...value);
      this.goods["price"].page += 1;
      this.finish();
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: calc(100vh - 125px);
  /* position: absolute; */
  top: 66px;
  /* bottom: 49px; */
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
.van-search__action {
  padding: 0 18px;
}
.search .van-cell {
  width: 80%;
  margin: 0 auto;
}
</style>