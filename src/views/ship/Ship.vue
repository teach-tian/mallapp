<template>
  <div id="ship">
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">我的收货地址</div>
      <div slot="right" @click="addShip">新增</div>
    </nav-bar>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @pullingUp="loadMore"
      :handleToScroll="handleToScroll"
      :handleToTouchEnd="handleToTouchEnd"
    >
      <location v-for="(item,index) in areData" :key="index" :locationData="item" />
    </scroll>
  </div>
</template>

<script>
import Location from "./childComps/Location";

import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/scroll";
import {Toast} from"vant"
export default {
  name: "Ship",
  components: {
    Location,
    NavBar,
    Scroll
  },
  data() {
    return {
      pullDownMsg: "",
      page: 1,
      pageSize: 5,
      areData: []
    };
  },
  created() {
    this.getArea();
  },
  methods: {
    goback() {
      // 返回上一页
      this.$router.push('/profile')
    },
    // 获取用户的地址
    getArea() {
       const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.user
        .GetUserArea({
          params: {
            page: this.page,
            pageSize: this.pageSize
          }
        })
        .then(res => {
           Toast.clear();
          if (res.data.code === 200) {
            return this.areData.push(...res.data.data);
          }
        })
        .catch(err => {
           Toast.clear();
          this.$message.error("网络连接异常");
        });
    },
    // 添加新地址
    addShip() {
      this.$router.push("/area");
    },
    handleToScroll(pos) {
      if (pos.y > 30) {
        this.pullDownMsg = "正在更新中...";
      }
    },
    handleToTouchEnd(pos) {
      if (pos.y > 30) {
        this.$router.go(0);
      }
    },
    loadMore() {
      this.page += 1;
      this.getArea();
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: calc(100vh - 44px);
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
</style>