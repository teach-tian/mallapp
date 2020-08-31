<template>
  <div class="ProfilePoint">
    <div class="jq22-flex jq22-flex-three">
			<div class="jq22-flex-box jq22-flex-box-info" @click="toBalancelLog()">
				<h4>账号余额 <em>{{userData.user_money | sellCountFilter}}</em>元</h4>
			</div>
			<div class="jq22-flex-box" @click="toPointLog()">
				<h4>积分 <em>{{userData.user_point | sellCountFilter}}</em>分</h4>
			</div>
		</div>
  </div>
</template>

<script>
export default {
	name:'ProfilePoint',
	props:['userData'],
	  filters:{
    sellCountFilter(value){
      let rselt =value;
      if(value > 10000){
        rselt = (rselt / 10000).toFixed(1) + '万'
      }
      return rselt
    }
	},
	methods: {
		toBalancelLog(){
			this.$router.push('/balanceLog')
		},
		toPointLog(){
			this.$router.push('/pointLog')
		}
	},
}
</script>

<style>

</style>