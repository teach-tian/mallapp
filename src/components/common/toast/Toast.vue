<template>
  <div class="toast" v-show="isShow">
    <div >{{message}}</div>
  </div>
</template>

<script>
export default {
  name:'Toast',
  props:{

  },
  data() {
    return {
      message: '这是测试',
      isShow: false
    }
  },
  methods: {
    show(messages,duration){
      this.isShow = true;
      this.message = messages;

      setTimeout(() =>{
        this.isShow = false;
        this.message = '';

      },duration)
    }
  },
}
</script>

<style scoped>
  .toast{
    position: fixed;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 8px 10px;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: 999;
  }
</style>