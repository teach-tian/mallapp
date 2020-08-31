<template>
  <div class="price">
    <el-form ref="form" :model="Price" label-width="95px">
      <el-form-item label="价格区间(元)">
        <el-col :span="8">
          <el-input
            v-model="Price.minPrice"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="最低价"
          ></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="8">
          <el-input
            v-model="Price.maxPrice"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="最高价"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button class="btn" type="primary" @click="onSubmit">确认</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "PriceSelect",
  props: ["goodsName"],
  data() {
    return {
      Price: {
        minPrice: 0,
        maxPrice: 100
      },
      page: 1,
      pageSize: 20
    };
  },
  methods: {
    onSubmit() {
      if (this.Price.minPrice - 0 >= this.Price.maxPrice - 0) {
        return this.$message.error("最低价不得大于或等于最高价");
      }
      this.$api.goods
        .getGoodsByPrice({
          goodsName: this.goodsName,
          page: this.page,
          pageSize: this.pageSize,
          minPrice: this.Price.minPrice,
          maxPrice: this.Price.maxPrice
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$emit("newData", res.data.data);
          }
          if (res.data.code === 404) {
            this.$emit("code404c", res);
          }
          if (res.data.code === 405) {
            this.$emit("code403c", res);
          }
        })
        .catch(err => {
          return this.$message.error("网络连接失败");
        });
    }
  }
};
</script>

<style scoped>
.el-col {
  width: 50px;
}
.el-col .el-input {
  width: 80px;
}
.line {
  margin-left: 30px;
  width: 20px;
  text-align: center;
}
.btn {
  margin-left: 44px;
}
</style>