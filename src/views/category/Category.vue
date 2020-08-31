<template>
  <div class="category">
    <nav-bar>
      <div slot="center">商品分类</div>
    </nav-bar>
    <!-- 搜索框 -->
    <div @click="toSearch">
      <el-input  placeholder="请输入需要搜索的商品">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <side-bar ref="sideBar" :SideBarList="SideBarList"/>
    
  </div>
</template>

<script>
import SideBar from './childComps/SideBar'
import NavBar from "components/common/navbar/NavBar.vue";
import { Sidebar, SidebarItem,Toast } from 'vant';
export default {
  name: "CateGory",
  components: {
    NavBar,
    SideBar
  },
  data() {
    return {
      SideBarList:[]
    };
  },
  created() {
    this.getCatsTree()
  },
  methods: {
    toSearch(){
      this.$router.push("search/0");
    },
    getCatsTree(){
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      let _sel = this;
      this.$api.goods.getCatsTree().then((res)=>{
         Toast.clear();
         if(res.data.code === 200){
           this.SideBarList = res.data.data
           //调用子组件的方法 加载展示商品
           setTimeout(()=>{
             _sel.$refs.sideBar.createdData()
           },200)
         }else{
           return this.$message.error(res.data.msg);
         }
      }).catch((err)=>{
         Toast.clear();
        // console.log(err);
        Toast.fail("加载失败");
      })
    }
  }
};
</script>

<style scoped>
</style>