import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { BootstrapVue } from "bootstrap-vue";

import "@/style/main.scss";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
