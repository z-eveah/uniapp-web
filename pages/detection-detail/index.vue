<template>
  <view class="d-box">
    <view class="title"></view>
    <view class="detail-box">
      <view class="status">
        <image
          v-if="waitIcon.indexOf(dataDetail.status) != -1"
          src="https://files.yunqueyi.com/image/png/common/20220816135321860.png"
          alt="wait"
          mode="aspectFill"
        />
        <image
          v-else-if="dataDetail.status == 5"
          src="https://files.yunqueyi.com/image/png/common/20220817141150961.png"
          alt="success"
          mode="aspectFill"
        />
        <image v-else src="https://files.yunqueyi.com/image/png/common/20220816135250298.png" alt="success" />
        <view class="font">{{ dataDetail.status | statusFilter }}</view>
      </view>
      <view class="content">
        <view class="info">
          <view class="list">
            <view class="l-left"> 受检人: </view>
            <view class="l-right">
              <text class="font">{{ dataDetail.patientName || "--" }}</text
              ><text class="font">{{ dataDetail.sex | sexFilter }}</text
              ><text class="font">{{
                dataDetail.ageMonth ? dataDetail.ageMonth + "月" : dataDetail.patientAge + "岁"
              }}</text>
            </view>
          </view>
          <view class="list">
            <view class="l-left"> 检测项目: </view>
            <view class="l-right">
              {{ dataDetail.checkName }}
            </view>
          </view>
          <view class="list">
            <view class="l-left"> 开单医生: </view>
            <view class="l-right">
              {{ dataDetail.doctorName || "--" }}
            </view>
          </view>
          <view class="list">
            <view class="l-left"> 检测编号: </view>
            <view class="l-right">
              {{ dataDetail.recordNo || "--" }}
            </view>
          </view>
          <view v-if="dataDetail.status != 0 && dataDetail.status != 1" class="list-bottom">
            <view class="l-b-code">
              <view class="l-b-list">
                <view class="l-left"> 条形码: </view>
                <view class="l-right">
                  {{ dataDetail.sampleCode }}
                </view>
                <view class="l-copy" @click="copyText(dataDetail.sampleCode)"> 复制 </view>
              </view>
              <view v-if="[2, 21, 22, 25].includes(Number(dataDetail.status || 0))" class="l-b-list">
                <view class="l-left"> 预期报告生成时间: </view>
                <view class="l-right">
                  {{
                    dataDetail.detectChargeType == 10 ? dataDetail.reportExpectDate : dataDetail.reportExpectDateHigh
                  }}
                </view>
              </view>
              <view v-if="dataDetail.status == 3" class="l-b-list">
                <view class="l-left"> 报告生成时间: </view>
                <view class="l-right">
                  {{ dataDetail.reportDate }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="flow">
          <view class="f-list">
            <view
              v-for="(item, index) in dataList"
              :key="index"
              class="express-step"
              :class="{
                hideCircle: item.status == dataDetail.status,
                last: index == dataList.length - 1,
                isComplate: item.complate,
              }"
            >
              <view v-if="item.status == dataDetail.status" class="express-step-icon">
                <!-- 等待 -->
                <image
                  v-if="waitIcon.indexOf(item.status) != -1"
                  class="step-pg"
                  src="https://files.yunqueyi.com/image/png/common/20220816120131913.png"
                  mode="aspectFill"
                />
                <image
                  v-else-if="item.status == 5"
                  class="step-pg"
                  src="https://files.yunqueyi.com/image/png/common/20220817141140460.png"
                  mode="aspectFill"
                />
                <!-- 成功 -->
                <image
                  v-else
                  class="step-pg"
                  src="https://files.yunqueyi.com/image/png/common/2022081612011851.png"
                  mode="aspectFill"
                />
              </view>
              <view class="express-step-msg" :class="{ noButton: item.status != dataDetail.status }">
                <view class="step-title">
                  {{ item.nodeName }}
                </view>
                <view class="step-m" :class="{ 'step-unusual': item.status == 5 }">
                  {{ item.nodeDesc }}
                </view>
                <view v-if="item.nodeTime" class="step-time">
                  {{ item.nodeTime }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="
          noShowBottomBtn.indexOf(dataDetail.status) == -1 || (dataDetail.status == 6 && dataDetail.showPayBtn == 1)
        "
        class="sumbit-container"
      >
        <view class="sumbit-button" @click="bottomBtnFun"> {{ dataDetail.status | showBtnTextFilter }} </view>
      </view>
      <view v-if="dataDetail.status == 2 && dataDetail.showSendBtn == 1" class="sumbit-container">
        <view class="sumbit-button" @click="bottomBtnFun"> 样本送检 </view>
      </view>
    </view>
  </view>
</template>
<script>
import {
  getGoodsInfo,
  getRecordInfo,
  getDetectionDetail,
  getDrugDetail,
  recommendationOrderSettle,
  createOrderId,
  getDetectionDetailProces,
  payBeforeVerify,
  payAmountOrder,
  payLog,
} from "@/api/detection";
import { jsApiPrepayNew } from "@/api/pay.js";
export default {
  filters: {
    sexFilter(val) {
      const str = val == 2 ? "女" : "男";
      return str;
    },
    statusShowFilter(val) {
      // 10：免费；20：收费
      if (val == 4) {
        return true;
      }
    },
    statusFilter(type) {
      const obj = {
        0: "待完善信息",
        1: "待采样",
        2: "已采样",
        21: "已送检",
        22: "已签收",
        25: "已接收",
        27: "已上机",
        3: "已完成",
        5: "样本失效",
        6: "待支付",
      };
      return obj[type];
    },
    showBtnTextFilter(status) {
      // 0  21 2 22
      const obj = {
        6: "立即支付", // 待支付
        2: "去送检",
        1: "绑定条形码", // 待采样
        5: "联系受检人", // 样本失效
        3: "查看报告", // 已完成
      };
      return obj[status];
    },
  },
  data() {
    return {
      status: "",
      headerInfo: {
        title: "检测详情",
        backMethod: "native",
      },
      id: "36942",
      dataDetail: {},
      canClick: true,
      needPaybackOrderid: "",
      needPaybackGoodId: "",
      payAmountData: [],
      payLogId: "", // 预支付记录ID
      canClick: true,
      dataList: [],
      waitIcon: [0, 1, 6],
      noShowBottomBtn: [0, 1, 5, 21, 22, 2, 6, 25, 27],
      goodsList: [],
      orderId: "",
      haveLoading: false,
    };
  },
  onLoad(options) {
    console.log(options, "---ptionsoptions依赖的id---");
    this.id = options.id || 36942;
    this.status = options.status;
    this.getDetailProces();
    this.init();
  },
  computed: {
    payment() {
      if (!this.goodsList?.length) return 0;
      const fen = this.goodsList.reduce((total, item) => (total += item.goodsNum * item.costPrice), 0);
      return (fen / 100).toFixed(2);
    },
  },
  methods: {
    init(sourcePay) {
      if (sourcePay) {
        this.haveLoading = true;
      }
      getDetectionDetail(this.id)
        .then((res) => {
          if (res.code === "000000") {
            this.dataDetail = res.data;
            if (this.dataDetail.status != this.status) {
              this.haveLoading = false;
              this.status = this.dataDetail.status;
              this.getDetailProces();
            }
          } else {
            uni.showToast({ title: res.message, icon: "none" });
          }
        })
        .catch((err) => {
          console.log(err, "errinit");
        });
      if (this.haveLoading) {
        this.resetPage();
      }
    },
    resetPage() {
      const timer = setTimeout(() => {
        getDetectionDetail(this.id, (res) => {
          console.log(res, "====res1222222", res.data.status, this.status);
          clearTimeout(timer);
          if (res.code === "000000") {
            this.dataDetail = res.data;
            if (this.dataDetail.status != this.status) {
              this.status = this.dataDetail.status;
              this.getDetailProces();
            }
          } else {
            uni.showToast({ title: res.message, icon: "none" });
          }
        });
      }, 2000);
    },
    copyText(val) {
      uni.setClipboardData({
        data: val,
        success: function () {
          uni.showToast({ title: "复制成功", icon: "none" });
        },
      });
    },
    // 标记已读 接口返回成功后本地标记已读，不需要整体刷新列表
    postReadStatus(id) {
      getHospitalReportRead(id).then(({ data }) => {
        console.log("标记已读: ", data);
        const matchItem = this.list.find((v) => v.tradeOrderReportResultId === id);
        if (!matchItem) return;
        matchItem.readFlag = 1;
      });
    },
    // 查看报告
    goReportDetail() {
      let reg = RegExp(/\.(jpg|gif|bmp|png)/); // 判断是否是图片
      let regDoc = /\.(pdf|doc|docx|xls|ppt|xlsx|pptx)/; // 判断是否是文档类型
      if (!this.dataDetail.reportUrl) {
        uni.showToast({ title: "暂无报告！", icon: "none" });
        return false;
      }
      if (reg.test(this.dataDetail.reportUrl)) {
        let arr = [this.dataDetail.reportUrl];
        uni.previewImage({
          urls: arr,
          current: 0,
          fail: (err) => {
            console.log(err);
          },
        });
        return;
      }
      const index = this.dataDetail.reportUrl.search(regDoc);
      if (index > -1) {
        const sub = this.dataDetail.reportUrl[0].substring(index + 1, this.dataDetail.reportUrl.length);
        let newPath =
          wx.env.USER_DATA_PATH + "/" + `${this.dataDetail.patientName}-${this.dataDetail.checkName}报告.pdf`;
        uni.showLoading({ title: "加载中" });
        let filePath = this.dataDetail.reportUrl;
        uni.downloadFile({
          url: filePath,
          filePath: newPath,
          success: (res) => {
            const filePath = res.tempFilePath;
            uni.openDocument({
              filePath: newPath,
              fileType: sub,
              showMenu: true,
              success: (res) => {
                uni.hideLoading();
                console.log("打开文档成功");
              },
              fail: (err) => {
                uni.hideLoading();
                console.log(err);
                uni.showToast({ title: "打开失败", icon: "none" });
              },
            });
          },
          fail: (err) => {
            uni.hideLoading();
            console.log(err);
            uni.showToast({ title: "下载失败！", icon: "none" });
          },
        });
      }
    },
    // 绑定条戏码
    goCode() {
      this.setDetectionData({
        checkList: true,
        ...this.dataDetail,
        pprotocolType: this.dataDetail.protocolId || this.dataDetail.pprotocolType,
      });
      this.setRecordID(this.id);
      this.setPatientData({ patientId: this.dataDetail.patientId });
      console.log(this.dataDetail);
      uni.navigateTo({
        url: `/pages/health/binding-code/index?id=${this.id}`,
      });
    },
    sampleDetection() {
      // 样本送检测
      uni.navigateTo({
        url: `/pages/sample-inspection/index`,
      });
    },
    beforePay() {
      let params = {
        tradeOrderPayLogId: this.payLogId,
        payChannel: 1,
        tradeType: 6,
      };
      console.log(params, "beforePay -- parm");
      jsApiPrepayNew(params)
        .then((res) => {
          this.canCLick = true;
          uni.hideLoading();
          this.wxCommonPay(
            res.data,
            () => {
              console.log("shuaxinshuj");
              this.init("sourcePay");
            },
            () => {}
          );
        })
        .catch((err) => {
          console.log(err, "err");
          uni.hideLoading();
          this.canCLick = true;
        });
    },
    wxCommonPay(res, succ, error) {
      console.log(res, "支付成功调用");
      uni.requestPayment({
        provider: "wxpay",
        timeStamp: res.timeStamp || String(Date.now()),
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType || "MD5",
        paySign: res.paySign,
        success: (res) => {
          console.log("success:" + JSON.stringify(res));
          succ && succ();
        },
        fail: (err) => {
          error && error();
          console.log("fail:" + JSON.stringify(err));
        },
      });
    },
    fetchGoodsInfo() {
      console.log(11, this.id);
      return new Promise((resolve, reject) => {
        getGoodsInfo(this.id)
          .then(({ code, data }) => {
            if (code !== "000000") reject();
            console.log("商品详情");
            this.goodsList = [data].map((v) => {
              v.goodsNum = 1;
              return v;
            });
            resolve();
          })
          .catch((err) => {
            console.log(err, "商品");
            reject();
            uni.hideLoading();
          });
      });
    },
    // 立即支付
    goPay() {
      // 查询商品详情
      uni.showLoading({ title: "请求中" });
      this.fetchGoodsInfo()
        .then(() => {
          if (!this.dataDetail.doctorId || !this.dataDetail.drugId || !this.dataDetail.detectOrderId) {
            console.log("000009998777");
            this.submitOrder();
          } else {
            this.orderId = this.dataDetail.detectOrderId;
            console.log("00907777778888");
            this.payBeforeVerifyFn();
          }
        })
        .catch((err) => {
          console.log(err, "err1111");
          uni.hideLoading();
        });
    },
    getRecordInfo() {
      return new Promise((resolve, reject) => {
        const params = {
          detectionRecordId: this.id,
        };
        getRecordInfo(params)
          .then((res) => {
            if (res.code == "000000") {
              resolve(item);
            } else {
              reject();
            }
          })
          .catch((err) => {
            uni.hideLoading();
            reject(err);
          });
      });
    },
    submitOrder() {
      const parmas = {
        amount: this.payment * 100,
        account: this.payment * 100,
        pharmaceuticalDetailDtoList: this.goodsList,
        recipeUrlList: [],
        expressFeeConfigId: 0,
        expressFee: 0,
        tryExpressFees: [],
        proxyDoctorId: "",
        saleType: 2,
        immediateBuy: 0,
        detectionRecordId: this.dataDetail.detectionRecordId,
      };
      console.log(parmas, "parmasparmas");
      recommendationOrderSettle(parmas)
        .then((res) => {
          console.log(res);
          if (res.code == "000000") {
            this.recommendationOrderId = res.data.recommendationOrderId;
            this.getDrugDetail(res.data.recommendationOrderId);
          } else {
            this.showLoading = false;
            uni.hideLoading();
          }
        })
        .catch(() => {
          this.showLoading = false;
          uni.hideLoading();
        });
    },
    // 获取药单详情
    getDrugDetail(id) {
      console.log(id);
      getDrugDetail(id)
        .then((res) => {
          console.log(res);
          if (res.code == "000000") {
            this.creadOrder(res.data);
          } else {
            this.showLoading = false;
            uni.showToast({
              icon: "none",
              title: res.message,
            });
          }
        })
        .catch(() => {
          this.showLoading = false;
        });
    },
    // 生成订单
    creadOrder(data) {
      const { shareRecommendationDto } = data;
      this.doctorId = shareRecommendationDto.doctorId;
      const params = {
        address: {},
        userType: 1,
        saleType: 2,
        mobilePhone: "",
        orderSource: 3,
        comments: "",
        drugId: shareRecommendationDto.recommendationOrderId, // 药单id
        detectionRecordId: this.id,
        storeGoods: shareRecommendationDto.prescriptionResponse,
        amount: shareRecommendationDto.prescriptionResponse.amount, // 总花费
        totalPrice: shareRecommendationDto.prescriptionResponse.totalPrice, // 商品总价格
        expressFee: 0, // 运费
        goodsType: 20, //
        payType: 1,
      };
      createOrderId(params)
        .then(({ code, data, message }) => {
          // this.showLoading = false;
          if (code === "000000") {
            this.orderId = data.orderId;
            console.log(params.amount, params.amount > 0);
            if (params.amount > 0) {
              this.beforePay();
            } else {
              this.startTime = new Date().getTime();
            }
          } else {
            this.showLoading = false;
            uni.showToast({
              icon: "none",
              title: message,
            });
          }
        })
        .catch(() => {
          this.showLoading = false;
        });
    },
    payFnWechat(item, callFn) {
      if (!this.checkOrder(this.data, callFn)) return;
      const doctorId = item.doctorId;
      let parentOrderId = item.detectOrderId;
      if (item.status === 6 && item.detectOrderId && item.detectOrderId != "0") {
        parentOrderId = item.detectOrderId;
      }
      const scene = "2," + doctorId + "," + parentOrderId + "," + item.drugId;
    },
    // 检测详情
    getDetailProces() {
      getDetectionDetailProces(this.id).then((res) => {
        if (res.code === "000000") {
          var flag = false;
          const data = res.data || [];
          data.forEach((item) => {
            if (item.status == this.status) {
              item.complate = false;
              flag = true;
            } else {
              console.log(flag, "flag");
              if (!flag) {
                item.complate = true;
              } else {
                item.complate = false;
              }
            }
          });
          this.dataList = data;
          console.log(this.dataDetail);
        }
      });
      console.log("999000999");
    },
    bottomBtnFun() {
      // 底部按钮点击
      const objFun = {
        3: "goReportDetail", // 已完成 查看报告
        1: "goCode", // 待采样 绑定条形码
        6: "goPay", // 去支付
        2: "sampleDetection",
      };
      console.log(this.dataDetail.status);
      const funName = objFun[this.dataDetail.status];
      console.log(funName);
      funName && this[funName]();
    },
    resetWxPayByBackParams() {
      this.needPaybackOrderid = "";
      this.needPaybackGoodId = "";
      this.payAmountData = [];
      this.payLogId = "";
    },
    payBeforeVerifyFn() {
      this.resetWxPayByBackParams();
      payBeforeVerify(this.id)
        .then(async (res) => {
          if (res.code == "000000") {
            this.needPaybackOrderid = res.data.orderId;
            this.needPaybackGoodId = res.data.goodsId;
            console.log(res.data.needPay);
            if (!res.data.needPay) {
              this.canClick = true;
              uni.showToast({ title: "已回款，无需支付", icon: "none" });
              this.$emit("load");
            } else {
              const canpay = await this.payAmountOrderFn();
              if (canpay) {
                await this.payLogFn();
                console.log("88889988999");
                if (this.payLogId) {
                  this.canClick = true;
                  this.beforePay();
                }
              }
            }
          } else {
            uni.showToast({ title: res.message, icon: "none" });
          }
        })
        .catch((err) => {
          console.log(err);
          uni.showToast({ title: "支付失败!", icon: "none" });
        });
    },
    payAmountOrderFn() {
      return payAmountOrder(this.needPaybackOrderid)
        .then((res) => {
          if (res.code == "000000") {
            const good = res.data.find((item) => {
              return item.goodsId == this.needPaybackGoodId;
            });
            if (good) {
              good.payAmount = good.payAmount || this.dataDetail.payPrice;
              this.payAmountData = [good];
              return true;
            } else {
              uni.showToast({ title: "查询可支付金额信息失败", icon: "none" });
            }
          } else {
            this.canClick = true;
            uni.showToast({ title: res.message, icon: "none" });
          }
        })
        .catch(() => {
          this.canClick = true;
          uni.showToast({ title: "支付失败", icon: "none" });
        });
    },
    payLogFn() {
      return payLog({
        detectionServiceRecordId: this.id,
        orderId: this.needPaybackOrderid,
        payAmountList: this.payAmountData,
        type: 2,
      })
        .then((res) => {
          if (res.code == "000000") {
            console.log(res.data, "resdataaa");
            this.payLogId = res.data.id;
          } else {
            this.canClick = true;
            uni.showToast({ title: res.message, icon: "none" });
          }
        })
        .catch(() => {
          this.canClick = true;
          uni.showToast({ title: "支付失败!!", icon: "none" });
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
