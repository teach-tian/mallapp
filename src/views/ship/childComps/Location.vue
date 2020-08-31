<template>
  <div>
    <div class="aui-flex">
      <div class="aui-flex-add">
        <img src="~/assets/img/cart/location.png" alt />
      </div>
      <div class="aui-flex-box">
        <h3>
          {{locationData.name}}
          <em>{{locationData.phone}}</em>
        </h3>
        <div>
          <el-row :gutter="24">
            <el-col :span="18">
              <div class="grid-content bg-purple add-text ">
                <span v-if="locationData.isDefault" class="default">默认</span>
                {{addr}}
                </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple text" @click="toEdit">编辑</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Location",
  props:['locationData'],
  data() {
    return {
      addr:'',
    }
  },
  created(){
    this.joinAddr()
  },
  methods:{
    joinAddr(){
      this.addr = this.locationData.province+' '+this.locationData.city+' '+this.locationData.district+' '+this.locationData.address+' '
    },
    toEdit(){
      // 将信息保存到vux 方便在修改页面取值
      this.$store.dispatch('addEditArea',this.locationData)
      this.$router.push('/editArea')
    }
  }
};
</script>

<style scoped>
.default{
  background-color: #FFF2EC;
  color: #F9590A;
  width: 36px;
  line-height: 25px;
  text-align: center;
  height: 25px;
  display:inline-block
}
.el-row {
    margin-bottom: 20px;
}
  .el-col {
    border-radius: 4px;
  }
  .add-text{
    padding-right: 5px;
    line-height: 24px;
    border-right: 1px solid #C1C1C1;
  }
  .text{
    /* height: 25px; */
    line-height: 47px;
    text-align: center;
  }
.aui-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  padding: 10px 10px 0 10px;
  position: relative;
  border-bottom: 1px solid #C1C1C1;
  margin-top: 15px;
}
.aui-flex-box {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #333;
  /* width: 100%; */
}
.aui-flex-add {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.aui-flex-add img {
  width: 100%;
  height: auto;
  display: block;
  border: none;
}
.aui-flex-box h3 em {
  font-size: 14px;
  color: #999;
  font-style: normal;
  font-weight: normal;
}
</style>