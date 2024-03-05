<template>
  <view class="inviteConsumer">
    <view v-if="loginAndRegister" class="inviteConsumer-content">
      <image
        class="inviteConsumer-content-img"
        src="https://files.yunqueyi.com/image/png/common/2022070118160658.png"
        mode=""
        @click="toHealthServiceList"
      ></image>
      <view class="inviteConsumer-content-info">
        <view class="info-top">
          <image v-if="doctorAvatarImageUrl" class="info-top-img" :src="doctorAvatarImageUrl" mode=""></image>
          <image v-else class="info-top-img" :src="defaultImgSrc" mode=""></image>
          <view class="info-top-text">
            <view class="text-top">
              <text>{{ doctorName }}</text
              ><text class="text-top-title">{{ doctorTitle }}</text>
            </view>
            <view class="text-bottom"> {{ hospitalName }} </view>
          </view>
        </view>
        <view class="info-img">
          <image :show-menu-by-longpress="true" :src="qrCodeUrl" mode=""></image>
        </view>
        <view class="info-tips">
          <view class="tips-top">
            <image src="https://files.yunqueyi.com/image/png/common/202207041045536.png" mode="widthFix"></image>
            <text>让居民使用微信扫一扫完成登记，即可绑定居民； </text>
          </view>
          <view class="tips-bottom"> 绑定后可免费向居民推送健康漫画和自定义通知消息 </view>
        </view>
      </view>
      <view class="inviteConsumer-content-bottom">
        <view class="bottom-text" @click="toPage">
          <image
            class="bottom-text-book"
            src="https://files.yunqueyi.com/image/png/common/2022070411134412.png"
            mode="widthFix"
          ></image>
          <text>查看操作指导</text>
          <image
            class="bottom-text-arrows"
            src="https://files.yunqueyi.com/image/png/common/20220704111408743.png"
            mode="heightFix"
          ></image>
        </view>
      </view>
    </view>
    <view v-if="loginAndRegister" class="inviteConsumer-save-btn" @click="downLoadImage"> 保存至相册 </view>
    <LoginTip v-if="!isLogin" tip-text="登录查看您的医生码" back-url="/pages/inviteConsumer/index" />
  </view>
</template>

<script>
import { getHospitalQrcode, getDownloadHospitalQrcode } from "@/api/inviteConsumer";
export default {
  data() {
    return {
      defaultImgSrc: "https://files.yunqueyi.com/image/png/common/20220701183304302.png",
      doctorAvatarImageUrl: "",
      doctorName: "",
      doctorTitle: "",
      hospitalName: "",
      qrCodeUrl: "",
      downloadQrcode: "",
      isLogin: null,
    };
  },
  onShow() {
    this.setLoginStatus();
  },
  onLoad() {
    this.setLoginStatus();
    this.getHospitalQrcode();
  },
  methods: {
    setLoginStatus() {
      const isLogin = uni.getStorageSync("token") || null;
      this.isLogin = isLogin;
    },
    // 获取医生详情
    getHospitalQrcode() {
      getHospitalQrcode().then((res) => {
        this.doctorAvatarImageUrl = res.data.doctorAvatarImageUrl;
        this.doctorName = res.data.doctorName;
        this.doctorTitle = res.data.doctorTitle;
        this.hospitalName = res.data.hospitalName;
        this.qrCodeUrl = res.data.qrCodeUrl;
      });
    },
    // 跳转到 也引导页面
    toPage() {
      uni.navigateTo({
        url: "/pages/guide/index",
      });
    },
    // 跳转到  居民将康服务列表
    toHealthServiceList() {
      uni.navigateTo({
        url: "/pages/healthServiceList/index",
      });
    },
    // 下载图片
    downLoadImage() {
      uni.showLoading({ title: "下载中..." });
      getDownloadHospitalQrcode()
        .then((res) => {
          uni.hideLoading();
          this.downloadQrcode = res.data.qrCodeUrl;
          if (res.code === "000000") {
            console.log(res.data.qrCodeUrl);
            uni.downloadFile({
              url: this.downloadQrcode, // 这里是我已经请求好的图片数据
              success: (res) => {
                console.log(res, "res");
                var tempFilePath = res.tempFilePath;
                uni.saveImageToPhotosAlbum({
                  filePath: tempFilePath, // 必须是本地路径
                  success: () => {
                    uni.showToast({
                      title: "图片已保存",
                      icon: "none",
                    });
                  },
                  fail: (err) => {
                    console.log(err);
                    // 保存失败有可能是用户点击了取消按钮，也有可能是用户未授权保存相册功能这时候需要用户手动开启权限
                    // console.log('失败')
                    wx.getSetting({
                      success(res) {
                        if (res.authSetting["scope.writePhotosAlbum"]) {
                          // 已授权,用户点击了取消按钮,无需其他操作
                          uni.showToast({
                            icon: "none",
                            title: "取消",
                          });
                        }
                        if (res.authSetting["scope.writePhotosAlbum"] == false) {
                          // 未授权,需用户跳转设置页面开启权限
                          uni.showModal({
                            title: "提示",
                            content: `图片保存失败，请前往设置页面允许保存相册`,
                            confirmColor: "#8C5CDD",
                            success: function (res) {
                              if (res.confirm) {
                                // console.log('用户点击确定');
                                uni.openSetting({
                                  success(res) {
                                    console.log("用户打开设置页面");
                                  },
                                });
                              } else if (res.cancel) {
                                // console.log('用户点击取消');
                                uni.showToast({
                                  icon: "none",
                                  title: "取消",
                                });
                              }
                            },
                          });
                        }
                      },
                    });
                  },
                });
              },
              fail: (err) => {
                console.log(err);
                uni.showToast({
                  title: err.errMsg,
                  icon: "none",
                });
              },
            });
          }
        })
        .catch(uni.hideLoading());
    },
  },
};
</script>

<style lang="scss" scoped>
.inviteConsumer {
  height: 100vh;
  background: #fcfffe;
  &-save-btn {
    height: 72rpx;
    width: 680rpx;
    margin: 0 auto;
    background: #00bda5;
    border-radius: 36rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #ffffff;
    line-height: 72rpx;
    text-align: center;
    margin-top: 42rpx;
  }
  &-content {
    width: 100%;
    height: 1060rpx;
    background: url("https://files.yunqueyi.com/image/png/common/20220701181312569.png") no-repeat left top;
    background-size: 100% 100%;
    overflow: hidden;
    &-bottom {
      width: 680rpx;
      height: 90rpx;
      background: url("https://files.yunqueyi.com/image/png/common/20220704111216655.png") no-repeat left top;
      background-size: 100% 100%;
      margin: 0 auto;
      display: flex;
      justify-content: center; /*水平主轴居中*/
      align-items: center; /*垂直交叉轴居中*/
      .bottom-text {
        display: flex;
        height: 38rpx;
        justify-content: center; /*水平主轴居中*/
        align-items: center; /*垂直交叉轴居中*/
        text {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #00bda5;
          line-height: 38rpx;
          margin: 0 10rpx 0 6rpx;
        }
        &-book {
          width: 26rpx;
          height: 28rpx;
        }
        &-arrows {
          width: 12rpx;
          height: 18rpx;
        }
      }
    }
    .inviteConsumer-content-img {
      display: block;
      width: 680rpx;
      height: 66rpx;
      margin: 36rpx auto 28rpx auto;
    }
    &-info {
      width: 600rpx;
      height: 680rpx;
      padding: 32rpx 40rpx;
      margin: 0 auto;
      background: url("https://files.yunqueyi.com/image/png/common/20220701181835986.png") no-repeat left top;
      background-size: 100% 100%;
      box-shadow: 0px 6px 27px 0px rgba(0, 0, 0, 0.09);
      .info-tips {
        padding-top: 30rpx;
        .tips-top,
        .tips-bottom {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 28rpx;
          text-align: center;
        }
        .tips-top {
          // position: relative;
          margin-bottom: 12rpx;
          width: 100%;
          // padding-left:15px;
          display: flex;
          image {
            // position: absolute;
            display: block;
            width: 26rpx;
            height: 26rpx;
            // top:50%;
            // left:0px;
            // transform: translateY(-50%);
          }
          text {
            display: block;
            margin-left: 4rpx;
            flex: 1;
            text-align: left;
          }
        }
      }
      .info-img {
        width: 410rpx;
        height: 410rpx;
        background: url("https://files.yunqueyi.com/image/png/common/20220704103359489.png") no-repeat left top;
        background-size: 100% 100%;
        margin: 0 auto 30rpx auto;
        padding-top: 6rpx;
        image {
          display: block;
          width: 372rpx;
          height: 372rpx;
          margin: 0 auto;
        }
      }
      .info-top {
        display: flex;
        margin-bottom: 24rpx;
        align-items: center;
        &-img {
          width: 112rpx;
          height: 112rpx;
          margin-right: 24rpx;
        }
        &-text {
          flex: 1;
          .text-top {
            height: 32rpx;
            font-size: 32rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #212121;
            line-height: 32rpx;
            margin-bottom: 14rpx;

            &-title {
              margin-left: 8rpx;
              font-size: 26rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #212121;
              line-height: 26rpx;
            }
          }
          .text-bottom {
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 1.4;
          }
        }
      }
    }
  }
}
</style>
