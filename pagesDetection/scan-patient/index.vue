<template>
  <view class="detection-scan-wrap">
    <view v-if="loginAndRegister" class="address">
      <u-icon size="21" name="https://file.yunqueyi.com/image/png/2023/05/15/20230515193527858-8ebadd47.png"></u-icon>
      <text class="name">{{ hospitalName }}</text>
    </view>
    <view v-if="loginAndRegister" class="scan-content">
      <image
        class="qrcode"
        src="https://file.yunqueyi.com/image/png/2023/05/15/20230515193545636-e98a5d65.png"
        @click="scanCode"
      ></image>
      <view class="tip">
        <view> 扫描受检人二维码 </view>
        <view class="mt5">开始检测</view>
      </view>
      <view class="btn" @click="toList(1)">信息代录入</view>
      <view class="grey" @click="toList(2)">查看检测记录</view>
    </view>
    <view v-if="!isLogin" class="pt100">
      <LoginTip tip-text="登录进行下一步" is-tab-bar="1" back-url="/pages/home/index" />
    </view>
  </view>
</template>

<script>
import { getByHospital } from "@/api/detection.js";
import { getUserInfo } from "@/api/user.js";
export default {
  data() {
    return {
      imgBase64: "https://file.yunqueyi.com/image/png/2023/05/15/20230515193545636-e98a5d65.png",
      hospitalId: "",
      hospitalName: "",
      isLogin: null,
    };
  },
  onShow() {
    this.setLoginStatus();
    const lp = uni.getStorageSync("loadOption");
    this.init(lp, true);
  },
  onLoad(options) {
    const that = this;
    uni.setStorageSync("loadOption", options);
    this.setLoginStatus();
    uni.$on("reload", function () {
      that.init(options);
    });
    that.init(options);
  },
  methods: {
    setLoginStatus() {
      const isLogin = uni.getStorageSync("token") || null;
      this.isLogin = isLogin;
    },
    async init(options, isclear) {
      const scene = decodeURIComponent(options.scene);
      if (options.scene && scene) {
        const [hospitalId] = scene.split(",");
        this.hospitalId = hospitalId;
        this.getByHospital();
        return;
      }
      if (options.hospitalId) {
        this.hospitalId = options.hospitalId;
        // 如果hospitalId为0，需要再次拿到当前的最新的hospitalId
        if (Number(options.hospitalId) === 0) {
          const res = await getUserInfo();
          this.hospitalId = res.data.hospital_id;
        }
        this.getByHospital();
        return;
      }
      if (isclear) {
        uni.removeStorageSync("loadOption");
      }
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        console.log("userInfo", res);
        this.doctorId = res.data.id;
      });
    },
    getByHospital() {
      getByHospital(this.hospitalId).then((res) => {
        if (res.code == "000000") {
          this.hospitalName = res.data.hospitalName;
        }
      });
    },
    scanCode() {
      let _this = this;
      uni.scanCode({
        scanType: ["barCode", "qrCode"],
        onlyFromCamera: true,
        success: function (res) {
          console.log("-res", res);
          const re = JSON.parse(res.result);
          if (re && re.patientId) {
            uni.redirectTo({
              url: `/pagesDetection/binding-code/index?hospitalId=${_this.hospitalId}&patientId=${re.patientId}`,
            });
          }
        },
        fail: function () {
          _this.$toast("无法有效识别条形码或二维码");
        },
      });
    },
    toList(type) {
      let url =
        type == 1 ? `/pagesDetection/agent-entry/index?hospitalId=${this.hospitalId}` : `/pages/testingMgmt/index`;
      uni.redirectTo({
        url,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
