import WXLogger from "./wl.js";
import { isProd } from "../service/getBaseUrl";
let Monitor = {};
Monitor = WXLogger.init({
  pid: "bj53rb58f5@c6f4a57692bad49",
  region: "cn",
  behavior: true,
  enableConsole: true,
  release: "2.0",
  environment: isProd ? "prod" : "pre",
  sendResource: true,
  disableHook: true,
  enableLinkTrace: true,
});
if (isProd) {
  const armsConfig = {
    api: "",
    success: "",
    time: "",
    code: "",
    msg: "",
    begin: "",
    traceId: "",
    sid: "",
    getCurrentPage: function () {
      const pages = getCurrentPages() || [];
      const pageLength = pages.length;
      const currPage = pages[pageLength - 1];
      return (currPage && currPage.route) || null;
    },
  };
  const wxAPIIntercepters = ["downloadFile", "previewImage", "openDocument", "login"];
  let wxAPIInfo = {};
  let apiBegin_time;
  let apiBegin_time_wx;
  let header_set = {};
  let request = {};
  uni.addInterceptor("request", {
    invoke(args) {
      console.log("invoke", args);
      armsConfig.api = args.url;
      header_set = args.header;
      request = args.data;
      apiBegin_time = new Date();
    },
    success() {
      armsConfig.success = true;
    },
    fail() {
      armsConfig.success = false;
    },
    complete(res) {
      console.log("complete", res);
      armsConfig.code = res.statusCode;
      armsConfig.time = new Date() - apiBegin_time;
      armsConfig.msg = JSON.stringify({
        response: res.data,
        request: request,
        header: { ...res.header, ...header_set },
        cookies: res.cookies,
        nickname: uni.getStorageSync("nickName"),
        mobile: uni.getStorageSync("mobile"),
      });
      console.log("-armsConfig-", armsConfig);
      Monitor.api(armsConfig);
    },
  });
  wxAPIIntercepters.map((item) => {
    wxAPIInfo[item] = {};
    uni.addInterceptor(item, {
      invoke(args) {
        apiBegin_time_wx = new Date();
        wxAPIInfo[item] = { ...args };
      },
      success() {},
      fail() {},
      complete(res) {
        uni.getNetworkType({
          complete: function (response) {
            let armsConfig_wxAPI = {};
            const armsInfo_wechat = JSON.stringify({
              nickname: uni.getStorageSync("nickName"),
              mobile: uni.getStorageSync("mobile"),
              ...response,
              ...wxAPIInfo[item],
            });
            armsConfig_wxAPI.success = res.errMsg.includes(":ok") ? true : false;
            armsConfig_wxAPI.time = new Date() - apiBegin_time_wx;
            armsConfig_wxAPI.api = "WECHAT_API_" + item;
            armsConfig_wxAPI.msg = armsInfo_wechat;
            Monitor.api(armsConfig_wxAPI);
          },
        });
      },
    });
  });
}
export default Monitor;
