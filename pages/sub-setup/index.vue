<template>
  <view class="subSetup-container">
    <view class="line-20"></view>
    <view class="setup-item">
      <view class="left">
        <p class="fs26">订阅报告</p>
        <p class="fs24">订阅后新的报告将会发送到云鹊医公众号</p>
      </view>
      <view class="right">
        <u-switch v-model="isSubmitWechat.subMsg" size="24" active-color="#00BDA5" @change="subStatusChange"></u-switch>
      </view>
    </view>
  </view>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { detectionSubscribe, cancelSubscribe } from "@/api/testingMgmt.js";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isSubmitWechat"]),
  },
  onLoad() {
    console.log("--checkSubStatus", this.isSubmitWechat);
  },
  onShow() {},
  methods: {
    ...mapMutations(["SET_SubmitWechat"]),
    subStatusChange(status) {
      console.log(status);
      const that = this;
      if (status) {
        detectionSubscribe().then((res) => {
          if (res.code == "000000") {
            const { subWechat } = this.isSubmitWechat;
            const a = { ...this.isSubmitWechat, subMsg: true };
            that.SET_SubmitWechat(a);
            if (!subWechat) {
              uni.navigateTo({
                url: `/pages/webview/index`,
              });
            } else {
              this.$toast("订阅成功");
            }
          }
        });
      } else {
        cancelSubscribe().then((res) => {
          console.log(res);
          if (res.code == "000000") {
            // this.$toast("订阅成功");
            const a = { ...this.isSubmitWechat, subMsg: false };
            that.SET_SubmitWechat(a);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.subSetup-container {
  height: 100vh;
  background: #f5f6f8;
  .setup-item {
    background: #ffffff;
    height: 132rpx;
    width: 100%;
    padding: 32rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    color: #212121;
    font-size: 24rpx;
    font-weight: 300;
    align-items: center;

    .fs26 {
      font-size: 32rpx;
      font-weight: 600;
    }
    .fs24 {
      margin-top: 16rpx;
      font-size: 28rpx;
      color: #999999;
    }

    .right {
      width: 120rpx;
      height: 50rpx;
      text-align: center;
      color: #ffffff;
      font-size: 24rpx;
    }
  }
  .line-20 {
    height: 20rpx;
    width: 100%;
    background: #f5f6f8;
  }
}
</style>
