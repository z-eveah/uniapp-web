<template>
  <view class="unregister-tip-wrap">
    <image class="tip-img" src="https://files.yunqueyi.com/image/png/common/20230720201651208.png"></image>
    <view class="content">
      <view class="txt">
        <view> 本App采用实名注册制 </view>
        <view class="mt10"> 如需要注册请联系客服{{Mobile}} </view>
      </view>
      <view class="btn" @click="home">返回首页</view>
    </view>
  </view>
</template>

<script>
import { getMobile } from "@/api/basicAddress.js";
export default {
  data() {
    return {
      Mobile: "400-006-5252",
    };
  },
  onShow() {
    this.getMobile();
  },
  methods: {
    home() {
      uni.switchTab({
        url: `/pages/home/index`,
      });
    },
    getMobile() {
      getMobile(1).then((res) => {
        this.Mobile = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.unregister-tip-wrap {
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
      height: 96rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: #666666;
      width: 100%;
      text-align: center;
    }
    .btn {
      height: 80rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #212121;
      line-height: 80rpx;
      text-align: center;
      width: 280rpx;
      background: #ffffff;
      border-radius: 80rpx;
      border: 2rpx solid #c0c0c0;
      margin: 0 auto;
      margin-top: 40rpx;
    }
    .mt10 {
      margin-top: 20rpx;
    }
  }
}
</style>
