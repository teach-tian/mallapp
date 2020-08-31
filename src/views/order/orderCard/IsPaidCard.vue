<template>
  <div class="IsPaidCard">
    <el-card shadow="always">
       <shop-card :orderData="orderData">
       <div slot="shopName">卖家已发货</div>
     </shop-card>
      <div class="foot">
         <div class="foot-right">
       <van-button plain hairline round  type="danger" @click="delivery()">确认收货</van-button>
         </div>
     <div class="foot-left">
       <van-button plain hairline round  type="primary" @click="CheckTheLogistics()">查看物流</van-button>
     </div>
    
   </div>
    </el-card>
  </div>
</template>

<script>
import ShopCard from './ShopCard'
import { Toast } from 'vant';
export default {
  name: "IsPaidCard",
  props:['orderData'],
  components:{
    ShopCard
  },
  methods: {
    // 签收订单
    delivery(){
       const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "签收中.....",
        forbidClick: true,
      });
      this.$api.order.PatchDelivery({
        order_id:this.orderData[0].order_id
      }).then(res=>{
        Toast.clear();
        if(res.data.code === 201){
          //发送到父组件 进行刷新
          // 本来是打算移除数组元素进行移除显示的，，但是数组的层级有点多 不太好拿 且容易出现错误，不方便维护
          // 所以改为刷新 重新请求数据
           //签收成功 前往评价页面
            const toast = Toast.loading({
              duration: 0, // 持续展示 toast
              message: "签收成功，跳转中.....",
              forbidClick: true
            });
            setTimeout(() => {
              Toast.clear();
              //进行页面的跳转
              this.$router.push('/orderComm/'+this.orderData[0].order_id)
            },1000);
          //this.$emit('deliveryIsOK')
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err=>{
        Toast.clear();
        // console.log(err);
         this.$message.error('网络连接异常')
      })
    },
    // 查看物流
    CheckTheLogistics(){
      this.$emit('showDialog',this.orderData[0].order_id)
    }
  },
};
</script>

<style scoped>
.el-card {
  width: 98%;
  margin: 5px auto;
}
.goods-right{
  float: right;
  margin-right: -54px;
  color: red;
}
.foot{
  /* width: 200px; */
  float: right;
  height: 50px;
}
.foot .foot-right,.foot-left{
  float: right;
}
.foot .foot-left{
  margin-right: 5px;
}
.van-button {
  width: 100px;
}
</style>