import Vue from "vue";
import App from "./App.vue";
import { getKeplrAccountProvider, gripApp } from "@stakeordie/griptape.js";
Vue.config.productionTip = false;

const restUrl = "https://api.holodeck.stakeordie.com";
const provider = getKeplrAccountProvider();

gripApp(restUrl, provider, () => {
  new Vue({
    render: function (h) {
      return h(App);
    },
  }).$mount("#app");
});
