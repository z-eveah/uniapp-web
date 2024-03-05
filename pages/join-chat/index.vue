<template>
  <view class="join-chat-container">
    <view class="top">
      <view class="cu-custom" @click="goHome">
        <view class="rignt">
          <image src="../../static/images/back.png" mode=""></image>
        </view>
      </view>
      <view class="title">{{ title }}老师,您好！</view>
      <image src="https://test1-file.yunqueyi.com/image/png/common/20220524193045787.png" mode="widthFix"></image>
    </view>
    <view class="pop-container">
      <image src="https://test1-file.yunqueyi.com/image/png/common/20220518144516597.png" mode=""></image>
    </view>
    <view v-if="url" class="join-chat-content">
      <view class="join-chat-cell">
        <cell
          bind:startmessage="startmessage"
          :plugid="plugid"
          :contact-text-blod="false"
          bind:completemessage="completemessage"
          :url="url"
        />
      </view>
    </view>
  </view>
</template>
<script>
import { getUserInfo } from "@/api/user.js";
import { getEnterGroupPath } from "@/api/joinChat.js";
export default {
  data() {
    return {
      url: "",
      plugid: "",
      title: "",
      hospitalId: "",
    };
  },
  onLoad(options) {
    console.log("options", options);
    this.hospitalId = options.scene;
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        this.title = res.data.name;
        this.getEnterGroupPath();
      });
    },
    getEnterGroupPath() {
      getEnterGroupPath(this.hospitalId).then((res) => {
        this.url = res.data;
      });
    },
    startmessage() {},
    completemessage() {},
  },
};
</script>
<style>
.wrapper {
  line-height: 1 !important;
}
</style>
<style lang="scss" scoped>
.join-chat-container {
  .cu-custom {
    height: 50rpx;
    padding: 0 30rpx;
    padding-top: 103rpx;
    .rignt {
      width: 24rpx;
      height: 50rpx;
      image {
        width: 24rpx;
        height: 50rpx;
      }
    }
  }
  .top {
    width: 750rpx;
    height: 704rpx;
    background: linear-gradient(360deg, #ffffff 0%, #ffecc8 45%, #fbcb8b 100%);
    margin-bottom: 244rpx;
    .title {
      padding-top: 20rpx;
      margin-bottom: 16rpx;
      font-size: 32rpx;
      text-align: center;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c35400;
      height: 46rpx;
      line-height: 46rpx;
    }
    image {
      width: 538rpx;
      height: 278rpx;
      margin: 0 auto;
      display: block;
    }
  }
  .pop-container {
    padding: 0 34rpx;
    height: 57rpx;
    margin-bottom: 10rpx;
    image {
      width: 248rpx;
      height: 57rpx;
    }
  }
  .join-chat-content {
    padding: 0 38rpx;
    .join-chat-cell {
      border-bottom: 1px solid #f0f1f2;
      border-top: 1px solid #f0f1f2;
      padding: 40rpx 0;
      height: 73rpx;
      .img {
        width: 400rpx;
        image {
          width: 400rpx;
        }
      }
      .title {
        height: 26rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
        line-height: 26rpx;
        margin-bottom: 16rpx;
      }
    }
  }
}
</style>
