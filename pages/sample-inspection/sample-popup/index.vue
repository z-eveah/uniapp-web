<template>
  <u-popup
    :show="show"
    round="22rpx"
    mode="bottom"
    :catch-move="true"
    @click-overlay="clickOverlay"
    @close="closePopup"
  >
    <view class="sample-popup">
      <view class="popup-title">
        {{ title }}
      </view>
      <view class="popup-content">
        <view class="lev-1">
          <view
            v-for="(levOne, index) in list"
            :key="index"
            :class="{
              'lev1-content': true,
              'check-content': isCheckLev1 == levOne.businessCategoryId,
              'default-check': index == 0 && isCheckLev1 == 0,
            }"
            @click="changeLev1(levOne)"
          >
            {{ levOne.categoryName }}
          </view>
        </view>
        <view class="lev-2">
          <u-checkbox-group
            v-model="lev2Result"
            shape="circle"
            placement="column"
            active-color="#00BDA5"
            icon-placement="right"
            @change="lev2Change"
          >
            <view v-for="lev2item in lev2List" :key="lev2item.goodsId" class="lev2-content">
              <u-checkbox
                :label-color="isCheckLev2.includes(lev2item.goodsId) ? '#00BDA5' : '#333333'"
                :name="lev2item.goodsId"
                :label="lev2item.checkName"
              >
              </u-checkbox>
            </view>
          </u-checkbox-group>
        </view>
      </view>
      <view class="popup-botm">
        <view class="btom-clear" @click="reset">
          <img src="https://test1-file.yunqueyi.com/image/png/common/20220704103944978.png" alt="" />
          <span class="btom-reset">重置</span>
        </view>
        <view shape="circle" type="primary" size="large" class="popup-btom-btn" @click="closePopup"> 确认 </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      show: false,
      title: "选项目",
      isCheckLev1: 0,
      isCheckLev2: [],
      lev2List: [],
      lev2Result: [],
      lev2Label: false,
      confirmList: [],
      checkAdress: {},
      isClickOverlay: false,
    };
  },
  created() {
    uni.removeStorageSync("sampleCheckedNum");
  },
  onShow() {},
  methods: {
    clickOverlay() {
      this.isClickOverlay = true;
      this.$emit(
        "confirm-project",
        0, // 一级选项
        [], // 选中的项目
        {} // 收件地址
      );
    },
    init() {
      if (this.list.length > 0) {
        this.lev2List = this.list[0].detectionItemList;
        this.isCheckLev1 = this.list[0].businessCategoryId;
        this.checkAdress = this.list[0].senderAddressDto; // 选中的地址
      } else {
        this.lev2List = [];
      }
    },
    openPopup(val) {
      this.show = val;
      const obj = uni.getStorageSync("confirmProject");
      if (obj) {
        this.list.forEach((v) => {
          if (v.businessCategoryId == obj.id) {
            this.changeLev1(v);
          }
        });
        this.isCheckLev1 = obj.id;
        this.isCheckLev2 = obj.list;
        this.lev2Result = obj.list;
      }
    },
    changeLev1(val) {
      console.log(val);
      console.log(this.list);
      this.lev2Result = []; // 清空之前选项
      this.isCheckLev2 = [];
      this.isCheckLev1 = val.businessCategoryId;
      this.checkAdress = val.senderAddressDto; // 选中的地址
      this.lev2List = val.detectionItemList; // 二级list
      uni.removeStorageSync("sampleCheckedNum");
    },
    lev2Change(val) {
      this.isClickOverlay = false;
      this.isCheckLev2 = val;
      uni.removeStorageSync("sampleCheckedNum");
    },
    reset() {
      this.lev2Result = []; // 清空选项
      this.isCheckLev2 = [];
      uni.removeStorageSync("sampleCheckedNum");
    },
    closePopup() {
      if (!this.isClickOverlay) {
        const confirmList = [];
        this.lev2List.forEach((subItem) => {
          this.isCheckLev2.forEach((item, index) => {
            if (subItem.goodsId == item) {
              confirmList[index] = subItem;
            }
          });
        });
        this.$emit(
          "confirm-project",
          this.isCheckLev1, // 一级选项
          confirmList, // 选中的项目
          this.checkAdress // 收件地址
        );
        uni.setStorageSync("confirmProject", { id: this.isCheckLev1, list: this.isCheckLev2 });
      } else {
        this.isCheckLev2 = [];
        this.reset();
        uni.setStorageSync("confirmProject", null);
      }

      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
