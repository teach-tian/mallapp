import Vue from "vue";
import VueRouter from "vue-router";

// 解决同路由跳转时的报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

//1.安装插件
Vue.use(VueRouter);


const Home = () => import("../views/home/Home.vue");
const Category = () => import("../views/category/Category.vue");
const Cart = () => import("../views/cart/Cart.vue");
const Profile = () => import("../views/myProfile/Profile.vue");
const LoginPage = () => import("../components/common/loginPage/LoginPage.vue");
const AppHome = () => import("../views/AppHome.vue");
const ForgetPWD = () =>import("../components/common/loginPage/childComps/ForgetPWD.vue");
const DetailPage = () => import("../views/myProfile/childComps/DetailPage.vue");
const EditPage = () => import("../views/myProfile/childComps/EditPage.vue");
const Search = () => import('../views/search/Search.vue')
const MyDetail = () => import('../views/mydetail/Detail.vue')
const BuyGoods = () => import('../components/common/buyGoods/BuyGoods.vue')
const PayOrder = () => import('../components/common/buyGoods/childComps/PayOrder.vue')
const FindPayPWD = () => import('../components/common/buyGoods/childComps/FindPayPWD.vue')
const Ship = () => import('../views/ship/Ship.vue')
const Area = () => import('../components/common/area/Area.vue')
const EditArea = () => import('../views/ship/childComps/EditArea.vue')
const SelectArea = () => import('../components/common/buyGoods/childComps/SelectArea.vue')
const PayOrderIsOK =() => import('../components/common/buyGoods/childComps/PayOrderIsOK.vue')
const Order = () => import('../views/order/Order.vue')
const MyPayOrder = () => import('../views/order/childComps/PayOrder.vue')
const OrderComm = () => import('../views/order/childComps/OrderComm.vue')
const Shop = () => import('../views/shop/Shop.vue')
const AliPayIsOK = () => import('../components/common/buyGoods/childComps/AliPayIsOk.vue')
const Favorite = () => import('../views/favorite/Favorite.vue')
const BalanceLog = () => import('../views/balanceLog/BalanceLog.vue')
const PointLog = () => import('../views/pointLog/PointLog.vue')
const Setting = () => import('../views/setting/Setting.vue')
const Footprint = () => import('../views/footprint/Footprint.vue')
const Rate = () => import('../views/rate/Rate.vue')
//空白页 进行刷新时使用
const EmptyPage = () => import('../views/order/childComps/emptyPage.vue')

// 2.创建路由对象
const routes = [
  { path: "", redirect: "/LoginPage" },
  { path: "/", component: LoginPage, redirect: "/LoginPage" },
  { path: "/detailPage", component: DetailPage },
  { path: "/setting", component: Setting },
  { path: "/editPage", component: EditPage },
  { path: "/loginPage", component: LoginPage },
  { path: "/forgetPWD", component: ForgetPWD },
  { path: "/pointLog", component: PointLog },
  { path: "/balanceLog", component: BalanceLog },
  { path: "/aliPayIsOK", component: AliPayIsOK },
  { path: "/shop/:shopid", component: Shop },
  { path: "/findPayPWD", component: FindPayPWD},
  { path: "/area", component: Area},
  { path: "/emptyPage", component: EmptyPage},
  { path: "/orderComm/:orderId", component: OrderComm},
  { path: "/payOrderIsOK", component: PayOrderIsOK},
  { path: "/order/:id", component: Order },
  { path: "/selectArea/:goodsId", component: SelectArea },
  { path: "/ship", component: Ship },
  { path: "/editArea", component: EditArea},
  { path: "/buyGoods/:goodsId", component: BuyGoods}, 
  { path: "/payOrder", component: PayOrder},
  { path: "/myPayOrder/:orderid", component: MyPayOrder},
  { path: "/rate", component: Rate ,meta:{
    keepAlive:true  //表示需要对页面进行缓存
  } },
  { path: "/footprint", component: Footprint ,meta:{
    keepAlive:true  //表示需要对页面进行缓存
  } },
  { path: "/favorite", component: Favorite ,meta:{
    keepAlive:true  //表示需要对页面进行缓存
  } },
  { path: "/search/:name", component: Search ,meta:{
    keepAlive:true  //表示需要对页面进行缓存
  }},
  {
    path: "/AppHome",
    component: AppHome,
    children: [
      { path: "/home", component: Home,meta:{
        keepAlive:true 
      } },
      { path: "/category", component: Category,meta:{
        keepAlive:true 
      } },
      { path: "/cart", component: Cart,meta:{
        keepAlive:true 
      } },
      { path: "/profile", component: Profile },
      { path: "/mydetail/:goodsId", component: MyDetail},
    ],
  },
];


//修改路由默认规则
const router = new VueRouter({
  // mode: "history",//注意 打包时需要将该处注释 否则将出现静态文件找不到 
  base: process.env.BASE_URL,
  routes,
});

//添加全局路由守卫 进行路由跳转的权限验证
router.beforeEach((to, from, next) => {
  // to 将要前往哪个路由
  // form 从哪个路由来的
  // next() 放行函数 nxet('路径') 强制跳转到的位置
  if (to.path === "/LoginPage") return next();
  if (to.path === "/forgetPWD") return next();
  // 获取客户端的token
  let token = window.sessionStorage.getItem("appToken");
  if (!token) return next("/LoginPage");
  // 放行
  next();
});

//导出
export default router;
