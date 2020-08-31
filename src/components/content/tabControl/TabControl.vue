<template>
  <div class="tab-control">
    <div v-for="(item,index) in titles" class="tab-control-item"
    :class="{active:index === currentIndex}" @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name:'TabControl',
  props:{
    titles:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      currentIndex:0
    }
  },
  methods:{
    itemClick(index){
      this.currentIndex = index;
      this.$emit('tbClick',index)
    }
  }
}
</script>

<style>
  .tab-control{
    display: flex;
    text-align: center;
    font-size: 16px;
    text-align: 40px;
    line-height: 40px;
  }
  .tab-control-item{
    flex:1;
  }
  .tab-control-item span{
    padding: 5px;
  }
  .active{
    color: var(--color-hight-text);
  }
  .active span{
    border-bottom: 2px solid var(--color-hight-text);
  }
</style>