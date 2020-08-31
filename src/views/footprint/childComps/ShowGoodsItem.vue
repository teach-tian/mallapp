<template>
  <div class="goods-itme" @click="itemClick">
    <img v-lazy="showImage" alt @load="imgLoad" />
    <div id="goods-info">
      <p>{{goodsItem.goodsName}}</p>
      <span class="price">￥{{goodsItem.goodsPrice}}</span>
      <img class="sc-img" src="~assets/img/common/sc.png" alt />
      <span class="collect">{{goodsItem.goodsFav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowGoodsItem",
  props: ["goodsItem"],
  computed: {
    showImage() {
      return this.goodsItem.goodsLogo || this.goodsItem.show.goodsLogo;
    }
  },
  methods: {
    imgLoad() {
       this.$bus.$emit("itemIamgLoad");
    },
    itemClick() {
      this.$router.push("/myDetail/" + this.goodsItem.goodsId);
    }
  }
};
</script>

<style scoped>
.goods-itme {
  position: relative;
  padding-bottom: 40px;
  width: 28%;
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
</style>