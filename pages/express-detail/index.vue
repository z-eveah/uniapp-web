<template>
  <view class="express-detail-wrap" :class="{ white: isLose }">
    <express-lose v-if="isLose" :lose-message="loseMessage" />
    <view v-else class="express-main">
      <view class="express-msg box">
        <view class="express-company">
          <img class="company-log" :src="expresData.channelLogo" alt="" />
          <p class="company-name">
            {{ expresData.channelName }}
          </p>
        </view>
        <view class="express-project">
          <view class="project-item">
            <p class="project-name">送检项目:</p>
            <p class="project-d">
              {{ expresData.checkNames }}
            </p>
          </view>
          <view class="project-item">
            <p class="project-name">{{ timeLabel[expresData.status] }}:</p>
            <p class="project-d">
              {{ timeStr }}
            </p>
          </view>
        </view>
        <view class="express-num">
          <view class="num-item">
            <p class="num-name">运单号:</p>
            <p class="num-d">
              {{ expresData.wayBillNo }}
            </p>
            <view class="btn-wrap" @click="copy">
              <view class="btn"> 复制 </view>
            </view>
          </view>
          <view v-if="expresData.status == 1" class="num-item time">
            <p class="num-name">上门时间:</p>
            <p class="num-d">
              {{ expresData.doorTime }}
            </p>
          </view>
        </view>
      </view>
      <view v-if="expresData.status == 1 || expresData.status == 2" class="operator-phone">
        <view class="operator-l">
          <img src="https://test1-file.yunqueyi.com/image/png/common/20220704180538981.png" />
          <view>快递员工号：{{ expresData.operatorCode || "--" }}</view>
        </view>
        <text v-if="expresData.operatorPhone" @click="callPhone(expresData.operatorPhone)">
          <img src="https://test1-file.yunqueyi.com/image/png/common/20220704180706952.png" />
        </text>
      </view>
      <view class="express-address box">
        <view class="address-top">
          <view class="address-wrap">
            <view class="wrap-line" />
            <view class="address-left">
              <img src="https://test1-file.yunqueyi.com/image/png/common/20220704181119661.png" alt="" srcset="" />
            </view>
            <view class="address-right">
              <view class="address-main">
                <p class="address-name">
                  {{ expresData.sendPersonName }}
                  {{ expresData.sendPhone }}
                </p>
                <p class="address-ad">
                  {{ expresData.sendAddress }}
                </p>
              </view>
            </view>
          </view>
          <view class="address-p p-top" />
        </view>
        <view class="address-bottm">
          <view class="address-p" />
          <view class="address-wrap">
            <view class="wrap-line" />
            <view class="address-left">
              <img src="https://test1-file.yunqueyi.com/image/png/common/20220704180445399.png" alt="" srcset="" />
            </view>
            <view class="address-right">
              <view class="address-main">
                <p class="address-name">
                  {{ expresData.receivePersonName }}
                  {{ expresData.receivePhone }}
                </p>
                <p class="address-ad">
                  {{ expresData.receiveAddress }}
                </p>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="express-step-main box">
        <view
          v-for="(item, index) in expresData.logisticsInfos"
          :key="index"
          class="express-step"
          :class="[{ first: index == 0 }, { last: index == expresData.logisticsInfos.length - 1 }]"
        >
          <view class="express-step-icon">
            <img
              v-if="index == 0"
              class="step-pg"
              src="https://test1-file.yunqueyi.com/image/png/common/20220704181158511.png"
              alt=""
              srcset=""
            />
            <img
              v-else
              class="oval-pg"
              src="https://test1-file.yunqueyi.com/image/png/common/20220704180756570.png"
              alt=""
              srcset=""
            />
          </view>
          <view class="express-step-msg">
            <p v-if="item.statusStr" class="step-title">
              {{ item.statusStr }}
            </p>
            <p v-if="item.statusDesc" class="step-m">
              {{ item.statusDesc }}
            </p>
            <p v-if="item.statusTime" class="step-time">
              {{ item.statusTime }}
            </p>
          </view>
        </view>
      </view>
      <view class="service-phone">
        <view @click="callPhone(expresData.serviceTelephone)">
          <img src="https://test1-file.yunqueyi.com/image/png/common/2022070418084289.png" alt="" srcset="" />
          <p>云鹊医客服</p>
        </view>
      </view>
    </view>
    <view class="express-footer">
      <view
        v-if="expresData.status == 1 && expresData.channel == 1"
        class="express-btn express-footer-cancel"
        @click="cancel"
      >
        <text>取消送检</text>
      </view>
      <view class="express-btn" @click="keepExpress">
        <text>继续寄快递</text>
      </view>
    </view>
  </view>
</template>

<script>
import ExpressLose from "./components/express-lose";
import { getDetectionSendDetail } from "@/api/detection.js";
export default {
  name: "ExpressDetail",
  components: {
    ExpressLose,
  },
  data() {
    return {
      isLose: false,
      sendLogId: "",
      loseMessage: "",
      expresData: {
        channelName: "",
        checkNames: "",
        status: 0,
        wayBillNo: "",
        doorTime: "",
        sendPersonName: "",
        sendPhone: "",
        receiveAddress: "",
        logisticsInfos: [],
        sendAddress: "",
        receivePersonName: "",
        receivePhone: "",
      },
      expresDatamock: {
        checkNames: "送检项目集",
        wayBillNo: "运单号11",
        logisticsInfos: [],
        receiveAddress: "收方地址",
        receivePersonName: "收方姓名",
        receivePhone: "收方手机号",
        sendAddress: "寄方地址",
        sendPersonName: "寄方姓名",
        sendPhone: "寄方手机号",
        status: 4, // 快递状态  1待揽收 2运送中 3已签收 4已取消
        statusStr: "快递状态str",
        statusTime: "状态时间",
      },
      timeLabel: {
        0: "暂无",
        1: "下单时间",
        2: "下单时间",
        3: "签收时间",
        4: "取消时间",
      },
      backMethod: "inner", // native原生返回，inner正常返回
      souceType: "",
      options: {},
    };
  },
  computed: {
    timeStr() {
      const { expresData } = this;
      return (expresData.status < 3 ? expresData.createOrderTime : expresData.statusTime) || "";
    },
  },
  onLoad(options) {
    const that = this;
    console.log(options);
    this.options = options;
    this.souceType = options.type || "";
    this.loseMessage = options.loseMessage || "";
    this.backMethod = options.backMethod || "inner";
    this.init(options.sendLogId);
    uni.$on("reloadData", function () {
      that.init(options.sendLogId);
    });
  },
  onUnload() {
    if (this.souceType == "inspection") {
      uni.switchTab({
        url: "/pages/home/index",
      });
    }
  },
  methods: {
    init(sendLogId) {
      if (this.loseMessage) {
        this.isLose = true;
      } else {
        this.sendLogId = sendLogId || "";
        this.getDetectionSendDetailFn();
      }
    },
    getDetectionSendDetailFn() {
      uni.showLoading({ title: "加载中" });
      if (!this.sendLogId) {
        this.$toast("无法查询订单信息");
      }
      getDetectionSendDetail(this.sendLogId)
        .then((res) => {
          this.expresData = res.data;
          uni.hideLoading();
        })
        .catch(uni.hideLoading());
    },
    copy() {
      let _this = this;

      uni.setClipboardData({
        data: this.expresData.wayBillNo,
        success: function (res) {
          // _this.$toast("已复制");
        },
      });

      uni.setClipboardData({
        data: this.expresData.wayBillNo,
        success: function (res) {
          // _this.$toast("已复制");
        },
      });
    },
    callPhone(phone) {
      uni
        .makePhoneCall({
          phoneNumber: phone.toString(),
        })
        .catch((e) => {});
    },
    keepExpress() {
      uni.navigateTo({
        url: "/pages/sample-inspection/index",
      });
    },
    // 取消送检
    cancel() {
      const { sendLogId } = this.options;
      uni.navigateTo({
        url: `/pages/express-cancel/index?sendLogId=${sendLogId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
