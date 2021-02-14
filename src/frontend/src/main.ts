import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import { store } from "@/store";
import vuetify from "@/plugins/vuetify";
import "@/plugins/notify";
import "@/plugins/vuetify-dialog";
import "@/assets/scss/global.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app");
