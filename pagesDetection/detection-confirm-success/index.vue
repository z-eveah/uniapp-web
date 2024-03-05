<template>
  <view class="confirm-success-wrapper">
    <view class="confirm-success-container">
      <view class="success-info">
        <image
          class="success-img"
          src="https://files.yunqueyi.com/image/png/common/20230301101427839.png"
          mode=""
        ></image>
        <view class="success-text">提交成功</view>
      </view>
      <view class="patient-info-container">
        <view class="patient-info-content">
          <view class="parient-name patient-info-modal">
            <text class="name-text">受检人:</text>
            <text class="name-value">
              <text class="name">{{ recordInfo.name }}</text>
              <text class="sex">{{ recordInfo.sex }}</text>
              <text class="date">{{ recordInfo.patientMobile }}</text>
            </text>
          </view>
          <view v-for="(item, ind) in recordInfo.checklist" :key="ind" class="checklist-item">
            <view class="parient-detection patient-info-modal">
              <view class="detection-text">服务项目:</view>
              <view class="detection-value"> {{ item.checkName }}</view>
            </view>
            <view class="parient-detection patient-info-modal">
              <view class="detection-text">条形码:</view>
              <view class="detection-value"> {{ item.sampleCode }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="button-container">
      <view class="button-success continue-entering" @click="scanCode"> 继续录入下一个 </view>
      <view class="btn-wrap">
        <view class="button-success patient-confirm" @click="toPage">代录入</view>
        <view class="button-success patient-confirm" @click="backhome"> 回登记首页 </view>
      </view>
    </view>
    <view class="to-check-list" @click="toCheckList">查看该受检人及亲属所有检测 ></view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { getInternalPurchaseEcho } from "@/api/detection.js";
export default {
  name: "Index",
  data() {
    return {
      recordInfo: {
        name: "",
        sex: "",
        patientMobile: "",
        checklist: [],
      },
      patientId: "",
      hospitalId: null,
      ids: [],
    };
  },
  computed: {},
  onLoad(options) {
    const { ids, hospitalId } = options;
    console.log("id-----", ids);
    const i = ids.split(",");
    this.ids = i;
    this.hospitalId = hospitalId;
    this.getRecordInfo(i);
  },
  methods: {
    toPage() {
      uni.redirectTo({
        url: `/pagesDetection/agent-entry/index?hospitalId=${this.hospitalId}`,
      });
    },
    backhome() {
      uni.redirectTo({
        url: `/pagesDetection/scan-patient/index?hospitalId=${this.hospitalId}`,
      });
    },
    //获取检测详情
    getRecordInfo(recordIds) {
      getInternalPurchaseEcho(recordIds).then((res) => {
        if (res.code === "000000") {
          this.patientId = res.data.encryptedPatientId;
          this.recordInfo.name = res.data.patientName;
          this.recordInfo.sex = res.data.sex === 1 ? "男" : "女";
          this.recordInfo.patientMobile = res.data.patientMobile;
          this.recordInfo.checklist = res.data.checkInfoList;
        }
      });
    },
    // 扫码获取信息
    scanCode() {
      let _this = this;
      uni.scanCode({
        scanType: ["barCode", "qrCode"],
        onlyFromCamera: true,
        success: function (res) {
          const re = JSON.parse(res.result);
          if (re && re.patientId) {
            uni.redirectTo({
              url: `/pagesDetection/binding-code/index?hospitalId=${_this.hospitalId}&patientId=${re.patientId}`,
            });
          }
        },
        fail: function () {
          _this.$toast("无法有效识别条形码或二维码");
        },
      });
    },
    toCheckList() {
      uni.navigateTo({
        url: `/pages/testingMgmt/index?patientId=${this.patientId}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
