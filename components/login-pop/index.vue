<template>
  <u-popup :show="showPicker" mode="center" round="11">
    <view class="login-tip-wrap">
      <image class="tip-img" src="https://files.yunqueyi.com/image/png/common/20230718150911766.png"></image>
      <view class="content">
        <view class="txt"> 登陆后可浏览 </view>
        <view class="btn" @click="toLogin">立即登录</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { getCurrentPage, serialize } from "@/utils/common.js";
export default {
  data() {
    return {
      showPicker: false,
    };
  },
  watch: {},
  mounted() {},
  methods: {
    toLogin() {
      const { route, options } = getCurrentPage();
      const pq = serialize(options);
      const o = pq ? "/" + route + "?" + pq : "/" + route;
      const bu = encodeURIComponent(o || "/pages/index");
      const url = `/pages/phoneLogin/index?redirectUrl=${bu}&isBack=1&isReload=1`;
      console.log("-redirectUrl-", url);
      this.showPicker = false;
      uni.redirectTo({
        url: url,
      });
    },
    open() {
      this.showPicker = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-tip-wrap {
  margin: 24rpx auto;
  width: 656rpx;
  background-color: #fff;
  padding: 0rpx 0 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 24rpx;
  .tip-img {
    width: 272rpx;
    height: 272rpx;
  }
  .content {
    margin-top: 12rpx;
    .txt {
      font-size: 36rpx;
      font-weight: 500;
      color: #02120f;
      width: 100%;
      text-align: center;
    }
    .btn {
      width: 360rpx;
      height: 80rpx;
      margin-top: 40rpx;
      background: #00bda5;
      border-radius: 40rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #ffffff;
      line-height: 80rpx;
      text-align: center;
    }
  }
}
</style>
