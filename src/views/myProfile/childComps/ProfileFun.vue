<template>
  <div class="ProfileFun">
    <div class="jq22-take-item">
			<div class="jq22-flex">
				<div class="jq22-flex-box">
					<h1>常用功能</h1>
				</div>
				
			</div>
			<div class="jq22-palace">
				<!-- <a href="javascript:;" class="jq22-palace-grid">
					<div class="jq22-palace-grid-icon">
						<img src="~assets/img/profile/images/nav-005.png" alt="">
					</div>
					<div class="jq22-palace-grid-text">
						<h2>我的绿卡</h2>
					</div>
				</a> -->
				<a href="javascript:;" class="jq22-palace-grid" @click="toShip">
					<div class="jq22-palace-grid-icon">
						<img src="~assets/img/profile/images/nav-006.png" alt="">
					</div>
					<div class="jq22-palace-grid-text">
						<h2>收货地址</h2>
					</div>
				</a>
				<a href="javascript:;" class="jq22-palace-grid" @click="toFavorite">
					<div class="jq22-palace-grid-icon">
						<img src="~assets/img/common/sc.png" alt="">
					</div>
					<div class="jq22-palace-grid-text">
						<h2>我的收藏</h2>
					</div>
				</a><a href="javascript:;" class="jq22-palace-grid" @click="footprint">
					<div class="jq22-palace-grid-icon">
						<img src="~assets/img/profile/images/foot.png" alt="">
					</div>
					<div class="jq22-palace-grid-text">
						<h2>浏览记录</h2>
					</div>
				</a>
				<!-- <a href="javascript:;" class="jq22-palace-grid">
					<div class="jq22-palace-grid-icon">
						<img src="~assets/img/profile/images/nav-008.png" alt="">
					</div>
					<div class="jq22-palace-grid-text">
						<h2>联系客服</h2>
					</div>
				</a> -->
				<!-- <a href="javascript:;" class="jq22-palace-grid">
					<div class="jq22-palace-grid-icon">
						<img src="~assets/img/profile/images/nav-011.png" alt="">
					</div>
					<div class="jq22-palace-grid-text">
						<h2>意见反馈</h2>
					</div>
				</a> -->
				<a href="javascript:;" class="jq22-palace-grid" @click="toSetting">
					<div class="jq22-palace-grid-icon">
						<img src="~assets/img/profile/images/nav-012.png" alt="">
					</div>
					<div class="jq22-palace-grid-text">
						<h2>设置</h2>
					</div>
				</a>
				
			</div>
		</div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
	name:'ProfileFun',
	methods: {
		toShip(){
			 this.$router.push('/ship')
		},
		toFavorite(){
			this.$router.push('/favorite')
		},
		toSetting(){
			this.$router.push('/setting')
		},
		footprint(){
			// const toast = Toast.loading({
      //   duration: 0, // 持续展示 toast
      //   message: "模块开发中，敬请期待",
      //   forbidClick: true,
      // });
      // setTimeout(()=>{
      //  Toast.clear();
      // },1500)
			this.$router.push('/footprint')
		}
	},
}
</script>

<style>

</style>