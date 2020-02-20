import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import(/* webpackChunkName: "home" */ "../views/Dashboard")
  },
  {
    path: "/finished",
    name: "finished",
    component: () => import(/* webpackChunkName: "home" */ "../views/Finished")
  },
  {
    path: "/received",
    name: "received",
    component: () => import(/* webpackChunkName: "home" */ "../views/Received")
  },
  {
    path: "/shipped",
    name: "shipped",
    component: () => import(/* webpackChunkName: "home" */ "../views/Shipped")
  },
  {
    path: "/about/:id",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About")
  },
  {
    path: "/statistics/quantity",
    name: "quantity",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/statistics/Quantity")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
