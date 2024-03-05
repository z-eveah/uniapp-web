<template>
  <view class="healthServiceList">
    <view class="healthServiceList-content">
      <view class="content-topbg">
        <view class="content-topbg-left"> 任务收益 </view>
        <view class="content-topbg-right" @click="toPage">
          收支明细
          <u-icon name="arrow-right" color="#fff" size="12"></u-icon>
        </view>
      </view>
      <view class="content-card">
        <view class="content-card-left">
          <view class="content-card-left-top">
            <image src="https://files.yunqueyi.com/image/png/common/20220704144533918.png" mode=""></image>
            健康服务费
          </view>
          <view class="content-card-left-bottom"> ￥{{ serviceFee[0] }}.{{ serviceFee[1] }} </view>
        </view>
        <view class="content-card-right">
          <view class="content-card-right-top">
            <image src="https://files.yunqueyi.com/image/png/common/20220704145739341.png" mode=""></image>
            云鹊豆
          </view>
          <view class="content-card-right-bottom">
            {{ yunQueBean }}
          </view>
        </view>
      </view>
      <view class="content-rule">
        <view class="content-rule-title"> 服务规则说明 </view>
        <view v-for="(item, index) in ruleList" :key="index" class="content-rule-item">
          <view class="content-rule-item-dot"> </view>
          {{ item.text }}
        </view>
      </view>
      <view class="content-task">
        <view class="content-task-title"> 任务列表 </view>
        <view v-for="(item, index) in mssionsList" :key="index" class="content-task-item">
          <view class="content-task-item-img">
            <image :src="item.img" mode=""></image>
          </view>
          <view class="content-task-item-text">
            <view class="content-task-item-text-title">
              {{ item.title }}
            </view>
            <view class="content-task-item-text-num">
              <text>+{{ item.credit }}</text
              >云鹊豆<image src="https://files.yunqueyi.com/image/png/common/20220704145739341.png" mode=""></image>
            </view>
          </view>
          <view class="content-task-item-btn" @click="toPage">
            {{ item.btnName }}
          </view>
        </view>
      </view>
    </view>
<!--    <view class="healthServiceList-toApp">-->
<!--      <image-->
<!--        src="https://files.yunqueyi.com/image/png/common/20220701134835727.png"-->
<!--        class="healthServiceList-toApp-img"-->
<!--      ></image>-->
<!--      <view class="healthServiceList-toApp-text">-->
<!--        <view class="healthServiceList-toApp-text-top"> 云鹊医App </view>-->
<!--        <view class="healthServiceList-toApp-text-bottom"> 更多居民健康管理服务，请至云鹊医App查看 </view>-->
<!--      </view>-->
<!--      <view class="healthServiceList-toApp-btn" @click="toPage"> 立即打开 </view>-->
<!--    </view>-->
  </view>
</template>

<script>
import { toDecimal2 } from "@/utils/common.js";
import { getFeeByDoctorId, getMissionsList } from "@/api/healthServiceList";
export default {
  data() {
    return {
      serviceFee: [],
      yunQueBean: "",
      ruleList: [
        {
          text: "邀请居民进行早筛检测，并发送至少1次健康宣教，即可获得10元现金奖励；",
        },
        {
          text: "给完成检测的居民进行健康服务，即可获得云鹊豆；",
        },
        {
          text: "奖励可在机构回款后提现至微信钱包；",
        },
        {
          text: "1个居民只发放1次现金奖励，多次检测不发放现金奖励，但可获得相应任务的云鹊豆；",
        },
        {
          text: "免费检测的机构不参与此活动。",
        },
      ],
      mssionsList: [],
      imgList: [
        {
          img: "https://files.yunqueyi.com/image/png/common/20220704160132363.png",
        },
        {
          img: "https://files.yunqueyi.com/image/png/common/20220704160231871.png",
        },
        {
          img: "https://files.yunqueyi.com/image/png/common/20220704160319481.png",
        },
        {
          img: "https://files.yunqueyi.com/image/png/common/20220704160348726.png",
        },
        {
          img: "https://files.yunqueyi.com/image/png/common/20220704160435471.png",
        },
      ],
    };
  },
  onLoad() {
    this.getFeeByDoctorId();
    this.getMissionsList();
  },
  methods: {
    priceInit(costPrice) {
      const str = String(toDecimal2(costPrice));
      return str.split(".");
    },
    getMissionsList() {
      getMissionsList().then((res) => {
        const data = res.data;
        data.forEach((ele, index) => {
          ele.img = this.imgList[index].img;
        });
        this.mssionsList = res.data;
      });
    },
    toPage() {
      uni.navigateTo({
        url: "/pages/downloadApp/index",
      });
    },
    getFeeByDoctorId() {
      getFeeByDoctorId().then((res) => {
        this.serviceFee = this.priceInit(res.data.serviceFee || 0);
        this.yunQueBean = res.data.yunQueBean;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.healthServiceList {
  width: 100%;
  height: 100vh;
  background: #f9f9f9;
  &-toApp {
    position: fixed;
    top: 0;
    z-index: 9;
    width: calc(100% - 44rpx);
    height: 74rpx;
    padding: 18rpx 22rpx;
    background: #f2fbfa;
    box-shadow: 0px -12rpx 48rpx 0px rgba(0, 0, 0, 0.08);
    display: flex;
    &-btn {
      position: absolute;
      margin-top: 20rpx;
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
        margin-bottom: 2rpx;
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

  &-content {
    padding-top: 100rpx;
    .content-task {
      width: 642rpx;
      height: 782rpx;
      padding: 30rpx;
      background: #ffffff;
      border-radius: 22rpx;
      margin: 0 auto;
      &-title {
        height: 50rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #212121;
        line-height: 50rpx;
        margin-bottom: 30rpx;
      }
      &-item {
        position: relative;
        height: 80rpx;
        padding: 40rpx 0;
        display: flex;
        border-bottom: 0.5px solid #f0f1f2;
        &-btn {
          position: absolute;
          width: 132rpx;
          background: linear-gradient(90deg, #ff9f4a 0%, #ff720c 100%);
          border-radius: 60rpx;
          height: 56rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 56rpx;
          text-align: center;
          right: 0px;
          bottom: 56rpx;
        }
        &-img {
          width: 80rpx;
          height: 80rpx;
          margin-right: 14rpx;
          image {
            width: 80rpx;
            height: 80rpx;
          }
        }
        &-text {
          &-title {
            height: 30rpx;
            font-size: 30rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #000000;
            line-height: 30rpx;
            margin-bottom: 16rpx;
          }
          &-num {
            display: flex;
            height: 24rpx;
            font-size: 24rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #666666;
            line-height: 24rpx;
            text {
              color: #ff720c;
            }
            image {
              width: 24rpx;
              height: 24rpx;
            }
          }
        }
      }
      .content-task-item:last-child {
        border: none;
      }
    }
    .content-rule {
      width: 642rpx;
      height: 388rpx;
      background: url("https://files.yunqueyi.com/image/png/common/20220704151355831.png") no-repeat left top;
      background-size: 100% 100%;
      margin: 0 auto 20rpx auto;
      padding: 36rpx 30rpx 0 30rpx;
      &-title {
        height: 50rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #212121;
        line-height: 50rpx;
        margin-bottom: 16rpx;
      }
      &-item {
        position: relative;
        padding-left: 28rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #212121;
        line-height: 32rpx;
        margin-bottom: 12rpx;
        &-dot {
          position: absolute;
          width: 12rpx;
          height: 12rpx;
          top: 10rpx;
          left: 0px;
          background: #ff9d47;
          border-radius: 50%;
        }
      }
    }
    .content-card {
      position: relative;
      display: flex;
      width: 670rpx;
      height: 164rpx;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.81) 0%, #ffffff 40%);
      box-shadow: 0px -4rpx 0px 0px #ffffff;
      border-radius: 22rpx;
      margin: -136rpx auto 0 auto;
      padding-left: 32rpx;
      padding-top: 48rpx;
      z-index: 2;
      &-right {
        &-bottom {
          height: 48rpx;
          font-size: 46rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: #212121;
          line-height: 56rpx;
        }
        &-top {
          position: relative;
          width: 126rpx;
          height: 40rpx;
          background: linear-gradient(90deg, #fff4b8 0%, rgba(254, 248, 229, 0) 100%);
          border-radius: 22rpx;
          padding-left: 50rpx;
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #c0750e;
          line-height: 40rpx;
          margin-bottom: 16rpx;
          image {
            position: absolute;
            width: 36rpx;
            height: 36rpx;
            left: 16rpx;
            top: 2rpx;
          }
        }
      }
      &-left {
        margin-right: 170rpx;
        &-bottom {
          height: 56rpx;
          font-size: 46rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: #212121;
          line-height: 56rpx;
        }
        &-top {
          position: relative;
          width: 130rpx;
          height: 40rpx;
          padding-left: 50rpx;
          background: linear-gradient(90deg, rgba(254, 186, 121, 0.34) 0%, rgba(254, 248, 229, 0.34) 100%);
          border-radius: 22rpx;
          // opacity: 0.34;

          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #d37019;
          line-height: 40rpx;
          margin-bottom: 16rpx;
          image {
            position: absolute;
            width: 34rpx;
            height: 34rpx;
            left: 16rpx;
            top: 2rpx;
          }
        }
      }
    }
    .content-topbg {
      position: relative;
      width: 100%;
      height: 262rpx;
      background: linear-gradient(180deg, #f78118 0%, #f78118 14%, #fba151 70%, #f9f9f9 100%);
      border-radius: 2rpx;
      &-left {
        position: absolute;
        width: 288rpx;
        height: 50rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #ffffff;
        line-height: 50rpx;
        left: 54rpx;
        top: 46rpx;
      }
      &-right {
        position: absolute;

        display: flex;
        justify-content: center;
        right: 24rpx;
        top: 46rpx;
        width: 162rpx;
        height: 48rpx;
        background: rgba(255, 255, 255, 0.11);
        border-radius: 24rpx;
        border: 1px solid rgba(255, 255, 255, 0.42);

        font-size: 26rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #ffffff;
        line-height: 48rpx;
        text-align: center;
      }
    }
  }
}
</style>
