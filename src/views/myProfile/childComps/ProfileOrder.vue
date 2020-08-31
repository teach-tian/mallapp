<template>
  <div class="ProfileOrder">
    <div class="jq22-take-item">
      <div class="jq22-flex" style="padding-bottom:0">
        <div class="jq22-flex-box">
          <h1>我的订单</h1>
        </div>
        <div class="jq22-arrow" @click="toOrder(0)">
          <span>查看全部订单</span>
        </div>
      </div>

      <div class="jq22-palace">
         <a href="javascript:;" class="jq22-palace-grid"  @click="toOrder(0)">
          <div class="jq22-palace-grid-icon">
            <el-badge :value="OrderData.all" :max="10" class="item">
              <img src="~assets/img/profile/images/nav-013.png" alt />
            </el-badge>
          </div>
          <div class="jq22-palace-grid-text">
            <h2>全部</h2>
          </div>
        </a>
        <a href="javascript:;" class="jq22-palace-grid"  @click="toOrder(1)">
          <div class="jq22-palace-grid-icon">
            <el-badge :value="OrderData.unPaid" :max="10" class="item">
              <img src="~assets/img/profile/images/nav-001.png" alt />
            </el-badge>
          </div>
          <div class="jq22-palace-grid-text">
            <h2>待支付</h2>
          </div>
        </a>
        <a href="javascript:;" class="jq22-palace-grid"  @click="toOrder(2)">
          <div class="jq22-palace-grid-icon">
            <el-badge :value="OrderData.isPaid" :max="10" class="item">
              <img src="~assets/img/profile/images/nav-002.png" alt />
            </el-badge>
          </div>
          <div class="jq22-palace-grid-text">
            <h2>待收货</h2>
          </div>
        </a>
        <a href="javascript:;" class="jq22-palace-grid"  @click="toOrder(3)">
          <div class="jq22-palace-grid-icon">
            <el-badge :value="OrderData.unEvaluated" :max="10" class="item">
              <img src="~assets/img/profile/images/nav-003.png" alt />
            </el-badge>
          </div>
          <div class="jq22-palace-grid-text">
            <h2>待评价</h2>
          </div>
        </a>
        <!-- <a href="javascript:;" class="jq22-palace-grid"  @click="toOrder(4)">
          <div class="jq22-palace-grid-icon">
            <el-badge :value="OrderData.afterSale" :max="10" class="item">
              <img src="~assets/img/profile/images/nav-004.png" alt />
            </el-badge>
          </div>
          <div class="jq22-palace-grid-text">
            <h2>售后</h2>
          </div>
        </a> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: "ProfileOrder",
	props:['OrderData'],
	methods: {
		toOrder(index){
      this.$router.push('/order/' + index)
    }
	},
};
</script>

<style>
</style>