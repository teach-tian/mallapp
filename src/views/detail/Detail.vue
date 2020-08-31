<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="detailBar"></detail-nav-bar>
    <el-alert
    title="用户须知"
    type="warning"
    description="本界面仅做展示，如需购买请前往商城"
    show-icon>
  </el-alert>
    <scroll class="content"
            @scroll="contenScroll"
            ref="scroll" 
            :probe-type="3" 
            :pull-up-load="true">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-bass-info :goods="goodsInfo"></detail-bass-info>
      <detail-comment-info ref="pj" :commentInfo="commentInfo"></detail-comment-info>
      <detail-shop-info :shop="shopInfo"></detail-shop-info>
      <detail-item-params :param-info="itemParams"></detail-item-params>
      <detail-goods-info ref="goods" :detail-info="detailInfo" ></detail-goods-info>    
      <goods-list ref="tj" :goods="recommends"></goods-list>
    </scroll>
    <back-top class="backTop" @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar 
            @addCart="addCart" 
            @buyClick="buyClick"
            @toService="toService"
            @addEnshrine="addEnshrine"></detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBassInfo from './childComps/DetailBassInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailItemParams from './childComps/DetailItemParams'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'


  import BackTop from 'components/common/backTop/BackTop'
  import Scroll from 'components/common/scroll/scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail,Goods,getRecommend} from 'network/detail'
  import {debounce} from 'common/utils' ////防抖函数
  import {mapActions} from 'vuex'

export default {
  name:'Detail',
  components :{
    DetailNavBar,
    DetailSwiper,
    DetailBassInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailItemParams,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    Scroll,
    BackTop
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goodsInfo:{},
      shopInfo:{},
      detailInfo:{},
      itemParams:{},
      commentInfo:{},
      recommends:[],
      topY:[],
      currentIndex:0,
      isShowBackTop:false
    }
  },
  methods: {
    ...mapActions(['addCart']),
     titleClick(index){
      this.$refs.scroll.scrollTo(0, -this.topY[index],800) 
    },
    //回到顶部
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },
    contenScroll(position){
       let i = 0;
        if(-position.y >= 0 && -position.y < this.topY[1]) {
            i = 0;
        }
        else if(-position.y >= this.topY[1] && -position.y < this.topY[2]) {
          i = 1;
        }
        else if(-position.y >= this.topY[2] && -position.y < this.topY[3]) {
          i = 2;
        }
        else if(-position.y >= this.topY[3]) {
          i = 3;
        }
        this.currentIndex = i;
        this.$refs.detailBar.currentIndex = this.currentIndex;
         //1. 判断BackTop是否显示
        this.isShowBackTop = -position.y > 1000
    },
    //添加购物车
    addCart(){
     return this.$toast.show('请到商城操作',1500)
      //1.获取购物车需要展示的商品信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goodsInfo.title;
      product.desc = this.goodsInfo.desc;
      product.price = this.goodsInfo.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车
      this.$store.dispatch('addCart',product).then(res =>{
        //  _self.$toast.methods.show(res,1500)
        this.$toast.show(res,1500)
      })
    },
    //购买商品
    buyClick(){
      this.$toast.show('请到商城操作',1500)
    },
    //收藏商品
    addEnshrine(){
      this.$toast.show('抱请到商城操作',1500)
    },
    //联系客服
    toService(){
      this.$toast.show('请到商城操作',1500)
    }

  },
  mounted() {
    const refresh = debounce( this.$refs.scroll.refresh,300)
    //监听itme图片加载完成
    this.$bus.$on('DetailItemIamgLoad',() =>{
      refresh();
    })
  },
  created() {
    // 保存iid
    this.iid = this.$route.params.iid
    //根据iid请求网络数据
    getDetail(this.iid).then(res => {
      const data = res.result;
      //取出轮播图数据
      this.topImages = data.itemInfo.topImages
      //创建商品对象
      this.goodsInfo = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      //取出店铺信息
      this.shopInfo = data.shopInfo
      //取出商品展示信息
      this.detailInfo = data.detailInfo
      //提取参数信息
      this.itemParams = data.itemParams
      //提取评论信息
      if(data.rate.cRate !==0){
        //因为服务器只返回了一条信息 所以暂时只取第一个
        this.commentInfo = data.rate.list[0]
      }
    })
    //请求推荐信息
    getRecommend().then(res =>{
     this.recommends = res.data.list
    })

    this.$nextTick(() =>{
      setTimeout(() =>{
        this.topY = []
        this.topY.push(0);
        this.topY.push(this.$refs.pj.$el.offsetTop);
        this.topY.push(this.$refs.goods.$el.offsetTop);
        this.topY.push(this.$refs.tj.$el.offsetTop);
        // console.log(this.topY);
      },1000)
    })
  },
}
</script>

<style scoped>
#detail{
  height: 100vh;
  background-color: #ffffff;
  position: relative;
  z-index: 1;
}
  .content{
    background-color: #ffffff;
    height: calc(100% - 93px);
  }
</style>