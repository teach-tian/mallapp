<template>
  <div class="goods-itme" @click="itemClick">
    <img v-lazy="showImage" alt @load="imgLoad" />
    <div class="goods-num">已售{{goodsItem.goodsBuyNum | sellCountFilter}}件</div>
    <div id="goods-info">
      <p>{{goodsItem.goodsName}}</p>
      <span class="price">
        <span>￥</span>
        {{goodsItem.goodsPrice}}
      </span>
      <img class="sc-img" src="~assets/img/common/sc.png" alt />
      <span class="collect">{{goodsItem.goodsFav}}</span>
      <div class="goods">
        <div class="old-price">{{goodsItem.goodsOldPrice}}</div>
        <!-- <div class="goodsAre">{{goodsItem.goodsAre}}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
    inputData: {
      type: String,
      default() {
        return "";
      },
    },
  },
  //进行数据的处理
  filters: {
    sellCountFilter(value) {
      let rselt = value;
      if (value > 10000) {
        rselt = (rselt / 10000).toFixed(1) + "万";
      }
      return rselt;
    },
  },
  computed: {
    showImage() {
      return this.goodsItem.goodsLogo;
    },
  },
  methods: {
    //
    imgLoad() {
      // 判断是哪个路由活跃用以判断是首页还是推荐页的监听事件
      //首页
      /*
      按理说这样应该是反的，但是这样写却又是可以正确获得
      */
      if (this.$route.path.indexOf("/home")) {
        this.$bus.$emit("DetailItemIamgLoad");
      }
      // 详情页
      else if (this.$route.path.indexOf("/detail")) {
        this.$bus.$emit("itemIamgLoad");
      }
      // this.$bus.$emit('itemIamgLoad')
    },
    itemClick() {
      if (this.goodsItem.goodsId) {
        this.$store.dispatch("addSearchGoods", this.inputData);
        this.$router.push("/mydetail/" + this.goodsItem.goodsId);
      } else {
        return this.$toast.show("推荐商品暂未上架", 1200);
        //this.$router.push('/detail/' + this.goodsItem.item_id)
      }
    },
  },
};
</script>

<style scoped>
.goods-itme {
  position: relative;
  padding-bottom: 52px;
  width: 48%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
}
.goods-itme img {
  width: 100%;
  border-radius: 5px;
}
#goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}
#goods-info .sc-img {
  position: relative;
  left: -4px;
  top: 2px;
  width: 14px;
  height: 14px;
}
#goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}
#goods-info .price {
  color: var(--color-hight-text);
  margin-right: 20px;
}
#goods-info .collect {
  position: relative;
}
.old-price {
  color: gainsboro;
  margin-right: 10px;
  text-decoration: line-through;
  font-size: 10px;
  margin-left: 5px;
  float: left;
}
.goodsAre {
  font-size: 10px;
  margin-right: 5px;
  float: right;
}
.goods {
  height: 10px;
}
.goods-num {
  position: absolute;
  top: 170px;
  left: 0;
  right: 0;
  min-width: 30%;
  max-width: 40%;
  height: 1rem;
  line-height: 1rem;
  z-index: 3;
  color: white;
  text-align: left;
  background-size: 100%;
  font-size: 0.3rem;
  text-overflow: ellipsis;
  background: url("~assets/img/category/index.png") 0 no-repeat;
  padding-left: 5px;
}
</style>