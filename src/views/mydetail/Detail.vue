<template>
  <div class="detail">
    <detail-nav-bar @titleClick="titleClick" ref="detailBar" ></detail-nav-bar>
    <scroll
      class="content"
      @scroll="contenScroll"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
    >
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-bass-info :goods="goodsInfo" :servesInfo="serves"></detail-bass-info>
      <detail-comment-info ref="pj" :commentInfo="commentInfo" @toRate="toRate"></detail-comment-info>
      <detail-shop-info :shop="shopInfo"></detail-shop-info>
      <detail-goods-info ref="goods" :detail-info="detailInfo" ></detail-goods-info>    
      <div class="tj-img">
        <span>为你</span>
        <img src="~assets/img/common/tj(1).png" width="40" alt="">
        <span>推荐</span>
      </div>
      <van-divider  :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"/>
     <van-empty ref="tj" v-if="Object.keys(recommends).length === 0" description="抱歉 暂无推荐信息" />
      <goods-list v-else ref="tj" :goods="recommends"></goods-list>
    </scroll>
    <back-top class="backTop" @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar 
            ref="cart"
            :goodsInfo="goodsInfo"
            @addCart="addCart" 
            @buyClick="buyClick"
            @toService="toService"
            @addEnshrine="addEnshrine"
            @removeEnshrine="removeEnshrine">
    <!-- SKU展示 -->
    </detail-bottom-bar>
      <van-sku
        v-model="show"
        :sku="sku"
        :goods="shopInfo"
        :goods-id="goodsId"
        :quota="quota"
        :quota-used="quotaUsed"
        :hide-stock="sku.hide_stock"
        @buy-clicked="onBuyClicked"
        @add-cart="onAddCartClicked"
    />
  </div>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from './childComps/DetailSwiper'
import DetailBassInfo from './childComps/DetailBassInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailBottomBar from './childComps/DetailBottomBar'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'

// 暂时是展示信息
import GoodsList from 'components/content/goods/GoodsList'
import {getRecommend} from 'network/detail'

import BackTop from "components/common/backTop/BackTop";
import Scroll from "components/common/scroll/scroll";
// 功能组件
import { debounce } from "common/utils"; //防抖函数
import { Toast } from "vant";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBassInfo,
    DetailCommentInfo,
    DetailShopInfo,
    DetailBottomBar,
    DetailGoodsInfo,
    Scroll,
    BackTop,
    GoodsList
  },
  data() {
    return {
      goodsId: null,
      topImages: [],
      goodsInfo: {},
      shopInfo: {
         picture: '' 
      },
      serves:[], //服务
      detailInfo: '',
      itemParams: {},
      commentInfo: [],//评论信息
      recommends: [],
      topY: [],
      currentIndex: 0,
      isShowBackTop: false,
      show:false, //是否显示商品规格信息
      quota:10,  //限购数 0表示不限制
      quotaUsed:0 ,//已经购买过的数量
      hideStock:true, //是否显示商品剩余库存
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [
    {
      k: '颜色', // skuKeyName：规格类目名称
      v: [
        {
          id: '1193', // skuValueId：规格值 id
          name: '默认', // skuValueName：规格值名称
          imgUrl: 'https://img.yzcdn.cn/1.jpg', // 规格类目图片，只有第一个规格类目可以定义图片
          previewImgUrl: 'https://img.yzcdn.cn/1p.jpg', // 用于预览显示的规格类目图片
        },
        {
          id: '1215',
          name: '蓝色',
          imgUrl: 'https://img.yzcdn.cn/2.jpg',
          previewImgUrl: 'https://img.yzcdn.cn/2p.jpg',
        }
      ],
      k_s: 's2' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
    }
  ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          {
            id: 2259, // skuId，下单时后端需要
            price: 100, // 价格（单位分）
            s1: '1215', // 规格类目 k_s 为 s1 的对应规格值 id
            s2: '1193', // 规格类目 k_s 为 s2 的对应规格值 id
            s3: '0', // 最多包含3个规格值，为0表示不存在该规格
            stock_num: 110 // 当前 sku 组合对应的库存
          }
        ],
        price: '1.00', // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        hide_stock: false // 是否隐藏剩余库存
      }
    };
  },
   beforeRouteEnter(to, from, next) {
     next(vm=>{
       //""
       let path = from.fullPath.split('/')[1] 
       if( (path !== 'buyGoods' && path.length !== 0) && (path !== 'payOrder' && path.length !== 0) 
            && (path !== 'payOrderIsOK' && path.length !== 0)  && (path !== 'rate' && path.length !== 0)){
         if(vm.$store.getters.getSearchGoods !== '' && path !== "cart"){
           path += '/'+ vm.$store.getters.getSearchGoods
         }
         if(path === "cart"){
           path = path
         }
         vm.$store.dispatch("addPath",path);
       }
     })
   },
  created() {
    // 保存goodsId
    this.goodsId = this.$route.params.goodsId;
    //请求详情信息
    this.getGoodsInfo();
    //请求推荐信息
    //
     this.$nextTick(() =>{
      setTimeout(() =>{
        this.topY = []
        this.topY.push(0);
        this.topY.push(this.$refs.pj.$el.offsetTop);
        this.topY.push(this.$refs.goods.$el.offsetTop);
        this.topY.push(this.$refs.tj.$el.offsetTop);
        //  console.log(this.topY);
      },2500)
    })
  },
   mounted() {
    const refresh = debounce( this.$refs.scroll.refresh,300)
    //监听itme图片加载完成
    this.$bus.$on('DetailItemIamgLoad',() =>{
      refresh();
    })
  },
  methods: {
    async getGoodsInfo(){
       const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      await this.$api.goods.getGoodsInfo({
        goodsId:this.goodsId
      }).then(res=>{
         Toast.clear();
        //console.log(res);
        if(res.data.code === 200){
          //取出轮播图数据
          this.topImages = res.data.data[0].topImages.split(',')
          //sku默认展示图片
          this.sku.tree[0].v[0].imgUrl = this.topImages[0]
          this.sku.tree[0].v[0].previewImgUrl = this.topImages[0]
          //  取出商品支持的服务
          this.serves = res.data.data[2]
          //取出商品的数据
          this.goodsInfo = res.data.data[0]
          this.goodsInfo.picture = this.topImages[0]
          //保存库存信息
          this.sku.stock_num = this.goodsInfo.num
          this.sku.list[0].stock_num= this.goodsInfo.num
          //保存删库展示的价格
          this.sku.price = this.goodsInfo.goodsPrice
          this.sku.list[0].price = this.goodsInfo.goodsPrice * 100
          //评价信息
          if(res.data.data[3][0] !== null){
            this.commentInfo = res.data.data[3]
          }
          //取出店铺信息
          this.shopInfo  = res.data.data[1]
          //取出详情信息 HTML的代码段，
          this.detailInfo = this.goodsInfo.goodsIntroduce
        }else{
          return this.$message.error(res.data.msg);
        }
      }).catch(err=>{
        // console.log(err);
         Toast.clear();
         Toast.fail('加载失败');
        // return this.$message.error("网络连接失败");
      })
    },
    //跳转
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.topY[index], 800);
    },
    //回到顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    contenScroll(position) {
      let i = 0;
      if (-position.y >= 0 && -position.y < this.topY[1]) {
        i = 0;
      } else if (-position.y >= this.topY[1] && -position.y < this.topY[2]) {
        i = 1;
      } else if (-position.y >= this.topY[2] && -position.y < this.topY[3]) {
        i = 2;
      } else if (-position.y >= this.topY[3]) {
        i = 3;
      }
      this.currentIndex = i;
      this.$refs.detailBar.currentIndex = this.currentIndex;
      //1. 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
    },
    //添加购物车
    addCart(){
      this.$api.cart.addCart({
        product_id:this.goodsId,
        product_amount:1,
        price:this.goodsInfo.goodsPrice,
      }).then(res=>{
        if(res.data.code === 201){
          //添加成功时调用子组件中的获取购物车数量的函数
          this.$refs.cart.getLenght()
        }
        this.$toast.show(res.data.msg,1500)
      }).catch(err=>{
        this.$message.error('可能网络走神了')
      })
    },
    //点击购买商品 唤起sku
    buyClick(){
      // this.$toast.show('抱歉，暂未完成该模块',1500)
      this.show = true
    },
    onBuyClicked(sku){
      // 跳转到确认订单界面，，并把商品的id传过去
      //将购买的数量保存到vuex中
      this.$store.dispatch("addGoodsNum",sku.selectedNum)
      this.$router.push('/buyGoods/' + this.goodsId)
    },
    // 查看更多评论
    toRate(){
      //将商品的id保存到vuex中 便于回退到商品详情页
      this.$store.dispatch("addGoodID",this.goodsId)
      this.$router.push('/rate')
    },
    onAddCartClicked(sku){
       this.$api.cart.addCart({
        product_id:this.goodsId,
        product_amount:sku.selectedNum,
        price:this.goodsInfo.goodsPrice,
      }).then(res=>{
        if(res.data.code === 201){
          //添加成功时调用子组件中的获取购物车数量的函数
          this.$refs.cart.getLenght()
        }
        this.show = false
        this.$toast.show(res.data.msg,1500)
      }).catch(err=>{
        this.$message.error('可能网络走神了')
      })
    },
    //收藏商品
    addEnshrine(){
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "收藏中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.goods.createFavorite({
        goods_id:this.goodsId
      }).then(res=>{
        Toast.clear();
        if(res.data.code === 201){
          //修改成功 将数据进行修改
          this.goodsInfo.goodsFav += 1
          return this.goodsInfo.isFav = true
        }else{
          return this.$message.error(res.data.msg)
        }
      }).catch(err=>{
        Toast.clear();
        this.$message.error('服务器连接异常')
      })
    },
    //联系客服
    toService(){
      this.$toast.show('抱歉，暂未完成该模块',1500)
    },
    // 移除收藏
    removeEnshrine(){
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "取消中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      this.$api.goods.removeFavorite({
        goods_id:this.goodsId
      }).then(res=>{
        Toast.clear();
        if(res.data.code === 201){
          //修改成功 将数据进行修改
           this.goodsInfo.goodsFav -= 1
          return this.goodsInfo.isFav = false
        }else{
          return this.$message.error(res.data.msg)
        }
      }).catch(err=>{
        Toast.clear();
        this.$message.error('服务器连接异常')
      })
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: calc(100vh - 83px);
  /* position: absolute; */
  top: 44px;
  /* bottom: 49px; */
  left: 0;
  right: 0;
  /* background-color: #fff; */
  overflow: hidden;
}
.tj-img{
  width: 414px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 5px;
}
.tj-img span{
   line-height: 40px;
   height: 40px;
}
</style>