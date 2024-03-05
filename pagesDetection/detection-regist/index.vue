<template>
  <view class="binding-code-container">
    <view class="code-container flex-wrap">
      <view class="left">
        <image src="https://files.yunqueyi.com/image/png/common/20230517161319795.png" class="icon"></image>
      </view>
      <view class="right">
        <view>
          {{ orderInfo.beneficiaryName || "--" }}
          <view class="phone"> {{ orderInfo.beneficiaryPhone || "--" }}</view>
        </view>
        <view class="idcard"> {{ orderInfo.idTypeStr || "身份证号" }}:{{ orderInfo.beneficiaryIdNum || "--" }} </view>
      </view>
    </view>
    <view class="pb150">
      <view class="code-container">
        <view class="code-content bar-code-content">
          <view class="left">
            <view class="input-title">{{ orderInfo.detectionName || "--" }}</view>
            <view class="input-content-group">
              <view class="input-content input-content-scan">
                <u-input
                  v-model="barcode"
                  type="text"
                  :border="false"
                  class="code"
                  :disabled="false"
                  placeholder-style="font-size: 32rpx;font-weight: 400;color: #999999;"
                  placeholder="请输入条形码"
                  clearable
                  @change="handleCodeChange"
                />
              </view>
              <view v-if="barcode == '' && errorMessageVisible" class="input-error-message">
                {{ errorMessage || "" }}
              </view>
            </view>
          </view>
          <view class="right">
            <view class="code-input-item-r">
              <view class="scan-qr-img-container-code" @click="scanCode">
                <image class="scan-qr-img" :src="!!barcode ? disabledScan : greenScan"></image>
                <view class="mt6">扫码识别</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="sumbit-button-top">
      <view
        v-if="!todayCompleted"
        class="sumbit-button"
        :class="isSubmit ? 'sumbit-button-active' : ''"
        @click="toggleBindingInfo"
      >
        提交
      </view>
    </view>
    <u-modal
      :show="showBindingInfo"
      class="binding-code-confirm"
      :show-confirm-button="true"
      :show-cancel-button="true"
      cancel-color="#212121"
      confirm-color="#00BDA5"
      width="300"
      :show-title="false"
      confirm-text="确认提交"
      cancel-text="返回修改"
      @confirm="bindingCode"
      @cancel="cancel"
    >
      <view class="binding-code-showinfo">
        <view class="title">确认提交</view>
        <view class="content">
          <view class="barcode">
            <u-image
              src="https://files.yunqueyi.com/image/png/common/20230626164231491.png"
              width="137rpx"
              height="32rpx"
            ></u-image>
            <text class="num">{{ barcode }}</text>
          </view>
          <view class="item">
            <text class="label">检测项目</text>
            <text class="value">{{ orderInfo.detectionName || "--" }}</text>
          </view>
          <view class="item">
            <text class="label">受检人</text>
            <text class="value">{{ patientName }}</text>
          </view>
          <view class="modal-tips">
            <u-icon size="30rpx" color="#FF720C" name="error-circle"></u-icon>
            <text class="m-tips-txt">请确认信息是否正确，若出现问题，将无法正常出报告</text>
          </view>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { getOrderInfo, bindBarcode, bindBarcodeV2, bindBarcodeV3, validateDetectionCode } from "@/api/detection.js";
import { getUserInfo } from "@/api/user.js";

export default {
  data() {
    return {
      showBindingInfo: false,
      isLoading: false,
      recordInfo: [],
      goodsId: "",
      status: "",
      agreeText: "",
      detectionServiceList: [],
      patientInfo: {},
      orderInfo: {},
      barcode: "",
      hospitalId: "",
      patientId: "",
      todayCompleted: false,
      disabledScan: "https://files.yunqueyi.com/image/png/common/20230517164325334.png",
      greenScan: " https://files.yunqueyi.com/image/png/common/20230517164427319.png",
      patientName: "",
      patientNameNext: "",
      tradeDetectionServiceRecordId: "",
      beneficiaryPatientId: "",
      doctorId: "",
      errorMessage: "",
      errorMessageVisible: false,
      yunOrderNo: "", // 保险单号
    };
  },
  computed: {
    isSubmit() {
      if (!!this.barcode) {
        return true;
      } else {
        return false;
      }
    },
  },
  onLoad(options) {
    // detectionKind 0是早筛 1是快检

    const { yunOrderNo } = options;
    this.yunOrderNo = yunOrderNo;
    this.getOrderInfo(yunOrderNo);
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        console.log("userInfo", res);
        this.doctorId = res.data.id;
      });
    },

    getOrderInfo(yunOrderNo) {
      getOrderInfo({ yunOrderNo }).then((res) => {
        console.log("orderInfo", res);
        let { code, data, message } = res;
        if (code == "000000") {
          this.orderInfo = data;
          let beneficiaryName = data.beneficiaryName || "--";
          let beneficiarySex = data.beneficiarySex || "--";
          let beneficiaryBirthday = data.beneficiaryBirthday || "--";
          let beneficiaryAge = data.beneficiaryAge || "--";
          this.patientName = `${beneficiaryName} ${beneficiarySex} ${beneficiaryBirthday}`;
          this.patientNameNext = `${beneficiaryName} ${beneficiarySex} ${beneficiaryAge}岁`;
          this.tradeDetectionServiceRecordId = data.tradeDetectionServiceRecordId;
          this.beneficiaryPatientId = data.beneficiaryPatientId;
        } else {
          this.$toast(message || "操作失败");
        }
      });
    },
    handleCodeChange() {
      if (this.barcode) {
        this.errorMessage = "";
        this.errorMessageVisible = false;
      }
    },
    clearCode(index) {
      this.detectionServiceList[index].sampleCode = "";
      this.detectionServiceList[index].errorMessage = "";
    },
    cancel() {
      this.showBindingInfo = false;
    },
    // 扫码获取信息
    scanCode() {
      if (!!this.barcode) {
        return;
      }
      let that = this;
      uni.scanCode({
        scanType: ["barCode", "qrCode"],
        onlyFromCamera: true,
        success: function (res) {
          console.log("barcode", res);
          that.barcode = res.result;
        },
        fail: function () {
          that.$toast("无法有效识别条形码或二维码");
        },
      });
    },

    toggleBindingInfo() {
      if (this.isSubmit == false) {
        return false;
      } else {
        const o = {
          goodsId: this.orderInfo.goodsId,
          sampleCode: String(this.barcode).toUpperCase(),
          projectId: 0,
        };
        uni.showLoading();
        validateDetectionCode(o)
          .then((res) => {
            console.log("--", res);
            uni.hideLoading();
            const { code, message } = res;
            if (code === "000000") {
              this.showBindingInfo = true;
            }
            console.log(message);
          })
          .catch((err) => {
            console.log(err);
            this.barcode = "";
            this.errorMessage = err.message || "无法有效识别条形码";
            this.errorMessageVisible = true;
          })
          .finally(() => {
            uni.hideLoading();
          });
      }
    },
    bindingCode() {
      if (this.orderInfo.detectionKind == "0") {
        let params = {
          barCode: this.barcode,
          id: this.tradeDetectionServiceRecordId,
          prototypeId: 0,
          prototypeLogId: 0,
          yunOrderNo: this.yunOrderNo,
        };
        console.log("vparams", params);
        uni.showLoading({
          title: "提交中...",
        });
        bindBarcode(params)
          .then((res) => {
            uni.hideLoading();
            console.log("bindV2", res);
            const { code, data, message } = res;
            if (code == "000000") {
              uni.redirectTo({
                url: `/pagesDetection/detection-regist-success/index?barcode=${this.barcode}&patientNameNext=${this.patientNameNext}&detectionName=${this.orderInfo.detectionName}&yunOrderNo=${this.yunOrderNo}`,
              });
            } else if (code == "226537") {
              this.barcode = "";
              this.errorMessage = message || "操作失败";
              this.errorMessageVisible = true;
            } else {
              // this.$toast(message || "操作失败");
            }
          })
          .catch((err) => {
            uni.hideLoading();
            this.barcode = "";
            this.errorMessage = err.message || "操作失败";
            this.errorMessageVisible = true;
          })
          .finally(() => {
            this.showBindingInfo = false;
          });
      }
      if (this.orderInfo.detectionKind == "1") {
        let params = {
          barCode: this.barcode,
          detectionKind: 1,
          id: this.tradeDetectionServiceRecordId,
          prototypeId: 0,
          prototypeLogId: 0,
          userId: this.beneficiaryPatientId,
          userType: 2,
          uuid: uni.getStorageSync("unionId"),
          doctorId: this.doctorId,
          yunOrderNo: this.yunOrderNo,
        };
        console.log("v2params", params);
        uni.showLoading({
          title: "提交中...",
        });
        bindBarcodeV2(params)
          .then((res) => {
            uni.hideLoading();
            console.log("bindV2", res);
            const { code, data, message } = res;
            if (code == "000000") {
              uni.redirectTo({
                url: `/pagesDetection/detection-regist-success/index?barcode=${this.barcode}&patientNameNext=${this.patientNameNext}&detectionName=${this.orderInfo.detectionName}&yunOrderNo=${this.yunOrderNo}`,
              });
            } else if (code == "226537") {
              this.barcode = "";
              this.errorMessage = message || "操作失败";
              this.errorMessageVisible = true;
            } else {
              // this.$toast(message || "操作失败");
            }
          })
          .catch((err) => {
            uni.hideLoading();
            this.barcode = "";
            this.errorMessage = err.message || "操作失败";
            this.errorMessageVisible = true;
          })
          .finally(() => {
            this.showBindingInfo = false;
          });
      }
      // 心电衣
      if (this.orderInfo.detectionKind == "3") {
        let params = {
          barCode: this.barcode,
          detectionKind: 3,
          id: this.tradeDetectionServiceRecordId,
          prototypeId: 0,
          prototypeLogId: 0,
          userId: this.beneficiaryPatientId,
          userType: 2,
          uuid: uni.getStorageSync("unionId"),
          doctorId: this.doctorId,
          yunOrderNo: this.yunOrderNo,
        };
        console.log("v3params", params);
        uni.showLoading({
          title: "提交中...",
        });
        bindBarcodeV3(params)
          .then((res) => {
            uni.hideLoading();
            console.log("bindV3", res);
            const { code, data, message } = res;
            if (code == "000000") {
              uni.redirectTo({
                url: `/pagesDetection/detection-regist-success/index?barcode=${this.barcode}&patientNameNext=${this.patientNameNext}&detectionName=${this.orderInfo.detectionName}&yunOrderNo=${this.yunOrderNo}`,
              });
            } else if (code == "226537") {
              this.barcode = "";
              this.errorMessage = message || "操作失败";
              this.errorMessageVisible = true;
            } else {
              // this.$toast(message || "操作失败");
            }
          })
          .catch((err) => {
            uni.hideLoading();
            this.barcode = "";
            this.errorMessage = err.message || "操作失败";
            this.errorMessageVisible = true;
          })
          .finally(() => {
            this.showBindingInfo = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
