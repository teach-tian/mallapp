<template>
  <div class="order">
    <!-- 头部 -->
    <van-sticky>
      <van-nav-bar
        title="我的订单"
        left-text="个人中心"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <template #right>
          <van-icon name="replay" size="18" />
        </template>
      </van-nav-bar>
    </van-sticky>

    <!-- 滚动导航 -->
    <van-sticky :offset-top="46">
      <van-tabs v-model="active" swipeable @click="onClick" @rendered="onRendered">
        <van-tab v-for="(item,index) in title" :title="item.name" :name="index" :key="index">
          <!-- 按照索引指定展示组件 -->
          <all-order
            ref="All"
            v-show="index === 0"
            :orderData="orderData[9].list"
            @handleToNew="handleToNewP"
            @handleToTouchEnd="handleToTouchEndP"
          />
          <un-paid
            ref="UnPaid"
            v-show="index === 1"
            :orderData="orderData[0].list"
            @handleToNew="handleToNewP"
            @handleToTouchEnd="handleToTouchEndP"
          />
          <is-paid
            ref="IsPaid"
            v-show="index === 2"
            :orderData="orderData[1].list"
            @handleToNew="handleToNewP"
            @handleToTouchEnd="handleToTouchEndP"
          />
          <un-evaluated
            ref="UnEvaluated"
            v-show="index === 3"
            :orderData="orderData[2].list"
            @handleToNew="handleToNewP"
            @handleToTouchEnd="handleToTouchEndP"
          />
          <cancel
            ref="Cancel"
            v-show="index === 4"
            :orderData="orderData[4].list"
            @handleToNew="handleToNewP"
            @handleToTouchEnd="handleToTouchEndP"
          />
          <after-sale
            ref="AfterSale"
            v-show="index === 5"
            :orderData="orderData[7].list"
            @handleToNew="handleToNewP"
            @handleToTouchEnd="handleToTouchEndP"
          />
        </van-tab>
      </van-tabs>
    </van-sticky>
  </div>
</template>

<script>
import AllOrder from "./childComps/AllOrder";
import IsPaid from "./childComps/IsPaid";
import UnPaid from "./childComps/UnPaid";
import UnEvaluated from "./childComps/UnEvaluated";
import Cancel from "./childComps/Cancel";
import AfterSale from "./childComps/AfterSale";
import { Toast } from "vant";
export default {
  name: "Order",
  mounted() {
    //vue DOM更新是异步的，tab组件的v-model值在js中重设了，但是DOM并没有更新完
    //所以进行如此的操作
    let _sel = this;
    this.$nextTick(() => {
      _sel.getId();
      _sel.getOrderByState(this.orderType);
    });
  },
  components: {
    IsPaid,
    UnPaid,
    UnEvaluated,
    Cancel,
    AfterSale,
    AllOrder,
  },
  data() {
    return {
      active: 0,
      orderType: 0,
      //订单状态： 0未付款、1已付款、，2未评价，3已评价，4售后申请，5已完成售后，6已删除,7已取消
      orderData: {
        9: { page: 1, pageSize: 5, list: [] }, //全部
        0: { page: 1, pageSize: 5, list: [] }, //未付款
        1: { page: 1, pageSize: 5, list: [] }, //已付款 待收货
        2: { page: 1, pageSize: 5, list: [] }, //未评价
        4: { page: 1, pageSize: 5, list: [] }, //售后
        7: { page: 1, pageSize: 5, list: [] }, //已取消
      },
      title: [
        {
          index: 0,
          name: "全部",
        },
        {
          index: 1,
          name: "待付款",
        },
        {
          index: 2,
          name: "待收货",
        },
        {
          index: 3,
          name: "待评价",
        },
      ],
    };
  },
  methods: {
    //获得激活面板的id
    getId() {
      this.active = this.$route.params.id - 0;
      this.getType(this.active);
    },
    // 返回
    onClickLeft() {
      this.$router.push("/profile");
    },
    // 刷新
    onClickRight() {
      this.$router.push("/emptyPage");
    },
    getType(name) {
      switch (name) {
        case 0:
          this.orderType = 9;
          break;
        case 1:
          this.orderType = 0;
          break;
        case 2:
          this.orderType = 1;
          break;
        case 3:
          this.orderType = 2;
          break;
        case 4:
          this.orderType = 7;
          break;
        case 5:
          this.orderType = 4;
          break;
        default:
          break;
      }
    },
    // 点击切换事件
    onClick(name, title) {
      //点击标签时 清空数据 重新获取
      this.getType(name);
      this.orderData[this.orderType].page = 1;
      this.orderData[this.orderType].list = [];
      this.getOrderByState(this.orderType);
    },
    onRendered(name, title) {
      // console.log("name:"+name);
      // console.log("title:"+title);
      // //点击标签时 清空数据 重新获取
      //  this.getType(name)
      //   this.orderData[this.orderType].page = 1;
      //   this.orderData[this.orderType].list = []
      //  this.getOrderByState(this.orderType)
    },
    //组件的加载更多
    handleToNewP(type) {
      this.getType(type);
      this.getOrderByState(this.orderType);
    },
    //子组件发出刷新请求
    handleToTouchEndP(type) {
      this.getType(type);
      this.orderData[this.orderType].page = 1;
      this.orderData[this.orderType].list = [];
      this.getOrderByState(this.orderType);
      // this.$refs.type.finish()
    },
    //获取数据
    async getOrderByState(type) {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "订单查询中....",
        forbidClick: true,
        loadingType: "spinner",
      });
      await this.$api.order
        .getOrderByState({
          orderState: type,
          page: this.orderData[type].page,
          pageSize: this.orderData[type].pageSize,
        })
        .then((res) => {
          Toast.clear();
          this.close(type);
          if (res.data.code === 200) {
            //判断数据是否为空
            if (res.data.data.length === 0) {
              return this.noAny(type);
            }
            // 判断该订单是否存在数据 若不存在，则展示不存在的提示
            if (res.data.data.length === 0 && this.orderData[type].page === 1) {
              return this.noData(type);
            }
            this.orderData[type].list.push(...res.data.data);
            this.orderData[type].page += 1;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          Toast.clear();
          this.close(type);
          this.$message.error("可能网络走神了");
          console.log(err);
        });
    },
    // 没有更多数据
    noAny(type) {
      let _sel = this;
      let i = 0;
      switch (type) {
        case 0:
          i = _sel.$refs.UnPaid.length - 1;
          _sel.$refs.UnPaid[i].noAny();
          break;
        case 1:
          i = _sel.$refs.IsPaid.length - 1;
          _sel.$refs.IsPaid[i].noAny();
          break;
        case 2:
          i = _sel.$refs.UnEvaluated.length - 1;
          _sel.$refs.UnEvaluated[i].noAny();
          break;
        case 3:
          i = _sel.$refs.Cancel.length - 1;
          _sel.$refs.Cancel[i].noAny();
          break;
        case 4:
          i = _sel.$refs.AfterSale.length - 1;
          _sel.$refs.AfterSale[i].noAny();
          break;
        case 9:
          i = _sel.$refs.All.length - 1;
          _sel.$refs.All[i].noAny();
          break;
        default:
          break;
      }
    },
    // 没有相关订单
    noData(type) {
      let _sel = this;
      let i = 0;
      switch (type) {
        case 9:
          i = _sel.$refs.All.length - 1;
          _sel.$refs.All[i].noData();
          break;
        case 0:
          i = _sel.$refs.UnPaid.length - 1;
          _sel.$refs.UnPaid[i].noData();
          break;
        case 1:
          i = _sel.$refs.IsPaid.length - 1;
          _sel.$refs.IsPaid[i].noData();
          break;
        case 2:
          i = _sel.$refs.UnEvaluated.length - 1;
          _sel.$refs.UnEvaluated[i].noData();
          break;
        case 3:
          i = _sel.$refs.Cancel.length - 1;
          _sel.$refs.Cancel[i].noData();
          break;
        case 4:
          i = _sel.$refs.AfterSale.length - 1;
          _sel.$refs.AfterSale[i].noData();
          break;
        default:
          break;
      }
    },
    // 无法准确定位组件 存在多个组循环， 每次的还不一样
    // 此次修改未完全解决 没找到引发原因
    // 时不时会出一些奇怪的错误 无法关闭子组件的提示
    // 关闭子组件的提示
    close(type) {
      let _sel = this;
      let i = 0;
      switch (type) {
        case 0:
          i = _sel.$refs.UnPaid.length - 1;
          _sel.$refs.UnPaid[i].close();
          break;
        case 1:
          i = _sel.$refs.IsPaid.length - 1;
          _sel.$refs.IsPaid[i].close();
          break;
        case 2:
          i = _sel.$refs.UnEvaluated.length - 1;
          _sel.$refs.UnEvaluated[i].close();
          break;
        case 3:
          i = _sel.$refs.Cancel.length - 1;
          _sel.$refs.Cancel[i].close();
          break;
        case 4:
          i = _sel.$refs.AfterSale.length - 1;
          _sel.$refs.AfterSale[i].close();
          break;
        case 9:
          i = _sel.$refs.All.length - 1;
          // console.log(_sel.$refs.All);
          // console.log(i);
          _sel.$refs.All[0].close();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style>
</style>