import Vue from "vue";
import App from "./App";
import store from "./store/";
import { toast } from "@/utils/toast";
import "@/service/getBaseUrl";
import mixins from "@/mixins";
import WebBuriedPoint, { sendBuriedData } from "@/mixins/webPoint";
import shareConfigs from "@/configs/share";
import loginTip from "@/components/login-tip/index";
import loginPop from "@/components/login-pop/index";
import unregisterTip from "@/components/unregister-tip/index";
import * as filters from "@/utils/filter";
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
Vue.config.productionTip = false;
Vue.component("LoginTip", loginTip);
Vue.component("LoginPop", loginPop);
Vue.component("UnregisterTip", unregisterTip);
Vue.mixin(mixins);
Vue.prototype.$toast = toast;
Vue.prototype.$sendBuriedData = sendBuriedData;
Vue.prototype.$shareConfigs = shareConfigs;
import uView from "uview-ui";
Vue.use(uView);

Vue.use(WebBuriedPoint, {
  class_name: "wx_product_assistant",
});

console.log(uni.$u.config.v);
App.mpType = "app";

const app = new Vue({
  ...App,
  store,
});
app.$mount();
