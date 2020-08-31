<template>
<!-- 广告 -->
  <div class="ProfileAdve" @click="toAdv()">
    <div class="jq22-flex jq22-flex-fore">
			<div class="jq22-flex-box">
				<img src="~assets/img/profile/images/ad-001.png" alt="">
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name:'ProfileAdve',
  methods: {
    toAdv(){
      this.$emit('toAdv')
    }
  },
}
</script>

<style>

</style>