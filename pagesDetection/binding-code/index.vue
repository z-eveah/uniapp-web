<template>
  <view class="binding-code-container">
    <view class="code-container flex-wrap">
      <view class="left">
        <image src="https://files.yunqueyi.com/image/png/common/20230517161319795.png" class="icon"></image>
      </view>
      <view class="right">
        <view>
          {{ patientInfo.patientName || "--" }}
          <view class="phone"> {{ patientInfo.patientPhone || "--" }}</view>
        </view>
        <view class="idcard"> {{ patientInfo.idTypeStr || "身份证号" }}: {{ patientInfo.patientIdNo || "--" }} </view>
      </view>
    </view>
    <view class="pb150">
      <view v-for="(item, index) in detectionServiceList" :key="index" class="code-container">
        <view
          class="code-content flex space-between align-center"
          :class="{ 'bar-code-content': item.errorMessage != '' }"
        >
          <view class="left">
            <view class="input-title">{{ item.checkName }}</view>
            <view class="input-content-group">
              <view class="input-content input-content-scan">
                <u-input
                  v-model="item.sampleCode"
                  type="text"
                  :border="false"
                  class="code"
                  :disabled="item.registered"
                  placeholder-style="font-size: 32rpx;font-weight: 400;color: #999999;"
                  placeholder="请输入条形码"
                  @change="clearError(index)"
                />
              </view>
              <view v-if="item.sampleTime" class="input-error-message hasTime">
                检测时间: {{ item.sampleTime || "" }}
              </view>
              <view v-if="item.errorMessage != ''" class="input-error-message">
                {{ item.errorMessage || "" }}
              </view>
            </view>
          </view>
          <view class="right">
            <view class="code-input-item-r">
              <!--              <view v-if="item.barCode" class="clear-img-container" @click="clearCode(index)">-->
              <!--                <image class="clear-img" src="https://files.yunqueyi.com/icon/2022/clear.png"></image>-->
              <!--              </view>-->
              <view class="scan-qr-img-container-code" @click="scanCode(item, index)">
                <image class="scan-qr-img" :src="item.registered ? disabledScan : greenScan"></image>
                <view class="mt6">扫码识别</view>
              </view>
            </view>
          </view>
        </view>
        <view class="mt20 code-content">
          <view class="flex space-between align-center">
            <view class="left">
              <view class="input-title">个体化用药基因检测</view>
              <view class="input-content-group">
                <view class="input-content input-content-scan">
                  <u-input
                    v-model="item.sampleCode"
                    type="text"
                    :border="false"
                    class="code"
                    :disabled="item.registered"
                    placeholder-style="font-size: 32rpx;font-weight: 400;color: #999999;"
                    placeholder="请输入条形码"
                    @change="clearError(index)"
                  />
                </view>
                <view v-if="item.sampleTime" class="input-error-message hasTime">
                  检测时间: {{ item.sampleTime || "" }}
                </view>
                <view v-if="item.errorMessage != ''" class="input-error-message">
                  {{ item.errorMessage || "" }}
                </view>
              </view>
            </view>
            <view class="right">
              <view class="code-input-item-r">
                <view class="scan-qr-img-container-code" @click="scanCode(item, index)">
                  <image class="scan-qr-img" :src="item.registered ? disabledScan : greenScan"></image>
                  <view class="mt6">扫码识别</view>
                </view>
              </view>
            </view>
          </view>
          <view class="flex space-between mt20 pt20 border-top" @click="open">
            <view class="fs32 black fw500">请选择药品</view>
            <image class="left-arrow" src="https://files.yunqueyi.com/image/png/common/20231201152413854.png" mode="" />
          </view>
        </view>
      </view>
    </view>
    <view class="sumbit-button-top">
      <view class="radio-wrap">
        <u-checkbox-group>
          <u-checkbox :checked="forwardFlag" shape="circle" active-color="#00BDA5" @change="handleCheckboxChange" />
        </u-checkbox-group>
        <view class="radio-info" @click="handleCheckboxChange">
          <view class="info-title">提前录入</view>
          <view class="info-tip">若检测时间晚于当前时间需选择</view>
        </view>
      </view>
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
        <view class="user">
          <view class="user-info">
            {{ patientInfo.patientName }}
            <text></text>
            <text class="space"></text>
            {{ patientInfo.sex == 1 ? "男" : "女" }}
            <text class="space"></text>
            {{ patientInfo.patientPhone }}
          </view>
        </view>
        <view class="list-wrap">
          <view v-for="(item, ind) in recordInfo" :key="ind" class="code">
            <view class="flex">
              <view class="check-name">{{ item.checkName }}</view>
            </view>
            <view class="code-info">{{ item.sampleCode }}</view>
          </view>
        </view>
      </view>
    </u-modal>
    <multiCheck ref="multiCheck"></multiCheck>
  </view>
</template>

<script>
import { internalPurchaseSubmitBind, patientLog, internalPurchaseSubmitCheck } from "@/api/detection.js";
import { getHospitalQrcode } from "@/api/inviteConsumer";
import multiCheck from "@/components/multi-check";

export default {
  components: {
    multiCheck,
  },
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
      hospitalId: "",
      patientId: "",
      todayCompleted: false,
      disabledScan: "https://files.yunqueyi.com/image/png/common/20230517164325334.png",
      greenScan: " https://files.yunqueyi.com/image/png/common/20230517164427319.png",
      forwardFlag: 0,
    };
  },
  computed: {
    isSubmit() {
      if (this.todayCompleted) {
        return true;
      } else {
        const nd = this.detectionServiceList.filter((i) => {
          return !i.registered;
        });
        const ib = nd.filter((i) => {
          return i.sampleCode && i.sampleCode.length > 0;
        });
        return ib.length > 0 ? true : false;
      }
    },
  },
  onLoad(options) {
    console.log("bind-code", options);
    const { hospitalId, patientId } = options;
    this.patientId = patientId;
    this.hospitalId = hospitalId;
    this.patientLog(hospitalId);
  },
  methods: {
    handleCheckboxChange() {
      this.forwardFlag = this.forwardFlag ? 0 : 1;
    },
    clearCode(index) {
      this.detectionServiceList[index].sampleCode = "";
      this.detectionServiceList[index].errorMessage = "";
    },
    cancel() {
      console.log(this.isLoading);
      if (this.isLoading) {
        return;
      }
      this.showBindingInfo = false;
    },
    // 扫码获取信息
    scanCode(item, index) {
      if (item.registered) {
        return false;
      }
      let _this = this;
      uni.scanCode({
        scanType: ["barCode", "qrCode"],
        onlyFromCamera: true,
        success: function (res) {
          console.log("--res", res, index, _this.detectionServiceList);
          _this.detectionServiceList[index].sampleCode = res.result;
        },
        fail: function () {
          _this.$toast("无法有效识别条形码或二维码");
        },
      });
    },
    // 跳转提交成功页面
    toSuccessPage() {
      let _this = this;
      let url = "";
      if (this.status === 6) {
        url = "/pages/health/detection-confirm-success-pay/index";
      } else {
        wx.requestSubscribeMessage({
          tmplIds: ["0qVzfr2ME5MukLzFBsjb_JWdq3X5lTgGoWyqQ5_xUJE"],
          success(res) {},
        });
        url = "/pages/health/detection-confirm-success/index";
      }
      _this.isLoading = false;
    },
    toggleBindingInfo() {
      const that = this;
      if (this.isSubmit == false) {
        return false;
      } else {
        uni.showLoading();
        const l = [];
        this.detectionServiceList.forEach((i) => {
          const { sampleCode, goodsId, checkName, registered } = i;
          if (i.sampleCode && i.sampleCode.length > 0 && Boolean(sampleCode) && !i.registered) {
            const i = {
              goodsId: goodsId,
              sampleCode: sampleCode,
              checkName: checkName,
              registered: registered,
            };
            l.push(i);
          }
        });
        let obj = {
          checkInfoList: l,
          hospitalId: this.hospitalId,
          encryptedPatientId: this.patientId,
        };
        internalPurchaseSubmitCheck(obj)
          .then((res) => {
            uni.hideLoading();
            if (res.code !== "000000") {
              this.$toast(res.message);
            } else {
              const { success, results } = res.data;
              if (success) {
                this.showBindingInfo = true;
                this.recordInfo = results;
              } else {
                const dsl = this.detectionServiceList;
                dsl.map((i, ind) => {
                  results.filter((k) => {
                    if (k.msg && k.goodsId == i.goodsId) {
                      dsl[ind]["errorMessage"] = k.msg;
                    }
                  });
                });
                that.detectionServiceList = dsl;
                that.$forceUpdate();
              }
            }
          })
          .catch((err) => {
            console.log(err);
            uni.hideLoading();
            // this.$toast(err.message);
          });
      }
    },
    bindingCode() {
      let _this = this;
      if (!this.isSubmit) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      console.log(this.isLoading);
      const l = [];
      this.detectionServiceList.forEach((i) => {
        const { sampleCode, goodsId, registered, recordId } = i;
        if (sampleCode && sampleCode.length > 0 && Boolean(sampleCode) && !i.registered) {
          const i = {
            goodsId: goodsId,
            sampleCode: sampleCode,
            registered: registered,
          };
          l.push(i);
        }
      });
      let obj = {
        checkInfoList: l,
        hospitalId: this.hospitalId,
        encryptedPatientId: this.patientId,
        dataFrom: 11,
        forwardFlag: this.forwardFlag,
      };
      uni.showLoading({
        title: "提交中...",
      });
      internalPurchaseSubmitBind(obj)
        .then((res) => {
          const { code, data, message } = res;
          console.log("--data", code, data, message);
          this.isSubmit = false;
          if (code !== "000000") {
            uni.hideLoading();
            return this.$toast(message);
          } else {
            const { success, results } = data;
            console.log("--data", data);
            if (success) {
              this.showBindingInfo = false;
              const ids = data.recordIds;
              uni.redirectTo({
                url: `/pagesDetection/detection-confirm-success/index?ids=${ids}&hospitalId=${_this.hospitalId}`,
              });
            } else {
              const dsl = this.detectionServiceList;
              dsl.map((i, ind) => {
                results.filter((k) => {
                  if (k.msg && k.goodsId == i.goodsId) {
                    dsl[ind]["errorMessage"] = k.msg;
                  }
                });
              });
              _this.detectionServiceList = dsl;
              _this.$forceUpdate();
            }
          }
          this.showBindingInfo = false;
          _this.isLoading = false;
          uni.hideLoading();
        })
        .catch((err) => {
          _this.isLoading = false;
          uni.hideLoading();
          // this.$toast(err.message);
        });
    },
    patientLog() {
      getHospitalQrcode();
      uni.showLoading();
      patientLog({ hospitalId: this.hospitalId, patientId: this.patientId })
        .then((res) => {
          if (res.code == "000000") {
            uni.hideLoading();
            const { todayCompleted, detectionServiceList } = res.data;
            this.detectionServiceList = detectionServiceList;
            this.todayCompleted = todayCompleted;
            this.patientInfo = res.data;
            if (todayCompleted) {
              this.$toast("该用户今日所有项目均已检测完成");
            } else {
              const has = detectionServiceList.filter((i) => {
                return i.registered;
              });
              if (has.length > 0) {
                this.$toast("该用户今日有项目已检测完成");
              }
            }
          } else {
            uni.hideLoading();
            this.$toast(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          uni.hideLoading();
          // this.$toast(err.message);
        });
    },
    clearError(index) {
      console.log(this.detectionServiceList[index].errorMessage);
      if (this.detectionServiceList[index].errorMessage && this.detectionServiceList[index].errorMessage.length > 0) {
        this.detectionServiceList[index].errorMessage = "";
        this.$forceUpdate();
      }
    },
    open() {
      console.log("----", this.$refs.multiCheck);
      this.$refs.multiCheck && this.$refs.multiCheck.open();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
