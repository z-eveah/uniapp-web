<template>
  <view class="user-container">
    <view class="user-content">
      <view class="user-head">
        <image
          :src="headImg || 'https://files.yunqueyi.com/image/png/common/20220718124728716.png'"
          class="head-image"
        ></image>
      </view>
      <view v-if="!isLogin" class="user-login" @click="goLogin"> 立即登录 </view>
      <view v-else class="user-msg-container">
        <view class="user-msg">
          <view class="name">{{ userName || "立即登录" }}</view>
          <view class="hospital">
            {{ hospital }}
          </view>
        </view>
        <view class="logout-btn" @click="logout">退出登录</view>
      </view>
    </view>
    <view class="menuList">
      <!-- 个人账户余额 为0不展示 -->
      <view v-if="myCashVal > 0 || amountSum > 0" class="sub-setup" @click="goToBalance">
        <view class="leftCon">
          <image src="https://files.yunqueyi.com/image/png/common/20230815104524291.png" mode="" class="leftIcon" />
          <p class="txt">{{ cashName || "个人账户余额" }}</p>
        </view>
        <view class="accoutMes">
          <text class="accountNum">{{ myCashVal }}元</text>
          <image class="left-arrow" src="https://files.yunqueyi.com/image/png/common/2022101811280422.png" mode="" />
        </view>
      </view>

      <view class="sub-setup" @click="attendWechat">
        <view class="leftCon">
          <image src="https://files.yunqueyi.com/image/png/common/20230815104442849.png" mode="" class="leftIcon" />
          <p class="txt">订阅设置</p>
        </view>

        <image class="left-arrow" src="https://files.yunqueyi.com/image/png/common/2022101811280422.png" mode="" />
      </view>
    </view>

    <view class="contact">
      <text>客服电话</text>
      <text class="phone">
        {{ serverNumber }}
      </text>
      <text> 在线时间: 周一至周日9:00~21:00 </text>
    </view>
  </view>
</template>
<script>
import { getMobile } from "@/api/basicAddress.js";
import { balanceInfo } from "@/api/detection.js";
import { getAccountInfoApplet, logoutUser } from "@/api/user.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      userName: "",
      hospital: "",
      isLogin: false,
      headImg: "",
      cashName: "",
      myCashVal: 0,
      balanceUrl: "",
      amountSum: 0, // 累计收益
      serverNumber: null,
    };
  },
  // 转发小程序
  onShareAppMessage(res) {
    if (res.from === "button") {
    }
    return this.$shareConfigs.index;
  },
  onLoad() {
    this.isLogin = uni.getStorageSync("token") ? true : false;
    if (this.isLogin) {
      this.getUserMeassage();
      this.balanceInfo();
      this.getAccountInfoApplet();
    }
    const that = this;
    uni.$on("reload", function () {
      console.log("reload");
      that.isLogin = uni.getStorageSync("token") ? true : false;
      if (that.isLogin) {
        that.getUserMeassage();
        that.balanceInfo();
        that.getAccountInfoApplet();
      }
    });
    this.getServerNumber();
  },
  onShow() {
    if (this.isLogin) {
      this.balanceInfo();
      this.getAccountInfoApplet();
    } else {
      this.myCashVal = 0;
      this.amountSum = 0;
    }
  },
  methods: {
    ...mapActions(["getUserInfo", "clearUserInfo"]),
    async getUserMeassage() {
      const res = await this.getUserInfo();
      // if(res.name){
      const { name, hospital, avatarImageUrl } = res;
      this.hospital = hospital;
      this.userName = name || "微信用户";
      this.headImg = avatarImageUrl;
      if (this.userName) {
        this.isLogin = true;
      }
      // }
    },
    getAccountInfoApplet() {
      getAccountInfoApplet().then((res) => {
        const { data } = res || {};
        const cashData = data.length > 0 ? data[0] : null;
        if (cashData && cashData.name) {
          const { name, url, value } = cashData;
          this.cashName = name;
          this.myCashVal = value;
          this.balanceUrl = url;
        }
      });
    },
    // 获取个人账户信息
    balanceInfo() {
      balanceInfo().then((res) => {
        let { code, data, message } = res;
        if (code == "000000") {
          const { amountSum } = data || {};
          this.amountSum = amountSum;
        } else {
          // this.$toast(message || "操作失败");
        }
      });
    },
    // 获取客服电话
    getServerNumber() {
      getMobile(1).then((res) => {
        this.serverNumber = res.data;
      });
    },
    logout() {
      logoutUser().then((res) => {
        console.log("退出登陆");
        this.userName = "";
        this.hospital = "";
        this.isLogin = false;
        this.myCashVal = 0;
        this.amountSum = 0;
        uni.removeStorageSync("token");
        this.clearUserInfo();
        uni.navigateTo({
          url: "/pages/health/center",
        });
      });
    },

    // 手动跳转登录
    goLogin() {
      if (!this.isLogin) {
        uni.navigateTo({
          url: "/pages/phoneLogin/index",
        });
      }
    },
    attendWechat() {
      uni.navigateTo({
        url: `/pages/sub-setup/index`,
      });
    },
    goToBalance() {
      uni.navigateTo({
        url: this.balanceUrl || `/pagesDetection/balance-withdrawal/index`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-container {
  padding: 0rpx 0rpx 0 0rpx;
  height: 100vh;
  background: #f5f6f8;
  .user-content {
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
    padding: 32rpx 40rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 24rpx;
    .user-head {
      width: 110rpx;
      height: 109rpx;
      flex-shrink: 0;
      .head-image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .user-login {
      margin-left: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      font-size: 40rpx;
      color: #212121;
    }
    .user-msg-container {
      width: 100%;
      display: flex;
      margin-left: 28rpx;
      justify-content: space-between;
      align-items: center;
      .user-msg {
        width: 100%;
        width: 367rpx;
        .name {
          height: 40rpx;
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #212121;
          line-height: 40rpx;
        }
        .hospital {
          margin-top: 9rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 38rpx;
        }
      }
      .logout-btn {
        width: 152rpx;
        height: 56rpx;
        line-height: 56rpx;
        border-radius: 33rpx;
        border: 1rpx solid #c0c0c0;
        text-align: center;
        align-items: center;
        font-size: 26rpx;
        color: #212121;
      }
    }
  }
  .menuList {
    background: #ffffff;
    padding: 0 15px;
    .sub-setup {
      margin: auto;
      box-sizing: border-box;
      background: #ffffff;
      height: 96rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 0;
      border-bottom: 0.5px solid #d9d9d9;
      .txt {
        font-size: 32rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.9);
        line-height: 24px;
      }
      .left-arrow {
        width: 18rpx;
        height: 32rpx;
      }
      .leftCon {
        display: flex;
        justify-content: flex-start;
        line-height: 60px;
      }
      .leftIcon {
        width: 48rpx;
        height: 48rpx;
        margin-right: 10px;
      }
      .accountNum {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #222222;
        line-height: 16px;
        margin-right: 16px;
      }
    }
  }
  .menuList .sub-setup:last-child {
    border: 0 none;
  }
}

.contact {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 26rpx;
  font-weight: 400;
  color: #999999;
  line-height: 40rpx;
  text-align: center;
  margin: 30rpx 0;

  .phone {
    color: #666;
    font-size: 32rpx;
    font-weight: 500;
  }
}
</style>
