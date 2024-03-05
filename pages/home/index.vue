<template>
  <view class=".page-content">
    <mescroll-body
      ref="mescrollRef"
      bottom="50"
      height="100%"
      :down="downOption"
      :up="upOption"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
    >
      <view class="testingIndex">
        <view class="testingIndex-top">
          <image
            src="https://files.yunqueyi.com/image/png/common/20230912144301701.png"
            class="testingIndex-top-logo"
          ></image>
        </view>
      </view>
      <view class="testingIndex-top-btns">
        <view
          v-for="(item, index) in menuList"
          :key="index"
          class="testingIndex-top-btns-item"
          @click="handleToPage(item.link)"
        >
          <image :src="item.imageUrl" class="btns-item-img"></image>
          <view class="btns-item-title"> {{ item.title }} </view>
        </view>
      </view>
      <view class="testingIndex-service">
        <view class="testingIndex-service-title"> 本院检测服务 </view>
        <view class="testingIndex-service-list">
          <view v-if="dataList.length === 0" class="service-list-nodata">
            <image
              src="https://files.yunqueyi.com/image/png/common/20220701133652616.png"
              class="service-list-nodata-img"
            ></image>
            <view class="service-list-nodata-text"> 暂无检测服务 </view>
          </view>
          <view v-if="dataList.length > 0" class="service-list-content">
            <view
              v-for="(item, index) in dataList"
              :key="index"
              class="service-list-content-item"
              @click="toGoodsDetail(item)"
            >
              <image :src="item.goodsImgUrl" class="item-img" mode="widthFix"></image>
              <view class="item-text">
                <view class="item-text-top">
                  {{ item.goodsName }}
                </view>
                <view class="item-text-center">
                  {{ item.storeName }}
                </view>
                <view class="item-text-price">
                  <view class="item-text-bottom">
                    <text class="item-text-bottom-unit">¥ </text
                    ><text class="item-text-bottom-price">{{ priceInit(item.costPricePromotion)[0] }}</text
                    >.<text class="item-text-bottom-price1">{{ priceInit(item.costPricePromotion)[1] }}</text>
                  </view>
                  <view v-show="item.tradeSalePromotionGoodsId !== 0" class="old-price"
                    >¥{{ priceInit(item.costPrice)[0] }}.{{ priceInit(item.costPrice)[1] }}</view
                  >
                  <view v-if="item.promotionLabel" class="drug-desc">
                    <view class="tag-text">{{ item.promotionLabel }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <envChange v-if="!isProd" />
    </mescroll-body>
  </view>
</template>

<script>
import { getGoodsList, hospitalCheck, getHomeBtns } from "@/api/serviceDetail.js";
import { toDecimal2 } from "@/utils/common.js";
import envChange from "@/components/env-change";
import { isProd } from "@/service/getBaseUrl";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    envChange,
  },
  mixins: [MescrollMixin],
  data() {
    return {
      dataList: [],
      mescroll: null,
      downOption: {
        isLock: true,
      },
      upOption: {
        auto: false,
        empty: {
          use: false,
        },
        textNoMore: "暂无更多数据",
      },
      isProd,
      pageNum: 0,
      pageSize: 10,
      saleType: 2,
      menuList: [],
    };
  },
  onShow() {
    this.checkSubStatus();
    this.getHomeBtns();
    this.getGoodsList();
  },
  onLoad() {
    this.getGoodsList();
    const that = this;
    uni.$on("reload", function () {
      that.pageNum = 0;
      that.getGoodsList();
    });
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    ...mapActions(["getUserInfo"]),

    getHomeBtns() {
      getHomeBtns().then((res) => {
        console.log("----", res);
        let { code, data, message } = res;
        if (code == "000000") {
          this.menuList = data;
        } else {
          this.$toast(message || "操作失败");
        }
      });
    },

    handleToPage(url) {
      this.checkUserRights(url);
      uni.removeStorageSync("confirmProject");
    },

    // 跳转链接
    toPage(url) {
      this.checkUserRights(url);
      uni.removeStorageSync("confirmProject");
    },
    toAppoint() {
      uni.navigateTo({
        url: "/pages/appointment/list",
      });
    },
    async toScanPage() {
      uni.navigateTo({
        url: `/pagesDetection/binding-code/index`,
      });
    },
    checkUserRights(url) {
      hospitalCheck()
        .then((res) => {
          console.log(res);
          if (res.code === "000000") {
            uni.navigateTo({
              url,
            });
          } else {
            uni.showToast({
              title: res.message,
              icon: "none",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          uni.showToast({
            title: err.message,
            icon: "none",
          });
        });
    },
    toPageDownload(url) {
      uni.navigateTo({
        url,
      });
    },
    //  init mescroll
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // down 方法禁用了
    downCallback() {
      return false;
    },
    // 上拉加载
    upCallback(page) {
      this.getGoodsList();
    },
    priceInit(costPrice) {
      const str = String(toDecimal2(costPrice));
      return str.split(".");
    },
    // 获取商品列表
    getGoodsList(page) {
      this.pageNum = this.pageNum + 1;
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        saleType: this.saleType,
      };
      getGoodsList(data)
        .then((res) => {
          if (res.code === "000000") {
            if (this.pageNum === 1) {
              this.dataList = [];
            }
            this.dataList = [...this.dataList, ...res.data.list];
            // 向上取整
            this.dataList = this.dataList.map((v) => {
              // 如果没有促销信息，把原价放在促销价上
              if (v.tradeSalePromotionGoodsId === 0) {
                v.costPricePromotion = v.costPrice;
              }
              return v;
            });
            const totalCount = res.data.totalCount;
            const curPageLen = this.pageNum * this.pageSize;
            const hasNext = curPageLen <= totalCount;
            this.mescroll.endSuccess(curPageLen, hasNext);
          } else {
            // this.dataList = [];
            this.mescroll.endSuccess(0, false);
          }
        })
        .catch(() => {
          this.dataList = [];
          this.mescroll.endSuccess(0, false);
        });
    },
    // 跳转到商品详情
    toGoodsDetail(item) {
      uni.navigateTo({
        url: `/pages/serviceDetail/index?goodsId=${item.goodsId}&goodsType=${item.goodsType}&saleType=${item.saleType}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-content {
  // padding-bottom:53rpx;
  background: #f9fafc;
}
.testingIndex {
  &-toApp {
    position: fixed;
    bottom: 0;
    width: calc(100% - 44rpx);
    height: 74rpx;
    padding: 18rpx 22rpx;
    background: #fff;
    box-shadow: 0px -12rpx 48rpx 0px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: flex-start;
    &-btn {
      position: absolute;
      margin-top: 10rpx;
      width: 140rpx;
      height: 54rpx;
      background: #00bda5;
      border-radius: 32rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #ffffff;
      line-height: 54rpx;
      text-align: center;
      right: 30rpx;
    }
    &-img {
      display: block;
      width: 74rpx;
      height: 74rpx;
      margin-right: 16rpx;
    }
    &-text {
      width: 450rpx;
      margin-right: 30rpx;
      &-top {
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #212121;
        line-height: 40rpx;
        margin-bottom: 1rpx;
      }
      &-bottom {
        height: 30rpx;
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 30rpx;
      }
    }
  }
  &-service {
    padding: 0 34rpx;
    width: calc(100% -86rpx);
    &-title {
      height: 36rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 700;
      color: #212121;
      line-height: 36rpx;
      margin-bottom: 30rpx;
    }
    &-list {
      // overflow-y:auto;
      .service-list-content {
        // min-height:410rpx;
        &-item {
          display: flex;
          height: 156rpx;
          background: #ffffff;
          padding: 30rpx;
          border-radius: 12rpx;
          margin-bottom: 20rpx;
          .item-img {
            width: 156rpx;
            height: 156rpx;
            border-radius: 12rpx;
          }
          .item-text {
            position: relative;
            margin-left: 22rpx;
            flex: 1;
            display: flex;
            flex-direction: column;
            &-top {
              font-size: 30rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: bold;
              color: #212121;
              line-height: 42rpx;
              margin-bottom: 14rpx;
              overflow: hidden;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            &-center {
              height: 24rpx;
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
              line-height: 24rpx;
              flex: 1;
            }
            &-bottom {
              // position: absolute;
              // bottom: 4rpx;
              // font-size: 13px;
              // font-family: PingFangSC-Medium, PingFang SC;
              // font-weight: bold;
              color: #ff4b33;
              &-unit {
                height: 24rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #ff4b33;
                line-height: 24rpx;
              }
              &-price {
                height: 36rpx;
                font-size: 36rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #ff4b33;
                line-height: 36rpx;
              }
              &-price1 {
                height: 24rpx;
                font-size: 26rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #ff4b33;
                line-height: 24rpx;
              }
            }
            .item-text-price {
              display: flex;
              align-items: center;
            }
            .old-price {
              font-size: 15px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              text-decoration: line-through;
              padding-left: 6px;
            }
            .drug-desc {
              height: 15px;
              border-radius: 4px;
              background: rgba(255, 94, 87, 0.1);
              width: max-content;
              display: flex;
              align-items: center;
              padding: 0 4px;
              box-sizing: border-box;
              margin-left: 5px;
              .tag-text {
                font-size: 10px;
                color: #ff4b33;
                line-height: 15px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      .service-list-nodata {
        background-color: #fff;
        padding: 108rpx 10rpx 400rpx;
        border-radius: 12rpx;
        &-img {
          display: block;
          width: 486rpx;
          height: 254rpx;
          margin: 0 auto;
        }
        &-text {
          text-align: center;
          height: 50rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #02120f;
          line-height: 50rpx;
        }
      }
    }
  }
  &-top {
    width: 100%;
    height: 350rpx;
    padding: 108rpx 24rpx 0 24rpx;

    background: linear-gradient(180deg, #02b9a3 0%, #12c4ad 45%, #f9fafa 90%);
    .testingIndex-top-logo {
      width: 202rpx;
      height: 42rpx;
    }

    &-btns {
      // height: 218rpx;
      display: flex;
      padding: 36rpx 30rpx 44rpx 30rpx;
      background: #ffffff;
      box-shadow: 0rpx 10rpx 36rpx 0px rgba(21, 61, 85, 0.04);
      border-radius: 22rpx;
      margin: -264rpx 34rpx 40rpx;
      &-item {
        flex: 1;
        .btns-item-img {
          display: block;
          margin: 0 auto 8rpx auto;
          width: 100rpx;
          height: 100rpx;
        }
        .btns-item-title {
          text-align: center;
          display: block;
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 30rpx;
          text-align: center;
        }
      }
    }
  }
}
</style>
