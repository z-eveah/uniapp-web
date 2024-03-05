<script src="../../mixins/index.js"></script>
<template>
  <view class="page-appointment-list">
    <view v-if="loginAndRegister">
      <u-sticky>
        <view class="m-header">
          <view class="m-search-box">
            <view class="m-search">
              <u-input
                v-model="content"
                placeholder="搜索姓名/手机号/身份证号"
                shape="circle"
                prefix-icon="search"
                :clearable="false"
                @confirm="handleSearch"
              >
                <template #suffix>
                  <view v-if="content" class="m-search-suffix" @click="handlecClear">
                    <u-icon name="close-circle" size="18" color="#606266" @click="handlecClear"></u-icon>
                  </view>
                </template>
              </u-input>
            </view>
            <view ref="searchBtn" class="m-date" @click="handleSearch">
              <text class="u-text">搜索</text>
            </view>
            <view class="m-date">
              <view v-if="date" class="m-date-select" @click="handleSelectDate(false)">
                <image src="../../static/images/icon-date-active.png" class="u-icon"></image>
                <text class="u-value">已筛</text>
              </view>
              <view v-else class="m-date-select" @click="handleSelectDate(true)">
                <image src="../../static/images/icon-date.png" class="u-icon"></image>
                <text class="u-text">日期</text>
              </view>
            </view>
          </view>
          <u-line></u-line>
          <u-tabs
            :list="tabList"
            line-color="#00BDA5"
            item-style="flex-grow: 1; height: 44px;"
            :current="0"
            @click="handleTabClick"
          ></u-tabs>
        </view>
      </u-sticky>
      <view class="m-list">
        <view class="m-count">
          共 <text class="u-count-val">{{ total }}</text> 条预约信息
        </view>

        <view class="express-list-wrap">
          <mescroll-body
            ref="mescrollRef"
            bottom="150"
            height="100%"
            :down="downOption"
            :up="upOption"
            @init="mescrollInit"
            @down="downCallback"
            @up="upCallback"
          >
            <view v-if="list && list.length > 0" class="express-list-main">
              <view v-for="item in list" :key="item.yunOrderNo">
                <view class="m-list-item">
                  <view class="item-header">
                    <text class="item-title">{{ item.detectionName }}</text>
                    <text class="item-status">{{ item.appointmentStatusStr }}</text>
                  </view>
                  <u-line></u-line>
                  <view class="item-content">
                    <view class="m-item-info">
                      <text class="u-label">姓名:</text>
                      <text class="u-value">{{ item.beneficiaryName }}({{ item.beneficiarySex }})</text>
                    </view>
                    <view class="m-item-info">
                      <text class="u-label">手机号:</text>
                      <text class="u-value">{{ item.beneficiaryPhone2 }}</text>
                    </view>
                    <view class="m-item-info">
                      <text class="u-label">{{ item.idTypeStr || "身份证号" }}:</text>
                      <text class="u-value">{{ item.beneficiaryIdNum2 }}</text>
                    </view>
                    <view class="m-item-info">
                      <text class="u-label">预约时间:</text>
                      <text class="u-value">{{ item.appointmentDate }} {{ item.appointmentTime }}</text>
                    </view>
                    <view v-if="item.appointmentStatus == 3 && item.submitResultFlag == 3" class="res-tips">
                      <u-icon name="info-circle" color="#FF4B33" size="12"></u-icon>首次检测结果无效,可重新检测
                    </view>
                  </view>
                  <!-- <view class="m-item-info">
                    <text class="u-label">{{ item.idTypeStr }}:</text>
                    <text class="u-value">{{ item.beneficiaryIdNum2 }}</text>
                  </view> -->
                  <view v-if="item.helpDetectionFlag == 1" class="detction-info u-flex">
                    <image
                      src="https://files.yunqueyi.com/image/png/common/20230726180902866.png"
                      mode="widthFix"
                      class="detction-info__icon"
                    />
                    <text>需现场为用户检测</text>
                  </view>
                  <view v-if="[1, 2].includes(item.appointmentStatus)" class="item-footer">
                    <view class="footer-btn">
                      <u-button text="重新预约" shape="circle" class="" @click="reAppointment(item)"></u-button>
                    </view>
                    <view class="footer-btn">
                      <u-button text="验证核销" shape="circle" color="#00BDA5" @click="checking(item)"></u-button>
                    </view>
                  </view>
                  <view
                    v-if="item.detectionType == 10 && item.statusCode == '0302' && item.verificationType == 4"
                    class="item-footer"
                  >
                    <view class="footer-btn">
                      <u-button
                        text="归还设备"
                        shape="circle"
                        color="#00BDA5"
                        @click="confirmReturnEquipment(item)"
                      ></u-button>
                    </view>
                  </view>
                  <view v-if="item.appointmentStatus == 3 && item.submitResultFlag == 3" class="item-footer">
                    <view class="footer-btn">
                      <u-button
                        text="重新检测"
                        shape="circle"
                        color="#00BDA5"
                        class=""
                        @click="reAppointment(item)"
                      ></u-button>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view v-else class="no-data">
              <image
                class="no-icon"
                src="https://files.yunqueyi.com/image/png/common/20220706171713336.png"
                alt=""
                srcset=""
              ></image>
              <text class="no-msg">暂无相关搜索结果</text>
            </view>
          </mescroll-body>
        </view>
      </view>
      <view class="appointment-bottom">
        <view class="bottom-btn" @click="scanCode"><u-icon name="scan" color="#fff" size="28"></u-icon>扫码核销</view>
      </view>
    </view>

    <view v-if="!isLogin" class="pt100">
      <LoginTip tip-text="登录查看预约信息" is-tab-bar="1" back-url="/pages/home/index" />
    </view>
    <u-popup :show="showModal" mode="center" closeable :safe-area-inset-bottom="false" @close="closeShowModal">
      <view class="showModal-content">
        <view class="showModal-content-title">请输入核销码</view>
        <u--input
          v-model="checkCode"
          class="showModal-content-input"
          placeholder="点击此处输入"
          input-align="center"
          border="surround"
        ></u--input>
        <view class="showModal-content-tips"> <text>*</text>请提示预约人查看手机短信或预约页面获取核销码 </view>
        <view class="showModal-content-btn" @click="codeCheckFun">确定</view>
      </view>
    </u-popup>
    <view>
      <u-modal
        :show="showReturnModal"
        title="确认"
        show-cancel-button="true"
        content="确认用户已归还设备？"
        confirm-text="确认"
        cancel-text="取消"
        confirm-color="#00BDA5FF"
        cancel-color="#212121FF"
        @cancel="showReturnModal = false"
        @confirm="handleConfirm"
      ></u-modal>
    </view>
    <view class="calendar-cont">
      <calendar
        ref="calendar"
        range
        :start-date="minDate"
        :end-date="maxDate"
        :insert="false"
        :clearDate="clearDate"
        @close="closeDate"
        @confirm="handleSelectDateConfirm"
      />
    </view>
    <!-- <uni-calendar ref="calendar" :insert="false" /> -->
    <!-- <uni-calendar ref="calendar" :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'" /> -->
    <!-- <u-calendar
      :show="selectDateShow"
      mode="range"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="defaultDate"
      color="#00BDA5"
      allow-same-day
      month-num="24"
      @close="handleSelectDateClose"
      @confirm="handleSelectDateConfirm"
    >
      <slot name="footer">
        <view class="u-calendar__confirm">
          <u-button shape="circle">1111</u-button>
        </view>
      </slot>
    </u-calendar> -->
    <time-popup ref="timePopup" @change="confirmHopeTime" />

    <!-- 扫码核销确认 -->
    <ScanAndVerify ref="scanRef" @done="toNextPage" />
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import timePopup from "./components/time-popup/index.vue";
import { getDoctorAppointmentList, appointment, codeCheck, returnEquipment } from "@/api/appointment.js";
import ScanAndVerify from "../components/ScanAndVerify.vue";
import Calendar from "@/components/uni-calendar/uni-calendar";

export default {
  components: {
    timePopup,
    ScanAndVerify,
    Calendar,
  },
  mixins: [MescrollMixin],
  data() {
    return {
      fromConfirm: false,
      clearDate: false,
      dateRangeSelect: [],
      downOption: {
        isLock: true,
      },
      upOption: {
        auto: false,
        empty: {
          use: false,
        },
        textNoMore: "暂无更多数据",
      },
      defaultDate: [],
      content: "",
      total: 0,
      // 0：全部；1待领取；2已超时；3已领取
      tabList: [
        { key: 0, name: "全部" },
        { key: 1, name: "待领取" },
        { key: 2, name: "已超时" },
        { key: 3, name: "已领取" },
      ],
      list: [],
      selectDateShow: false,
      date: false,
      minDate: "",
      maxDate: "",
      current: {},
      appointmentStatus: 0,
      checkCode: "",
      showModal: false,
      showReturnModal: false,
      appointmentTimeOfBegin: "",
      appointmentTimeOfEnd: "",
      pageSize: 10,
      pageNo: 1,
      mescroll: null,
      isLogin: null,
    };
  },
  onShow() {
    this.setLoginStatus();
  },
  onLoad() {
    this.setLoginStatus();
    const data = {
      appointmentStatus: this.appointmentStatus,
      appointmentTimeOfBegin: "",
      appointmentTimeOfEnd: "",
      content: this.content,
      pageNo: this.pageNo,
      pageSize: this.pageSize,
    };
    this.getDoctorAppointmentList(data);
    this.setDate();
  },
  methods: {
    setLoginStatus() {
      const isLogin = uni.getStorageSync("token") || null;
      this.isLogin = isLogin;
    },
    //  init mescroll
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // down 方法禁用了
    downCallback() {
      return false;
    },
    // 上拉加载
    upCallback(page) {
      console.log(page);
      this.pageNo = this.pageNo + 1;
      const data = {
        appointmentStatus: this.appointmentStatus,
        appointmentTimeOfBegin: this.appointmentTimeOfBegin,
        appointmentTimeOfEnd: this.appointmentTimeOfEnd,
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.getDoctorAppointmentList(data);
    },
    getDoctorAppointmentList(data) {
      getDoctorAppointmentList(data)
        .then((res) => {
          if (res.code === "000000") {
            console.log("getDoctorAppointmentList", res);
            if (this.pageNo == 1) {
              this.list = [];
            }
            this.total = res.data.total;
            this.list = [...this.list, ...res.data.appointmentListResp];
            const totalCount = res.data.total;
            const curPageLen = this.pageNo * this.pageSize;
            const hasNext = curPageLen <= totalCount;
            this.mescroll && this.mescroll.endSuccess(curPageLen, hasNext);
          } else {
            this.mescroll && this.mescroll.endSuccess(0, false);
          }
        })
        .catch(() => {
          this.dataList = [];
          this.mescroll && this.mescroll.endSuccess(0, false);
        });
    },
    setDate() {
      const current = new Date();
      const yy = current.getFullYear();
      const mm = current.getMonth() + 1;
      const dd = current.getDate();
      const startDate = `${yy}-${mm}-${dd}`;
      const endDate = `${yy}-${mm}-${dd}`;
      this.minDate = `2023-01-01`;
      this.maxDate = `${yy + 1}-12-31`;
      this.appointmentTimeOfBegin = "";
      this.appointmentTimeOfEnd = "";
      this.defaultDate = [startDate, endDate];
    },
    handleSearch(val) {
      console.log(val);
      this.pageNo = 1;
      const data = {
        appointmentStatus: this.appointmentStatus,
        appointmentTimeOfBegin: this.appointmentTimeOfBegin,
        appointmentTimeOfEnd: this.appointmentTimeOfEnd,
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.list = [];
      this.getDoctorAppointmentList(data);
    },
    handleTabClick(item) {
      this.pageNo = 1;
      this.appointmentStatus = item.key;
      const data = {
        appointmentStatus: this.appointmentStatus,
        appointmentTimeOfBegin: this.appointmentTimeOfBegin,
        appointmentTimeOfEnd: this.appointmentTimeOfEnd,
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.list = [];
      console.log("--data", data);
      this.getDoctorAppointmentList(data);
      console.log(item);
    },
    handleLoadMore() {
      this.pageNo = this.pageNo + 1;
      const data = {
        appointmentStatus: this.appointmentStatus,
        appointmentTimeOfBegin: this.appointmentTimeOfBegin,
        appointmentTimeOfEnd: this.appointmentTimeOfEnd,
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.getDoctorAppointmentList(data);
    },
    handleSelectDate(flag) {
      this.$refs.calendar.open();
      this.clearDate = false;
      // this.selectDateShow = true;
    },
    closeDate() {
      // confirm close都走close 区分一下
      if (this.fromConfirm) {
        this.fromConfirm = false;
      } else {
        this.clearDate = true;
        this.appointmentTimeOfBegin = "";
        this.appointmentTimeOfEnd = "";
        this.date = false;
      }

      const data = {
        appointmentStatus: this.appointmentStatus,
        appointmentTimeOfBegin: this.appointmentTimeOfBegin,
        appointmentTimeOfEnd: this.appointmentTimeOfEnd,
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.list = [];
      this.getDoctorAppointmentList(data);
    },
    handleSelectDateConfirm(val) {
      let { range } = val;
      let { before, after } = range;
      if (before > after) {
        [before, after] = [after, before];
      }
      this.dateRangeSelect = range.data.map((item) => {
        return {
          date: item,
        };
      });
      this.pageNo = 1;
      console.log(val);
      this.date = true;
      this.appointmentTimeOfBegin = before;
      this.appointmentTimeOfEnd = after;
      this.defaultDate = [this.appointmentTimeOfBegin, this.appointmentTimeOfEnd];
      const data = {
        appointmentStatus: this.appointmentStatus,
        appointmentTimeOfBegin: this.appointmentTimeOfBegin,
        appointmentTimeOfEnd: this.appointmentTimeOfEnd,
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.list = [];
      this.getDoctorAppointmentList(data);
      this.selectDateShow = false;
      this.fromConfirm = true;
    },
    handleSelectDateClose() {
      this.selectDateShow = false;
    },
    reAppointment(item) {
      console.log(",reAppointment", item);
      this.current = item;
      const data = {
        projectEquityNo: item.projectEquityNo,
        hospitalId: item.hospitalId,
      };
      this.$refs.timePopup.openPopup(data);
    },
    codeCheckFun() {
      if (!this.checkCode || this.checkCode == "") {
        uni.showToast({
          title: "请输入核销码",
          icon: "none",
        });
        return;
      }
      const { yunOrderNo } = this.current;
      const data = {
        // yunOrderNo: "PSZ2023061615360000083371407",
        yunOrderNo,
        verificationCode: this.checkCode,
      };
      codeCheck(data)
        .then((res) => {
          console.log(res);
          if (res.code === "000000" && res.data) {
            uni.showToast({
              title: "验证成功",
              icon: "none",
            });
            this.closeShowModal();
            this.toNextPage();
          } else {
            uni.showToast({
              title: "核销码错误",
              icon: "none",
            });
          }
        })
        .catch((err) => {
          if (err.code === "400004") {
            uni.showToast({
              title: err.message,
              icon: "none",
            });
            this.pageNo = 1;
            const data = {
              appointmentStatus: this.appointmentStatus,
              appointmentTimeOfBegin: this.appointmentTimeOfBegin,
              appointmentTimeOfEnd: this.appointmentTimeOfEnd,
              content: this.content,
              pageNo: this.pageNo,
              pageSize: this.pageSize,
            };
            this.getDoctorAppointmentList(data);
          }
        });
    },
    checking(item) {
      this.showModal = true;
      this.current = item;
    },
    // 扫码核销
    scanCode() {
      this.$refs.scanRef && this.$refs.scanRef.scanCode();
    },
    closeShowModal() {
      this.showModal = false;
      this.checkCode = "";
    },
    handlecClear() {
      this.content = "";
      this.pageNo = 1;
      const data = {
        appointmentStatus: this.appointmentStatus,
        appointmentTimeOfBegin: this.appointmentTimeOfBegin,
        appointmentTimeOfEnd: this.appointmentTimeOfEnd,
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.list = [];
      this.getDoctorAppointmentList(data);
    },
    confirmHopeTime(times) {
      console.log("yunOrderNo", this.current);
      const data = {
        appointmentTime: times.value,
        hospitalId: this.current.hospitalId,
        hospitalName: this.current.hospitalName,
        yunOrderNo: this.current.yunOrderNo,
        helpDetectionFlag: this.current.helpDetectionFlag,
      };
      appointment(data).then((res) => {
        console.log(res);
        if (res.code == "000000") {
          uni.showToast({
            title: "修改成功",
            icon: "none",
          });
          const data = {
            appointmentStatus: this.appointmentStatus,
            appointmentTimeOfBegin: "",
            appointmentTimeOfEnd: "",
            content: this.content,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          };
          // this.list = [];
          this.getDoctorAppointmentList(data);
        }
      });
    },
    appointmentStatusMap(i) {
      let r = false;
      if ([1, 2].includes(i.appointmentStatus)) {
        r = true;
      }
      if (i.appointmentStatus == 3 && i.submitResultFlag == 3) {
        r = true;
      }
      return r;
    },
    confirmReturnEquipment(item) {
      this.current = item;
      this.showReturnModal = true;
    },
    handleConfirm() {
      let that = this;
      uni.showLoading({
        title: "提交中",
        mask: true,
      });
      that.showReturnModal = false;
      returnEquipment({ yunOrderNo: this.current.yunOrderNo })
        .then((res) => {
          // 归还设备成功刷新列表
          const data = {
            appointmentStatus: that.appointmentStatus,
            appointmentTimeOfBegin: "",
            appointmentTimeOfEnd: "",
            content: that.content,
            pageNo: that.pageNo,
            pageSize: that.pageSize,
          };
          if (res.code === "000000") {
            that.getDoctorAppointmentList(data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    toNextPage(data) {
      const { verificationType, yunOrderNo } = data || this.current;
      // 扫描核销 verificationType 核销方式分类 0早筛类（甲基化） 1快检类（早早检） 2中医类 3慢病类 4心电衣类
      if (verificationType === 1 || verificationType === 2) {
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

<style lang="scss" scoped>
.page-appointment-list {
  position: relative;
  .m-header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #ffffff;
    .m-search-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10rpx 32rpx;

      .m-search {
        flex: 1;
      }

      .m-date {
        display: flex;
        align-items: center;
        flex-direction: row;
        padding-left: 28rpx;
        height: 70rpx;

        .m-date-select {
          display: flex;
          flex-direction: row;
          .u-icon {
            width: 30rpx;
            height: 30rpx;
            margin-right: 8rpx;
          }

          .u-text {
            font-size: 28rpx;
            font-weight: 500;
          }
          .u-value {
            font-size: 28rpx;
            font-weight: 500;
            color: #00bda5;
          }
        }
      }
    }
  }

  .m-list {
    height: calc(100vh - 424rpx);
    position: absolute;
    width: 100%;
    top: 174rpx;
    bottom: 181px;
    background-color: #f5f6f8;
    padding: 30rpx 0rpx 181rpx 0rpx;
    .m-count {
      padding: 0 30rpx 0 30rpx;
      margin-bottom: 20rpx;
      font-size: 28rpx;
      color: #999999;
      .u-count-val {
        color: #212121;
      }
    }
    .express-list-main {
      width: calc(100% - 60rpx);
      margin: 0 auto;
    }
    .express-list-wrap {
      height: 100%;
    }
    .m-list-item {
      padding: 30rpx;
      background-color: #ffffff;
      border-radius: 22rpx;
      margin-bottom: 22rpx;

      .item-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20rpx;
        .item-title {
          font-size: 28rpx;
          font-weight: 500;
          color: #212121;
        }
        .item-status {
          font-size: 24rpx;
          color: #00bda5;
        }
      }

      .item-content {
        padding: 20rpx 0;
        .m-item-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 20rpx 0;
          .u-label {
            font-size: 28rpx;
            color: #666666;
          }
          .u-value {
            flex-grow: 1;
            font-size: 28rpx;
            font-weight: 500;
            color: #212121;
            text-align: right;
          }
        }
      }

      .item-footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        .footer-btn {
          width: 156rpx;
          height: 66rpx;
          padding-left: 24rpx;
        }
      }
    }
    .res-tips {
      padding: 14rpx;
      background: #ffeeee;
      border-radius: 8rpx;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      color: #ff4b33;
    }
  }
}
.no-data {
  padding-top: 166rpx;
  padding-bottom: 166rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  background: #fff;
  border-radius: 22rpx;
  .no-icon {
    width: 486rpx;
    height: 252rpx;
  }
  .no-msg {
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 700;
    color: #212121;
    line-height: 50rpx;
  }
}
.appointment-bottom {
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 0;
  height: 181rpx;
  width: 100%;
  background: #f5f6f8;
}
.bottom-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 425rpx;
  height: 110rpx;
  background: #00bda5;
  box-shadow: 0px 10rpx 20rpx 0px rgba(0, 189, 165, 0.42), inset 0px 5rpx 25rpx 0px rgba(255, 255, 255, 0.64);
  border-radius: 55rpx;
  font-size: 36rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 110rpx;
}
.showModal-content {
  width: 590rpx;
  height: 446rpx;
  background: #ffffff;
  border-radius: 22rpx;
  .showModal-content-title {
    margin-top: 48rpx;
    margin-bottom: 28rpx;
    height: 52rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 52rpx;
    text-align: center;
  }
  .showModal-content-btn {
    margin: 0 auto;
    text-align: center;
    width: 494rpx;
    height: 77rpx;
    background: #00bda5;
    border-radius: 46rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 77rpx;
  }
}
/deep/ .mescroll-body {
  background-color: #f5f6f8;
}
/deep/ .u-input {
  width: 80%;
  margin: 0 auto 20rpx auto;
}
/deep/ .u-popup__content {
  border-radius: 22rpx;
}
/deep/ .u-button {
  height: 66rpx !important;
  line-height: 66rpx;
}
/deep/ .u-modal__content__text {
  text-align: center;
  color: #212121ff;
  font-size: 32rpx;
}
/deep/ .u-modal__button-group__wrapper {
  font-size: 36rpx;
}

/deep/ .u-modal__button-group__wrapper--confirm {
  font-weight: 500;
}

.showModal-content-tips {
  padding: 0 20px;
  line-height: 30rpx;
  color: #ff720c;
  font-size: 24rpx;
  margin-bottom: 50rpx;
  text {
    margin-right: 5rpx;
    color: #fb602d;
  }
}
.m-search {
  /deep/ .u-input {
    width: auto;
    margin: 0;
    position: relative;
  }
  .m-search-suffix {
    position: absolute;
    z-index: 999;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 69rpx;
  }
}
.detction-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 52rpx;
  margin-bottom: 40rpx;
  background-color: #fffbe7;
  color: #ff720c;
  &__icon {
    width: 24rpx;
    height: 24rpx;
    margin-right: 7rpx;
  }
}
.calendar-cont {
  /deep/ .uni-calendar__mask {
    z-index: 1000;
  }
  /deep/ .uni-calendar--fixed {
    z-index: 1001;
  }
  // /deep/ .uni-calendar-item--multiple {
  //   background-color: #00bda5;
  // }
  // /deep/ .uni-calendar-item--isDay-text {
  //   color: #00bda5;
  // }
  // /deep/ .uni-calendar-item--checked {
  //   background-color: #00bda5;
  //   color: #fff;
  // }
  // /deep/ .uni-calendar-item--isDay {
  //   // background-color: #00bda5;
  //   background-color: #00bda5;
  //   opacity: 0.8;
  //   color: #fff;
  // }
  // /deep/ .uni-calendar-item--after-checked {
  //   background-color: #00bda5;
  //   color: #fff;
  // }
}
</style>
