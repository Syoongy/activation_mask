import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Notifications from "vue-notification";
import VueProgress from "vue-progress-path";

Vue.use(Notifications);
Vue.use(VueProgress);
Vue.config.productionTip = false;
import "vue-progress-path/dist/vue-progress-path.css";
import "@/assets/bulma.min.css";

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
