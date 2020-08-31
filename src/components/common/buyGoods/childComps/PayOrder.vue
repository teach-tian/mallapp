<template>
  <div class="PayOrder">
    <!--头部  star-->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">确认订单</div>
    </nav-bar>
    <!--头部 end-->
    <el-alert
    v-show="radioVal - 0 === 1"
      title="支付宝支付使用须知"
      type="warning"
      description="使用支付宝在线支付，请使用沙盒账号（联系开发者获取），不用使用自己的支付宝账号进行登录支付。若出现任何问题 本站概不负责"
      show-icon
    ></el-alert>
    <!-- 2自动取消订单 -->
    <div class="payTime">
      <li>
        <span>剩余支付时间 {{lastPayTime}}</span>
      </li>
      <li>
        <strong>¥{{textPrice}}</strong>
      </li>
      <!-- <li>创建时间:{{orderData[0].createTime}}</li> -->
      <!-- <li v-for="(item,index) in orderData" :key="index">订单号:{{item.orderNumber}}</li> -->
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
import PayChange from "./PayChange";
import InputPwd from "./InpuPWD";
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
      orderData: [], //订单信息
      order_num: "", //订单号
      created_at: "", //订单创建时间
      lastPayTime: "", //剩余时间
      timer: null, //计时器
      textPrice: "", //价格展示
      unit: new Array("仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分")
    };
  },
  created() {
    this.getPayOrder();
    this.computedLastPayTime();
  },
  methods: {
    goback() {
      if (this.payOrder.isFormCart) {
        this.$router.push("/cart");
      } else {
        this.$router.push("/mydetail/" + this.payOrder.goodIds);
      }
    },
    //从vux中取出需要购买商品的信息
    getPayOrder() {
      this.payOrder = this.$store.getters.getPayOrder;
      this.orderData.push(...this.$store.state.subOrder);
      this.created_at = this.orderData[0].createTime;
      //拼接字符串 按空格分隔
      this.orderData.forEach(item => {
        this.order_num += item.orderNumber + " ";
      });
    },
    //提交 开始付款操作
    onSubmit() {
      if (this.radioVal === "1") {
        return this.AliPay();
      }
      if (this.radioVal === "2") {
        return this.$message.error("抱歉！暂时不支持微信支付");
      }
      if (this.radioVal === "3") {
        //调用支付组件的清空方法 防止数据污染
        this.$refs.paypwd.clearPasswordHandle();
        // 进行密码验证
        this.inputpwd = true;
        return;
      }
    },
    // 调用阿里支付
    AliPay() {
      const loading = this.$loading({
        lock: true,
        text: "支付申请中....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$api.onlinePay
        .appWebPay({
          OutTradeNo: this.order_num,
          Subject: "手机网站支付测试",
          ProductCode: "QUICK_WAP_WAY",
          body: "手机网站支付描述信息",
          TotalAmount: this.payOrder.goodsPrice
        })
        .then(res => {
          loading.close();
          if (res.data.code === 201) {
            //将数据存到vuex中
            // this.$store.dispatch('addAliFrom', res.data.data)
            this.html = res.data.data;
            var form = res.data.data;
            const div = document.createElement("div");
            div.innerHTML = form; //此处form就是后台返回接收到的数据
            document.body.appendChild(div);
            document.forms[0].submit();
            //return this.$router.push('/aliPay')
          } else {
            return this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          loading.close();
          return this.$message.error("服务器连接异常");
        });
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
    toPayOrder() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "订单支付中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      //进行订单的支付
      this.$api.order
        .payOrder({
          orderNum: this.order_num
        })
        .then(res => {
          Toast.clear();
          if (res.data.code === 201) {
            //支付成功
            this.$message.success(res.data.msg);
            return this.$router.push("/payOrderIsOK");
          } else {
            return this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          Toast.clear();
          return this.$message.error("网络连接失败");
        });
    },
    // 订单倒计时
    computedLastPayTime() {
      let self = this;
      this.timer = setInterval(function() {
        let createTime = Date.parse(self.created_at) / 1000;
        let endTime = createTime + 900;
        let clientTime = Date.parse(new Date()) / 1000;
        let lastTime = (endTime - clientTime).toFixed(0); //
        let int_minute;
        if (lastTime > 0) {
          int_minute = Math.floor(lastTime / 60);
          lastTime -= int_minute * 60;
          self.lastPayTime = int_minute + "分" + lastTime + "秒";
        } else {
          //当时间到期 跳转到订详情，，
          clearInterval(this.timer);
          this.timer = null;
          self.$router.push("/order/1");
        }
      }, 1000);
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
    this.sellCountFilter(this.payOrder.goodsPrice.toFixed(2));
  },
  // 销毁组件前清除定时器
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
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
  background: url("../../../../assets/img/cart/checkbox.png") no-repeat;
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
  background: url("../../../../assets/img/cart/checkbox.png") no-repeat;
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