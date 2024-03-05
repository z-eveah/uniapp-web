<template>
  <view :class="{ 'sample-detail-wrap': true }">
    <view v-if="sampleList.length == 0" class="no-data">
      <img class="no-icon" src="~@/static/images/no-list.png" alt="" />
      <p class="no-msg">暂无需送检样本</p>
    </view>
    <section v-if="sampleList.length > 0" class="sample-detail-title">
      <view>
        共 <span class="num">{{ sampleNum }}</span> 个样本，已勾选 <span class="num">{{ checkedNum }}</span> 个
      </view>
    </section>
    <section>
      <u-checkbox-group ref="checkSampleGroup" v-model="checked" placement="column" @change="sampleChange">
        <view v-for="(item, index) in sampleList" :key="index" class="sample-detail-content">
          <view class="check-num">
            <view>检测编号：{{ item.recordNo }}</view>
            <u-checkbox ref="checkboxes" active-color="#00BDA5" :name="item.id" shape="circle" />
          </view>
          <view class="check-info">
            <view class="check-label">受检人：</view>
            <view class="check-detail">
              {{ item.patientName }}
            </view>
          </view>
          <view class="check-info">
            <view class="check-label">检测名称：</view>
            <view class="check-detail">
              {{ item.checkName }}
            </view>
          </view>
          <view class="check-info">
            <view class="check-label">检测时间：</view>
            <view class="check-detail">
              {{ item.sampleTime }}
            </view>
          </view>
          <view class="check-info">
            <view class="check-label">采样条形码：</view>
            <view class="check-detail">
              {{ item.sampleCode }}
            </view>
          </view>
        </view>
      </u-checkbox-group>
    </section>
  </view>
</template>

<script>
import { getSampleList } from "@/api/sample.js";
import { mapMutations } from "vuex";
export default {
  name: "SampleDetail",
  data() {
    return {
      showLoading: false,
      checked: [],
      sampleList: [],
      sampleNum: 0, // 总共数量
      checkedNum: 0, // 选中的数量
      reduceNum: 0, // 取消勾选的数量
      sampelData: {},
    };
  },
  onShow() {
    const data = uni.getStorageSync("sampelData");
    this.sampelData = JSON.parse(data);
    this.getSampleList();
  },
  onUnload() {
    this.setSampleReduceNum(this.reduceNum);
    console.log(111, this.reduceNum);
  },
  methods: {
    ...mapMutations({
      setCheckRecoreidList: "SET_CHECK_RECORDID_LIST",
      setSampleReduceNum: "SET_SAMPLE_REDUCE_NUM",
    }),
    getSampleList() {
      this.showLoading = true;
      getSampleList(this.sampelData).then((res) => {
        if (res.code == "000000") {
          this.showLoading = false;
          this.sampleList = res.data || [];
          this.sampleNum = res.data.length;
          this.$nextTick(() => {
            const sampleCheckedNum = uni.getStorageSync("sampleCheckedNum");
            if (sampleCheckedNum) {
              this.checked = JSON.parse(sampleCheckedNum);
            } else {
              this.sampleList.forEach((v) => {
                this.checked.push(v.id);
              });
            }
            this.checkedNum = this.checked.length;
          });
        }
      });
    },
    sampleChange(val) {
      this.checkedNum = val.length;
      console.log(val, "0000");
      uni.setStorageSync("sampleCheckedNum", JSON.stringify(val));
      this.reduceNum = Number(this.sampleNum) - Number(this.checkedNum);
      this.setCheckRecoreidList(val);
    },
    selfGoBack() {
      this.setSampleReduceNum(this.reduceNum);
      console.log(222);
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
