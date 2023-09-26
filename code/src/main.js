import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 加载 element 组件库
import ElementUI from "element-ui";
// 加载 element 组件库的样式
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import Cookies from "vue-cookies";
//使用cookie
Vue.prototype.$cookie = Cookies;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");


//登录拦截
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) {
//     //requireAuth若为true则该路由需要判断是否登录
//     if (localStorage.managerName) {
//       //判断当前的managerName数据是否存在
//       next();
//     } else {
//       next({
//         //返回登录页面
//         path: "/bglogin",
//         query: { redirect: to.fullPath },
//       });
//     }
//   } else if(to.meta.requireAuthF){
//         //requireAuth若为true则该路由需要判断是否登录
//         if (localStorage.userName) {
//           //判断当前的userName数据是否存在
//           next();
//         } else {
//           next({
//             //返回登录页面
//             path: "/login",
//             query: { redirect: to.fullPath },
//           });
//         }
//   } else {
//     next();
//   }
// })
