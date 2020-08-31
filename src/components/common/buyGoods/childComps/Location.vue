<template>
  <div>
    <div class="aui-flex">
      <div class="aui-flex-add">
        <img src="~/assets/img/cart/location.png" alt />
      </div>
      <div class="aui-flex-box">
         {{areData.name}}
          <em>{{areData.phone}}</em>
        </h3>
        <p>{{addr}}</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Location",
  props:['addr','areData'],
};
</script>

<style scoped>
.aui-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 15px;
    position: relative;
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