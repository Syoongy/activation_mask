import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard"),
  },
  {
    path: "/finished",
    name: "finished",
    component: () =>
      import(/* webpackChunkName: "finished" */ "../views/Finished"),
  },
  {
    path: "/received",
    name: "received",
    component: () =>
      import(/* webpackChunkName: "received" */ "../views/Received"),
  },
  {
    path: "/shipped",
    name: "shipped",
    component: () =>
      import(/* webpackChunkName: "shipped" */ "../views/Shipped"),
  },
  {
    path: "/statistics/quantity",
    name: "quantity",
    component: () =>
      import(/* webpackChunkName: "quantity" */ "../views/statistics/Quantity"),
  },
  {
    path: "/opsCombined99",
    name: "opsCombined99",
    component: () =>
      import(/* webpackChunkName: "combined" */ "../views/statistics/Combined"),
  },
  {
    path: "/opsCombinedETA99",
    name: "opsCombinedETA99",
    component: () =>
      import(
        /* webpackChunkName: "combinedeta" */ "../views/statistics/CombinedWithETA"
      ),
  },
  {
    path: "/statistics/combinedHall",
    name: "combinedHall",
    component: () =>
      import(
        /* webpackChunkName: "combinedhall" */ "../views/statistics/CombinedHall"
      ),
  },
  {
    path: "/statistics/saftiCombinedHall",
    name: "combinedHall",
    component: () =>
      import(
        /* webpackChunkName: "safticombinedhall" */ "../views/statistics/saftiCombinedHall"
      ),
  },
  {
    path: "/scoreboard",
    name: "scoreboard",
    component: () =>
      import(/* webpackChunkName: "scoreboard" */ "../views/Scoreboard"),
  },
  {
    path: "/finale",
    name: "finale",
    component: () => import(/* webpackChunkName: "finale" */ "../views/Finale"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
