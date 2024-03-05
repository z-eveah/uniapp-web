<template>
  <view>
    <view v-if="hasStore == 1" class="dising-box">
      <view v-if="goodsType != 15" class="top-tell">
        <image src="https://file.yunqueyi.com/h5/images/mall/xcx/v17.png" class="icon"></image>
        药品用法用量：请谨遵医嘱
      </view>
      <cart v-for="(item, index) in storeList" :key="index" :cart-parm="cartFun(item)">
        <view>
          <view v-if="goodsType != 15" class="solt-list">
            <view class="s-item">
              <view class="s-item-l">配送方式</view>
              <view class="s-item-r">{{ item.expressType | filterType }}</view>
            </view>
          </view>
          <view class="solt-list last-list">
            <view class="s-item">
              <view class="s-item-l">商品总额</view>
              <view class="s-item-r">¥{{ exchangePrice(item.totalPrice) }}</view>
            </view>
            <template v-if="goodsType != 15">
              <view class="s-item">
                <view class="s-item-l">优惠</view>
                <view class="s-item-r s-item-s">
                  {{ item.preferentialPrice > 0 ? "-" + exchangePrice(item.preferentialPrice) : 0 }}</view
                >
              </view>
              <view class="s-item">
                <view class="s-item-l">运费</view>
                <view class="s-item-r s-item-s">
                  {{ item.expressFee > 0 ? `¥${exchangePrice(item.expressFee)}` : "免运费" }}</view
                >
              </view>
            </template>
          </view>
          <view v-if="goodsType != 15" class="solt-list">
            <view class="s-item">
              <view class="s-item-l">药单金额</view>
              <view class="s-item-r s-item-s">¥{{ exchangePrice(item.amount) }}</view>
            </view>
          </view>
          <view class="solt-list last-list">
            <view class="s-item">
              <view class="s-item-l">本次支付金额</view>
              <view class="s-item-r s-item-b">¥{{ exchangePrice(pageAmount) }}</view>
            </view>
          </view>
        </view>
      </cart>
      <view v-show="isShowBlack && showAddress == 1" class="scroll-fix-a" @click="changeAddress">
        <view class="fix-a">
          <view class="scroll-a">{{ selectAddress ? selectAddress : "添加收货地址" }}</view>
          <image src="https://file.yunqueyi.com/h5/images/mall/xcx/v16.png" class="icon"></image>
        </view>
      </view>
      <view class="pay-info">
        <view class="pay-lr">
          <view class="pay-model">
            <view class="pay-l">
              合计：<text class="price">￥{{ exchangePrice(pageAmount) }}</text>
            </view>
            <view v-if="showSj" class="sj">随机立减最高10元</view>
            <view v-if="expressFee"
              >含运费：<text class="express-price">￥{{ exchangePrice(expressFee) }}</text>
            </view>
            <view v-if="!expressFee" class="express-free">免运费</view>
          </view>
          <view class="pay-r" :class="{ 'pay-gr': payStatus == 1 }" @click.stop="createOrder">
            {{ payStatus == 1 ? "已支付" : "确认支付" }}</view
          >
        </view>
      </view>
    </view>
    <view v-if="hasStore == 2" class="no-store-list">暂时没有查询到药单数据</view>
    <envChange v-if="!isProd" />
    <showModel2 v-if="isShowModel" :model-obj="modelObj">
      <view class="model-btns">
        <button
          v-if="!isSaleCrm"
          open-type="launchApp"
          :app-parameter="backAppParm"
          :binderror="launchAppError"
          class="button"
          :bindlaunchapp="bindlaunchapp"
          @click="closeModel"
        >
          确定
        </button>
        <button v-if="isSaleCrm" class="button" @click="saleCrmClick">确定</button>
      </view>
    </showModel2>
    <image
      v-if="hasStore != 1 && hasStore != 2"
      class="default-bg"
      src="https://file.yunqueyi.com/health/applet/wechat_product_home.jpg"
      mode="widthFix"
    ></image>
  </view>
</template>
<script>
import { getDefaultAddress } from "@/api/address.js";
import { getTradeOrderPayLog, payPartMoney } from "@/api/afterUser.js";
import cart from "@/components/cart/";
import envChange from "@/components/env-change";
import showModel2 from "@/components/show-modal/modal2.vue";
import { isProd } from "@/service/getBaseUrl";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    envChange,
    cart,
    showModel2,
  },

  filters: {
    filterType(type) {
      let str = "";
      if (type == 1) {
        //1:快递寄送,2:骑手配送,3:自提
        str = "快递寄送";
      } else if (type == 2) {
        str = "骑手配送";
      } else if (type == 3) {
        str = "自提";
      }
      return str;
    },
  },
  data() {
    return {
      goodsType: null,
      hasStore: 0,
      isProd,
      patientMobile: "",
      patientName: "",
      patientId: "",
      price: "160.00",
      addressInfo: null,
      showAddress: 0,
      selectAddress: "",
      isShowBlack: false,
      pageAmount: 0,
      storeList: [],
      expressType: null,
      address: {},
      goodsQuantity: 0,
      tradeOrderPayLogId: "",
      fromType: "",
      doctorId: "",
      comments: "",
      preferentialPrice: "",
      storeGoods: {},
      unionById: "",
      amount: "",
      totalPrice: "",
      expressFee: "",
      addressPoint: "",
      goodsPoint: "",
      payStatus: 1,
      showSj: false,
      backAppParm: "100",
      isShowModel: false,
      modelObj: {
        content: "",
        title: "返回云鹊医APP",
        btnNum: 1,
        sureBtnTxt: "确定",
      },
      canCLick: true, // 避免重复点击
      isSaleCrm: false,
    };
  },
  // 转发小程序
  onShareAppMessage(res) {
    if (res.from === "button") {
    }
    return this.shareOption;
  },

  onLoad(options) {
    console.log(options, "options");
    const scene = decodeURIComponent(options.scene) || undefined;
    if (scene) {
      // type 0-app 1-crm
      const [fromType, doctorId, tradeOrderPayLogId, type] = scene.split(",");
      Object.assign(this, {
        fromType,
        doctorId,
        tradeOrderPayLogId,
        isSaleCrm: type == "1",
      });
      if (type == "1") this.modelObj.title = "支付成功";

      this.getTradeOrderPayInfo(this.tradeOrderPayLogId);
    }
  },
  onShow() {
    this.unionById = uni.getStorageSync("unionId");
    uni.hideShareMenu();
    if (this.unionById) {
      this.getDefaultAddress();
    }
  },
  computed: {
    ...mapGetters(["packInfo"]),
    waPoint() {
      console.log(this.addressPoint);
      return this.addressPoint;
    },
  },

  methods: {
    ...mapActions(["setPackInfo"]),
    saleCrmClick() {
      this.isShowModel = false;
      this.getTradeOrderPayInfo(this.tradeOrderPayLogId);
    },
    initAddress() {
      if (this.packInfo) {
        const { cityName, countyName, provinceName, townName } = this.packInfo;
        this.addressInfo = {
          ...this.packInfo,
        };
        let labels = "送至：" + provinceName + " " + cityName + " " + countyName;
        if (townName) {
          labels = labels + " " + townName;
        }
        this.selectAddress = labels;
      }
    },
    payFun() {
      if (!this.canCLick) {
        return;
      }
      this.canCLick = false;
      let u = uni.getStorageSync("unionId");
      uni.showLoading({
        title: "检测支付环境...",
      });
      this.beforePay();
    },
    payErrBack() {
      this.canCLick = true;
    },
    beforePay() {
      ///prepay预支付接口
      let params = {
        tradeOrderPayLogId: this.tradeOrderPayLogId,
        payChannel: 1,
        tradeType: 6,
      };
      console.log(params, "beforePay -- parm");
      /**
       * 返回结果
       *  0  成功  展示成功页面
       * -1  错误  可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等。
       * -2  用户取消  无需处理。发生场景：用户不支付了，点击取消，返回APP。
       * -3  没有安装微信客户端
       */
      console.log(params, "支付参数");
      payPartMoney(params)
        .then((res) => {
          console.log(res, "支付请求完参数");
          uni.hideLoading();
          this.canCLick = true;
          this.wxCommonPay(
            res.data,
            () => {
              this.isShowModel = true;
              this.backAppParm = 0;
            },
            () => {
              this.backAppParm = -2;
            }
          );
        })
        .catch((res) => {
          console.log(res, "支付失败");
          this.canCLick = true;
        });
    },
    wxCommonPay(res, succ, error) {
      console.log(res, "请求支付参数");
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
    launchAppError() {},
    bindlaunchapp() {
      this.isShowModel = false;
    },
    goOrderDetail() {
      uni.navigateTo({
        url: `/pages/health/myOrder`,
      });
    },

    cartFun(item) {
      return {
        list: item.goodsList,
        title: item.storeName,
        goodsPoint: this.goodsPoint,
        showIndex: "all",
      };
    },
    //获取默认收货地址
    getDefaultAddress() {
      // let u = uni.getStorageSync("unionId"),
      // url = `${this.baseUrl}/healths/address/default?unionId=${u}&doctorId=${this.doctorId}&entry=1`;
      getDefaultAddress(this.doctorId)
        .then((res) => {
          // if (res.data.code !== "000000") {
          //   this.$toast(res.data.message);
          //   return;
          // }
          this.setPackInfo({
            ...res.data,
          });
          this.initAddress();
        })
        .catch(() => {
          this.$toast("网络存在问题，请重试");
        });
      // this.request({
      //   url: url,
      //   method: "GET",
      //   data: {},
      //   success: (res) => {
      //     if (res.data.code !== "000000") {
      //       this.$toast(res.data.message);
      //       return;
      //     }
      //     this.setPackInfo({
      //       ...res.data.data,
      //     });
      //     this.initAddress();
      //   },
      //   fail: () => {
      //     this.$toast("网络存在问题，请重试");
      //   },
      // });
    },
    getSj() {
      this.request({
        url: `${this.baseUrl}/trade/pay/common/discount/1/5?userType=2&userId=${this.patientId}`,
        method: "GET",
        data: {},
        success: (res) => {
          if (res.data.code == "000000" && res.data.data > 0) {
            this.showSj = true;
          }
        },
        fail: () => {
          this.$toast("网络存在问题，请重试");
        },
      });
    },
    //获取药单信息
    getTradeOrderPayInfo(id, type) {
      getTradeOrderPayLog(id).then((res) => {
        const { payStatus, prescriptionResponse, expressFee, showAddress, amountToPay } = res.data;
        Object.assign(this, {
          expressFee,
          payStatus,
          showAddress,
          storeList: prescriptionResponse.storeList,
          totalPrice: prescriptionResponse.totalPrice,
          pageAmount: amountToPay,
          storeGoods: prescriptionResponse,
        });

        if (type == 2) {
          this.payStatus = 1;
          this.hasStore = 1;
        } else {
          this.hasStore = this.storeList.length > 0 ? 1 : 2;
          if (uni.getStorageSync("unionId") && payStatus == 2) {
            this.payFun();
          }
        }
      });
    },

    //创建订单
    createOrder() {
      this.getTradeOrderPayInfo(this.tradeOrderPayLogId);
      // if (!uni.getStorageSync("unionId")) {
      //   this.checkLogin({
      //     cb: () => {
      //       // this.getDefaultAddress()
      //       this.getTradeOrderPayInfo(this.tradeOrderPayLogId);
      //     },
      //     isTabBar: "",
      //     isBack: false,
      //     redirectUrl: encodeURIComponent(`/pages/health/doctorDising?scene=${this.scene}`),
      //   });
      //   return;
      // }

      if (this.payStatus == 1) {
        return;
      }
      this.payFun();
    },
    changeAddress() {
      uni.navigateTo({
        url: "/pages/health/addressList",
      });
    },
    closeModel() {
      this.isShowModel = false;
      this.getTradeOrderPayInfo(this.tradeOrderPayLogId);
      if (this.unionById) {
        this.getDefaultAddress();
      }
    },
  },
};
</script>
<style>
page {
  background: #f8f9fa;
}

.button {
  color: #0d9078;
}
</style>
<style lang="scss" scoped>
.com-pd-mg {
  padding: 0 32rpx;
  margin-top: 24rpx;
}

.dising-box {
  padding-bottom: 140rpx;
}

.top-tell {
  background: #fefaf5;
  padding: 14rpx 30rpx;
  display: flex;
  align-items: center;
  color: #e6a23c;
  font-size: 26rpx;

  .icon {
    width: 26rpx;
    height: 26rpx;
    margin-right: 10rpx;
  }
}

.scroll-fix-a {
  background: rgba(0, 0, 0, 0.6);
  height: 80rpx;
  position: fixed;
  left: 0;
  bottom: 120rpx;
  width: 100%;

  .fix-a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    padding: 0 30rpx;
    height: 80rpx;
  }

  .scroll-a {
    flex: 1;
    line-height: 80rpx;
    height: 80rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    width: 26rpx;
    height: 26rpx;
  }
}

.pay-info {
  position: fixed;
  height: 120rpx;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1000;

  .pay-lr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120rpx;
    padding: 0 30rpx;

    .pay-r {
      width: 250rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 32rpx;
      color: #fff;
      font-weight: 600;
      border-radius: 45rpx;
      background: linear-gradient(137deg, rgba(255, 166, 95, 1) 0%, rgba(255, 122, 75, 1) 100%);
    }

    .pay-gr {
      background: #979899;
      opacity: 0.5;
    }
  }

  .pay-model {
    .sj {
      margin-top: 20rpx;
      padding: 4rpx 8rpx;
      font-size: 24rpx;
      color: #ed6a0c;
      border: 1rpx solid #ff9a4b;
      line-height: 1;
    }

    .express-price {
      font-size: 24rpx;
      color: #979899;
    }

    .express-free {
      font-size: 24rpx;
      color: #979899;
    }
  }

  .pay-l {
    color: #373839;
    line-height: 1;

    .price {
      color: #fb5b52;
      font-size: 36rpx;
      font-weight: 600;
    }
  }
}

.remarks {
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.05);
  padding: 40rpx 32rpx;
  .remark-tit {
    color: #3f4041;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 30rpx;
    padding-bottom: 20rpx;
  }

  .item-r {
    height: 130rpx;
    .area {
      height: 100%;
      width: 100%;
      padding: 0;
      line-height: 30rpx;
    }
  }
}

.solt-list {
  padding: 16rpx 0;
  position: relative;

  .s-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 0;

    .s-item-l {
      color: #979899;
      font-size: 28rpx;
      line-height: 28rpx;
    }

    .s-item-r {
      color: #3f4041;
      line-height: 28rpx;
      font-size: 28rpx;
    }

    .s-item-s {
      color: #373839;
    }

    .s-item-b {
      color: #545454;
      font-size: 36rpx;
      line-height: 36rpx;
      font-weight: bold;
    }
  }

  .pb40 {
    padding-bottom: 40rpx;
  }

  .pt20 {
    padding-top: 20rpx;
  }
}

.last-list::after {
  position: absolute;
  content: " ";
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #f0f1f2;
  color: #f0f1f2;
  -webkit-transform-origin: 0 100%;
  -ms-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  -ms-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.no-store-list {
  text-align: center;
  padding-top: 80rpx;
  color: #999;
}
.default-bg {
  width: 100%;
}
</style>
