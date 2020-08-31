<template>
  <div class="rate">
    <nar-bar />
    <meil-all v-for="(item,index) in commentData" :key="index" :commentData="item"/>
  </div>
</template>

<script>
import NarBar from "./childComps/NavBar";
import MeilAll from "./childComps/MeiliAllItem";
import { Toast } from "vant";
export default {
  name: "Rate",
  components: {
    NarBar,
    MeilAll
  },
  data() {
    return {
      good_id: "",
      page: 1,
      pageSize: 10,
      commentData:[],
    };
  },
  created() {
    this.getGoodID();
    this.GetAllRateByGoodId();
  },
  methods: {
    getGoodID() {
      this.good_id = this.$store.getters.getGoodID;
    },
    //获取所需的评论
    GetAllRateByGoodId() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.comment
        .GetAllRateByGoodId({
          good_id: this.good_id,
          page: this.page,
          page_size: this.pageSize
        })
        .then(res => {
          Toast.clear();
          if(res.data.code === 200){
            this.commentData.push(...res.data.data)
            this.page += 1
          }
          console.log(res);
        })
        .catch(err => {
          Toast.clear();
          Toast.fail("加载失败");
        });
    }
  }
};
</script>

<style>
</style>