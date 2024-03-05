<template>
  <view class="serviceDetail">
    <view class="serviceDetail-customBtn" @click="backBtn">
      <u-icon name="arrow-left" color="#fff" size="30rpx"></u-icon>
    </view>
    <view class="serviceDetail-swiper">
      <u-swiper
        :list="resource"
        key-name="url"
        :height="375"
        :autoplay="false"
        :current="currentNum"
        @change="(e) => (currentNum = e.current)"
      >
        <view slot="indicator" class="indicator-num">
          <text class="indicator-num__text">{{ shwocurrentNum }}/{{ resource.length }}</text>
        </view>
      </u-swiper>
    </view>
    <view class="goods-info" v-if="isLoadingComplete">
      <view v-if="!isShowActive">
        <view class="goods-info-price">
          <view class="goods-name">
             <view class="goods-info-price-l">
                <view class="price-l"> ￥ </view>
                <view class="price-c">
                  {{ priceArr[0] }}
                </view>
                <view class="price-r"> .{{ priceArr[1] ? priceArr[1] : "00" }} </view>
             </view>
             <view class="goods-tag-l">
                <view v-if="goodsInfo.leastCount && type == 1" class="tag"> {{ goodsInfo.leastCount }}件起购 </view>
                <view v-if="goodsInfo.minWhole && type == 2" class="tag"> {{ goodsInfo.minWhole }}件起批 </view>
                <view v-if="goodsInfo.goodsIntro" class="tag">
                  {{ goodsInfo.goodsIntro }}
             </view>
          </view>
          </view>
          <view class="goods-name">
               <view v-if="goodsInfo.cashBack" class="goods-info-price-r">
                <view class="return-cash">
                  <view class="cash-l"> 患教费 </view>
                  <view class="cash-r"> ￥{{ cashBackArr[0] }}.{{ cashBackArr[1] ? cashBackArr[1] : "00" }} </view>
                </view>
              </view>
              <view class="goods-tag-r" :class="{'isShowBottom':(!goodsInfo.cashBack && (type || goodsInfo.goodsIntro))}">
                <view>库存{{ goodsInfo.goodsStock }}</view>
                <view class="m-num"> 销量{{ goodsInfo.quantityOfSale }} </view>
              </view>
          </view>
        </view>
        <!-- <view class="goods-tag-container">
          
          
        </view> -->
      </view>
      <view v-if="isShowActive">
        <view class="goods-tag-container">
          <view class="goods-tag-l">
            <view v-if="goodsInfo.leastCount && goodsType == 1" class="tag"> {{ goodsInfo.leastCount }}件起购 </view>
            <view v-if="goodsInfo.minWhole && goodsType == 2" class="tag"> {{ goodsInfo.minWhole }}件起批 </view>
            <view v-if="goodsInfo.goodsIntro" class="tag">
              {{ goodsInfo.goodsIntro }}
            </view>
            <view v-if="goodsInfo.cashBack" class="goods-info-price-r">
              <view class="return-cash">
                <view class="cash-l"> 患教费 </view>
                <view class="cash-r"> ￥{{ cashBackArr[0] }}.{{ cashBackArr[1] ? cashBackArr[1] : "00" }} </view>
              </view>
            </view>
          </view>
          <view class="goods-tag-r">
            <view>库存{{ goodsInfo.goodsStock }}</view>
            <view class="m-num"> 销量{{ goodsInfo.quantityOfSale }} </view>
          </view>
        </view>
      </view>
      <view class="goods-name-container">
        <!-- <span class="goods-tag">处方药</span> -->
        {{ goodsInfo.goodsName }}
      </view>
      <view class="goods-msg-container">
        <view class="goods-msg-main">
          <view :class="isGoodsDescription ? 'descriptions' : 'descriptions-no'" @click="shwoPopup">
            {{ goodsType === 337 ? "服务说明" : "药品说明" }} &gt;
          </view>
          {{ goodsInfo.goodsDescription }}
        </view>
      </view>
    </view>
    <view class="shop-container" v-if="isLoadingComplete">
      <view class="shop-content">
        <view class="shop-container-l">
          <img v-if="storeInfo.storeLogo" :src="storeInfo.storeLogo" alt="" />
          <image v-else src="https://files.yunqueyi.com/image/png/common/20220705133225626.png" alt=""></image>
        </view>
        <view class="shop-container-r">
          <view class="shop-name">
            {{ storeInfo.storeName }}
            <image
              v-if="storeInfo.storeQualityUrl"
              src="https://files.yunqueyi.com/image/jpeg/common/20220705133339846.jpg"
              alt=""
            ></image>
          </view>
          <view v-if="goodsInfo.storeIntro" class="freight">
            {{ goodsInfo.storeIntro }}
          </view>
        </view>
      </view>
    </view>
    <!-- // 商品描述 -->
    <view class="goods-desc">
      <view class="desc-title"> 商品详情 </view>
      <view v-if="goodsInfo.otc" class="otc-tip">
        <view class="otc-msg">
          <image class="tip-icon" src="https://files.yunqueyi.com/image/png/common/20220705140833131.png"></image>
          <p class="tip-main">依据国家规定，除药品质量原因外，药品一经售出，不得退换。</p>
        </view>
        <view v-if="type == 1" class="otc-step-wrap">
          <image class="otc-step-icon" src="https://files.yunqueyi.com/image/png/common/2022070514091250.png"></image>
        </view>
      </view>
      <view v-for="(item, index) in goodsCheckImages" :key="item.id">
        <image v-if="item.imageType == 4" :src="item.imageUrl" class="des-img" mode="widthFix"></image>
        <!--  -->
        <video
          v-if="item.imageType == 5"
          :id="`video${index}`"
          controls
          class="des-video"
          :src="item.imageUrl"
          :poster="`${item.imageUrl}?vframe/jpg/offset/0`"
        >
          <!-- <source :src="item.imageUrl" type="video/mp4" /> -->
        </video>
      </view>
    </view>
<!--    <view class="serviceDetail-bottom">-->
<!--      <view class="serviceDetail-bottom-btn" @click="toPage"> 去App下单 </view>-->
<!--    </view>-->
    <!-- 服务说明 -->
    <u-popup :show="stateShow" round="10rrpx" mode="bottom" closeable class="descriptions-popup" @close="closePopup">
      <view class="descriptions-title">
        {{ goodsType === 337 ? "服务说明" : "药品说明" }}
        <view class="close-img-container">
          <!-- <img
	              class="close-img"
	              src="~@/assets/images/icon-close.png"
	              alt=""
	              @click="stateClose"
	            > -->
        </view>
      </view>
      <view class="descriptions-content">
        <view v-for="(item, index) in explainList" :key="index" class="goods-rule">
          <view v-if="medicalDetailFieldMap[item.name]" class="rule-item">
            <span class="title">{{ item.title }}: </span>
            <span
              v-if="item.isHtml && medicalDetailFieldMap[item.name]"
              class="ex-html rule-main"
              v-html="medicalDetailFieldMap[item.name]"
            />
            <span v-else class="exp-conet rule-main">{{ medicalDetailFieldMap[item.name] }}</span>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getServiceDetail, getGoodsDetailById } from "@/api/serviceDetail.js";
import { mToArr, serviceExpInfo } from "@/utils/common.js";
export default {
  data() {
    return {
      isShowActive: false,
      goodsInfo: {},
      goodsCheckImages: [],
      priceArr: [],
      currentNum: 0,
      storeInfo: {},
      resource: [],
      stateShow: false,
      medicalDetailFieldMap: {},
      explainList: [],
      goodsType: "",
      type:0,
      isLoadingComplete:false
    };
  },
  computed: {
    isGoodsDescription() {
      return this.goodsInfo.goodsDescription && this.goodsInfo.goodsDescription.length > 0;
    },
    shwocurrentNum() {
      if (this.resource.length === 0) {
        return this.resource.length;
      } else {
        return this.currentNum + 1;
      }
    },
  },
  onLoad(options) {
    const { goodsId, saleType, goodsType } = options;
    const data = {
      goodsId,
      saleType,
    };
    this.goodsType = goodsType;
    console.log(this.goodsType, "this.goodsType");
    if (goodsType == 337) {
      this.getServiceDetail(data);
    } else {
      this.getGoodsDetailById(data);
    }
    // 禁用分享功能
    uni.hideShareMenu();
  },
  methods: {
    backBtn() {
      //处理返回事件
      uni.switchTab({
        url: "/pages/home/index",
      });
    },
    // 处理返回值
    respFun(res) {
      const { goodsInfo, medicalService, storeInfo } = res.data;
      let goodsHeaderImages = [];
      let goodsVideoList = "";
      this.resource = [];
      this.priceArr = mToArr(goodsInfo.costPrice);
      this.goodsInfo = { ...goodsInfo };
      this.type = goodsInfo.saleType;
      this.storeInfo = { ...storeInfo };
      this.goodsCheckImages = medicalService.goodsCheckImages;
      this.isLoadingComplete = true; // 数据初步加载完成
      goodsHeaderImages = goodsInfo.goodsHeaderImages.map((item) => item.goodsImgUrl);
      // 取视频列表第0 个视频
      goodsVideoList = goodsInfo.goodsVideoList.length > 0 ? goodsInfo.goodsVideoList[0].goodsImgUrl : "";
      // 有视频的时候push
      if (goodsVideoList) {
        this.resource.push(goodsVideoList);
      }
      this.medicalDetailFieldMap = medicalService.medicalDetailFieldMap; // 说明书
      this.explainList = serviceExpInfo().filter((item) => {
        return this.medicalDetailFieldMap[item.name];
      });
      this.resource = [...this.resource, ...goodsHeaderImages];
    },
    // 商品类型
    getGoodsDetailById(data) {
      getGoodsDetailById(data).then((res) => {
        console.log(res);
        let goodsHeaderImages = [];
        let goodsVideoList = "";
        const { costPrice, storeIntro, storeLogo, storeName, storeQualityUrl, medicalDetailFieldMap } = res.data;
        this.priceArr = mToArr(costPrice);
        this.goodsInfo = { ...res.data };
        this.type = this.goodsInfo.saleType;
        this.storeInfo = { storeIntro, storeLogo, storeName, storeQualityUrl };
        this.isLoadingComplete = true; // 数据初步加载完成
        // 处理字段
        this.goodsCheckImages = res.data.medicationExplainImgUrls2.map((item) => {
          return {
            imageUrl: item.goodsImgUrl,
            imageType: item.imgType,
          };
        });
        this.cashBack = data.cashBack ? mToArr(data.cashBack) : "";
        goodsHeaderImages = res.data.goodsHeadImgUrlList;
        goodsVideoList = res.data.goodsHeadVideoUrlList.length > 0 ? this.goodsInfo.goodsHeadVideoUrlList[0] : "";
        if (goodsVideoList) {
          this.resource.push(goodsVideoList);
        }
        this.resource = [...this.resource, ...goodsHeaderImages];
        this.medicalDetailFieldMap = medicalDetailFieldMap; // 说明书
        this.explainList = serviceExpInfo().filter((item) => {
          console.log(this.medicalDetailFieldMap[item.name]);
          return this.medicalDetailFieldMap[item.name];
        });
        // console.log('--------------------',serviceExpInfo());
      });
    },
    toPage() {
      uni.navigateTo({
        url: "/pages/downloadApp/index",
      });
    },
    // 获取服务类型商品详情
    getServiceDetail(data) {
      getServiceDetail(data).then(this.respFun);
    },
    shwoPopup() {
      this.stateShow = true;
    },
    closePopup() {
      this.stateShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.serviceDetail {
  height: 100vh;
  background: #f5f6f8;
  &-customBtn {
    position: fixed;
    z-index: 10;
    border-radius: 50%;
    top: 102rpx;
    left: 30rpx;
    width: 60rpx;
    height: 60rpx;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-bottom {
    position: fixed;
    bottom: 0;
    height: 142rpx;
    padding-top: 10rpx;
    width: 100%;
    background: #ffffff;
    &-btn {
      width: 702rpx;
      height: 80rpx;
      margin: 0 auto;
      background: linear-gradient(90deg, #ff9f4a 0%, #ff720c 100%);
      border-radius: 80rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #ffffff;
      line-height: 80rpx;
      text-align: center;
    }
  }
  &-swiper {
    width: 100%;
    height: auto;
    overflow: hidden;
    ::v-deep .u-swiper__indicator {
      width: 82rpx;
      height: 48rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 24rpx;
      right: 30rpx;
      bottom: 30rpx;
    }
    ::v-deep .indicator-num__text {
      display: block;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
  .goods-info {
    padding: 26rpx 30rpx;
    background-color: #ffffff;
    .goods-info-price {
      display: flex;
      justify-content: space-between;
      .goods-info-price-l {
        display: flex;
        height: 42rpx;
        align-items: baseline;
        color: #ff4b33;
        .price-l {
          font-size: 30rpx;
          font-weight: 700;
        }
        .price-c {
          margin: 0 4rpx;
          font-size: 50rpx;
          font-weight: 700;
          line-height: 52rpx;
        }
        .price-r {
          font-weight: 700;
          font-size: 34rpx;
        }
      }
      .goods-info-price-r {
        display: flex;
        height: 42rpx;
        align-items: flex-end;
        .return-cash {
          display: flex;
          align-items: center;
          // background-image: url('~@/assets/images/good-detail-cash.png');
          background-size: 100% 100%;
          height: 36rpx;
          padding-right: 4rpx;
          // width: 110rpx;
          color: #ffffff;
          font-family: PingFangSC-Regular, PingFang SC;
          font-size: 24rpx;
          font-weight: 400;
          .cash-l {
            color: #ff4b33;
            padding-left: 8rpx;
          }
          .cash-r {
            color: #ffffff;
            padding-left: 18rpx;
            font-weight: 700;
          }
        }
      }
    }
    .goods-name{
      .goods-tag-l {
        padding-top:20rpx;
        display: flex;
        .tag {
          height: 24rpx;
          padding:7rpx;
          border-radius: 8rpx;
          color: #ff4b33;
          margin-right: 10rpx;
          font-size: 22rpx;
          display: flex;
          line-height:24rpx;
          justify-content: center;
          align-items: center;
          background: rgba(255, 94, 87, 0.1);
          &:last-of-type {
            margin-right: 0;
          }
        }
        .goods-info-price-r {
          display: flex;
          height: 36rpx;
          .return-cash {
            display: flex;
            align-items: center;
            // background-image: url('~@/assets/images/good-detail-cash.png');
            background-size: 100% 100%;
            height: 36rpx;
            // width: 110rpx;
            padding-right: 8rpx;
            color: #ffffff;
            font-family: PingFangSC-Regular, PingFang SC;
            font-size: 24rpx;
            font-weight: 400;
            .cash-l {
              color: #ff4b33;
              padding-left: 8rpx;
            }
            .cash-r {
              color: #ffffff;
              padding-left: 18rpx;
              font-weight: 700;
            }
          }
        }
      }
      .goods-tag-r {
        display: flex;
        align-items: center;
        height: 36rpx;
        color: #999999;
        padding-top:16rpx;
        .m-num {
          margin-left: 20rpx;
        }
      }
      .isShowBottom{
        padding-top:56rpx;
      }
    }
    .goods-tag-container{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20rpx;
      height: autorpx;
      font-family: PingFangSC-Regular, PingFang SC;
      .goods-tag-l {
        display: flex;
        .tag {
          height: 36rpx;
          padding: 0 7rpx;
          border-radius: 8rpx;
          color: #ff4b33;
          margin-right: 10rpx;
          font-size: 22rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 94, 87, 0.1);
          &:last-of-type {
            margin-right: 0;
          }
        }
        .goods-info-price-r {
          display: flex;
          height: 36rpx;
          .return-cash {
            display: flex;
            align-items: center;
            // background-image: url('~@/assets/images/good-detail-cash.png');
            background-size: 100% 100%;
            height: 36rpx;
            // width: 110rpx;
            padding-right: 8rpx;
            color: #ffffff;
            font-family: PingFangSC-Regular, PingFang SC;
            font-size: 24rpx;
            font-weight: 400;
            .cash-l {
              color: #ff4b33;
              padding-left: 8rpx;
            }
            .cash-r {
              color: #ffffff;
              padding-left: 18rpx;
              font-weight: 700;
            }
          }
        }
      }
      .goods-tag-r {
        display: flex;
        align-items: center;
        height: 36rpx;
        color: #999999;
        .m-num {
          margin-left: 20rpx;
        }
      }
    }
    .goods-name-container {
      margin-top: 22rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 700;
      color: #212121;
      line-height: 44rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2; //多行在这里修改数字即可
      -webkit-box-orient: vertical;
      .goods-tag {
        padding: 0 6rpx;
        height: 44rpx;
        font-size: 24rpx;
        text-align: center;
        line-height: 24rpx;
        color: #ffffff;
        margin-right: 10rpx;
        background: linear-gradient(90deg, #01beb8 0%, #42d3af 100%);
        border-radius: 8rpx;
        font-weight: 400;
      }
    }
    .goods-msg-container {
      display: flex;
      margin-top: 22rpx;
      overflow: hidden;
      border-radius: 8rpx;
      padding: 18rpx 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      background: #f9f9f8;
      border-radius: 22rpx;
      .goods-msg-main {
        font-size: 26rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        // display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-align: justify;
        line-height: 40rpx;
        max-height: 80rpx;
        position: relative;
        color: #999999;
        width: 100%;
        &::before {
          content: "";
          height: calc(100% - 36rpx);
          float: right;
        }
        .descriptions {
          position: relative;
          float: right;
          clear: both;
          margin-left: 20rpx;
          margin-top: -4rpx;
          font-size: 26rpx;
          line-height: 40rpx;
          height: 40rpx;
          color: #0d9078;
        }
        .descriptions-no {
          position: relative;
          float: left;
          clear: both;
          margin-top: -4rpx;
          font-size: 26rpx;
          line-height: 40rpx;
          height: 40rpx;
          color: #0d9078;
        }
      }
    }
  }
}
.shop-container {
  margin-top: 16rpx;
  padding: 26rpx 30rpx;
  background: #ffffff;
  .shop-content {
    display: flex;
    align-items: center;
    .shop-container-l {
      width: 80rpx;
      height: 80rpx;
      margin-right: 14rpx;
      image {
        width: 80rpx;
        height: 80rpx;
      }
    }
    .shop-container-r {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .shop-name {
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 700;
        color: #212121;
        line-height: 40rpx;
        display: flex;
        align-items: center;

        image {
          height: 28rpx;
          width: 130rpx;
          margin-left: 17rpx;
        }
      }
      .freight {
        height: 40rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        color: #676869;
        line-height: 40rpx;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
  }
}

.goods-desc {
  margin-top: 16rpx;
  background-color: #ffffff;
  padding-bottom: 152rpx;
  .desc-title {
    padding: 0 30rpx;
    line-height: 76rpx;
    font-weight: 700;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-size: 28rpx;
    color: #212121;
  }
  .otc-tip {
    .otc-msg {
      display: flex;
      padding-left: 30rpx;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 20rpx;
      .tip-icon {
        width: 24rpx;
        height: 24rpx;
        margin-right: 4rpx;
      }
      .tip-main {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
      }
    }
    .otc-step-wrap {
      padding: 34rpx 0;
      background: #ffffff;
      .otc-step-icon {
        display: block;
        margin: 0 auto;
        width: 638rpx;
        height: 210rpx;
      }
    }
  }
  .des-img {
    width: 100%;
    height: auto;
    display: block;
  }
  .des-video {
    width: 100%;
  }
}
.descriptions-title {
  height: 92rpx;
  font-size: 36rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  color: #212121;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  border-bottom: 1rpx solid #e9e9e9;
  position: sticky;
  top: 0;
  background-color: #fff;

  .close-img-container {
    width: 80rpx;
    height: 80rpx;
    position: absolute;
    top: 7rpx;
    right: 33rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .close-img {
      width: 27rpx;
      height: 27rpx;
    }
  }
}
.descriptions-content {
  margin-top: 32rpx;
  margin-bottom: 230rpx;
  .goods-rule {
    padding: 0 30rpx 30rpx;
    .rule-item {
      display: flex;
      align-items: baseline;
      font-size: 28rpx;
      .title {
        flex-shrink: 0;
        color: #999999;
        min-width: 112rpx;
        display: block;
        margin-right: 30rpx;
        word-break: keep-all;
      }
      .rule-main {
        font-weight: 400;
        color: #212121;
        line-height: 36rpx;
        flex-shrink: 1;
        width: 100%;
      }
      .p-wrap-msg {
        margin-top: 0;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: -16rpx;
        width: 100%;
        .suit {
          flex: inherit;
          display: block;
          background-color: rgba(248, 249, 250, 1);
          line-height: 40rpx;
          padding: 0 16rpx;
          margin-right: 12rpx;
          border-radius: 4rpx;
          margin-bottom: 16rpx;
        }
      }
    }
  }
}
</style>
