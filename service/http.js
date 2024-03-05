import { getCurrentPage, merger } from "@/utils/common.js";
import { baseUrl } from "./getBaseUrl";

const DEFAULT_CONFIG = {
  baseUrl: baseUrl,
  data: {},
  header: {
    token: uni.getStorageSync("token") || "",
  },
  method: "post",
  timeout: 150000,
  dataType: "json",
  responseType: "text",
  sslVerify: true,
  firstIpv4: false,
};
const blockLoginPopList = [
  "pages/home/index",
  "pages/wxLogin/index",
  "pages/phoneLogin/index",
  "pages/health/center",
  "pages/inviteConsumer/index",
  "pages/sample-inspection/index",
  "pages/testingMgmt/index",
  "pages/appointment/list",
  // "pagesDetection/scan-patient/index",
];

class HTTP {
  constructor() {
    this.config_init = merger({}, DEFAULT_CONFIG);
    this.loading = true;
    this.requestMap = new Map();
  }
  requestInterceptor(opt) {
    const { baseUrl } = this.config_init;
    const { url, isLoading } = opt;
    const u = baseUrl + url;
    const m = merger(this.config_init, opt);
    const configs = {
      ...m,
      url: u,
    };
    if (this.loading && isLoading) {
      this.loadingMask();
    }
    return configs;
  }
  responseInterceptor(res) {
    const { code } = res.data;
    const isLogin = uni.getStorageSync("token") || false;
    const pages = getCurrentPage();
    const r = !blockLoginPopList.includes(pages.route);
    if (["200000", "200006"].includes(code) || !isLogin) {
      r && pages && pages.$vm.$refs["login-pop"].open();
    }
    return res.data;
  }
  loadingMask(opt) {
    const o = {
      ...opt,
      mask: true,
    };
    this.loading = false;
    uni.showLoading(o);
  }
  request(options) {
    const { method, url } = options;
    const request = this.requestInterceptor(options);
    let requestId = this.generateId(method, url);
    if (!requestId) {
      return false;
    }
    return new Promise((resolve, reject) => {
      uni.request({
        ...request,
        header: {
          token: uni.getStorageSync("token") || "",
        },
        success: (res) => {
          const inter_res = this.responseInterceptor(res);
          if (inter_res.code == "000000") {
            resolve(inter_res);
          } else {
            reject(inter_res);
          }
        },
        fail: (err) => {
          reject(err);
        },
        complete: () => {
          this.deleteById(requestId);
          setTimeout(function () {
            this.loading = true;
            uni.hideLoading();
          }, 1000);
        },
      });
    });
  }
  generateUniqueId(method, url) {
    const idString = `${method}-${url}-${new Date().valueOf()}`;
    return idString.toString();
  }
  generateId(method, url) {
    const id = this.generateUniqueId(method, url);
    if (this.requestMap.has(id)) {
      return false;
    }
    this.requestMap.set(id, { method, url });
    return id;
  }
  deleteById(id) {
    this.requestMap.delete(id);
  }
}
export { HTTP };
