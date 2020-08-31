<template>
  <div class="UnPaid">
    <van-empty v-if="Object.keys(orderData).length === 0" description="您还没有相关订单" />
    <scroll
      class="content"
      ref="scroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <ul v-show="isShowLoading">
        <li class="pullDown">
          <i class="el-icon-loading"></i>
          {{ pullDownMsg }}
        </li>
      </ul>
      <goods-card v-for="(item,index) in orderData" :orderData="item" :key="index" @cancelIsOK="cancelIsOKP" @cancel="CancelP"/>
      <ul v-show="isShowUpLoading">
        <li class="pullUp">
          <i class="el-icon-loading"></i>
          {{ pullUpMsg }}
        </li>
      </ul>
     
    </scroll>
     <!-- 取消订单确认 -->
    <van-dialog
      v-model="show"
      title="请选择取消订单的原因"
      show-cancel-button
      cancel-button-text="暂不取消"
      confirm-button-text="确认取消"
      @confirm="con()"
    >
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-list>
          <van-cell v-for="(item,index) in cancelData" :title="item.cancel_text" clickable @click="radioClick(item.cancel_status)" :key="index">
            <template #right-icon>
              <van-radio :name="item.cancel_status " />
            </template>
          </van-cell>
        </van-list>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
import GoodsCard from "../orderCard/UnPaidCard";
import { debounce } from "common/utils"; //防抖函数
import Scroll from "components/common/scroll/scroll";
import { Toast, Dialog } from "vant";
export default {
  name: "UnPaid",
  props: ["orderData"],
  data() {
    return {
      isShowLoading: false,
      isShowUpLoading: false,
      isShowBackTop: false,
      pullDownMsg: "",
      pullUpMsg: "",
      show: false,
      //0收货人信息有误,1商品数量或款式需调整,2有更优惠的购买方案,3商品缺货,4我不想买了,5七天无理由退换货，6其他原因
      radio: 0,
      cancelData:[],  //存放取消时的文本信息
      order_id:0,
    };
  },
  components: {
    GoodsCard,
    Scroll,
     [Dialog.Component.name]: Dialog.Component
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    //监听itme图片加载完成
    this.$bus.$on("itemIamgLoad", () => {
      refresh();
    });
  },
  created() {},
  methods: {
    //没有相关订单数据
    // 上拉加载更多 分页数据
    loadMore() {
      this.isShowUpLoading = true;
      this.pullUpMsg = "加载更多.....";
      //调用接口
      return this.$emit("handleToNew",1);
    },
    handleToScroll(pos) {
      if (pos.y > 70) {
        this.isShowLoading = true;
        this.pullDownMsg = "释放刷新";
      }
    },
    close(){
      this.isShowLoading = false;
    },
    // 下拉刷新
    handleToTouchEnd(pos) {
      if (pos.y > 70) {
        this.pullDownMsg = "正在更新中...";
        this.$emit('handleToTouchEnd',1)
        // this.$router.go(0);
      }else{
        this.pullDownMsg = "已取消";
      }
    },
     noAny(){
      this.pullUpMsg = '已经到底了'
      setTimeout(()=>{
        this.isShowUpLoading = false
      },1500)
    },
    finish() {
      this.$refs.scroll.finishPullUp();
    },
    cancelIsOKP(){
      this.$emit('handleToTouchEnd',1)
    },
    //切换单选按钮
    radioClick(value){
     this.radio = value
    },
    //确认取消
    con() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "订单取消中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      setTimeout(() => {
        this.$api.order
          .patchOrderToCancel({
            order_id: this.order_id,
            cancel_id:this.radio
          })
          .then(res => {
            Toast.clear();
            if (res.data.code === 201) {
              //取消成功 进行刷新
              this.$emit('handleToTouchEnd',1)
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            Toast.clear();
            this.$message.error("可能网络走神了");
          });
      }, 500);
    },
    CancelP(value){
      //
      this.order_id = value
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "数据校验中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.order.getCancel().then(res=>{
        Toast.clear();
        if(res.data.code === 200){
           this.cancelData = []
          this.cancelData.push(...res.data.data)
          
          return (this.show = true);
        }else{
          this.$message.error(res.data.msg);
        }
      }).catch(err=>{
        Toast.clear();
       this.$message.error("数据校验失败，请稍后重试");
      })
    }
  },
  updated() {
    this.finish();
  },
};
</script>

<style scoped>
.content {
  height: calc(100vh - 90px);
  overflow: hidden;
}
.pullDown {
  margin: 0;
  padding: 16px;
  text-align: center;
  border: none;
}
.pullUp {
  margin: 0;
  text-align: center;
  border: none;
}
</style>