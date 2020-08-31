<template>
  <div class="feature">
    <div class="img-title" v-for="(item,index) in homeRecList" :key="index">
      <van-image
        round
        fit="cover"
        width="4rem"
        height="4rem"
        :src="item.sp_home_ico"
        :alt="item.sp_home_title"
        @click="onClick(item)"
      />
      <p>{{item.sp_home_title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeatureView",
  props: ["homeRecList"],
  methods: {
    onClick(item) {
     this.$router.push("search/" + item.sp_home_title);
    }
  }
};
</script>

<style scoped>
.feature{
  display: flex;
  flex-wrap: wrap;
  justify-content : center;
  text-align: center;
}
.feature .img-title {
  margin: 6px;
}
</style>