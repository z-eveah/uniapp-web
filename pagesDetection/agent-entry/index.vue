<template>
  <view class="add-examinate-wrap">
    <view class="add-examinate-main">
      <view class="examinate-msg">
        <view class="examinate-identification">
          <view class="identification-content" @click="getPhoto">
            <u-icon size="36rpx" name="https://files.yunqueyi.com/image/png/common/20230516135237983.png"></u-icon>
            <text class="text">拍照识别身份证</text>
          </view>
        </view>
        <u--form ref="uForm" :model="examinateForm" :label-style="labelStyle">
          <u-form-item :label-width="80" border-bottom :required="true" label="受检人" prop="name">
            <u--input v-model="examinateForm.name" border="none" :clearable="false" placeholder="请输入受检人姓名" />
            <view slot="right" class="clear-img-container" @click="clearInput('name')">
              <image
                v-if="examinateForm.name"
                class="clear-img"
                src="https://files.yunqueyi.com/icon/2022/clear.png"
              ></image>
            </view>
          </u-form-item>
          <u-form-item :label-width="80" border-bottom :required="true" label="身份证号" prop="idNo">
            <u--input
              v-model="examinateForm.idNo"
              border="none"
              type="idcard"
              placeholder="点击输入"
              :clearable="false"
            />
            <view slot="right" class="clear-img-container" @click="clearInput('idNo')">
              <image
                v-if="examinateForm.idNo"
                class="clear-img"
                src="https://files.yunqueyi.com/icon/2022/clear.png"
              ></image>
            </view>
          </u-form-item>
          <u-form-item :label-width="80" border-bottom label="手机号" :required="true" prop="mobilePhone">
            <u--input
              v-model="examinateForm.mobilePhone"
              border="none"
              type="number"
              :clearable="false"
              placeholder="该手机用于接收报告通知"
            />
            <view slot="right" class="clear-img-container" @click="clearInput('mobilePhone')">
              <image
                v-if="examinateForm.mobilePhone"
                class="clear-img"
                src="https://files.yunqueyi.com/icon/2022/clear.png"
              ></image>
            </view>
          </u-form-item>
          <u-form-item :label-width="80" border-bottom :required="true" label="身高" prop="height">
            <view @click="openHeightSelect">
              <text :class="{ defaultcolor: examinateForm.height == '请选择身高' }">{{ examinateForm.height }}</text>
              <u-picker
                :show="heightSelectStatus"
                title="身高"
                :default-index="selectedHeightArr"
                mode="single-column"
                :columns="heightList"
                confirm-color="#00bda5"
                @confirm="heightConfirm"
                @cancel="heightCancel"
              ></u-picker
            ></view>
            <view slot="right" class="clear-img-container">
              <view class="item-unit">cm</view>
            </view>
          </u-form-item>
          <u-form-item :label-width="80" border-bottom :required="true" label="体重" prop="weight">
            <view class="select-wrap" @click="openWeightSelect">
              <text :class="{ defaultcolor: examinateForm.weight == '请选择体重' }">{{ examinateForm.weight }}</text>
              <u-picker
                :show="weightSelectStatus"
                title="体重"
                :default-index="selectedWeightArr"
                confirm-color="#00bda5"
                :columns="weightList"
                @confirm="weightConfirm"
                @cancel="weightCancel"
              ></u-picker
            ></view>
            <view slot="right" class="clear-img-container">
              <view class="item-unit">kg</view>
            </view>
          </u-form-item>
        </u--form>
      </view>
    </view>
    <view class="footer-wrap">
      <view class="btn-wrap">
        <view class="btn" :class="{ active: isSubmit }" @click="submit"> 保存并提交 </view>
      </view>
    </view>
    <!-- <view v-if="isLoading" class="loading-mask">
      <u-loading-icon color="#ffffff"></u-loading-icon>
    </view> -->
  </view>
</template>

<script>
import { ocrIdCard, savePatient } from "@/api/detection.js";
import { getHeightRange, getWeightRange } from "../constant";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      // isLoading: false,
      heightSelectStatus: false,
      weightSelectStatus: false,
      selectedHeightArr: [],
      selectedWeightArr: [],
      heightList: [],
      weightList: [],
      examinateForm: {
        name: "",
        mobilePhone: "",
        idNo: "",
        weight: "请选择体重",
        height: "请选择身高",
      },
      examinateRules: {
        name: [
          {
            min: 2,
            max: 20,
            message: "受检人姓名请填写2-20位",
            trigger: ["blur"],
          },
          {
            pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
            transform(value) {
              return String(value);
            },
            message: "请填写正确的受检人姓名",
            trigger: ["blur", "change"],
          },
        ],
        mobilePhone: [
          {
            pattern: /^([1][3,4,5,6,7,8,9])\d{9}$/,
            message: "请填写正确的手机号",
            trigger: ["blur"],
          },
        ],
        idNo: [
          {
            message: "请填写正确的身份证",
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              return this.validatorValue(value);
            },
          },
        ],
      },
      labelStyle: {
        color: "#212121",
        "font-size": "28rpx",
      },
      hospitalId: "",
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isSubmit() {
      const { mobilePhone, idNo, name, height, weight } = this.examinateForm;
      if (
        mobilePhone.length > 0 &&
        idNo.length > 0 &&
        name.length > 0 &&
        height != "请选择身高" &&
        weight != "请选择体重"
      ) {
        return true;
      } else {
        return false;
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getSelectedHeightArr() {
      let { height } = this.examinateForm;
      let { heightList } = this;
      let [arr] = heightList;
      if (height == "请选择身高") height = 160;
      let index = arr?.findIndex((item) => item == height);
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.selectedHeightArr = [index];
    },

    // eslint-disable-next-line vue/return-in-computed-property
    getSelectedWeightArr() {
      let { weight } = this.examinateForm;
      let { weightList } = this;
      let [arr] = weightList;
      if (weight == "请选择体重") weight = 50;
      let index = arr?.findIndex((item) => item == weight);
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.selectedWeightArr = [index];
    },
  },
  onReady() {
    this.$refs.uForm.setRules(this.examinateRules);
  },
  onShow() {},
  onLoad(options) {
    this.heightList = getHeightRange();
    this.weightList = getWeightRange();
    this.hospitalId = options?.hospitalId;
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    init() {},
    // 校验身份证号码 或手机号
    validatorValue(val) {
      if (this.examinateForm.idNo == "") {
        return true;
      }
      const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return regIdCard.test(this.examinateForm.idNo);
    },

    async submit() {
      if (!this.isSubmit) return;
      wx.showLoading({
        title: "加载中...",
      });
      this.$refs.uForm
        .validate()
        .then(async (result) => {
          if (!result) {
            return;
          }
          let { name, idNo, mobilePhone, height, weight } = this.examinateForm;
          let params = {
            patientName: name,
            idCard: idNo,
            patientMobilePhone: mobilePhone,
            height,
            weight: weight * 1000,
            doctorId: 0,
          };
          let {
            code,
            message,
            data: { encryptedPatientId },
          } = await savePatient(params);
          if (code == "000000") {
            wx.hideLoading();
            uni.redirectTo({
              url: `/pagesDetection/binding-code/index?hospitalId=${this.hospitalId}&patientId=${encryptedPatientId}`,
            });
          } else {
            this.$toast(message);
          }
        })
        .catch((err) => {
          this.$toast(err[0].message || "请输入正确信息");
        });
    },

    clearInput(type) {
      this.examinateForm[type] = "";
    },

    openHeightSelect() {
      this.heightSelectStatus = true;
    },
    openWeightSelect() {
      this.weightSelectStatus = true;
    },

    heightConfirm(e) {
      [this.examinateForm.height] = e.value;
      this.heightSelectStatus = false;
    },
    heightCancel() {
      this.heightSelectStatus = false;
    },
    weightConfirm(e) {
      [this.examinateForm.weight] = e.value;
      this.weightSelectStatus = false;
    },
    weightCancel() {
      this.weightSelectStatus = false;
    },
    async getPhoto() {
      let self = this;
      uni.chooseImage({
        sizeType: ["original", "compressed"],
        success: async function (res) {
          self.isLoading = true;
          let size = res.tempFiles[0].size;
          size = Number((size / 1024 / 1024).toFixed(1));
          let tempFilePaths = res.tempFilePaths[0];
          let imgSuffixNum = tempFilePaths.lastIndexOf(".");
          let imgSuffix = imgSuffixNum && tempFilePaths.substr(parseInt(imgSuffixNum) + 1);
          if (size > 5) {
            return uni.showToast({ title: "文件大小不能大于5M", icon: "none" });
          }
          const reg = RegExp(/(jpg|jpeg|bmp|png)/); // 判断是否是图片
          imgSuffix = imgSuffix.toLocaleLowerCase();
          if (!reg.test(imgSuffix)) {
            return uni.showToast({ title: "只可以上传jpg|jpeg|png格式的图片", icon: "none" });
          }
          const d = {
            cardSide: 1,
            file64Str: self.uploadBase64Img(tempFilePaths),
            name: tempFilePaths,
            uuid: uni.getStorageSync("unionId"),
          };
          let {
            code,
            data: { ocrCardDto, message },
          } = await ocrIdCard(d);
          if (code == "000000") {
            self.isLoading = false;
            if (ocrCardDto?.ocrStatus) {
              const k = JSON.parse(ocrCardDto?.wordsResult);
              self.examinateForm.idNo = k["公民身份号码"].words;
              self.examinateForm.name = k["姓名"].words;
            } else {
              self.$toast(ocrCardDto?.ocrMessage);
            }
          } else {
            self.$toast(message);
          }
        },
      });
    },

    uploadBase64Img(tempFilePaths) {
      let res = wx.getFileSystemManager().readFileSync(tempFilePaths, "base64");
      return res;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
