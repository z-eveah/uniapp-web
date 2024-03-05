<template>
  <view>
    <view v-if="type == 1" class="pre-login">
      <u-loading-page font-size="14" :loading="loading" loading-mode="semicircle"></u-loading-page>
    </view>
    <view v-else class="login-container">
      <view class="btn-container">
        <view class="log">
          <image src="https://test1-file.yunqueyi.com/image/png/common/20220705131224975.png" mode=""></image>
        </view>
        <view class="protocol-container">
          <view class="protocol">

            <view class="txt-wrap">
              <text class="tip">您已阅读并同意 </text>
              <text class="pro-text" @click="agreement(53, '云鹊健康法律声明')">《云鹊健康法律声明》</text>
              以及<text class="pro-text" @click="agreement(2, '云鹊医用户协议')">《云鹊医用户协议》</text> 和<text
                class="pro-text"
                @click="agreement(3, '云鹊隐私声明')"
                >《云鹊隐私声明》</text
              >
            </view>
          </view>
        </view>

        <button class="get-auth-active" @click="changeModalVisible">授权手机号登录</button>
        <view class="get-auth-active" @click="phoneLogin">手机验证码登录</view>
      </view>

      <view v-if="modalVisible" class="rule-modal">
        <view class="rule-modal-content">
          <view class="rule-modal-title">用户协议及隐私政策</view>
          <view class="rule-modal-body">
            <text>为了更好地保障您的合法权益，请您阅读并同意以下协议</text>
            <text class="=rule-modal-body-color" @click="goAgreement(5, '云鹊健康法律声明')">《云鹊健康法律声明》</text>
            以及
            <text class="=rule-modal-body-color" @click="goAgreement(46, '云鹊健康用户协议')"
              >《云鹊健康用户协议》</text
            >
            和
            <text class="=rule-modal-body-color" @click="goAgreement(5, protocolName)">《{{ protocolName }}》</text>
          </view>
          <view class="rule-modal-footer">
            <view class="disagree btn" @click="agreeOrDisagree(false)">不同意</view>
            <button class="disagree btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
              同意授权
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { wxAuthLogin, getCode, getToken, getProtocolName } from "@/api/login.js";
let that;
export default {
  data() {
    return {
      type: 1,
      sessionKey: "",
      loading: true,
      openId: "",
      unionId: "",
      options: {},
      modalVisible: false,
      protocolName: "",
      loadOption: null,
    };
  },
  onLoad(option) {
    // this.loadOption = option;
    // that = this;
    // this.getToken();
  },
  methods: {
    phoneLogin() {
      uni.navigateTo({
        url: "/pages/phoneLogin/index",
      });
    },
    goAgreement(type, title) {
      const u = "/pages/agreement/index" + `?type=${type}&title=${title}`;
      uni.navigateTo({
        url: u,
      });
    },
    getToken() {
      uni.login({
        provider: "weixin",
        success: (res) => {
          console.log("---res", res);
          const code = res.code;
          getToken(code).then((res) => {
            if (res.data.token) {
              this.type = 1;
              uni.setStorageSync("token", res.data.token);
              uni.$emit("reload");
              this.goBack();
            } else {
              this.type = 2;
              this.getSessionKey();
              uni.removeStorageSync("token");
            }
          });
        },
      });
      getProtocolName(5).then((res) => {
        if (res.code == "000000") {
          this.protocolName = res.data;
        }
      });
    },
    getSessionKey() {
      uni.login({
        provider: "weixin",
        success: (res) => {
          const code = res.code;
          getCode(code).then((res) => {
            this.sessionKey = res.data.session_key;
            this.openId = res.data.openId;
            this.unionId = res.data.unionId;
          });
        },
      });
    },
    getPhoneNumber(e) {
      let _this = this;
      uni.checkSession({
        success() {
          _this.decryptionPhoneNumber(e);
        },
        fail(err) {
          console.log(err, "授权失败信息");
          _this.getSessionKey();
          _this.$toast("请重试");
        },
      });
    },
    // 解密手机号
    decryptionPhoneNumber(e) {
      console.log('--e', e);
      const { errMsg, encryptedData, iv } = e.detail;
      if (errMsg == "getPhoneNumber:ok") {
        let obj = {
          sessionKey: this.sessionKey,
          encryptedData: encryptedData,
          iv: iv,
          openId: this.openId,
          unionId: this.unionId,
          type: 3,
        };
        wxAuthLogin(obj)
          .then((res) => {
            uni.setStorageSync("token", res.data);
            uni.setStorageSync("unregisterTip", 2);
            uni.$emit("reload");
            if (that.loadOption && (that.loadOption.redirectUrl || that.loadOption.scene)) {
              this.dealRouteTo(that.loadOption);
            } else {
              this.goBack();
            }
          })
          .catch((err) => {
            if (err.code == "400001") {
              uni.setStorageSync("unregisterTip", 1);
              uni.navigateTo({
                url: "/pages/unregister-app/index",
              });
            } else {
              uni.setStorageSync("unregisterTip", 2);
            }
          });
      } else {
        this.$toast("授权失败");
        // var pc = new WXBizDataCrypt("wx69e6361f588acbe5", this.sessionKey);
        // var data = pc.decryptData(e.detail.encryptedData , e.detail.iv);
      }
    },
    goBack() {
      let pages = getCurrentPages(); //当前页
      let beforePage = pages[pages.length - 2]; //上个页面
      uni.navigateBack({
        delta: 1,
        success: () => {
          // beforePage.onLoad(beforePage.options); // 传入参数
          // beforePage.onReady();
          uni.switchTab({
            url: "/pages/home/index",
          });
        },
        fail: (err) => {
          console.log("--err", err);
          uni.switchTab({
            url: "/pages/home/index",
          });
        },
      });
    },
    changeModalVisible() {
      this.modalVisible = !this.modalVisible;
    },
    agreeOrDisagree(bool) {
      this.checked = bool;
      this.changeModalVisible();
    },
    agreement(type, title) {
      uni.navigateTo({
        url: `/pages/agreement/index?type=${type}&title=${title}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
