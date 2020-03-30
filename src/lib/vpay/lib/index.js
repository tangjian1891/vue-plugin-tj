import vpay from "./v-pay.vue";
export default {
  install(_Vue) {
    _Vue.component("v-pay", vpay);
  }
};
