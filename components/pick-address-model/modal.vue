<template>
  <view class="mpvue-picker">
    <view class="pickerMask" catchtouchmove="true" @click="maskClick"></view>
    <view class="mpvue-picker-content mpvue-picker-view-show">
      <!-- <view class="header-title">
        <view>选择地区</view>
        <view class="icon" @click="pickerCancel">
          <u-icon name="close" color="#AAAAAA" size="16"></u-icon>
        </view>
      </view> -->
      <view class="mpvue-picker__hd" catchtouchmove="true">
        <view class="mpvue-picker__action" @click="pickerCancel">取消</view>
        <view class="mpvue-picker__action mpvue-sure" @click="pickerConfirm">确定</view>
      </view>
      <view class="area-tabs">
        <view class="tab-item" @click="tabClick(0)">{{ curProviceName ? curProviceName : "请选择省份" }}</view>
        <view class="tab-item" @click="tabClick(1)">{{ curCityName ? curCityName : "请选择市" }}</view>
        <view class="tab-item" @click="tabClick(2)">{{ curAreaName ? curAreaName : "请选择区/县" }}</view>
        <view class="tab-item mr0" @click="tabClick(3)">{{ curTownName ? curTownName : "请选择城镇" }}</view>
      </view>
      <view class="mpvue-menus">
        <view v-if="curTab == 0" class="area-box">
          <scroll-view scroll-y="true" class="provice-scroll-Y">
            <view
              v-for="(item, index) in provinceDataList"
              :key="index"
              class="area-item"
              :class="{ cur: curProviceId == item.provinceId }"
              @click="setClick(item, 0)"
            >
              {{ item.provinceName }}<image v-if="curProviceId == item.provinceId" :src="iconImg" class="img"></image>
            </view>
          </scroll-view>
        </view>
        <view v-if="curTab == 1" class="area-box">
          <scroll-view scroll-y="true" class="provice-scroll-Y">
            <view
              v-for="(item, index) in cityDataList"
              :key="index"
              class="area-item"
              :class="{ cur: curCityId == item.cityId }"
              @click="setClick(item, 1)"
            >
              {{ item.cityName }}<image v-if="curCityId == item.cityId" :src="iconImg" class="img"></image>
            </view>
          </scroll-view>
        </view>
        <view v-if="curTab == 2" class="area-box">
          <scroll-view scroll-y="true" class="provice-scroll-Y">
            <view
              v-for="(item, index) in areaDataList"
              :key="index"
              class="area-item"
              :class="{ cur: curAreaId == item.countyId }"
              @click="setClick(item, 2)"
            >
              {{ item.countyName }}<image v-if="curAreaId == item.countyId" :src="iconImg" class="img"></image>
            </view>
          </scroll-view>
        </view>
        <view v-if="curTab == 3" class="area-box">
          <scroll-view scroll-y="true" class="provice-scroll-Y">
            <view
              v-for="(item, index) in townDataList"
              :key="index"
              class="area-item"
              :class="{ cur: curTownId == item.townId }"
              @click="setClick(item, 3)"
            >
              {{ item.townName }}<image v-if="curTownId == item.townId" :src="iconImg" class="img"></image>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getProvice, getCity, getArea, getTown } from "@/api/basicAddress.js";
export default {
  props: {
    defaultPick: {
      type: Object,
      default: () => {
        return { value: [], label: "" };
      },
    },
  },
  data() {
    return {
      pickerValue: [],
      provinceDataList: [],
      cityDataList: [],
      areaDataList: [],
      townDataList: [],
      showPicker: false,
      curProviceId: null,
      curCityId: null,
      curAreaId: null,
      curTownId: null,
      curProviceName: "",
      curCityName: "",
      curAreaName: "",
      curTownName: "",
      iconImg: "https://files.yunqueyi.com/image/png/common/20220720190223543.png",
      curTab: 0,
    };
  },
  created() {
    console.log(this.defaultPick);

    if (this.defaultPick.value.length == 0) {
      this.getProvice();
    } else {
      let names = this.defaultPick.label.split(" ");
      this.curProviceId = this.defaultPick.value[0];
      this.curCityId = this.defaultPick.value[1];
      this.curAreaId = this.defaultPick.value[2];
      this.curTownId = this.defaultPick.value[3];
      this.curProviceName = names[0];
      this.curCityName = names[1];
      this.curAreaName = names[2];
      this.curTownName = names[3];
      this.getProvice(this.curProviceId, true);
    }
  },
  onShow(options) {
    // this.getProvice()
  },
  methods: {
    //选择地区
    setClick(item, type) {
      if (type == 0) {
        this.curProviceId = item.provinceId;
        this.curProviceName = item.provinceName;
        this.curTab = 1;
        this.getCity(this.curProviceId);
      } else if (type == 1) {
        this.curCityId = item.cityId;
        this.curCityName = item.cityName;
        this.getArea(this.curCityId);
        this.curTab = 2;
      } else if (type == 2) {
        this.curAreaId = item.countyId;
        this.curAreaName = item.countyName;
        this.curTab = 3;
        this.getTown(item.countyId);
      } else if (type == 3) {
        this.curTownId = item.townId;
        this.curTownName = item.townName;
      }
    },

    //tab切换
    tabClick(index) {
      if (index == 0) {
        this.curAreaId = null;
        this.curAreaName = "";
        this.curCityId = null;
        this.curCityName = "";
        this.curTownId = null;
        this.curTownName = "";
        // this.getCity(this.curProviceId)
      } else if (index == 1) {
        this.curAreaId = null;
        this.curAreaName = "";
        this.curTownId = null;
        this.curTownName = "";
      } else if (index == 2) {
        this.curTownName = "";
        this.curTownId = null;
      }
      this.curTab = index;
    },

    //获取省份接口
    getProvice(provinceId, parm) {
      getProvice().then((res) => {
        this.provinceDataList = res.data.provinceList;
        if (parm) {
          this.getCity(this.curProviceId, parm);
        }
      });
    },

    //获取城市数据
    getCity(provinceId, parm) {
      getCity(provinceId).then((res) => {
        this.cityDataList = res.data.cityList;
        if (parm) {
          this.getArea(this.curCityId, parm);
        }
      });
    },

    //获取区域数据
    getArea(cityId, parm) {
      getArea(cityId).then((res) => {
        this.areaDataList = res.data.countyList;
        if (parm) {
          this.curTab = 2;
          this.getTown(this.curAreaId, true);
        }
      });
    },
    //获取城镇数据
    getTown(countyId, parm) {
      getTown(countyId).then((res) => {
        this.townDataList = res.data.townList;
        if (parm) {
          this.curTab = 3;
        }
      });
    },

    maskClick() {
      this.pickerCancel();
    },

    pickerCancel() {
      this.$emit("onCancel");
    },

    pickerConfirm(e) {
      if (this.curProviceName == "") {
        return this.$toast("请选择省份");
      }
      if (this.curCityName == "") {
        return this.$toast("请选择城市");
      }
      if (this.curAreaName == "") {
        return this.$toast("请选择区/县");
      }
      if (this.curTownName == "") {
        return this.$toast("请选择城镇");
      }
      let parm = {
        label: this.setLabelName(),
        value: [this.curProviceId, this.curCityId, this.curAreaId, this.curTownId],
      };
      this.$emit("onConfirm", parm);
    },

    setLabelName() {
      let pcikerLabel = this.curProviceName + " " + this.curCityName + " " + this.curAreaName + " " + this.curTownName;
      return pcikerLabel;
    },
  },
};
</script>

<style lang="scss" scoped>
.pickerMask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}
.header-title {
  padding-top: 44rpx;
  view {
    font-size: 36rpx;
    font-weight: 800;
  }
  background-color: #fff;
  color: #02120f;
  position: relative;
  text-align: center;
  .icon {
    position: absolute;
    right: 60rpx;
    top: 46rpx;
  }
}
.mpvue-picker-view-show {
  transform: translateY(0);
}
.mpvue-picker__hd {
  display: flex;
  padding: 20px 30px;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 17rpx;
}
.mpvue-menus {
  background: #fff;
}
.area-tabs {
  height: 80rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1rpx solid #f0f1f2;

  .tab-item {
    color: #333;
    font-weight: bold;
    margin-right: 20rpx;
    line-height: 40rpx;
    height: 40rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 230rpx;
    overflow: hidden;
  }
  .mr0 {
    margin-right: 0;
  }
}
.area-box {
}
.provice-scroll-Y {
  height: 360px;
  background: #fff;

  .area-item {
    margin: 0 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    // border-bottom: 1rpx solid #F0F1F2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .img {
      width: 23rpx;
      height: 17rpx;
    }
  }
  .cur {
    color: #00dba5;
  }
}
.mpvue-picker__hd:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.mpvue-picker__action {
  display: block;
  flex: 1;
  color: #00dba5;
  font-size: 16px;
}
.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}
.mpvue-picker__action:last-child {
  text-align: right;
}
.picker-item {
  text-align: center;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
}
</style>
