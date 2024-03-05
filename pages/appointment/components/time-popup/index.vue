<template>
  <u-popup :show="timeShow" :close-on-click-overlay="true" round="22rpx" mode="bottom" height="700" @close="closePopup">
    <view class="time-popup">
      <view class="popup-title"> 预约时间 </view>
      <view class="popup-time">
        <view class="time-lev1">
          <scroll-view scroll-y="true" style="height: 600rpx">
            <view
              v-for="(item, index) in sendTime"
              :key="index"
              :class="{
                'time-label': true,
                'time-label-checked': currentItem.appointmentDate == item.appointmentDate,
              }"
              @click="selectTime(item.appointmentDate, item)"
            >
              {{ item.appointmentDate }}
            </view>
          </scroll-view>
        </view>
        <view class="time-lev2">
          <view
            v-show="currentItem.amTimeBegin != '' && currentItem.amTimeEnd != ''"
            class="text time-val"
            :class="selectTimeBucket === currentItem.amTimeBegin ? 'time-val-checked' : ''"
            :style="currentItem.amAppointmentFlag ? '' : 'color:#212121'"
            @click="selectTimeB('am')"
          >
            {{ currentItem.amTimeContent || "" }}
          </view>
          <view
            v-if="currentItem.pmTimeBegin != '' && currentItem.pmTimeEnd != ''"
            class="text time-val"
            :class="selectTimeBucket === currentItem.pmTimeBegin ? 'time-val-checked' : ''"
            :style="currentItem.pmAppointmentFlag ? '' : 'color:#212121'"
            @click="selectTimeB('pm')"
          >
            {{ currentItem.pmTimeContent || "" }}
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { getScheduling } from "@/api/appointment.js";
export default {
  data() {
    return {
      timeShow: false,
      currentItem: {},
      currentItemChoosed: {},
      sendTime: [],
    };
  },
  created() {},
  methods: {
    openPopup(data) {
      console.log(data);
      this.timeShow = true;
      this.getScheduling(data);
    },
    closePopup() {
      this.timeShow = false;
    },
    selectTime(selectTimes, item) {
      console.log(item);
      this.selectTimes = selectTimes;
      this.currentItem = item;
      this.selectTimeBucket = "";
      this.selectItem();
    },

    selectItem() {
      if (!this.selectTimes || !this.selectTimeBucket) {
        return;
      }
      this.timeShow = false;
      this.$emit("change", {
        value: this.selectTimes + " " + this.selectTimeBucket,
        currentItemChoosed: this.currentItemChoosed,
      });
    },
    selectTimeB(item) {
      // 约满禁止预约
      if (this.currentItem[item + "AppointmentFlag"]) {
        return;
      }
      this.selectTimeBucket = item === "am" ? this.currentItem["amTimeBegin"] : this.currentItem["pmTimeBegin"];
      this.currentItemChoosed = { ...this.currentItem, timeBucket: item };
      console.log("-selectTimeB", this.currentItem, this.currentItemChoosed);
      this.selectItem();
    },
    // 获取期望上门时间
    getScheduling(data) {
      console.log(data);
      getScheduling(data).then((res) => {
        console.log(res, "getSendHopeTime");
        if (res.code == "000000") {
          this.sendTime = res.data;
          this.lelv2List = this.sendTime[0].hopeTimeDtos;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.time-popup {
  height: 100%;
  .popup-title {
    height: 116rpx;
    text-align: center;
    line-height: 116rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #02120f;
    border-bottom: 1px solid #e7e8e7;
    position: sticky;
    top: 0;
    // background-color: #fff;
    z-index: 9;
  }
  .popup-time {
    display: flex;
    height: 100%;
    overflow: hidden;
    max-height: 610rpx;

    .time-lev1 {
      background-color: #f5f6f8;
      width: 35%;
      height: 100%;
      .time-label {
        height: 76rpx;
        padding-left: 34rpx;
        padding-top: 16rpx;
        box-sizing: border-box;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #02120f;
      }
      .time-label-checked {
        background-color: #fff;
      }
    }
    .time-lev2 {
      background-color: #fff;
      padding-top: 20rpx;
      overflow: auto;
      width: 65%;
      padding-bottom: 40rpx;
      .time-val {
        padding-left: 42rpx;
        box-sizing: border-box;
        height: 82rpx;
        line-height: 82rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
      .time-val-checked {
        color: #00bda5;
      }
    }
  }
}
</style>
