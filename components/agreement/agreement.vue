<template>
  <view class="agreement agreement-container">
    <rich-text type="text" :nodes="agreeText"></rich-text>
  </view>
</template>

<script>
import { getProtocolContentByType } from "@/api/protocol.js";
export default {
  data() {
    return {
      agreeText: "",
    };
  },
  methods: {
    show(type) {
      this.showProtocol(type);
    },
    showProtocol(type) {
      getProtocolContentByType(type).then((res) => {
        const protoData = res.data;
        this.agreeText = protoData;
        this.agreeText = this.agreeText.replace("【", "[");
        this.agreeText = this.agreeText.replace("】", "]");
        this.agreeText = this.agreeText.substr(
          this.agreeText.indexOf("<p"),
          this.agreeText.lastIndexOf("</p>") - this.agreeText.indexOf("<p")
        );
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.agreement {
  width: 100%;
  box-sizing: border-box;
  padding: 40rpx 32rpx;
  color: #676869;
  line-height: 1.8;
  word-break: break-all;
  rich-text {
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .agree-wrap {
    width: 600rpx;
    box-sizing: border-box;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6rpx;
    .btn-close {
      float: right;
    }
    .agree-texts {
      width: 480rpx;
      height: 720rpx;
      background: #fff;
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(103, 104, 105, 1);
      line-height: 42rpx;
      padding: 0 60rpx;
      margin-bottom: 60rpx;
      text-align: left;
      overflow-x: hidden;
      overflow-y: auto;
      rich-text {
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
      }
    }
  }
}
</style>
