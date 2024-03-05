<template>
  <view class="confirm-success-wrapper">
    <view class="confirm-success-container">
      <view class="success-info">
        <image
          class="success-img"
          src="https://files.yunqueyi.com/image/png/common/20230301101427839.png"
          mode=""
        ></image>
        <view v-if="verificationType === '1'" class="success-text">核销成功，请发放试剂</view>
        <view v-if="verificationType !== '1'" class="success-text">核销成功</view>
        <!-- <view class="sucess-sub-tips">请将服务项目对应试剂盒发放给用户</view> -->
        <view v-if="totalCash > 0" class="getCash-text"
          >赚得<span>{{ totalCash }}</span
          >元收益</view
        >
        <view v-if="totalCash > 0" class="getCash-tips">可到「个人账户余额」查看您的收益</view>
      </view>
      <view class="patient-info-container">
        <view class="patient-info-content">
          <view v-if="barcode" class="item">
            <text class="label">条形码:</text>
            <text class="value">{{ barcode || "--" }}</text>
          </view>
          <view class="item">
            <text class="label">受检人:</text>
            <text class="value">{{ patientNameNext || "" }}</text>
          </view>
          <view class="item">
            <text class="label">服务项目:</text>
            <text class="value">{{ detectionName || "--" }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="button-container">
      <view class="button-success continue-entering" @click="scanCode"> 继续核销 </view>
      <view class="button-success back-list" @click="toList"> 返回列表 </view>
    </view>
    <official-account v-if="!hasAccount" class="fixed-account" style=""></official-account>

    <!-- 扫码核销确认 -->
    <ScanAndVerify ref="scanRef" @done="toNextPage" />
  </view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getOrderInfo, getAmoutByYunNo } from "@/api/detection.js";
import ScanAndVerify from "@/pages/components/ScanAndVerify.vue";

export default {
  name: "Index",
  components: { ScanAndVerify },
  data() {
    return {
      verificationType: "",
      barcode: "",
      patientNameNext: "",
      detectionName: "",
      totalCash: 0, // 获得的收益钱数量
      yunOrderNo: "", // 保险单号
      orderInfo: null,
    };
  },
  computed: {
    ...mapGetters(["hasAccount"]),
  },
  onLoad(options) {
    console.log("options---", options);
    const { barcode, yunOrderNo, verificationType } = options;
    this.barcode = barcode;
    this.verificationType = verificationType;
    this.yunOrderNo = yunOrderNo;
    if (yunOrderNo) {
      this.getOrderInfo(yunOrderNo);
      this.getAmoutByYunNo(yunOrderNo);
    }
  },
  methods: {
    ...mapActions(["setAccountStatus"]),
    getOrderInfo(yunOrderNo) {
      getOrderInfo({ yunOrderNo }).then((res) => {
        console.log("orderInfo", res);
        let { code, data, message } = res;
        if (code == "000000") {
          this.orderInfo = data;
          let beneficiaryName = data.beneficiaryName || "--";
          let beneficiarySex = data.beneficiarySex || "--";
          let beneficiaryAge = data.beneficiaryAge || "--";
          this.patientNameNext = `${beneficiaryName} ${beneficiarySex} ${beneficiaryAge}岁`;
          this.detectionName = data.detectionName;
        } else {
          this.$toast(message || "操作失败");
        }
      });
    },
    // 继续核销
    scanCode() {
      this.$refs.scanRef && this.$refs.scanRef.scanCode();
    },
    getAmoutByYunNo(yunOrderNo) {
      getAmoutByYunNo(yunOrderNo).then((res) => {
        console.log("checkInfo", res);
        let { code, message, data } = res;
        if (code == "000000") {
          this.totalCash = (data.doctorServiceChargeAmount / 100).toFixed(2);
          console.log("提交成功数据---", data);
        } else {
          this.$toast(message || "操作失败");
        }
      });
    },
    // 返回到列表
    toList() {
      uni.redirectTo({
        url: `/pages/appointment/list`,
      });
    },
    toNextPage(data) {
      const { verificationType, yunOrderNo } = data;
      // 扫描核销 verificationType 核销方式分类 0早筛类 1快检类 2中医类 3慢病类 4心电衣类
      if (verificationType === 2 || verificationType === 1) {
        uni.redirectTo({
          url: `/pagesDetection/detection-regist-success/index?yunOrderNo=${yunOrderNo}&verificationType=${verificationType}`,
        });
      } else if (verificationType === 3) {
        uni.redirectTo({
          url: `/pages/submit-test-result/index?yunOrderNo=${yunOrderNo}`,
        });
      } else {
        uni.redirectTo({
          url: `/pagesDetection/detection-regist/index?yunOrderNo=${yunOrderNo}`,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
