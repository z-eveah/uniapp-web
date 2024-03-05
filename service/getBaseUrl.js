import Vue from "vue";
import { ENV_CONFIG } from "@/configs/consts";
// ！！！！！！！！！！！！发布上线前，isProd使用true，确保是生产环境！！！！！！！！！！！！
// const isProd = true;
let isProd = true;
const objs = {};
const accountInfo = wx.getAccountInfoSync();
// 开发版develop
// 体验版 trial
// 正式版 release
if (accountInfo && accountInfo.miniProgram && ["develop", "trial"].includes(accountInfo.miniProgram.envVersion)) {
  isProd = false;
}
console.log("accountInfo", accountInfo);

Object.keys(ENV_CONFIG).map((item) => {
  objs[item] = isProd ? ENV_CONFIG[item]["prod"] : uni.getStorageSync(item) || ENV_CONFIG[item]["test"];
  // objs[item] = isProd ? ENV_CONFIG[item]["4"] : uni.getStorageSync(item) || ENV_CONFIG[item]["3"];
});
const { baseUrl, medUrl, phomeUrl, baseDsisUrl, qiniuResourceUrl } = objs;

Vue.prototype.baseUrl = baseUrl;

export { isProd, baseUrl, medUrl, phomeUrl, baseDsisUrl, qiniuResourceUrl };
