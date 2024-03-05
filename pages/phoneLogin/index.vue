<template>
  <view class="login-container">
    <view class="btn-container">
      <view class="log">
        <image src="https://test1-file.yunqueyi.com/image/png/common/20220705131224975.png" mode=""></image>
      </view>
      <view class="phone-container">
        <view class="phone">
          <view class="phone-left">
            <input
              v-model="mobilePhone"
              type="number"
              maxlength="11"
              placeholder-style="color: #999999"
              placeholder-class="phoneplaceholder"
              class="phone-input"
              placeholder="请输入手机号"
            />
            <view v-if="mobilePhone" class="clear" @click="clearMobile">
              <image
                class="clear-img"
                src="https://test1-file.yunqueyi.com/image/png/common/20220713164446921.png"
                mode=""
              ></image>
            </view>
          </view>

          <view class="get-code-btn" @click="sendCode">
            <text v-if="isSendCode" :class="{ 'btn-text': isSendActive }">获取验证码</text>
            <view v-else class="num">
              <text>{{ num }}s后重发</text>
            </view>
          </view>
        </view>
        <view class="code">
          <input
            v-model="authCode"
            placeholder-style="color: #999999"
            placeholder-class="phoneplaceholder"
            class="code-input"
            placeholder="请输入验证码"
            type="number"
            maxlength="6"
          />
        </view>
        <view :class="{ 'login-btn': true, 'login-btn-active': isSumbit }" @click="loginSumbit(1)">登录</view>
        <view class="login-btn login-btn-active mt20" @click="loginSumbit(2)">一键登录</view>
      </view>
    </view>
    <view v-if="showBindingInfo" class="rule-modal">
      <view class="rule-modal-content">
        <view class="rule-modal-title">用户协议及隐私政策</view>
        <view class="rule-modal-body">
          <text>为了更好地保障您的合法权益，请您阅读并同意以下协议</text>
          <text class="=rule-modal-body-color" @click="openPrivacyContract">《云鹊健康小程序隐私保护指引》</text>
          和
          <text class="=rule-modal-body-color" @click="goAgreement(46, '《云鹊医用户协议》')"
            >《云鹊健康用户协议》</text
          >
        </view>
        <view class="rule-modal-footer">
          <view class="disagree btn" @click="cancel">不同意</view>
          <button
            v-if="loginType == 1 && canIUse_auth"
            class="agree btn"
            open-type="agreePrivacyAuthorization"
            @agreeprivacyauthorization="bindingCode"
          >
            同意并授权
          </button>
          <button
            v-if="loginType == 1 && !canIUse_auth"
            class="agree btn"
            @click="editTips('agreePrivacyAuthorization')"
          >
            同意并授权
          </button>
          <button
            v-if="loginType == 2 && canIUse_phone"
            class="agree btn"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            同意并授权
          </button>
          <button v-if="loginType == 2 && !canIUse_phone" class="agree btn" @click="editTips('getPhoneNumber')">
            同意并授权
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Monitor from "../../utils/arms";
import WXBizDataCrypt from "../../utils/wxCrypt";

let that;
import { getAuthCode, phoneAuthLogin, wxAuthLogin, getCode, getToken } from "@/api/login.js";
export default {
  data() {
    return {
      type: 1,
      num: 60,
      isSendCode: true,
      mobilePhone: "",
      sessionKey: "",
      authCode: "",
      unionId: "",
      timer: null,
      showBindingInfo: false,
      loadOption: null,
      loginType: "",
      canIUse_auth: uni.canIUse("button.open-type.agreePrivacyAuthorization"),
      canIUse_phone: uni.canIUse("button.open-type.getPhoneNumber"),
    };
  },
  computed: {
    isSendActive() {
      const reg = /^([1][3,4,5,6,7,8,9])\d{9}$/;
      return this.mobilePhone && reg.test(this.mobilePhone);
    },
    isSumbit() {
      const reg = /^([1][3,4,5,6,7,8,9])\d{9}$/;
      return this.mobilePhone && reg.test(this.mobilePhone) && this.authCode;
    },
  },
  onLoad(option) {
    that = this;
    this.loadOption = option;
    console.log("--loadOption", this.loadOption);
    this.getToken();
  },
  methods: {
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
    },
    clearMobile() {
      this.mobilePhone = "";
    },
    sendCode() {
      if (this.isSendCode) {
        this.getAuthCode();
      }
    },
    getAuthCode() {
      if (!this.mobilePhone) {
        return this.$toast("请输入手机号");
      }
      const reg = /^([1][3,4,5,6,7,8,9])\d{9}$/;
      if (!reg.test(this.mobilePhone)) {
        return this.$toast("请输入正确的手机号");
      }
      this.num = 60;
      uni.login({
        provider: "weixin",
        success: (res) => {
          const code = res.code;
          let obj = {
            mobilePhone: this.mobilePhone,
            code: code,
          };
          getAuthCode(obj)
            .then((res) => {
              this.isSendCode = false;
              uni.showToast({
                title: "验证码已发送",
                icon: "success",
                duration: 2000,
              });
              this.timer = setInterval(this.countDown, 1000);
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
        },
      });
    },
    countDown() {
      if (this.num > 0) {
        this.num--;
      } else {
        this.isSendCode = true;
        this.num = 60;
        clearInterval(this.timer);
      }
    },
    loginSumbit(type) {
      if (this.isSumbit || type == 2) {
        this.showBindingInfo = true;
      }
      this.loginType = type;
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
    goBack() {
      let pages = getCurrentPages(); //当前页
      let beforePage = pages[pages.length - 2]; //上个页面
      uni.navigateBack({
        delta: 1,
        success: () => {
          beforePage.onLoad(beforePage.options); // 传入参数
          beforePage.onReady();
          // uni.switchTab({
          //   url: "/pages/home/index",
          // });
        },
        fail: (err) => {
          console.log("--err", err);
          uni.switchTab({
            url: "/pages/home/index",
          });
        },
      });
    },
    bindingCode(e) {
      console.log("e", e);
      if (this.isSumbit) {
        uni.showLoading({
          title: "登录中...",
        });
        uni.login({
          provider: "weixin",
          success: (res) => {
            const code = res.code;
            let obj = {
              code: code,
              type: 3,
              mobile: this.mobilePhone,
              authCode: this.authCode,
            };
            phoneAuthLogin(obj)
              .then((res) => {
                uni.setStorageSync("token", res.data.token);
                uni.setStorageSync("unregisterTip", 2);
                uni.$emit("reload");
                uni.hideLoading();
                this.showBindingInfo = false;
                this.goBack();
              })
              .catch((err) => {
                console.log("err", err);
                uni.hideLoading();
                that.cancel();
                uni.showToast({
                  title: err.message,
                  icon: "none",
                });
              });
          },
        });
      } else {
        this.$toast("请勾选并同意协议");
      }
    },
    cancel() {
      this.showBindingInfo = false;
    },
    goAgreement(type, title) {
      const u = "/pages/agreement/index" + `?type=${type}&title=${title}`;
      uni.navigateTo({
        url: u,
      });
    },
    getPhoneNumber(e) {
      console.log("e", e);
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
            that.cancel();
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
        const pc = new WXBizDataCrypt("wxff22a282e8ceb9a6", this.sessionKey);
        const data = pc.decryptData(encryptedData, iv);
        console.log("解密后的手机号：" + data.purePhoneNumber);
        this.$toast("授权失败");
      }
    },
    handleAgreePrivacyAuthorization(e) {
      console.log("--er", e);
    },
    openPrivacyContract() {
      const i = uni.canIUse("openPrivacyContract");
      console.log("--", i);
      if (i) {
        wx.openPrivacyContract({
          success: (res) => {
            console.log("openPrivacyContract success");
          },
          fail: (res) => {
            console.error("openPrivacyContract fail", res);
          },
        });
      } else {
        this.goAgreement(54, "《云鹊健康小程序隐私保护指引》");
      }
    },
    open() {
      this.showBindingInfo = !this.showBindingInfo;
      this.loginType = 2;
    },
    editTips(type) {
      // this.openPrivacyContract();
      if (type == "agreePrivacyAuthorization") {
        this.bindingCode();
      }
      if (type == "getPhoneNumber") {
        this.$toast("您的微信版本太低， 请升级。");
      }
      let armsConfig_wxAPI = {};
      wx.getSystemInfo &&
        wx.getSystemInfo({
          success: function (res) {
            console.log("--res", res);
            armsConfig_wxAPI.success = false;
            armsConfig_wxAPI.time = new Date();
            armsConfig_wxAPI.api = "WECHAT_API_" + type;
            armsConfig_wxAPI.msg = JSON.stringify({
              getAppBaseInfo: res,
            });
            Monitor.api(armsConfig_wxAPI);
          },
        });
    },
  },
};
</script>
<style>
.login-container .phoneplaceholder {
  font-size: 32rpx !important;
}
</style>
<style lang="scss" scoped>
@import "./index.scss";
</style>
