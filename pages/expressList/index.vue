<template>
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
    <view class="express-list-wrap" :class="{ no: nodata }">
      <view v-if="list.length === 0" class="no-data">
        <image
          class="no-icon"
          src="https://files.yunqueyi.com/image/png/common/20220706171713336.png"
          alt=""
          srcset=""
        ></image>
        <text class="no-msg">暂无送检</text>
      </view>
      <view class="express-list-main">
        <view v-for="item of list" :key="item.sendLogId" class="express-list-item" @click="goDetail(item.sendLogId)">
          <view class="item-num">
            <view class="express-num">
              <text class="label">运单号:</text>
              <text class="num">
                {{ item.wayBillNo }}
              </text>
            </view>
            <view class="copy-wrap" @click.stop="copyFn(item)">
              <view class="copy">复制</view>
            </view>
          </view>
          <view class="express-ad">
            <view class="express-sd">
              <view class="city">
                {{ item.sendCityName }}
              </view>
              <view class="user">
                {{ item.sendPersonName }}
              </view>
            </view>
            <view class="express-status-wrap">
              <view class="express-status" :class="{ over: item.status > 2 }">
                {{ item.statusStr }}
              </view>
              <img
                class="arrows-icon"
                src="https://files.yunqueyi.com/image/png/common/20220706191103371.png"
                alt=""
                srcset=""
              />
            </view>
            <view class="express-gt">
              <view class="city">
                {{ item.receiveCityName }}
              </view>
              <view class="user">
                {{ item.receivePersonName }}
              </view>
            </view>
          </view>
          <view class="list-express-msg">
            <view class="list-msg-wrap">
              <view class="list-msg-label">送检项目:</view>
              <view class="list-msg-main">
                {{ item.checkNames }}
              </view>
            </view>
            <view class="list-msg-wrap">
              <view class="list-msg-label">{{ timeLabel[item.status] }}:</view>
              <view class="list-msg-main">
                {{ timeStr(item) }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </mescroll-body>
</template>

<script>
import { getExpressList, getUserData } from "@/api/expressList";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  name: "ExpressList",
  components: {},
  mixins: [MescrollMixin],
  data() {
    return {
      headerInfo: {
        title: "送检查询",
      },
      mescroll: null,
      // 下拉刷新配置项
      downOption: {
        isLock: true,
      },
      // 上拉加载配置项
      upOption: {
        auto: false,
        empty: {
          use: false,
        },
      },
      hospitalId: "",
      pageNo: 0,
      pageSize: 10,
      nodata: false,
      list: [],
      timeLabel: {
        1: "下单时间",
        2: "下单时间",
        3: "签收时间",
        4: "取消时间",
      },
    };
  },
  onShow() {
    // 返回时重新请求数据
    this.pageNo = 0;
    this.initPageData();
  },
  onLoad(options) {
    // 有 hospitalId 就直接获取列表 ,没有 去请求 hospitalId
    const { hospitalId } = options;
    this.hospitalId = hospitalId;
    console.log(this.hospitalId);
    this.initPageData();
  },
  methods: {
    initPageData() {
      if (!this.hospitalId) {
        this.getUserHospitalId();
      } else {
        this.getList();
      }
    },
    timeStr(expresData) {
      return expresData.status < 3 ? expresData.createOrderTime : expresData.statusTime;
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
      this.getList();
    },

    // 获取机构id
    getUserHospitalId() {
      getUserData()
        .then((res) => {
          if (res.code == "000000") {
            this.hospitalId = res.data.hospitalId;
            this.getList();
          } else {
            this.$toast(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取列表
    getList() {
      this.pageNo = this.pageNo + 1;
      const { hospitalId, pageNo, pageSize } = this;
      getExpressList({
        hospitalId,
        pageNo,
        pageSize,
      })
        .then((res) => {
          if (res.code == "000000" && res.data.list) {
            if (this.pageNo === 1) {
              this.list = [];
            }
            this.list = [...this.list, ...res.data.list];
            const totalCount = res.data.totalCount;
            const curPageLen = this.pageNo * this.pageSize;
            const hasNext = curPageLen <= totalCount;
            this.mescroll.endSuccess(curPageLen, hasNext);
          } else {
            this.mescroll.endSuccess(0, false);
          }
        })
        .catch(() => {
          //  请求失败,隐藏加载状态
          this.mescroll.endErr();
        });
    },
    // 更新订单列表
    getActivedList() {
      getExpressList({
        hospitalId: this.hospitalId,
        pageNo: 1,
        pageSize: this.list.length,
      })
        .then((res) => {
          if (res && res.code == "000000") {
            this.list = res.data.list;
            if (this.list && this.list.length) {
              this.nodata = false;
            } else {
              this.nodata = true;
            }
          }
        })
        .catch(() => {});
    },
    goDetail(sendLogId) {
      uni.navigateTo({
        url: `/pages/express-detail/index?sendLogId=${sendLogId}&hospitalId=${this.hospitalId}`,
      });
    },
    // 复制功能
    copyFn(item) {
      const copyText = item.wayBillNo;
      uni.setClipboardData({
        data: copyText,
        success: function () {
          uni.showToast({
            title: "复制成功",
            duration: 2000,
          });
        },
      });
      // const input = document.createElement("input");
      // input.value = copyText;
      // document.body.appendChild(input);
      // input.select();
      // input.setSelectionRange(0, input.value.length);
      // document.execCommand("Copy");
      // document.body.removeChild(input);
      // this.$toast("已复制");
      // console.log("已复制的内容：", copyText);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
