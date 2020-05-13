import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Notifications from "vue-notification";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

// PLC IP
const socket = io("PLC_API_ADDRESS");
Vue.use(VueSocketIOExt, socket);
// Vue.use(VueSocketIOExt, socket1);
Vue.use(Notifications);
Vue.config.productionTip = false;
import "@/assets/bulma.min.css";

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
