<template>
  <view v-if="showEnvChange" class="change-env">
    <view @click="goEntry">隐藏入口</view>
    <view v-for="(item, index) in btnList" :key="index" @click="change(item)">切换{{ item }}</view>
    <view class="curr">当前{{ env }}</view>
    <view class="close" @click="closeEnvChange">关闭</view>
  </view>
</template>

<script>
import { ENV_CONFIG } from "@/configs/consts";
export default {
  data() {
    return {
      showEnvChange: true,
      env: "test",
      btnList: ["dev", "test", "uat", "prod"],
    };
  },
  mounted() {
    const baseUrl = uni.getStorageSync("baseUrl");
    console.log("baseUrl", baseUrl);
    this.env = this.getEnv(baseUrl);
    this.setCurrentEnvToLocal(this.env);
  },
  methods: {
    setCurrentEnvToLocal(type) {
      Object.keys(ENV_CONFIG).map((item) => {
        uni.setStorageSync(item, ENV_CONFIG[item][type]);
      });
    },
    change(type) {
      const env = type || "prod";
      this.env = env;
      this.setCurrentEnvToLocal(type);
      this.$toast(`已成功切换到${env}环境，请重新打开小程序`);
    },
    closeEnvChange() {
      this.showEnvChange = false;
    },
    goEntry() {
      uni.navigateTo({
        url: `/pages/test/index?env=${this.env}`,
      });
    },
    getEnv(baseUrl) {
      const currentEnv = baseUrl.match(/https:\/\/([\w]*)-?sc.yunqueyi.com/);
      console.log("env change", baseUrl, currentEnv);
      if (currentEnv) {
        return currentEnv[1] || "prod";
      }
      return "test";
    },
  },
};
</script>

<style lang="scss" scoped>
.change-env {
  position: fixed;
  right: 50rpx;
  bottom: 170rpx;
  background: #ffb400;
  padding: 5rpx 15rpx;
  view {
    height: 50rpx;
    color: #fff;
    margin: 5rpx 0;
  }
  .close {
    text-align: center;
  }
  .curr {
    font-weight: 700;
    font-size: 28rpx;
    color: #c71eff;
  }
}
</style>
