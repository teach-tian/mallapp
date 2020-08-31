<template>
  <div class="order">
    <div class="divHeight b-line"></div>
    <div class="aui-flex aui-flex-text-sml b-line">
      <div class="aui-flex-box">
        <p>
          <em>商品积分:</em> 获得{{OrderInfo.point}}积分
        </p>
        <p>
          <em>订单编号:</em> {{OrderInfo.orderNum}}
        </p>
        <p>
          <em>交易编号:</em> {{OrderInfo.runingTab}}
        </p>
        <p>
          <em>下单时间:</em> {{OrderInfo.createDate}}
        </p>
        <p>
          <em>支付时间:</em> {{OrderInfo.payDate}}
        </p>
        <p>
          <em>支付方式:</em> {{OrderInfo.payment}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'OrderInfo',
  data() {
    return {
      OrderInfo:{}
    }
  },
  created() {
    this.getServe()
  },
  methods: {
    getServe(){
      this.OrderInfo = this.$store.getters.getServe
    }
  },
};
</script>

<style>
</style>