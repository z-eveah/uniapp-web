<template>
  <view class="my-check-container">
    <view class="my-check-box" :class="isSubmitWechat.subMsg && isSubmitWechat.subWechat ? '' : 'h192'">
      <scroll-view scroll-x="true" class="check-tabs">
        <view
          v-for="(item, index) in tabs"
          :key="index"
          class="tabs-item"
          :class="{ cur: activeIndex == item.value, 'last-pad': index == tabs.length - 1 }"
          @click="tabChange(item, index)"
        >
          <span class="tab-ext">{{ item.label }}</span>
        </view>
        <!-- <view class="icon-box">
          <image class="icon-sort" src="@/static/images/icon_sort.png" @click="showPicker = true" />
        </view> -->
      </scroll-view>
      <view
        v-if="!(isSubmitWechat.subMsg && isSubmitWechat.subWechat && isLogin)"
        class="sub-wrap"
        :class="{ 'sub-ed': isSubmitWechat.subMsg && isSubmitWechat.subWechat }"
      >
        <view class="left">
          <p class="fs26">订阅消息</p>
          <p class="fs24">订阅后可及时收到样本的物流信息、收样信息、报告信息等</p>
        </view>
        <view class="right" @click="attendWechat">{{
          isSubmitWechat.subMsg && isSubmitWechat.subWechat ? "已订阅" : "立即订阅"
        }}</view>
      </view>
    </view>
    <view
      v-if="dataList && dataList.length"
      class="list-content"
      :class="isSubmitWechat.subMsg && isSubmitWechat.subWechat ? 'mt88' : 'mt192'"
    >
      <scroll-view
        :scroll-top="scrollTop"
        lower-threshold="100"
        class="scroll-Y"
        :scroll-y="true"
        @scrolltolower="upCallback"
      >
        <view class="scroll-content">
          <CellItem v-for="item in dataList" :key="item.id" :data="item" @load="init" />
        </view>
      </scroll-view>
    </view>
    <view v-if="dataList && dataList.length === 0">
      <view v-if="!isLogin" class="pt100">
        <LoginTip tip-text="登录查看您的检测" back-url="/pages/testingMgmt/index" />
      </view>
      <view v-if="loginAndRegister" class="no-check-list">
        <image src="https://files.yunqueyi.com/icon/2022/no-list.png" mode=""></image>
        <view class="check-text">暂无检测</view>
      </view>
    </view>
    <u-popup :show="showPicker" closeable round="11" @close="showPicker = false">
      <view class="select-hosptial-up">
        <view class="title">
          <span>样本筛选</span>
        </view>
        <view class="main">
          <view class="info">
            <view class="tit"> 报告生成时间 </view>
            <view class="time" :class="{ check: startTime }" @click="showSelectTime">
              <view>{{ startTime || "起始时间" }}</view>
              <view>-</view>
              <view>{{ endTime || "终止时间" }}</view>
            </view>
          </view>
          <view class="info">
            <view class="tit"> 检测结果 </view>
            <view class="result-status">
              <view
                v-for="item in resultList"
                :key="item"
                :class="{ check: detectResultArray.includes(item.code) }"
                @click="selectResult(item)"
              >
                {{ item.value }}
              </view>
            </view>
          </view>
          <view class="info">
            <view class="tit"> 检测项目 </view>
            <view class="result-status">
              <view
                v-for="(item, index) in columns"
                :key="index"
                :class="{ check: item == reportName }"
                @click="changConfirm(item)"
              >
                {{ item }}
              </view>
            </view>
          </view>
        </view>
        <view class="popup-botm">
          <view class="btom-clear" @click="reset"> 重置 </view>
          <view class="btom-ok" @click="closePopup"> 确认 </view>
        </view>
      </view>
    </u-popup>
    <u-calendar
      :show="timeShow"
      :min-date="minDate"
      :max-date="maxDate"
      allow-same-day
      mode="range"
      color="#00BDA5"
      :default-date="defaultDateMultiple"
      month-num="12"
      z-index="10077"
      @confirm="timeConfirm"
      @close="timeShow = false"
    ></u-calendar>
  </view>
</template>
<script>
import { getListByDoctor, getHospitalReportNameList, getDetectResultEnum } from "@/api/testingMgmt.js";
import CellItem from "./components/cell-item.vue";
import { mapGetters, mapMutations } from "vuex";
import { detectionSubscribe } from "@/api/testingMgmt.js";
export default {
  components: {
    CellItem,
  },
  data() {
    return {
      isLoading: false,
      isList: true,
      showOnce: false,
      reporShow: false,
      showPicker: false,
      timeShow: false,
      startTime: "",
      endTime: "",
      minDate: ``,
      maxDate: ``,
      defaultDateMultiple: [],
      defaultDateMultipleCopy: [],
      columns: [],
      reportName: "",
      // 下拉刷新配置项
      downOption: {
        isLock: true,
      },
      // 上拉加载配置项
      upOption: {
        auto: false,
        empty: {
          use: false,
        },
      },
      tabs: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "待采样",
        },
        {
          value: 6,
          label: "待支付",
        },
        {
          value: 2,
          label: "已采样",
        },
        {
          value: 21,
          label: "已送检",
        },
        {
          value: 22,
          label: "已签收",
        },
        {
          value: 25,
          label: "已接收",
        },
        {
          value: 27,
          label: "已上机",
        },
        {
          value: 5,
          label: "样本失效",
        },
        {
          value: 3,
          label: "已完成",
        },
      ],
      activeIndex: "",
      dataList: [],
      pageNo: 1,
      pageNum: 0,
      pageSize: 10,
      showPupInfo: {
        padding: "50",
      },
      diagnosePatientAdvice: {},
      loadingFlag: false,
      totalCount: 0,
      resultList: [],
      detectResultArray: [],
      scrollTop: 0,
      patientId: "",
      isLogin: null,
    };
  },
  onLoad(options) {
    if (options.nt == 1) {
      this.activeIndex = 3;
    }
    if (options.patientId) {
      this.patientId = options.patientId;
    }
    this.setCalender();
    this.setLoginStatus();
    this.init();
  },
  onShow() {
    this.setLoginStatus();
  },
  // 跳登录
  computed: {
    ...mapGetters(["isSubmitWechat"]),
  },
  methods: {
    ...mapMutations(["SET_SubmitWechat"]),
    setLoginStatus() {
      const isLogin = uni.getStorageSync("token") || null;
      this.isLogin = isLogin;
    },
    init() {
      this.pageNum = 0;
      this.dataList = [];
      this.getByOperator();
      this.getDetectResultEnum();
      this.fetchNameList();
      this.checkSubStatus();
    },
    setCalender() {
      const d = new Date();
      let year = d.getFullYear();
      let minYear = year;
      let month = d.getMonth() + 1;
      let minMonth = month;
      if (month < 6) {
        minYear -= 1;
        minMonth = 12 - (6 - month);
      }
      if (month > 6) {
        minMonth = month - 6;
        year += 1;
      }
      minMonth = minMonth < 10 ? `0${minMonth}` : minMonth;
      this.minDate = `${minYear}-${minMonth}-1`;
      this.maxDate = `${year}-12-31`;
      console.log(this.minDate, this.maxDate);
    },
    /*上拉加载的回调 */
    upCallback() {
      this.getByOperator();
    },
    goReportQuery() {
      uni.navigateTo({
        url: "/pages/health/report-query/index",
      });
    },
    showSelectTime() {
      this.timeShow = true;
      if (this.startTime) {
        this.defaultDateMultiple = this.defaultDateMultipleCopy;
        console.log(this.defaultDateMultiple);
      }
    },
    timeConfirm(e) {
      this.defaultDateMultipleCopy = e;
      this.startTime = e[0];
      this.endTime = e[e.length - 1];
      this.timeShow = false;
    },
    reset() {
      this.reportName = "";
      this.startTime = "";
      this.endTime = "";
      this.defaultDateMultiple = [];
      this.defaultDateMultipleCopy = [];
      this.detectResultArray = [];
    },
    closePopup() {
      this.dataList = [];
      this.pageNum = 0;
      this.isList = true;
      this.showPicker = false;
      this.getByOperator();
    },
    getDetectResultEnum() {
      getDetectResultEnum().then((res) => {
        if (res.code == "000000") {
          this.resultList = [{ code: 0, value: "未录入" }, ...res.data];
        }
      });
    },
    // 检测项目列表
    fetchNameList() {
      getHospitalReportNameList().then(({ data }) => {
        console.log("检测项目列表: ", data);
        this.columns = data;
      });
    },
    selectResult(item) {
      const index = this.detectResultArray.findIndex((v) => {
        return v == item.code;
      });
      if (index != -1) {
        this.detectResultArray.splice(index, 1);
      } else {
        this.detectResultArray.push(item.code);
      }
    },
    changConfirm(value) {
      console.log(value);
      if (this.reportName === value) return;
      this.reportName = value;
    },
    // 获取列表 方法
    getByOperator() {
      this.pageNum = this.pageNum + 1;
      uni.showLoading({ title: "加载中" });
      const data = {
        keyStr: "",
        reportName: this.reportName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.activeIndex,
        reportDateBegin: this.startTime,
        reportDateEnd: this.endTime,
        detectResultArray: this.detectResultArray,
        encryptedPatientId: this.patientId,
      };
      this.isList = false;
      getListByDoctor(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code == "000000" && res.data.reportLists) {
            if (this.pageNum === 1) {
              this.dataList = [];
            }
            if (this.pageNum === 1 && res.data.reportLists.length === 0) {
              this.isList = false;
              console.log("--------------------");
            }
            this.isList = true;
            this.dataList = [...this.dataList, ...res.data.reportLists];
            // this.dataList.concat(reportLists);
            this.dataList.forEach((v) => {
              v.sampleTime = this.happenTimeFun(v.sampleTime);
              v.reportDateTime = this.happenTimeFun(v.reportDateTime);
            });
            this.totalCount = res.data.totalCount;
            if (!res.data.reportLists.length) {
              this.$toast("没有更多了");
            }
          } else {
            this.isList = false;
          }
        })
        .catch(() => {
          //  请求失败,隐藏加载状态
          uni.hideLoading();
        });
    },
    downCallback() {
      return;
    },
    login() {
      const url = "/pages/health/myCheck/index";
      const isTabBar = "";
      uni.navigateTo({
        url: `/pages/login?redirectUrl=${url}&isTabBar=${isTabBar}&isBack=1`,
      });
    },
    scrolltolower() {},
    showPup() {},
    happenTimeFun(num) {
      if (!num) {
        return false;
      }
      //时间戳数据处理
      let date = new Date(num);

      //时间戳为10位需*1000，时间戳为13位的话不需乘1000

      let y = date.getFullYear();

      let MM = date.getMonth() + 1;

      MM = MM < 10 ? "0" + MM : MM; //月补0

      let d = date.getDate();

      d = d < 10 ? "0" + d : d; //天补0

      let h = date.getHours();

      h = h < 10 ? "0" + h : h; //小时补0

      let m = date.getMinutes();

      m = m < 10 ? "0" + m : m; //分钟补0

      // let s = date.getSeconds();

      // s = s < 10 ? "0" + s : s; //秒补0

      return y + "/" + MM + "/" + d + " " + h + ":" + m;
    },
    statusType(type) {
      const params = {
        1: "待采样",
        2: "已采样",
        21: "已送检",
        22: "已接收",
        3: "已完成",
        5: "样本失效",
      };
      return params[type];
    },
    tabChange(item, index) {
      if (this.loginAndRegister) {
        this.activeIndex = item.value;
        this.dataList = [];
        this.pageNum = 0;
        this.getByOperator();
      }
    },
    isToday(date) {
      return new Date(date).toDateString() === new Date().toDateString();
    },
    attendWechat() {
      const { subWechat } = this.isSubmitWechat;
      const that = this;
      detectionSubscribe().then((res) => {
        if (res.code == "000000") {
          const a = { ...that.isSubmitWechat, subMsg: true };
          that.SET_SubmitWechat(a);
          console.log("isSubmitWechat---", a, that.isSubmitWechat);
          if (!subWechat) {
            uni.navigateTo({
              url: `/pages/webview/index`,
            });
          } else {
            that.$toast("订阅成功");
          }
        }
      });
    },
  },
};
</script>
<style>
page {
  height: 100%;
  background: #f5f6f8;
}
</style>
<style lang="scss" scoped>
@import "./index.scss";
</style>
