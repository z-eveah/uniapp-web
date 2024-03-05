<template>
  <view class="downloadApp">
    <img class="bgimg" src="https://files.yunqueyi.com/image/png/common/202207081349393.png" alt="" />
    <view class="downloadApp-btn" @click.stop="downloadApp"> </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    downloadApp() {
      uni.downloadFile({
        url: "https://files.yunqueyi.com/image/png/common/20220715182145959.png", // 这里是我已经请求好的图片数据
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
          // uni.saveImageToPhotosAlbum({
          //   // 然后调用这个方法
          //   filePath: tempFilePath,
          //   success: (res) => {
          //     uni.showToast({
          //       title: "图片已保存",
          //       icon: "none",
          //     });
          //   },
          // });
        },
        fail: (err) => {
          console.log(err);
          uni.showToast({
            title: err.errMsg,
            icon: "none",
          });
        },
      });

      // uni.downloadFile({
      //   url: "https://files.yunqueyi.com/image/png/common/20220715182145959.png", // 这里是我已经请求好的图片数据
      //   success: (res) => {
      //     console.log(res);
      //     var tempFilePath = res.tempFilePath;
      //     uni.saveImageToPhotosAlbum({
      //       // 然后调用这个方法
      //       filePath: tempFilePath,
      //       success: (res) => {
      //         uni.showToast({
      //           title: "图片已保存",
      //           icon: "none",
      //         });
      //       },
      //     });
      //   },
      //   fail: (err) => {
      //     console.log(err);
      //     uni.showToast({
      //       title: "图片保存失败",
      //       icon: "none",
      //     });
      //   },
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.downloadApp {
  height: 1624rpx;
  position: relative;
  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // z-index: 999;
  // background: url("https://files.yunqueyi.com/image/png/common/202207081349393.png") no-repeat center top;
  // background-size: cover;
  .bgimg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &-btn {
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translateX(-50%);
    height: 115px;
    width: 394px;
    background: url("https://files.yunqueyi.com/image/png/common/20220708110832587.png") no-repeat left top;
    background-size: 100% 100%;
  }
}
</style>
