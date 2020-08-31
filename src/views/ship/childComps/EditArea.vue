<template>
  <div id="editArea">
    <nav-bar>
      <div slot="left" @click="goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div slot="center">修改收货地址</div>
    </nav-bar>
    <div class="head_top">
      <div class="right r">
        <div class="CityList"></div>
      </div>
      <div v-if="Unlimited" @click="toAddress" class="Unlimited">
        <el-button type="primary" plain>点击-快速选择城市</el-button>
      </div>
      <v-distpicker type="mobile" @selected="selected" v-show="addInp" class="area1"></v-distpicker>
      <el-card class="box-card">
        <div class="mask">
          <el-form
            :model="AreaForm"
            status-icon
            :rules="AreaFormRules"
            ref="AreaFormREF"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="收件人" prop="name">
              <el-input v-model="AreaForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="AreaForm.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="省份" prop="address">
              <el-input v-model="AreaForm.province" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地级市" prop="address">
              <el-input v-model="AreaForm.city" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="市、县级市" prop="address">
              <el-input v-model="AreaForm.district" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input type="textarea" v-model="AreaForm.address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="默认地址">
              <el-switch
                v-model="isPitch"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitForm()">立即修改</el-button>
          <br />
          <br />
          <el-button type="danger" @click="resetForm()">删除该地址</el-button>
          <div id="toastId2" class="toasttj2" style="display: none; opacity: 0;"></div>
        </div>
      </el-card>
    </div>
  </div>
</template>
 
<script>
import VDistpicker from "v-distpicker";
import NavBar from "components/common/navbar/NavBar.vue";

import _ from 'lodash'
export default {
  components: { VDistpicker, NavBar },
  name: "EditArea",
  created() {
    this.getData();
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value) {
        let re = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
        if (re.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的手机号码"));
        }
      }
    };
    return {
      addInp: false, //是否显示三级联动的下拉框
      AreaForm: {
        province: "",
        city: "",
        area: "",
        name: "",
        phone: "",
        address: "",
        district: "",
      },
      isPitch: false, ///定义不同的名字 防止数据被污染，，，是否是选择状态
      Unlimited: true,
      cancelProvinceShow: false,
      cancelCityShow: false,
      cancelAreaShow: false,

      searchList: {
        province_id: 150000,
        city_id: 150500,
        area_id: ""
      },
      AreaFormRules: {
        name: [
          { required: true, message: "收件人名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "收件人联系方式", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入收货地址", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    goback() {
      // 返回上一页
      // this.$router.push('/ship')
      this.$router.go(-1)
    },
    getData() {
      this.AreaForm = _.cloneDeep(this.$store.getters.geteditArea);
      this.isPitch = this.AreaForm.isDefault;
    },
    toAddress() {
      this.addInp = true;
    },
    selected(data) {
      //城市选择
      this.Unlimited = false;
      this.addInp = false;
      this.AreaForm.province = data.province.value;
      this.AreaForm.city = data.city.value;
      this.AreaForm.area = data.area.value;
      (this.cancelProvinceShow = true),
        (this.cancelCityShow = true),
        (this.cancelAreaShow = true);
      this.searchList.province_id = data.province.code;
      this.searchList.city_id = data.city.code;
      this.searchList.area_id = data.area.code;
      //localStorage.setItem("cityCode", JSON.stringify(this.searchList));
    },
    //城市关闭按钮显示
    buttonShow() {
      (this.cancelProvinceShow = false),
        (this.cancelCityShow = false),
        (this.cancelAreaShow = false),
        (this.Unlimited = false);
      if (this.AreaForm.province) {
        this.cancelProvinceShow = true;
      }
      if (this.AreaForm.city) {
        this.cancelCityShow = true;
      }
      if (this.AreaForm.area) {
        this.cancelAreaShow = true;
      }
      if (
        !this.AreaForm.province &&
        !this.AreaForm.city &&
        !this.AreaForm.area
      ) {
        this.Unlimited = true;
      }
      localStorage.setItem("cityCode", JSON.stringify(this.searchList));
    },
    //取消省
    cancelProvince() {
      this.AreaForm.province = "";
      this.AreaForm.city = "";
      this.AreaForm.area = "";
      this.searchList.province_id = "";
      this.searchList.city_id = "";
      this.searchList.area_id = "";
      this.buttonShow();
    },
    //取消市
    cancelCity() {
      this.AreaForm.city = "";
      this.AreaForm.area = "";
      this.searchList.city_id = "";
      this.searchList.area_id = "";
      this.buttonShow();
    },
    //取消区
    cancelArea() {
      this.AreaForm.area = "";
      this.searchList.area_id = "";
      this.buttonShow();
    },
    // 提交
    submitForm() {
      this.$refs.AreaFormREF.validate(result => {
        if (!result) {
          // console.log("验证不通过");
          return false;
        } else {
          if(this.isPitch)
            this.AreaForm.isDefault = 0
          else
            this.AreaForm.isDefault = 1
          
          // console.log(this.AreaForm);
          this.$api.user.patchUserArea({
            CustomerAddrId:this.AreaForm.customerAddrId,
            CustomerId:this.AreaForm.customerId,
            Name:this.AreaForm.name,
            Phone:this.AreaForm.phone,
            Province:this.AreaForm.province,
            City:this.AreaForm.city,
            District:this.AreaForm.district,
            Address:this.AreaForm.address,
            IsDefault:this.AreaForm.isDefault,
            IsDel:this.AreaForm.isDel,
          }).then(res=>{
            if(res.data.code === 201){
              this.$message.success(res.data.msg)
              return this.$router.push('/ship')
            }else{
              this.$message.error(res.data.msg)
            }
          }).catch(err=>{
            this.$message.error('网络连接异常')
          })
        }
          
      });
    },
    // 删除
    resetForm() {
      this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // 进行删除操作
          this.$api.user.deleteArea({
            areaId:this.AreaForm.customerAddrId,
            userid:this.AreaForm.customerId,
          }).then(res=>{
            if(res.data.code === 201){
              this.$message.success(res.data.msg)
              return this.$router.push('/ship')
            }else{
              this.message.error(res.data.msg)
            }
          }).catch(err=>{
             this.$message.error('网络连接异常')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
};
</script>
<style scoped>
#editArea {
  height: 50px;
  widows: 100%;
}
.head_top {
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 0.02rem 0.4rem 0 rgba(238, 236, 236, 0.5);
  margin-bottom: 0.1rem;
  position: relative;
}
.area1 {
  width: 100%;
  height: 45%;
  border-top: 0.01rem solid #ccc;
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  overflow-y: scroll;
  z-index: 11;
}
.distpicker-address-wrapper .address-header ul {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
}
.CityList {
  width: 100%;
  height: 3.38rem;
  line-height: 3.38rem;
  display: flex;
  justify-content: space-between;
  padding: 0 5%;
  box-sizing: border-box;
}

.Unlimited {
  width: 100%;
  height: 3.38rem;
  font-size: 1.16rem;
  line-height: 3.38rem;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
}
.cancel {
  width: 100%;
  height: 3.38rem;
  position: absolute;
  top: 0;
  left: 0;
}
.cancel > div {
  width: 1.2rem;
  background: #fff;
  color: #999;
  line-height: 3.22rem;
  text-align: center;
}
.cancel > div:nth-child(1) {
  position: absolute;
  top: 0.09rem;
  left: 25%;
}
.cancel > div:nth-child(2) {
  position: absolute;
  top: 0.09rem;
  left: 57%;
}
.cancel > div:nth-child(3) {
  position: absolute;
  top: 0.09rem;
  right: 5%;
}
.el-button {
  width: 100%;
}
</style>