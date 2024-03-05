import { detectionReportSubscribe, detectionReportSubscribeWechat } from "@/api/testingMgmt.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      unregisterTip: null,
      isLogin: null,
    };
  },
  onLoad(options) {},
  computed: {
    ...mapGetters(["isSubmitWechat"]),
    loginWithoutRegister() {
      return this.unregisterTip == 1 && this.isLogin ? true : false;
    },
    loginAndRegister() {
      return this.unregisterTip != 1 && this.isLogin ? true : false;
    },
  },
  onShow() {
    const unregisterTip = uni.getStorageSync("unregisterTip") || null;
    this.unregisterTip = unregisterTip;
    const isLogin = uni.getStorageSync("token") || null;
    this.isLogin = isLogin;
  },
  methods: {
    ...mapMutations(["SET_SubmitWechat"]),
    //价格转换 分->元
    exchangePrice(price) {
      return price / 100;
    },
    checkSubStatus() {
      const that = this;
      detectionReportSubscribe().then((res) => {
        if (res.code == "000000") {
          const a = { ...that.isSubmitWechat, subMsg: res.data.subscribeFlag };
          that.SET_SubmitWechat(a);
        }
      });
      detectionReportSubscribeWechat().then((res) => {
        if (res.code == "000000") {
          const len = res.data.length;
          const a = { ...that.isSubmitWechat, subWechat: len == 0 ? false : true };
          that.SET_SubmitWechat(a);
        }
      });
    },
    dealRouteTo(opt) {
      const { redirectUrl, isTabBar, isReload } = opt;
      const url = decodeURIComponent(redirectUrl);
      console.log("---", opt, url);
      if (!url) {
        uni.switchTab({
          url: "/pages/home/index",
        });
      } else if (isTabBar) {
        uni.switchTab({
          url: url,
        });
      } else {
        if (isReload) {
          uni.reLaunch({
            url: url,
          });
        } else {
          uni.redirectTo({
            url: url,
          });
        }
      }
    },
  },
};
