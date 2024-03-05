<template>
  <view class="sample-wrap">
    <view v-if="loginAndRegister" class="sample-wrap-content">
      <view class="sample-check-container" @click="goExpresDetail">
        <img src="https://test1-file.yunqueyi.com/image/png/common/20220704103216355.png" alt="" />
      </view>
      <view class="sample-info">
        <view class="sample-info-title"> 送检信息 </view>
        <view class="sample-info-content">
          <view class="ct-check-project">
            <view class="project-label"> 送检项目 </view>
            <view
              :class="{
                'project-tip': true,
              }"
              @click="openProjectPopup"
            >
              <view
                :class="{
                  'project-ct': checkProject,
                }"
              >
                {{ checkProject ? checkProject : "请选择" }}
              </view>
              <image
                class="left-arrow"
                src="https://test1-file.yunqueyi.com/image/png/common/20220705151523855.png"
                mode=""
              >
              </image>
            </view>
          </view>
          <view class="number-container">
            <view class="number-label"> 送检数量 </view>
            <view class="number-input">
              <input
                v-model="sampleNum"
                type="number"
                :readonly="!checkProject"
                placeholder-style="color: #999999"
                placeholderClass="input-placeholder-class"
                placeholder="请输入"
                border="none"
                maxlength="4"
                @click="showProjectTost"
                @input="projectBlur"
              />
            </view>
          </view>

          <view v-if="checkProject" class="sample-tip">
            <span>该检测项目今日共{{ allSampleNum }}份需要送检</span>
            <span @click="goSampleDetail"
              >查看详情
              <image
                class="sample-tip-left"
                src="https://test1-file.yunqueyi.com/image/png/common/20220713161001250.png"
                mode=""
              >
              </image>
            </span>
          </view>
          <view class="sample-temper">
            <view class="sample-temper-label"> 温控要求 </view>
            <view class="sample-temper-radio">
              <u-radio-group
                v-model="transportCondition"
                active-color="#00BDA5"
                direction="horizontal"
                class="temper-radio"
              >
                <view class="sample-temper-radio-c">
                  <u-radio
                    name="t0"
                    label-color="#212121"
                    label="常温"
                    :disabled="!checkProject"
                    @click="showProjectTost"
                  >
                  </u-radio>
                  <u-radio name="t3" label-color="#212121" label="2～8度" disabled @click="showProjectTost"></u-radio>
                </view>
              </u-radio-group>
            </view>
          </view>
        </view>
      </view>

      <view class="sample-address">
        <view class="express-address box">
          <view class="address-top">
            <view class="address-wrap">
              <view class="wrap-line" />
              <view class="address-left">
                <img src="https://test1-file.yunqueyi.com/image/png/common/20220704103544759.png" alt="" srcset="" />
              </view>
              <view class="address-right">
                <view class="address-main" @click="goAddressList">
                  <view class="address-txt">
                    <p class="address-name">
                      {{ mailingAddress.userName }}
                      {{ mailingAddress.mobilePhone }}
                    </p>
                    <p class="address-ad">
                      {{ getDetailAdress(mailingAddress) }}
                    </p>
                  </view>
                  <view class="edit-address">
                    <van-icon class="project-arrow" name="arrow" />
                  </view>
                </view>
              </view>
              <image
                class="left-arrow"
                src="https://test1-file.yunqueyi.com/image/png/common/20220705151523855.png"
                mode=""
              />
            </view>
            <view class="address-p p-top" />
          </view>
          <view class="address-bottm">
            <view class="address-p" />
            <view class="address-wrap">
              <view class="wrap-line" />
              <view class="address-left">
                <img src="https://test1-file.yunqueyi.com/image/png/common/20220704103446957.png" alt="" srcset="" />
              </view>
              <view class="address-right">
                <view v-if="JSON.stringify(receivAddress) == '{}'" class="address-tip"> 选择送检项目,自动获取 </view>
                <view v-else class="address-main">
                  <view class="address-txt">
                    <p class="address-name">
                      {{ receivAddress.userName }}
                      {{ receivAddress.mobilePhone }}
                    </p>
                    <p class="address-ad">
                      {{ getDetailAdress(receivAddress) }}
                    </p>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="sample-time" @click="openTimePopup">
        <view class="sample-time-r"> 期望上门时间 </view>
        <view class="sample-time-r">
          <view
            class="c999"
            :class="{
              'sample-time-text': showHopeTime,
            }"
          >
            {{ showHopeTime ? showHopeTime : "请选择" }}
          </view>

          <image
            class="left-arrow"
            src="https://test1-file.yunqueyi.com/image/png/common/20220705151523855.png"
            mode=""
          ></image>
        </view>
      </view>

      <view class="sample-notes">
        <view class="title"> 备注 </view>
        <u--textarea v-model="notes" border="none" maxlength="199" count placeholder="请输入备注"></u--textarea>
      </view>

      <view class="container-footer">
        <u-button
          shape="circle"
          type="primary"
          :loading="isSubmit"
          loading-mode="spinner"
          loading-text="提交"
          :color="isAllowSubmit ? '#00bda5' : '#d9d9d9'"
          @click="submitProject"
        >
          提交
        </u-button>
      </view>
    </view>
    <view v-if="!isLogin" class="pt20">
      <LoginTip tip-text="登录查看您的送检" back-url="/pages/sample-inspection/index" />
    </view>
    <sample-popup ref="projectPopup" :list="projectList" @confirm-project="confirmProject" />
    <time-popup ref="timePopup" :list="timeList" @confirmHopeTime="confirmHopeTime" />
    <u-popup
      :show="showPicker"
      :custom-style="{ width: '600rpx' }"
      mode="center"
      closeable
      round="11"
      @close="showPicker = false"
    >
      <view class="select-hosptial-up">
        <view class="title">
          <span>下单失败</span>
        </view>
        <view class="main">
          <view class="info"> 当前时段下单失败,可能是当地网点已暂停取件，您可以选择其它时段下单，或采取以下方案: </view>
          <view class="info"> 方案一:联系云鹊医工作人员。（内部人员请联系潘藤泽） </view>
          <view class="info"> 方案二: </view>
          <view class="info">
            1. 通过顺丰速运APP，顺丰速运+小程序，或访问顺丰速运官网www.sf-express.com进行服务网点查询
          </view>
          <view class="info"> 2. 获取服务网点联系方式后联系网点 </view>
          <view class="info"> 3. 与网点沟通,是否还能当天取件,若不能，能否送至站点进行揽收。 </view>
          <view class="info"> 4. 进行揽收或商定其它时间 </view>
          <view class="info orange"> 部分乡,镇,村预约截止时间可能较早,请提前和顺丰小哥取得联系,避免错过当日快递. </view>
          <!--          <u-icon class="icon-close" name="error" color="#e6a23c" size="12"></u-icon>-->
        </view>
        <view class="popup-botm">
          <view class="btom-ok" @click="closePopup"> 确认 </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import samplePopup from "./sample-popup/index.vue";
import timePopup from "./time-popup/index.vue";
import { mapGetters, mapMutations } from "vuex";
import {
  getSampleProject,
  getSampleList,
  getMailingAddress,
  submitProject,
  getUserInfo,
  getProjectNotes,
} from "@/api/sample.js";
export default {
  name: "SampleInspection",
  components: {
    samplePopup,
    timePopup,
  },
  data() {
    return {
      showLoading: false,
      checkProject: "", // 送检项目
      sampleNum: "", // 送检数量
      allSampleNum: "", // 全部样本数量
      transportCondition: "t0", // 温控
      showHopeTime: "", // 展示期望上门时间
      projectList: [], // 送检项目list
      hospitalId: "", // 机构id
      sampleList: [], // 查看样本（数量）
      receivAddress: {}, // 收件地址
      mailingAddress: {
        userNam: "",
        mobilePhone: "",
      }, // 寄件地址
      hoptTime: {}, // 期望上门时间
      businessCategoryId: "",
      detectionSendCheckList: [], // // 送检项目列表
      initCheckList: [], // 送检id(未勾选，默认全部)
      checkType: false, // 是否点击了查看详情
      doctorId: "",
      userMobile: "",
      isSubmit: false, // 已经提交
      notes: "", // 备注
      showPicker: false,
      isLogin: null,
    };
  },
  computed: {
    ...mapGetters(["expressInfo", "checkRecordidList", "expressChange", "sampelReduceNum"]),
    isAllowSubmit() {
      return this.checkProject && this.sampleNum && this.transportCondition && this.showHopeTime;
    },
  },
  watch: {
    expressChange: {
      handler(newval) {
        if (newval) {
          this.mailingAddress = this.expressInfo;
          this.setExpressChange(false);
        }
      },
      immediate: true,
    },
    sampelReduceNum: {
      handler(newval, oldVal) {
        console.log(newval, "传入的取消勾选的数量");
        console.log(oldVal, "之前传入的取消勾选数量");
        const checkNum = this.checkRecordidList.length; // 选中样本数量
        console.log(checkNum, "选中样本数量");
        const cancelNum = this.initCheckList.length - checkNum;
        console.log(cancelNum, "取消样本数量");
        console.log(this.sampleNum);
        // const num = Number(this.sampleNum) - Number(newval);
        // 如果取消勾选数量 = 0， 显示的数量 < 选中样本数量 显示的数量应=选中样本的数量
        // 如果取消勾选数量 = 0， 显示的数量 > 选中样本数量 显示的数量应不变
        // 修改了送检数量，第一次进去取消勾选后，第二次进去全选之后 需要加上之前取消的数量
        if (newval == 0 && this.sampleNum >= checkNum) {
          this.sampleNum = Number(this.sampleNum);
          return;
        } else if (newval == 0 && this.sampleNum < checkNum) {
          this.sampleNum = checkNum;
          return;
        } else {
          // 改动了送检数量 显示的数量 = 填写的数量 - 取消勾选（总样本数量-选中样本数量）&& (再次进去加上勾选回来的)
          if (this.sampleNum > this.initCheckList.length) {
            this.sampleNum = Number(this.sampleNum) + (Number(oldVal) - Number(newval));
            // this.sampleNum = this.sampleNum - cancelNum;
          } else {
            this.sampleNum = checkNum;
          }
        }
      },
    },
    checkProject: {
      handler(newval) {
        if (!newval) {
          this.transportCondition = "";
        }
      },
      immediate: true,
    },
  },
  onShow() {
    const isLogin = uni.getStorageSync("token") || null;
    this.isLogin = isLogin;
    this.getUserInfo();
  },
  methods: {
    ...mapMutations({
      setExpressInfo: "SET_EXPRESS_INFO",
      setExpressChange: "SET_EXPRESS_CHANGE",
    }),
    // 获取送检备注
    getProjectNotes(type = 16) {
      const parmas = {
        businessCategoryId: type,
      };
      getProjectNotes(parmas).then((res) => {
        console.log(res);
        if (res.code == "000000") {
          this.notes = res.data;
        }
      });
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.code == "000000") {
          this.hospitalId = res.data.hospitalId;
          this.doctorId = res.data.id;
          this.getSampleProject(this.hospitalId);
          this.getMailingAddress(this.doctorId);
        }
      });
    },
    goExpresDetail() {
      uni.navigateTo({
        url: `/pages/expressList/index?hospitalId=${this.hospitalId}`,
      });
    },
    projectBlur(val) {
      console.log(val);
      if (isNaN(val.detail.value)) {
        this.$nextTick(() => {
          this.$toast("只能输入数字！");
          this.sampleNum = val.detail.value.substr(0, val.detail.value.length - 1);
        });
        return;
      }
      if (val.detail.value > 9999) {
        this.$toast("检测数量输入范围1-9999");
        this.sampleNum = 9999;
        val.detail.value = 9999;
        return;
      }
      // 送检数量 < 选中的样本数量
      const checkSampleNum = this.checkType ? this.checkRecordidList : this.initCheckList;
      console.log(checkSampleNum);
      if (val.detail.value < checkSampleNum.length) {
        this.$toast("送检数量小于所选样本数据，请重新选择");
        return;
      }
    },
    // 打开选择项目弹窗
    openProjectPopup() {
      this.$refs.projectPopup.openPopup(true);
    },
    // 打开选择时间弹窗
    openTimePopup() {
      this.$refs.timePopup.openPopup(true);
    },
    // 修改地址
    editAdress() {
      uni.navigateTo({
        url: "/pages/change-address/index",
      });
    },
    goAddressList() {
      uni.navigateTo({
        url: `/pages/send-address-list/index?doctorId=${this.doctorId}&hospitalId=${this.hospitalId}`,
      });
    },
    // 获取项目
    getSampleProject(id) {
      getSampleProject(id).then((res) => {
        if (res.code == "000000") {
          this.projectList = res.data;
          setTimeout(() => {
            this.$refs.projectPopup.init();
          }, 0);
        }
      });
    },
    // 获取样本list数量
    getSampleList(data) {
      getSampleList(data).then((res) => {
        if (res.code == "000000") {
          this.checkType = false;
          this.sampleList = res.data;
          this.sampleNum = res.data.length > 0 ? res.data.length : ""; // 样本数量
          this.allSampleNum = res.data.length; // 一共多少个样本
          this.transportCondition = "t0";
          const checkIdList = [];
          res.data.forEach((item) => {
            checkIdList.push(item.id);
          });
          this.initCheckList = checkIdList; // 默认选中所有样本（所有样本id）
        }
      });
    },
    // 确认选择送检项目
    confirmProject(val, confirmList, checkAdress) {
      this.businessCategoryId = val; // 一级id
      this.receivAddress = checkAdress; // 收件地址
      this.detectionSendCheckList = confirmList; // 选中项目
      const sampelData = {}; // 获取项目详情入参
      sampelData.detectionItemList = confirmList;
      sampelData.hospitalId = this.hospitalId;
      uni.setStorageSync("sampelData", JSON.stringify(sampelData));
      const text = [];
      confirmList.forEach((item, index) => {
        text[index] = item.checkName;
      });
      // 送检项目 显示
      if (text.length > 0) {
        this.getSampleList(sampelData);
        const projectTxt = text.join("、");
        this.checkProject = projectTxt;
      } else {
        this.checkProject = "";
        this.sampleNum = "";
        this.receivAddress = {};
      }
      this.getProjectNotes(this.businessCategoryId);
    },
    showProjectTost() {
      if (!this.checkProject) {
        this.$toast("请选择送检项目");
      }
    },
    // 查看样本
    goSampleDetail() {
      uni.navigateTo({
        url: "/pages/sample-detail/index",
      });
      this.checkType = true;
    },
    // 获取寄件地址
    getMailingAddress(id) {
      const param = {
        bizType: 2,
        doctorId: id,
      };
      getMailingAddress(param).then((res) => {
        if (res.code == "000000") {
          this.mailingAddress = res.data;
          this.setExpressInfo(res.data);
        }
      });
    },
    // 详细地址拼接
    getDetailAdress(data) {
      const { provinceName, cityName, countyName, townName, address } = data;
      const text = `${provinceName}${cityName}${countyName}${townName}${address}`;
      return provinceName ? text : "";
    },
    // 确认期望上门时间显示
    confirmHopeTime(hoptTime) {
      this.hoptTime = hoptTime;
      if (hoptTime.lev2ID == 10) {
        this.showHopeTime = "今天 一小时内";
        this.hoptTime.hopeType = 0;
      } else {
        const endTime = hoptTime.hopeEndTime;
        const beginTimeTxt = hoptTime.hopeBeginTime.split(":").slice(0, 2).join(":");
        const endTimeTxt = endTime.split(":").slice(0, 2).join(":");
        const dayText = this.hoptTime.hopeType == 1 ? "今天 " : this.hoptTime.hopeType == 2 ? "明天 " : "后天 ";
        this.showHopeTime = `${dayText}${beginTimeTxt}-${endTimeTxt}`;
      }
    },
    // 提交数据
    submitProject() {
      // 送检数量 < 选中的样本数量
      let checkSampleNum = "";
      const sampleCheckedNum = uni.getStorageSync("sampleCheckedNum");
      if (sampleCheckedNum) {
        checkSampleNum = this.checkRecordidList;
      } else {
        checkSampleNum = this.initCheckList;
      }
      console.log(checkSampleNum, this.checkRecordidList, this.initCheckList);
      const reg =
        /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
      if (this.sampleNum == 0) {
        this.$toast("检测数量为0，请确认");
        return;
      }
      console.log(checkSampleNum);
      if (this.sampleNum < checkSampleNum.length) {
        this.$toast("送检数量小于所选样本数据，请重新选择");
        this.sampleNum = checkSampleNum.length;
        return;
      }
      if (reg.test(this.notes)) {
        this.$toast("备注不能包含表情！");
        return;
      }
      const data = {
        businessCategoryId: this.businessCategoryId, // 业务分类id
        channel: 1,
        detectionSendAddressIn: this.receivAddress, // 收件人信息
        detectionSendAddressOut: this.mailingAddress, // 送检人信息
        detectionSendCheckList: this.detectionSendCheckList, // 送检项目列表
        hopeBeginTime: this.hoptTime.hopeBeginTime, // 上门开始时间
        hopeEndTime: this.hoptTime.hopeEndTime, // 上门结束时间
        hopeType: this.hoptTime.hopeType,
        hospitalId: this.hospitalId,
        sendNum: this.sampleNum, // 送检数量
        tradeDetectionServiceRecordIdList: checkSampleNum, // 送检id
        transportCondition: this.transportCondition, // 温控
        notes: this.notes, // 备注
      };
      this.isSubmit = true;
      submitProject(data)
        .then((res) => {
          uni.removeStorageSync("confirmProject");
          if (res.code === "000000") {
            this.isSubmit = false;
            uni.navigateTo({
              url: `/pages/express-detail/index?sendLogId=${res.data}&type=inspection`,
            });
          }
          if (res.code === "900009") {
            this.showPicker = true;
          }
          // 900009
        })
        .catch((res) => {
          this.isSubmit = false;
          if (res.code === "900009") {
            this.showPicker = true;
          } else {
            if (res.code == "500001") {
            }
            uni.navigateTo({
              url: `/pages/express-detail/index?loseMessage=${res.message}&type=inspection`,
            });
          }
        });
    },
    closePopup() {
      this.showPicker = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
