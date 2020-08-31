<template>
  <div class="list-item">
    <div class="item-selector">
      <check-buttom :is-check="product.ischecked" @click.native="checkClick" v-show="!isedit"></check-buttom>
      <check-buttom :is-check="product.ischecked" @click.native="checkClick2" v-show="isedit"></check-buttom>
    </div>
    <div class="item-img" @click="toGoodsInfo">
      <img v-lazy="product.image" alt="商品图片" @load="imgLoad" />
    </div>
    <div class="item-info">
      <div class="item-title" @click="toGoodsInfo">{{product.title}}</div>
      <div class="item-desc"></div>
      <div class="info-bottom">
        <div class="item-price">￥{{product.price}}</div>
        <!-- 编辑时显示 -->
        <div class="input-text" v-show="isedit">
          <!-- <el-input-number size="mini" v-model="product.product_amount" @change="handleChange" :min="1" :max="10"></el-input-number> -->
          <van-stepper
            v-model="product.product_amount"
            theme="round"
            @change="handleChange"
            :min="1"
            :max="10"
          />
        </div>
        <!-- 结算显示 -->
        <div class="item-count" v-show="!isedit">x{{product.product_amount}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import checkButtom from "components/content/checkButtom/CheckButtom";
import _ from "lodash";
import { Toast } from "vant";
export default {
  name: "CartGoodsListItem",
  components: {
    checkButtom
  },
  props: {
    product: {
      type: Object,
      default() {
        return {};
      }
    },
    isedit: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      cartInfo: {}, //用来确保商品数量修改失败还能进行页面的正确显示
      isOk: false //上一个网络请求是否完成
    };
  },
  created() {
    //深拷贝一份商品的数据
    this.cartInfo = _.cloneDeep(this.product);
  },
  methods: {
    imgLoad() {
      this.$bus.$emit("itemIamgLoad");
    },
    //修改商品的选择状态
    checkClick() {
      this.$api.cart
        .pathCartChecked({
          catId: this.product.cart_id
        })
        .then(res => {
          if (res.data.code === 201) {
            return (this.product.ischecked = !this.product.ischecked);
          } else {
            return this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          return this.$message.error("网络异常，请稍后重试");
        });
    },
    //到商品详情
    toGoodsInfo() {
      this.$router.push("/mydetail/" + this.product.product_id);
    },
    //商品数量发生改变时
    handleChange(value) {
      // 发生网络请求 进行数据库的修改
      if (this.isOk) {
        Toast.loading({ forbidClick: true });
        setTimeout(() => {
          Toast.clear();
          // 注意此时修改 value 后会再次触发 change 事件
          this.product.product_amount = this.cartInfo.product_amount;
        }, 500);
        return;
      } else {
         this.isOk = true
        const toast = Toast.loading({
          duration: 0, // 持续展示 toast
          message: "修改中...",
          forbidClick: true,
          loadingType: "spinner"
        });
        this.$api.cart
          .patchCartNum({
            catId: this.product.cart_id,
            product_amount: value
          })
          .then(res => {
            Toast.clear();
            this.isOk = false;
            if (res.data.code === 201) {
              return (this.cartInfo.product_amount = this.product.product_amount);
              // this.$message.success(res.data.msg)
            } else {
              //修改失败时 将深拷贝的数据给显示的数据用，用来确保能正确显示
              this.product.product_amount = this.cartInfo.product_amount;
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            Toast.clear();
            this.isOk = false;
            this.$message.error("网络可能走神了");
          });
      }
    },
    // 修改商品选择状态，仅本地选择，不修改服务器的数据
    // 用于删确认
    checkClick2() {
      return (this.product.ischecked = !this.product.ischecked);
    }
  }
};
</script>

<style scoped>
.list-item {
  width: 100%;
  display: flex;
  font-size: 0;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}
.item-selector {
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-title,
.item-desc {
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.item-title {
  font-size: 18px;
  margin-bottom: 4px;
}
.item-img {
  padding: 5px;
}
.item-img img {
  width: 80px;
  height: 100px;
  display: block;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
.item-info {
  font-size: 17px;
  color: #333;
  padding: 5px 10px;
  position: relative;
  overflow: hidden;
}
.item-info,
.item-desc {
  color: #666;
  font-size: 14px;
}
.item-desc {
  margin-top: 15px;
}
.info-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.item-price {
  color: #ffb805;
  font-size: 20px;
}
.item-count {
  font-size: 20px;
}
</style>