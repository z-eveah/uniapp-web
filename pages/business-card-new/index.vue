<template>
  <view class="business-card">
    <image :src="qrcode" class="business-bg" show-menu-by-longpress="true" mode="widthFix"></image>
    <view v-if="showOnce" class="diaLogs"> </view>
    <view v-if="showOnce" class="info-concent">
      <view class="content">
        <view class="teteSize">
          <p>您已经添加过专属顾问,</p>
          <p>请确认是否再次添加？</p>
        </view>
        <view class="confrim-btn">
          <view class="btnClcel" @click="cancelC">取消</view>
          <view class="btnClCom" @click="confirmC">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from "@/api/user.js";

import { getCounselor, checkCustomer } from "@/api/business.js";
export default {
  data() {
    return {
      qrcode: "",
      id: "",
      mobile: "",
      isecAuth: "",
      type: "",
      showOnce: false,
    };
  },
  onLoad(options) {
    const { id, mb, type } = options;
    this.id = id;
    this.mobile = mb;
    this.type = type;
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    fetchData(id = "", mb = "", type = 0) {
      if (this.type === "null" || !this.type) {
        type = 0;
      } else {
        type = this.type;
      }
      console.log("--this.mobile", this.mobile, this.type);
      getCounselor({
        mobile: this.mobile,
        type: this.type,
      }).then((res) => {
        this.qrcode = res.data.qrcode;
        this.checkCustomer();
      });
    },
    getUserInfo() {
      getUserInfo()
        .then((res) => {
          this.fetchData(this.id, this.mobile);
        })
        .catch((err) => {
          console.log("-res", err);
        });
    },

    doctorIdUnionId(unionId) {
      doctorIdUnionId(unionId, (res) => {
        if (res.code === "000000") {
          if (res.data) {
            this.fetchData(this.id, this.mobile);
          } else {
            uni.removeStorageSync("unionId");
            this.checkLogin({
              cb: () => {
                this.fetchData(this.id, this.mobile);
              },
              isBack: false,
              isTabBar: "",
              redirectUrl: encodeURIComponent(`/pages/business-card-new/index`),
            });
          }
        }
      });
    },
    checkCustomer() {
      checkCustomer(this.mobile).then((res) => {
        if (res.data) {
          this.showOnce = true;
        }
      });
    },
    cancelC() {
      this.showOnce = false;
      wx.exitMiniProgram &&
        wx.exitMiniProgram({
          success: function () {
            console.log("退出成功！");
          },
        });
    },
    confirmC() {
      this.showOnce = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.business-card {
  position: relative;
  height: 100%;
  width: 100vw;

  .business-bg {
    display: block;
    width: 100%;
    z-index: -1;
  }
  .diaLogs {
    z-index: 99;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    opacity: 0.5;
    background: #000000;
  }

  .info-concent {
    z-index: 100;
    position: absolute;
    top: 35%;
    width: 100%;

    .content {
      width: 80%;
      background: #ffffff;
      border-radius: 22rpx;
      margin: 0 auto;

      .teteSize {
        text-align: center;
        padding: 24rpx;

        p {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #212121;
        }
      }

      .confrim-btn {
        display: flex;
        // justify-content: space-around;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        width: 100%;
        text-align: center;

        .btnClcel {
          padding: 21rpx 40rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #00bda5;
          width: 50%;
          border-right: 1px solid rgba(0, 0, 0, 0.08);
        }

        .btnClCom {
          padding: 21rpx 40rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #00bda5;
          width: 50%;
        }
      }
    }
  }
}
</style>
