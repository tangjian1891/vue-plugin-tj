import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 使用vpay
import VPay from "./lib/vpay";
Vue.use(VPay);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
