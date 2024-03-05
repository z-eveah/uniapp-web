<template>
  <view>
    <view v-if="isLogin">
      <view v-if="hasStore == 1" class="dising-box">
        <view v-if="goodsType != 15" class="top-tell">
          <image src="https://file.yunqueyi.com/h5/images/mall/xcx/v17.png" class="icon"></image>
          药品用法用量：请谨遵医嘱
        </view>
        <cart v-for="(item, index) in storeList" :key="index" :goods-type="goodsType" :cart-parm="cartFun(item)">
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
              <view v-if="goodsType != 15" class="s-item">
                <view class="s-item-l">优惠</view>
                <view class="s-item-r s-item-s">
                  {{ item.preferentialPrice > 0 ? "-" + exchangePrice(item.preferentialPrice) : 0 }}
                </view>
              </view>
              <view v-if="goodsType != 15" class="s-item">
                <view class="s-item-l">运费</view>
                <view class="s-item-r s-item-s">
                  {{ item.expressFee > 0 ? `¥${exchangePrice(item.expressFee)}` : "免运费" }}
                </view>
              </view>
            </view>
            <view v-if="goodsType != 15" class="solt-list last-list">
              <view class="s-item">
                <view class="s-item-l">药单金额</view>
                <view class="s-item-r s-item-b">¥{{ exchangePrice(item.amount) }}</view>
              </view>
            </view>
          </view>
        </cart>
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
              <view v-if="!expressFee && goodsType != 15" class="express-free">免运费</view>
            </view>
            <view class="pay-r" :class="{ 'pay-gr': payStatus == 1 }" @click.stop="createOrder">
              {{ payStatus == 1 ? "已支付" : "确认支付" }}
            </view>
          </view>
        </view>
      </view>
      <view v-if="hasStore == 2" class="no-store-list">暂时没有查询到药单数据</view>
    </view>
    <view v-if="!isLogin" class="pt100">
      <LoginTip tip-text="登录并完成支付" back-url="/pages/index" />
    </view>
    <showModel2 v-if="isShowModel" :model-obj="modelObj">
      <view class="model-btns">
        <button
          v-if="!isSaleCrm"
          open-type="launchApp"
          :app-parameter="backAppParm"
          class="button"
          :bindlaunchapp="bindlaunchapp"
          @click="closeModel"
        >
          确定
        </button>
        <button v-if="isSaleCrm" class="button" @click="saleCrmClick">确定</button>
      </view>
    </showModel2>
  </view>
</template>
<script>
import { getDrugDetail, getInfoByOrderId } from "@/api/order.js";
import { jsApiPrepay } from "@/api/pay.js";
import showModel2 from "@/components/show-modal/modal2.vue";
import cart from "@/components/cart/";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
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
      cartParm: {
        list: [],
        title: "云鹊小铺",
      },
      hasStore: 2,
      patientMobile: "",
      patientName: "",
      patientId: "",
      price: "160.00",
      addressInfo: null,
      scrollTop: 0,
      isShowBlack: false,
      showAddress: 0,
      pageAmount: 0,
      storeList: [],
      expressType: null,
      address: {},
      goodsQuantity: 0,
      drugId: "",
      comments: "",
      fromType: "",
      preferentialPrice: "",
      doctorId: "",
      storeGoods: {},
      amount: "",
      totalPrice: "",
      expressFee: "",
      orderId: "",
      scene: "",
      addressPoint: "",
      goodsPoint: "",
      payStatus: 1,
      showSj: false,
      backAppParm: "100",
      isShowModel: false,
      goodsType: "",
      modelObj: {
        content: "",
        title: "返回云鹊医APP",
        btnNum: 1,
        sureBtnTxt: "确定",
      },
      canCLick: true, // 避免重复点击
      isSaleCrm: false,
      loadOption: {},
      isLogin: null,
    };
  },
  // 转发小程序
  onShareAppMessage(res) {
    if (res.from === "button") {
    }
    return this.shareOption;
  },
  onLoad(options) {
    console.log(options, "支付参数");
    if (options.scene) {
      this.loadOption = options;
      uni.setStorageSync("loadOption", options);
      this.init(options);
    }
  },
  onShow() {
    const isLogin = uni.getStorageSync("token") || null;
    this.isLogin = isLogin;
    if (this.isLogin) {
      const lp = uni.getStorageSync("loadOption");
      console.log(lp, "支付参数onShow");
      this.init(lp, true);
    }
  },
  computed: {
    ...mapGetters(["packInfo"]),
  },
  methods: {
    ...mapActions(["setPackInfo"]),
    init(options, isclear) {
      if (options.scene) {
        this.scene = decodeURIComponent(options.scene) || "";
        const sp = this.scene.split(","); //sp[0]:类型来源   sp[1]:doctorId  sp[2]:orderId  sp[3]:药单Id
        this.fromType = sp[0];
        this.orderId = sp[2];
        if (sp.length >= 5) {
          this.isSaleCrm = true;
          this.getInfoByOrderId(this.orderId);
          this.modelObj.title = "支付成功";
          console.log("crm支付");
        } else {
          console.log("app支付");
          this.doctorId = sp[1];
          this.drugId = sp[3];
          console.log("drugId", this.drugId);
          this.getDrugDetail(this.drugId);
        }
      }
      if (isclear) {
        uni.removeStorageSync("loadOption");
      }
    },
    saleCrmClick() {
      this.isShowModel = false;
      this.getInfoByOrderId(this.orderId);
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
    /**
     * 返回结果
     *  0  成功  展示成功页面
     * -1  错误  可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等。
     * -2  用户取消  无需处理。发生场景：用户不支付了，点击取消，返回APP。
     * -3  没有安装微信客户端
     */
    beforePay() {
      let parm = {
        orderId: this.orderId,
        payChannel: 1,
        tradeType: 6,
        userId: this.doctorId,
      };
      jsApiPrepay(parm)
        .then((res) => {
          console.log("res", res);
          this.canCLick = true;
          uni.hideLoading();
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
        .catch((err) => {
          console.log("err", err);
          uni.hideLoading();
          uni.showToast({
            title: err.message,
            icon: "none",
            duration: 2000,
          });
          this.canCLick = true;
        });
    },
    bindlaunchapp() {
      this.isShowModel = false;
    },
    getInfoByOrderId(id) {
      let orderId = id.toString();
      getInfoByOrderId(orderId).then((res) => {
        this.doctorId = res.data.doctorId;
        this.drugId = res.data.recommendationOrderId;
        this.getDrugDetail(this.drugId);
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
    //获取药单信息
    getDrugDetail(id, type) {
      getDrugDetail(id).then((res) => {
        console.log(res);
        const { payStatus, shareRecommendationDto = {}, goodsType } = res.data || {};
        this.payStatus = payStatus;
        this.goodsType = goodsType;
        const { prescriptionResponse = {}, showAddress } = shareRecommendationDto;
        this.showAddress = showAddress;
        this.storeGoods = prescriptionResponse;
        this.storeList = prescriptionResponse.storeList;
        this.pageAmount = prescriptionResponse.amount;
        this.totalPrice = prescriptionResponse.totalPrice;
        this.expressFee = shareRecommendationDto.expressFee;
        if (shareRecommendationDto.containOtc) {
          this.modelObj.content = "支付成功，请返回补充信息";
        }
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
      if (this.payStatus == 1) {
        return;
      }
      this.payFun();
    },

    closeModel() {
      this.isShowModel = false;
      this.getDrugDetail(this.drugId);
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
</style>
