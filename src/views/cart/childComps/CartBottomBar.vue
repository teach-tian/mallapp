<template>
  <div>
    <div class="cart-bottom-bar" v-show="!isedit">
      <div class="total-check">
        <!--      <img src="~assets/img/cart/tick.svg" alt="">-->
        <check-buttom :is-check="isSelectAll" @click.native="selectAllClick"></check-buttom>
        <span>全选</span>
      </div>
      <div class="total-price">
        <span>合计：￥{{totalPrice}}</span>
      </div>
      <div class="calc" @click="account">去结算({{calcCount}})</div>
    </div>
    <!-- 显示编辑的状态，，及删除的页面 -->
    <div class="cart-bottom-bar" v-show="isedit">
      <div class="total-check">
        <!--      <img src="~assets/img/cart/tick.svg" alt="">-->
        <check-buttom :is-check="isSelectAll" @click.native="selectAllClick"></check-buttom>
        <span>全选</span>
      </div>
      <div class="total-price">
      </div>
      <div class="calc" @click="deletecart">删除({{calcCount}})</div>
    </div>
    <!-- 删除确认 -->
    <el-dialog
  title="刪除确认"
  :visible.sync="centerDialogVisible"
  width="80%"
  center>
  <span>该操作将 <span class="delete">删除({{calcCount}})条 </span>购物车记录，是否确定?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="Confirm">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import CheckButtom from "components/content/checkButtom/CheckButtom";

export default {
  name: "CartBottomBar",
  props: ["cartList", "isedit"],
  data() {
    return {
      centerDialogVisible: false,
      cartid: '', //记录需要删除的购物车id
      goodsId:'', //记录需要购买的商品id
    }
  },
  components: {
    CheckButtom
  },
  computed: {
    totalPrice() {
      //汇总 先过滤
      return this.cartList
        .filter(item => {
          return item.ischecked === true;
        })
        .reduce((preValue, item) => {
          return preValue + item.price * item.product_amount;
        }, 0)
        .toFixed(2);
    },
    calcCount() {
      return this.cartList.filter(item => {
        return item.ischecked === true;
      }).length;
    },
    isSelectAll() {
      if (this.cartList.length === 0) {
        return false;
      }
      return !this.cartList.filter(item => !item.ischecked).length;
    }
  },
  methods: {
    selectAllClick() {
      if (this.isSelectAll) {
        this.cartList.forEach(item => (item.ischecked = false));
      } else {
        this.cartList.forEach(item => (item.ischecked = true));
      }
    },
    // 进行付款购买
    account() {
      if (this.calcCount === 0) {
        return this.$toast.show("您还没选择商品哦", 2000);
      } else {
         //清空
      this.goodsId = ''
      this.cartList.forEach(item => {
        if(item.ischecked){
          this.goodsId += item.product_id + ' '
        }
      })
       // 跳转到确认订单界面，，并把商品的id传过去
         return this.$router.push('/buyGoods/' + this.goodsId)
      }
    },
    // 删除购物车中的商品
    deletecart(){
      if (this.calcCount === 0) {
        return this.$toast.show("请选择需要删除的商品", 2000);
      }
      //清空
      this.cartid = ''
      this.cartList.forEach(item => {
        if(item.ischecked){
          this.cartid += item.cart_id + ','
        }
      })
      this.centerDialogVisible = true
    },
    // 确认删除
    Confirm(){
      this.centerDialogVisible = false
      this.$api.cart.deleteCart({
        carid: this.cartid
      }).then(res=>{
        // console.log(res);
        if(res.data.code === 201){
          this.$message.success(res.data.msg)
          //重新请求数据
          this.$emit('deleteOk')
        }else{
          return this.$message.error(res.data.msg)
        }
      }).catch(err=>{
        return this.$message.error('网络好像走神了')
      })
    }
  }
};
</script>

<style scoped>
.cart-bottom-bar {
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 49px;
  background: #eeeeee;
  display: flex;
  line-height: 40px;
  text-align: center;
}
.total-check {
  width: 25%;
  display: flex;
  justify-content: center;
}
.total-price {
  width: 50%;
}
.calc {
  width: 25%;
  background-color: #ff5028;
  color: #fff;
}
.delete{
  color: red;
}
</style>