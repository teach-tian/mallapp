<template>
  <div class="aui-pay-change">
			<div class="aui-flex">
				<div class="aui-flex-box">
					<h3>等待买家付款</h3>
					<p>剩余23小时59分自动关闭</p>
				</div>
				<div class="aui-pay-zfb">
					<img src="~assets/img/cart/pay.png" alt="">
				</div>
			</div>
		</div>
</template>

<script>
export default {
	name:'PayChange'
}
</script>

<style scoped>

.divHeight {
    width: 100%;
    height: 10px;
    background: #f5f5f5;
    position: relative;
    overflow: hidden;
}


.aui-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 15px;
    position: relative;
}

.aui-flex-box {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: #333;
    /* width: 100%; */
}


.aui-pay-change {
    /* height: 120px; */
    background-image: -webkit-gradient(linear,left top,right top,from(#ff9000),to(#ff5101));
    background-image: -webkit-linear-gradient(left,#ff9000,#ff5101);
    background-image: -moz-linear-gradient(left,#ff9000,#ff5101);
    background-image: linear-gradient(to right,#ff9000,#ff5101);
    background-color: #ff5101;
    /* margin-bottom: 20px; */
}

.aui-pay-zfb {
    width: 100px;
}

.aui-pay-zfb img {
    width: 100%;
    height: auto;
    display: block;
    border: none;
}

.aui-pay-change .aui-flex {
    padding: 20px 30px;
    color: #fff;
}

.aui-pay-change .aui-flex-box {
    color: #fff;
}
</style>