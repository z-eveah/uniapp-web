<template>
  <view class="report-list-cell" @click="tapWhole">
    <view class="top van-hairline--bottom">
      <view v-if="!data.sampleId">
        {{ data.detectType == 3 ? "设备ID" : "检测编号" }}
        {{ data.detectType == 3 ? data.equipmentId : data.recordNo || "--" }}</view
      >
      <view v-if="data.sampleId">采样条形码 {{ data.sampleId }}</view>
      <view v-if="data.status == 3 && data.detectType != 3" class="status" :class="{ unread: !data.readFlag }">
        {{ data.readFlag ? "已读" : "未读" }}
      </view>
      <view
        v-if="data.status != 3"
        :class="{
          status: true,
          unread: true,
          'staus-err': data.status == 5,
        }"
      >
        {{ data.status | statusFilter }}
      </view>
    </view>
    <view class="midd">
      <view class="line">
        <span class="label">受检人:</span>
        <span class="value">{{ data.name }}</span>
      </view>
      <view class="line">
        <span class="label">检测项目:</span>
        <span class="value">{{ data.reportName }}</span>
      </view>
      <view v-if="data.detectType != 3" class="line">
        <span class="label">检测时间:</span>
        <span class="value">{{ data.sampleTimeStr || "--" }}</span>
      </view>
      <view v-if="data.payPrice" class="line">
        <span class="label">支付金额:</span>
        <span class="value">¥{{ data.payPrice | fenFormat }}</span>
      </view>
      <!-- <view v-if="data.sampleId" class="line">
        <span class="label">采样条形码:</span>
        <span class="value">{{ data.sampleId }}</span>
      </view> -->
      <view class="line">
        <span class="label">开单医生:</span>
        <span class="value">{{ data.doctorName | formatDoctor }}</span>
      </view>
      <view v-if="data.reportDate && data.status == 3 && data.detectType != 2" class="line">
        <span class="label">报告生成时间:</span>
        <span class="value">{{ data.reportDate || "--" }}</span>
      </view>
      <view v-if="data.detectResultStr && data.detectType != 3" class="line">
        <span class="label">检测结果:</span>
        <span
          class="value"
          :class="{
            cFF4B33: ['阳性', '可跟进','高风险'].includes(data.detectResultStr),
          }"
          >{{ data.detectResultStr | formatDoctor }}</span
        >
      </view>
      <template v-if="data.detectType != 2">
        <view v-if="[2, 21, 22, 25].includes(Number(data.status || 0))" class="line">
          <span class="label label-long">预期报告生成时间:</span>
          <span class="value">
            {{ (data.detectChargeType == 10 ? data.reportExpectDate : data.reportExpectDateHigh) || "--" }}
          </span>
        </view>
      </template>
      <view v-if="data.status == 5" class="sample-err">
        <image class="icon-err" src="~@/static/images/icon-err.png" alt=""></image>
        <template v-if="data.failureReason && data.failureReason !== ''">
          失效原因:
          {{ data.failureReason }}
        </template>
        <template v-else> 温馨提示: 样本失效，可联系机构重新采样 </template>
      </view>
    </view>

    <view class="bott">
      <view v-if="data.detectType != 2 && data.detectType != 3" class="btn btn-style" @click="goDetectionDetail"
        >查看详情</view
      >
      <view v-if="data.sendLogId" class="button binding btn-style" @click="goDetail">查看物流</view>
      <view v-if="data.reportUrl && data.detectType != 2" class="btn btn-style" @click.stop="tapBtn(data)"
        >查看报告</view
      >
      <view v-if="data.detectType == 2 && data.mediaUrl" class="btn btn-style" @click.stop="tapBtn(data)"
        >查看图片</view
      >
      <view v-if="data.status == 6 && data.payShowFlag == 1" class="payment-btn btn-style" @click.stop="goPay"
        >立即支付</view
      >
    </view>
  </view>
</template>

<script>
// import pay from "@/mixins/pay";
import {
  getRecordInfo,
  recommendationOrderSettle,
  getGoodsInfo,
  getDrugDetail,
  createOrderId,
  payBeforeVerify,
  payAmountOrder,
  payLog,
} from "@/api/detection";
import { jsApiPrepayNew } from "@/api/pay.js";
export default {
  name: "ReportListCell",
  filters: {
    statusFilter(type) {
      const obj = {
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
    formatDoctor(name) {
      return name == undefined || name == "" ? "--" : name;
    },
    fenFormat(val) {
      if (isNaN(val)) {
        return "";
      }
      const f = val / 100;
      let s = f.toString();
      let rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      goodsList: [],
      orderId: "",
      needPaybackOrderid: "",
      needPaybackGoodId: "",
      payAmountData: [],
      payLogId: "", // 预支付记录ID
      canClick: true,
    };
  },
  computed: {
    payment() {
      if (!this.goodsList?.length) return 0;
      const fen = this.goodsList.reduce((total, item) => (total += item.goodsNum * item.costPrice), 0);
      return (fen / 100).toFixed(2);
    },
  },
  methods: {
    goPay() {
      // 查询商品详情
      console.log(this.data, "所有数据");
      uni.showLoading({ title: "请求中" });
      this.fetchGoodsInfo()
        .then(() => {
          this.getRecordInfo()
            .then((res) => {
              if (!res.doctorId || !res.drugId || !res.detectOrderId) {
                console.log(res, "获取商品详情药单订单检测单");
                this.submitOrder();
              } else {
                this.orderId = res.detectOrderId;
                console.log(res, "支付前接口");
                this.payBeforeVerifyFn();
                //this.beforePay();
              }
            })
            .catch(() => {
              uni.hideLoading();
            });
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    payBeforeVerifyFn() {
      if (this.data.detectOrderType == 1) {
        this.resetWxPayByBackParams();
        payBeforeVerify(this.data.recordId)
          .then(async (res) => {
            if (res.code == "000000") {
              this.needPaybackOrderid = res.data.orderId;
              this.needPaybackGoodId = res.data.goodsId;
              console.log(res.data.needPay);
              if (!res.data.needPay) {
                this.canClick = true;
                this.$toast("已回款，无需支付");
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
              this.$toast(res.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$toast("支付失败1");
          });
      }
    },
    payAmountOrderFn() {
      return payAmountOrder(this.needPaybackOrderid)
        .then((res) => {
          if (res.code == "000000") {
            const good = res.data.find((item) => {
              return item.goodsId == this.needPaybackGoodId;
            });
            if (good) {
              good.payAmount = good.payAmount || this.data.payPrice;
              this.payAmountData = [good];
              return true;
            } else {
              this.$toast("查询可支付金额信息失败");
            }
          } else {
            this.canClick = true;
            this.$toast(res.message);
          }
        })
        .catch(() => {
          this.canClick = true;
          this.$toast("支付失败");
        });
    },
    payLogFn() {
      console.log(this.data.recordId, this.needPaybackOrderid, this.payAmountData);
      return payLog({
        detectionServiceRecordId: this.data.recordId,
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
            this.$toast(res.message);
          }
        })
        .catch(() => {
          this.canClick = true;
          this.$toast("支付失败");
        });
    },
    // 重置先用后付，回款数据
    resetWxPayByBackParams() {
      this.needPaybackOrderid = "";
      this.needPaybackGoodId = "";
      this.payAmountData = [];
      this.payLogId = "";
    },
    beforePay() {
      // let parm = {
      //   orderId: this.orderId,
      //   payChannel: 1,
      //   tradeType: 6,
      //   userId: this.data.doctorId,
      // };
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
              console.log("支付会调");
              this.$emit("load");
            },
            () => {}
          );
        })
        .catch((err) => {
          uni.hideLoading();
          this.canCLick = true;
        });
    },
    fetchGoodsInfo() {
      return new Promise((resolve, reject) => {
        getGoodsInfo(this.data.recordId)
          .then(({ code, data }) => {
            if (code !== "000000") reject();
            console.log("商品详情");
            this.goodsList = [data].map((v) => {
              v.goodsNum = 1;
              return v;
            });
            resolve();
          })
          .catch(() => {
            reject();
            uni.hideLoading();
          });
      });
    },
    happenTimeFun(num) {
      //时间戳数据处理
      if (!num) {
        return "-";
      }
      console.log(num);
      let date = new Date(num);
      let nowDate = new Date();

      //时间戳为10位需*1000，时间戳为13位的话不需乘1000

      let y = date.getFullYear();

      let MM = date.getMonth() + 1;

      MM = MM < 10 ? "0" + MM : MM; //月补0

      let d = date.getDate();

      d = d < 10 ? "0" + d : d; //天补0

      let h = date.getHours();

      h = h < 10 ? "0" + h : h; //小时补0

      let m = date.getMinutes();

      m = m < 10 ? "0" + m : m; //分钟补0

      let s = date.getSeconds();
      console.log(date.getSeconds(), s, num);
      console.log(s, "sss", nowDate.getSeconds());
      s = s < 10 ? "0" + s : s; //秒补0

      return y + "/" + MM + "/" + d + " " + h + ":" + m + ":" + s;
    },
    wxCommonPay(res, succ, error) {
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
    goDetail() {
      uni.navigateTo({
        url: `/pages/express-detail/index?sendLogId=${this.data.sendLogId}`,
      });
    },
    getRecordInfo() {
      return new Promise((resolve, reject) => {
        const params = {
          detectionRecordId: this.data.recordId,
        };
        getRecordInfo(params)
          .then((res) => {
            if (res.code == "000000") {
              const item = {
                drugId: res.data.drugId,
                doctorId: this.data.doctorId || res.data.doctorId,
                detectOrderId: this.data.detectOrderId || res.data.detectOrderId,
              };

              //
              this.data.doctorId = res.data.doctorId;
              this.data.detectOrderId = res.data.detectOrderId;
              //
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
        detectionRecordId: this.data.detectionRecordId,
      };
      console.log(parmas, "创建订单之前recommendationOrderSettle");
      recommendationOrderSettle(parmas)
        .then((res) => {
          console.log(res);
          if (res.code == "000000") {
            this.recommendationOrderId = res.data.recommendationOrderId;
            this.getDrugDetail(res.data.recommendationOrderId);
          } else {
            this.showLoading = false;
            uni.showToast({
              title: res.message,
              duration: 2000,
            });
            uni.hideLoading();
          }
        })
        .catch((err) => {
          console.log(err);
          uni.showToast({
            title: "err",
            duration: 2000,
          });
          this.showLoading = false;
          uni.hideLoading();
        });
    },
    // 获取药单详情
    getDrugDetail(id) {
      console.log(id, "getDrugDetail");
      getDrugDetail(id)
        .then((res) => {
          console.log(res);
          if (res.code == "000000") {
            this.creadOrder(res.data);
          } else {
            this.showLoading = false;
            uni.showToast({
              title: res.message,
              duration: 2000,
            });
            this.$toast(res.message);
          }
        })
        .catch((err) => {
          console.log(err, "err2");
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
        detectionRecordId: this.data.recordId,
        storeGoods: shareRecommendationDto.prescriptionResponse,
        amount: shareRecommendationDto.prescriptionResponse.amount, // 总花费
        totalPrice: shareRecommendationDto.prescriptionResponse.totalPrice, // 商品总价格
        expressFee: 0, // 运费
        goodsType: 20, //
        payType: 1,
      };
      console.log(params, "createOrderId");
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
            this.$toast(message);
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
    checkOrder(p, callFn) {
      if (p.status == 1 || p.status == 3 || p.status == 2) {
        this.$dialog
          .alert({
            className: "con-dialog",
            title: "提示",
            message: "支付已超时，订单已被自动取消",
            confirmButtonText: "我知道了",
          })
          .then(() => {
            callFn(p);
          });
        return false;
      }
      return true;
    },
    tapWhole() {
      // console.log('tapWhole');
      this.$emit("tapWhole");
    },
    tapBtn(item) {
      let reg = RegExp(/\.(jpg|gif|bmp|png)/); // 判断是否是图片
      let regDoc = /\.(pdf|doc|docx|xls|ppt|xlsx|pptx)/; // 判断是否是文档类型
      console.log(item, "item");
      if (item.detectType == 2) {
        // 快检lei i
        wx.previewImage({
          urls: [item.mediaUrl],
          // urls: item.detectionResultImageUrls,
        });
        return;
      }
      // if (!item.detectionResultUrls || !item.detectionResultUrls.length) {
      //   this.$toast("暂无报告！");
      //   return false;
      // }
      if (!item.reportUrl) {
        this.$toast("暂无报告！");
        return false;
      }
      console.log(reg.test(item.reportUrl));
      if (reg.test(item.reportUrl)) {
        let arr = [item.reportUrl];
        uni.previewImage({
          urls: arr,
          current: 0,
          fail: (err) => {
            console.log(err);
          },
        });
        return;
      }
      const index = item.reportUrl.search(regDoc);
      if (index > -1) {
        const sub = item.reportUrl[0].substring(index + 1, item.reportUrl.length);
        let newPath = wx.env.USER_DATA_PATH + "/" + `${item.name}-${item.reportName}报告.pdf`;
        uni.showLoading({ title: "加载中" });
        let filePath = item.reportUrl;
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
                this.$toast("打开失败");
              },
            });
          },
          fail: (err) => {
            uni.hideLoading();
            console.log(err);
            this.$toast("下载失败！");
          },
        });
      }
    },
    goDetectionDetail() {
      console.log(this.data, "list");
      uni.navigateTo({
        url: `/pages/detection-detail/index?id=${this.data.recordId}&status=${this.data.status}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.report-list-cell {
  background: #fff;
  border-radius: 22rpx;
  padding: 0 30rpx;
  margin-bottom: 20rpx;
  .cFF4B33 {
    color: #ff4b33 !important;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    // border-bottom: 0.5px solid #e9e9e9;
    font-size: 26rpx;
    color: #999999;
    line-height: 26rpx;
    position: relative;
    .status {
      font-size: 24rpx;
      &.unread {
        color: #00bda5;
      }
      &.staus-err {
        color: #ff4b33;
      }
    }
  }
  .midd {
    .line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 68rpx;
      font-size: 28rpx;
      line-height: 28rpx;
      .label {
        color: #666666;
        width: 180rpx;
      }
      .label-long {
        width: 240rpx;
      }
      .value {
        font-weight: 700;
        color: #212121;
        flex: 1;
        text-align: right;
      }
    }
    .sample-err {
      width: 100%;
      background: #ffeeee;
      border-radius: 8rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff4b33;
      line-height: 52rpx;
      padding-left: 18rpx;
      padding-right: 18rpx;

      box-sizing: border-box;
      .icon-err {
        width: 24rpx;
        height: 24rpx;
        vertical-align: -4rpx;
        padding-right: 4rpx;
      }
      margin-bottom: 10rpx;
      margin-top: 6rpx;
    }
  }
  .bott {
    display: flex;
    justify-content: flex-end;
    padding-top: 20rpx;
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      // height: 32px;
      border-radius: 40rpx;
      border: 0.5px solid #c0c0c0;
      font-size: 26rpx;
      color: #212121;
      // line-height: 15px;
      padding: 20rpx 24rpx;
      margin-bottom: 36rpx;
      font-family: -apple-system-font, sans-serif;
      line-height: 1;
    }
    .binding {
      height: 66rpx;
      border-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 28rpx;
      font-size: 26rpx;
      border: 1rpx solid #00bda5;
      color: #00bda5;
    }
    .payment-btn {
      width: 152rpx;
      height: 66rpx;
      background: #00bda5;
      border-radius: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
      margin-bottom: 36rpx;
      color: #ffffff;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    .btn-style {
      margin-left: 24rpx;
    }
  }
}
</style>
