<template>
  <div id="SelectArea">
      <!-- 头部导航 -->
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">更换收货地址</div>
      <div slot="right" @click="toAdd()">新增</div>
    </nav-bar>
    <van-address-list
      v-model="AreaIndex"
      :list="areData"
      default-tag-text="默认"
      add-button-text="选择该地址"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import NavBar from "components/common/navbar/NavBar.vue";
export default {
  name: "SelectArea",
  components:{
    NavBar
  },
  data() {
    return {
      AreaIndex:'1', //默认选中的id
      page: 1,
      pageSize: 10,
      areData: [],
      goodsId:'',
    };
  },
  created() {
    this.alterID();
    this.getArea();
  },
  methods: {
    goback(){
     return this.$router.push('/buyGoods/' + this.goodsId)
    },
     alterID() {
      // 保存goodsId,,,当是从购物车那过来的，则会传递一个由商品id组成传递字符串，按' '分隔
      this.goodsId = this.$route.params.goodsId;
    },
    //跳转到添加
    toAdd(){
       this.$router.push("/area");
    },
    // 获取用户的地址
    getArea() {
      this.$api.user
        .GetUserArea({
          params: {
            page: this.page,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            this.areData.push(...res.data.data);
            this.AreaIndex = res.data.data[0].id
           
          }
        })
        .catch(err => {
          this.$message.error("网络连接异常");
        });
    },
    onAdd() {
       let _sel = this;
      this.areData.forEach(item=>{
        if(item.id === _sel.AreaIndex){
           _sel.$store.dispatch('addEditArea', item)
        }
      })
      return this.$router.push('/buyGoods/' + this.goodsId)
    },
    onEdit(item, index) {
       let _sel = this;
      this.areData.forEach(item=>{
        if(item.id === _sel.AreaIndex){
           _sel.$store.dispatch('addEditArea', item)
        }
      })
      this.$router.push('/editArea')
    }
  }
};
</script>

<style>
</style>