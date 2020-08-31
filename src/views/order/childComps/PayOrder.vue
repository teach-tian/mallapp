<template>
  <div class="PayOrder">
    <!--头部  star-->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">订单支付</div>
    </nav-bar>
    <!--头部 end-->
    <!-- 2自动取消订单 -->
    <div class="payTime">
      <li>
      </li>
      <li>
        <strong>¥{{textPrice}}</strong>
      </li>
      <li>订单号:{{order_num}}</li>
    </div>
    <!--内容 star-->
    <div class="contaniner fixed-cont">
      <!--支付 star-->
      <div class="pay">
        <div class="show">
          <li>
            <label>
              <img src="~/assets/img/cart/zhifubao.png" />支付宝支付
              <input type="radio" v-model="radioVal" value="1" name="Fruit" />
              <span></span>
            </label>
          </li>
          <li>
            <label>
              <img src="~/assets/img/cart/weixin.png" />微信支付
              <input type="radio" v-model="radioVal" value="2" name="Fruit" />
              <!-- <input name="Fruit" type="radio" value="0"  /> -->
              <span></span>
            </label>
          </li>
          <li>
            <label>
              <img src="~/assets/img/cart/yuer.png" />余额支付
              <input type="radio" v-model="radioVal" value="3" name="Fruit" />
              <span></span>
            </label>
          </li>
        </div>
      </div>
      <!--支付 end-->
    </div>

    <div class="book-recovery-bot2" id="footer" @click="onSubmit">
      <div class="payBottom">确认支付</div>
    </div>
    <!--内容 end-->
    <!-- 调出密码键盘 -->
    <div v-show="inputpwd" id="inputpwdtop">
      <div id="inputpwd">
        <input-pwd ref="paypwd" @backFnc="clerPwd" @pwdIsOK="pwdIsOKP" />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import PayChange from "components/common/buyGoods/childComps/PayChange";
import InputPwd from "components/common/buyGoods/childComps/InpuPWD";
import { Toast } from "vant";
export default {
  name: "PayOrder",
  components: {
    NavBar,
    InputPwd,
    PayChange
  },
  data() {
    return {
      radioVal: "3", //// 用于设置默认选中项
      fullscreenLoading: false, //加载框是否显示
      payOrder: {},
      inputpwd: false,
      order_num: "", //订单号
      created_at: "", //订单创建时间
      timer: null, //计时器
      textPrice:'', //价格展示
      unit: new Array("仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分")
    };
  },
  created() {
    this.getPayOrder();
  },
  methods: {
    goback() {
      this.$router.push('/order/1')
      // if(this.payOrder.isFormCart){
      //    this.$router.push('/cart')
      // }else{
      //    this.$router.push('/mydetail/'+this.payOrder.goodIds)
      // }
    
    },
   getPayOrder(){
    //  获取路由传递过来的订单id
    let orderid=this.$route.params.orderid
    this.getOrder(orderid)
    //调用接口 获取数据
   },
   getOrder(orderid){
     const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "订单确认中...",
        forbidClick: true,
        loadingType: "spinner"
      });
     this.$api.order.getOrderById({
       order_id:orderid
     }).then(res=>{
       Toast.clear();
       if(res.data.code === 200){
         this.created_at = res.data.data.create_time
         this.order_num = res.data.data.order_number
         this.payOrder.goodsPrice = res.data.data.order_price - 0
       }else{
         this.$message.error(res.data.msg)
       }
     }).catch(err=>{
       Toast.clear();
      this.$message.error('网络连接异常')
     })
   },
    //提交 开始付款操作
    onSubmit() {
      if (this.radioVal !== "3") {
        return this.$message.error("抱歉！暂时仅支持余额支付");
      }
      //调用支付组件的清空方法 防止数据污染
      this.$refs.paypwd.clearPasswordHandle();
      // 进行密码验证
      this.inputpwd = true;
    },
    pwdIsOKP(value) {
      // 密码验证通过
      this.clerPwd();
      let _sel = this;
      const loading = this.$loading({
        lock: true,
        text: "密码验证中....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$api.order
        .verifyPayPWD({
          //md5加密 必须是字符串
          paypwd: value + ""
        })
        .then(res => {
          if (res.data.code === 200) {
            //密码正确
            loading.close();
            //调用接口 修改余额，支付状态
            _sel.toPayOrder();
          } else {
            loading.close();
            return this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
          return this.$message.error("网络连接失败");
        });
      setTimeout(() => {
        loading.close();
      }, 10000);
    },
    clerPwd() {
      this.inputpwd = false;
    },
     //进行订单的支付
    toPayOrder(){
       const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "订单支付中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.order.payOrder({
        orderNum : this.order_num
      }).then(res=>{
        Toast.clear();
        if(res.data.code === 201){
          //支付成功 
         this.$message.success(res.data.msg)
         //將返回的订单数据保存到vuex中 
         this.$store.dispatch("addServe",res.data.data)
        return this.$router.push('/payOrderIsOK')
        }else{
          return this.$message.error(res.data.msg)
        }
      }).catch(res => {
           Toast.clear();
          return this.$message.error("网络连接失败");
        });
    },
    sellCountFilter(m) {
      m *= 100;
      m += "";
      var length = m.length;

      var result = "";
      for (var i = 0; i < length; i++) {
        if (i == 2) {
          result = "元" + result;
        } else if (i == 6) {
          result = "万" + result;
        }
        if (m.charAt(length - i - 1) == 0) {
          if (i != 0 && i != 1) {
            if (
              result.charAt(0) != "零" &&
              result.charAt(0) != "元" &&
              result.charAt(0) != "万"
            ) {
              result = "零" + result;
            }
          }
          continue;
        }
        result =
          this.toDx(m.charAt(length - i - 1)) +
          this.unit[this.unit.length - i - 1] +
          result;
      }
      result += result.charAt(result.length - 1) == "元" ? "整" : "";
      this.textPrice = result;
    },
    toDx(n) {
      //阿拉伯数字转换函数
      switch (n) {
        case "0":
          return "零";
        case "1":
          return "壹";
        case "2":
          return "贰";
        case "3":
          return "叁";
        case "4":
          return "肆";
        case "5":
          return "伍";
        case "6":
          return "陆";
        case "7":
          return "柒";
        case "8":
          return "捌";
        case "9":
          return "玖";
      }
    }
  },
  updated() {
    this.sellCountFilter(this.payOrder.goodsPrice.toFixed(2))
  },
};
</script>

<style scoped>
#inputpwdtop {
  position: fixed;
  width: 100%;
  height: 100vh;
  bottom: 0;
  left: 0;
  flex: 9;
  background-color: rgba(0, 0, 0, 0.5);
}
#inputpwd {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  flex: 9;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
  outline: 0;
  color: #333;
}
.center {
  text-align: center;
}

.contaniner {
  width: 100%;
  margin-top: 2.5rem;
}
img {
  border: 0;
  vertical-align: middle;
}
.textfl {
  text-align: left;
}
.textfr {
  text-align: right;
}
.payTime {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  font-size: 12px;
  color: #999;
  font-weight: 300;
}
.payTime li {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.payTime strong {
  font-size: 24px;
  color: #333;
}
.payTime span {
  font-size: 14px;
}
.pay {
  width: 100%;
  height: 300px;
  position: relative;
}
.show {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.show li {
  width: 100%;
  height: 60px;
  line-height: 60px;
  list-style: none;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.show img {
  width: 40px;
  height: 40px;
  margin-left: 10px;
  margin-right: 10px;
}
.show input[type="radio"] {
  display: none;
}
.show input[type="radio"] + span {
  border: 1px solid #cccccc;
  border-radius: 20px;
  width: 20px;
  height: 20px;
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}
.show input[type="radio"]:checked + span {
  border: 1px solid #66c068;
  border-radius: 20px;
  background: url("../../../assets/img/cart/checkbox.png") no-repeat;
  background-size: 20px 20px;
}

.showList {
  width: 100%;
  position: absolute;
  top: 183px;
  left: 0;
}
.showList li {
  width: 100%;
  height: 60px;
  line-height: 60px;
  list-style: none;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.showList img {
  width: 40px;
  height: 40px;
  margin-left: 10px;
  margin-right: 10px;
}
.showList input[type="radio"] {
  display: none;
}
.showList input[type="radio"] + span {
  border: 1px solid #ccc;
  border-radius: 20px;
  width: 20px;
  height: 20px;
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}
.showList input[type="radio"]:checked + span {
  border: 1px solid #66c068;
  border-radius: 20px;
  background: url("../../../assets/img/cart/checkbox.png") no-repeat;
  background-size: 20px 20px;
}

label {
  width: 100%;
  height: 60px;
  display: inline-block;
}

.book-recovery-bot2 {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  line-height: 60px;
  background: #65bf67;
}
.book-recovery-bot2 div {
  width: 100%;
  height: 100%;
  float: left;
}
.book-recovery-bot2 a {
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
  display: block;
}

.payBottom {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: #009fe9;
  color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 16px;
}
.payBottom li {
  width: 50%;
  height: 60px;
  float: left;
}
.payBottom span {
  font-size: 24px;
  margin-top: 10px;
}
</style>