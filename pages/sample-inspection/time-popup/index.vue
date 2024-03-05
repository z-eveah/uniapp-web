<template>
  <u-popup
    :show="timeShow"
    :close-on-click-overlay="true"
    round="22rpx"
    mode="bottom"
    :custom-style="{ height: '728rpx', flex: 'none' }"
    @close="closePopup"
  >
    <view class="time-popup">
      <view class="popup-title"> 期望上门时间 </view>
      <view class="popup-time">
        <view class="time-lev1">
          <view
            v-for="(item, index) in sendTime"
            :key="index"
            :class="{
              'time-label': true,
              'time-label-checked': isCheckLev1 == item.hopeType,
            }"
            @click="changeLev1(item)"
          >
            {{ getHopeType(item.hopeType) }}
          </view>
        </view>
        <view class="time-lev2">
          <view
            v-for="(item, index) in lelv2List"
            :key="index"
            :class="{
              'time-val': true,
              'time-val-checked': isCheckLev2 == item.id,
            }"
            @click="changeLev2(item, index)"
          >
            <text v-if="isCheckLev1 == 1 && item.id == 10">一小时内</text>
            <text v-else>
              {{ showTimeTxt(item.hopeBeginTime, item.hopeEndTime) }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { getSendHopeTime } from "@/api/sample.js";
export default {
  data() {
    return {
      timeShow: false,
      isCheckLev1: 1,
      isCheckLev2: 1,
      lelv2List: [],
      sendTime: [],
      hopeBeginTime: "",
      hopeEndTime: "",
      isChoice: false,
    };
  },
  created() {
    this.getSendHopeTime();
  },
  methods: {
    showTimeTxt(beginTime, endTime) {
      beginTime = beginTime.split(":").slice(0, 2).join(":");
      endTime = endTime.split(":").slice(0, 2).join(":");
      return `${beginTime} - ${endTime}`;
    },
    openPopup(val) {
      this.timeShow = val;
    },
    closePopup() {
      const hoptTime = {
        hopeType: this.isCheckLev1, // 一级
        hopeBeginTime: this.hopeBeginTime, // 开始时间
        hopeEndTime: this.hopeEndTime, // 结束时间
        // isCheckText: this.isCheckText, // 是否选了一小时内
        lev2ID: this.isCheckLev2, // 选中的id
      };
      if (this.isChoice) {
        this.$emit("confirmHopeTime", hoptTime);
        this.isChoice = false;
      }
      this.timeShow = false;
    },
    changeLev1(val) {
      this.isCheckLev1 = val.hopeType;
      this.lelv2List = val.hopeTimeDtos;
    },
    changeLev2(val) {
      this.isChoice = true;
      this.isCheckLev2 = val.id;
      this.hopeBeginTime = val.hopeBeginTime;
      this.hopeEndTime = val.hopeEndTime;
      this.timeShow = false;
      this.closePopup();
    },
    getHopeType(type) {
      let text = "";
      if (type == 1) {
        text = "今天";
      } else if (type == 2) {
        text = "明天";
      } else {
        text = "后天";
      }
      return text;
    },
    // 获取期望上门时间
    getSendHopeTime() {
      getSendHopeTime().then((res) => {
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
@import "./index.scss";
</style>
