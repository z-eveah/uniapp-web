<template>
  <view class="flex flex-wrap justify-center">
    <view class="pt-29 pr-24 pb-0 pl-24 flex flex-wrap justify-center bg-green-light bg-green-gradient">
      <view class="w-full px-30 py-36 h-286 font-p-medium bg-white rounded-22">
        <view v-if="detectionResult != 2" class="h-40 flex justify-between leading-4">
          <view class="text-36 first:ml-200">上传检测结果图片</view>
          <!-- <view class="text-blue text-28 font-p-regular" @click="setExampleImagePreview">示例图</view> -->
        </view>
        <view class="mt-40 flex">
          <view v-if="reportList.length < 3" class="w-170 h-170 mr-20 ml-30 relative" @click="chooseReportImageToSend">
            <image class="w-full h-full rounded-22" :src="dimg" alt=""></image>
          </view>
          <view v-for="(item, ind) in reportList" :key="ind" :class="className">
            <image class="w-170 h-170 rounded-22" :src="item" @click="setExampleImagePreview3(item)"></image>
            <image
              class="absolute -top-6 -right-10 w-40 h-40"
              src="https://files.yunqueyi.com/icon/2022/clear.png"
              mode=""
              @tap.stop="deleteReportImg(ind)"
            ></image>
          </view>
        </view>
      </view>
      <view
        class="w-full h-95 pt-30 pr-36 pb-33 pl-36 mt-32 flex flex-wrap bg-white border border-solid border-blue-light rounded-22"
      >
        <view class="mb-24 flex flex-wrap">
          <view class="w-122 h-40 text-grey-light text-28 font-p-regular text-justify leading-4 tracking-wide"
            >受检人
          </view>
          <view class="h-40 text-28 leading-4 text-black-light font-p-medium font-medium">
            <text>{{ testInfo.name }}</text>
            <text class="mr-32 ml-37">{{ testInfo.sex }}</text>
            <text>{{ testInfo.age }}</text>
          </view>
        </view>
        <view>
          <text class="mr-20 w-122 h-40 text-grey-light text-28 font-p-regular text-justify leading-4">检测名称 </text>
          <text class="h-40 text-28 leading-4 text-black-light font-p-medium font-medium">{{ testInfo.testName }}</text>
        </view>
      </view>
    </view>
    <view
      class="mt-66 w-666 h-80 flex justify-center items-center text-32 text-white rounded-md bg-green font-medium font-p-medium"
      @click="handleSubmit"
      >提交</view
    >
  </view>
</template>

<script>
import { mapActions } from "vuex";
import { UPLOAD_TYPE } from "@/configs/consts";
import { getOrderInfo, chronicUploadCheck } from "@/api/detection";
import { qiniuResourceUrl } from "@/service/getBaseUrl";

export default {
  components: {},
  data() {
    return {
      dimg: "https://files.yunqueyi.com/image/png/common/20230612144118992.png",
      reportList: [],
      yunOrderNo: "",
      tradeDetectionServiceRecordId: 0,
      detectionKind: 0, // detectionKind 0是早筛 1是快检 2是普通检测
      testInfo: {
        sex: "",
        age: "",
        name: "",
        testName: "",
      },
    };
  },
  onShow() {},
  onLoad(options) {
    const { yunOrderNo } = options;
    this.yunOrderNo = yunOrderNo;
    this.getOrderInfo(yunOrderNo);
  },
  computed: {
    className() {
      return this.reportList.length === 3 ? "w-170 h-170 mr-20 relative wrapper" : "w-170 h-170 mr-20 relative";
    },
  },
  methods: {
    ...mapActions(["loadFileToQiniu"]),
    toPageDownload(url) {
      uni.navigateTo({
        url,
      });
    },
    handleSubmit() {
      if (this.reportList.length === 0) {
        return this.$toast("请上传检测结果");
      }
      const pics = this.reportList.map((url) => ({ url, type: UPLOAD_TYPE.picture }));
      const data = {
        pics,
        yunOrderNo: this.yunOrderNo,
        detectionKind: this.detectionKind,
        id: this.tradeDetectionServiceRecordId,
      };
      console.log("data", data);
      chronicUploadCheck(data)
        .then((res) => {
          uni.redirectTo({
            url: `/pagesDetection/detection-regist-success/index?yunOrderNo=${this.yunOrderNo}`,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOrderInfo(yunOrderNo) {
      getOrderInfo({ yunOrderNo }).then((res) => {
        console.log("orderInfo", res);
        let { code, data, message } = res;
        if (code == "000000") {
          this.detectionKind = data.detectionKind;
          this.tradeDetectionServiceRecordId = data.tradeDetectionServiceRecordId;
          this.testInfo = {
            sex: data.beneficiarySex || "--",
            age: `${data.beneficiaryAge}岁` || "--",
            name: data.beneficiaryName || "--",
            testName: data.detectionName || "--",
          };
        } else {
          this.$toast(message || "操作失败");
        }
      });
    },
    chooseReportImageToSend() {
      if (this.reportList && this.reportList.length >= 3) {
        return false;
      }
      let self = this;
      self.currentEditImg = "reportList";
      const s = this.reportList.length;
      let maxCount = Number(3 - s);
      uni.chooseImage({
        count: maxCount,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: async function (res) {
          console.log("res----", res);
          let tempFilePaths = res.tempFilePaths;
          self.count = tempFilePaths.length;
          for (let index = 0; index < self.count; index++) {
            // self.getQiniuToken(res.tempFilePaths[index], index);
            const o = {
              tempFilePaths: res.tempFilePaths[index],
            };
            const f = await self.loadFileToQiniu(o);
            let data = JSON.parse(f.data);
            let baseUrl = qiniuResourceUrl + "/" + data.key;
            console.log("--f", baseUrl);
            // const urlArr = JSON.parse(JSON.stringify(self.reportList));
            // urlArr.push(baseUrl);
            self.reportList.push(baseUrl);
          }
        },
      });
    },
    setExampleImagePreview3(item) {
      if (item) {
        uni.previewImage({
          urls: [item],
          current: 0,
        });
      }
    },
    deleteReportImg(ind) {
      let _this = this;
      const urlArr = JSON.parse(JSON.stringify(_this.reportList));
      urlArr.splice(ind, 1);
      _this.reportList = urlArr;
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  &:first-child {
    margin-left: 10px;
  }
}
</style>
