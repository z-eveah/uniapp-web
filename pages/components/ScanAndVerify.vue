<template>
  <!-- 扫码核销确认 -->
  <u-modal
    :show="visible"
    :show-title="false"
    :show-confirm-button="true"
    :show-cancel-button="true"
    cancel-color="#212121"
    confirm-color="#00BDA5"
    width="640rpx"
    confirm-text="确认"
    cancel-text="返回"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <view class="modal-content">
      <view class="title">信息确认</view>
      <view class="content">
        <view class="item">
          <text class="label">服务项目</text>
          <text class="value">{{ orderInfo.detectionName || "--" }}</text>
        </view>
        <view class="item">
          <text class="label">参保人</text>
          <text class="value">{{ orderInfo.patientNameNext }}</text>
        </view>
        <view class="tip-with-icon">
          <view class="icon">
            <u-icon size="30rpx" color="#FF720C" name="error-circle"></u-icon>
          </view>
          <text class="text">请确认服务项目及参保人身份信息</text>
        </view>
        <view v-if="orderInfo.verificationType === 2 && orderInfo.detectionType !== 21" class="modal-tips">
          <view class="tip-p"> 并确认已告知参保人下述情况禁止贴敷： </view>
          <view class="tip-p"> 1.糖尿病、血液病、艾滋病、结核病及其他传染病患者禁用； </view>
          <view class="tip-p"> 2.严重心肝肾功能障碍者及过敏体质者禁用； </view>
          <view class="tip-p"> 3.体内有心脏起搏器等金属植入禁用磁灸热贴、万古神远红外理疗贴； </view>
          <view class="tip-p"> 4.孕妇下腹部、高热患者、贴敷部位溃烂者禁用； </view>
        </view>
      </view>
    </view>
  </u-modal>
</template>
<script>
import { getOrderInfo, orderInfoCheck } from "@/api/detection";

export default {
  emits: ["done"],
  data() {
    return {
      visible: false,
      orderInfo: null,
    };
  },
  methods: {
    // 订单详情
    getOrderDetail(yunOrderNo) {
      getOrderInfo({ yunOrderNo }).then((res) => {
        console.log("orderInfo", res);
        let { code, data, message } = res;
        if (code == "000000") {
          if (data.verificationType === 1 || data.verificationType === 2) {
            data.patientNameNext = `${data.beneficiaryName || "--"} ${data.beneficiarySex || "--"} ${
              data.beneficiaryBirthday || "--"
            }`;
            this.orderInfo = data;
            this.visible = true;
          } else {
            this.orderCheck(yunOrderNo);
          }
        } else {
          this.$toast(message || "操作失败");
        }
      });
    },
    // 确认核销
    handleConfirm() {
      this.visible = false;
      this.orderCheck(this.orderInfo.yunOrderNo);
    },
    // 取消核销
    handleCancel() {
      this.visible = false;
      this.$toast("核销失败");
    },
    // 扫码获取单号
    scanCode() {
      let self = this;
      uni.scanCode({
        scanType: ["qrCode"],
        success: function (res) {
          const result = JSON.parse(res.result);
          console.log("scanCodeInfo", result.yunOrderNo);
          if (!!result.yunOrderNo) {
            self.getOrderDetail(result.yunOrderNo);
          } else {
            this.$toast("核销码错误");
          }
        },
      });
    },
    orderCheck(yunOrderNo) {
      orderInfoCheck(yunOrderNo)
        .then((res) => {
          console.log("checkInfo", res);
          let { code, message, data } = res;
          if (code == "000000") {
            const result = {
              verificationType: data,
              yunOrderNo,
            };
            this.$emit("done", result);
          } else {
            this.$toast(message || "操作失败");
          }
        })
        .catch((err) => {
          this.$toast(err.message || "操作失败");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.modal-content {
  .title {
    font-size: 36rpx;
    line-height: 54rpx;
    text-align: center;
    font-weight: 500;
    color: #000000;
    margin-bottom: 32rpx;
  }
  .content {
    overflow: hidden;
    .item {
      display: flex;
      align-items: flex-start;
      font-size: 30rpx;
      margin-bottom: 24rpx;

      .label {
        color: #999;
        flex: 0 0 120rpx;
        margin-right: 18rpx;
        text-align: justify;
        text-align-last: justify;
        line-height: 1.5;
      }

      .value {
        flex: 1;
        color: #212121;
        font-weight: 800;
        line-height: 1.5;
      }
    }

    .tip-with-icon {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      .icon {
        margin-top: 3rpx;
        margin-right: 8rpx;
      }
      .text {
        flex: auto;
        font-size: 26rpx;
        color: #ff720c;
      }
    }
    .modal-tips {
      margin: 16rpx 12rpx 0 38rpx;
      .tip-p {
        color: #999;
        font-size: 26rpx;
        line-height: 1.5;
        margin-bottom: 8rpx;
      }
    }
  }
}
</style>
