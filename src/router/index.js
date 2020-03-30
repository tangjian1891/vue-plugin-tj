import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/index.vue")
  },
  {
    path: "/vpay",
    name: "VPay",
    component: () => import("@/views/h5/v-pay.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
