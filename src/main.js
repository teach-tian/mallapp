import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import FastClick from "fastclick";
import VueLazyLoad from "vue-lazyload";
import VueCookies from "vue-cookies";
import "vant/lib/index.css";
import api from "./api/index"; // 导入api接口
//导入md5模块
import md5 from "js-md5";

import http from "axios";
//挂载一个网络请求 ，用来测试请求第三方api
Vue.prototype.$http = http;

//挂载cookie全局
Vue.use(VueCookies);

// 导入字体图标
import "./assets/fonts/iconfont.css";
// 自定义组件  消息框提醒
import toast from "./components/common/toast";
// 安装toast
Vue.use(toast);

// 全局按需引入第三方组件库
import "./plugins/element.js";
import "./plugins/vant.js";

//解决移动端300ms延迟
FastClick.attach(document.body);
//使用图懒加载插件
Vue.use(VueLazyLoad, {
  loading: require("./assets/img/common/loading.png"),
  error: require("./assets/img/common/err.png"),
});

Vue.config.productionTip = false;

// 全局实例化$bus事件总线
Vue.prototype.$bus = new Vue();

// 全局挂载md5 该挂载有问题 无法访问
Vue.prototype.$md5 = md5;
// 将api挂载到vue的原型上
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
