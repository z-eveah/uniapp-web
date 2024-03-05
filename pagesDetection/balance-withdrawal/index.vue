<template>
  <view class="balance-withdraw-wrap">
    <!-- 余额卡片展示区域 -->
    <view class="balance-container">
       <view class="balance-top">
          <view class="balance-left">
              <img class="cashIcon" src="https://files.yunqueyi.com/image/png/common/20230814143820196.png" alt=""/>
              <view class="cashDetail">
                  <view ><text class="cashNum" >{{myAmount}}</text>元</view>
                  <view class="cashTips"  v-if="myAmount<10">{{lowPriceRemark}}</view>
                  <view class="cashTips" v-else>{{myRemark}}</view>

              </view>
          </view>
           <view 
              v-if="myAmount>10"
              class="getCashBtn active"
              @click="getCashTo"
            >
                提现
          </view>
           <view 
            class="getCashBtn"
            v-else
          >
              提现
           </view>
          
       </view>
       <!-- 卡片下方展示金额数据 -->
       <view class="balance-data">
          <view class="balanceData-item ">
              <view class="balanceDataNum"><text class="num">{{amountSum}}</text>元</view>
              <view class="balanceDataTips">累计收益</view>
          </view>
          <view class="balanceData-item">
            <view class="balanceDataNum"><text class="num">{{amountWithdrawal}}</text>元</view>
            <view class="balanceDataTips">累计提现</view>
          </view>
       </view>
       
    </view>
    <!-- 收益与提现tab切换区域 -->
    <view class="cash-tab-container">
      <view class="cash-tab-header">
        <view
          class="tab-header-item"
          @click="changeTab('tab1')"
        >
          <view 
            class="activeText"
            :class="{ 'active': activeTab === 'tab1' }"
            >收益明细</view>
          <view 
           v-if=" activeTab === 'tab1' " 
           class="activeBot"></view>
        </view>
        <view
          class="tab-header-item"
          @click="changeTab('tab2')"
        >
          
          <view 
            class="activeText"
            :class="{ 'active': activeTab === 'tab2' }"
            >提现记录</view>
           <view 
              v-if=" activeTab === 'tab2' " 
            class="activeBot"></view>
        </view>
      </view>
      <!-- tab具体内容展示区 -->
      <view class="cash-tab-content">
        <view v-show="activeTab === 'tab1'" class="tab-pane">
         
          <mescroll-body
            ref="mescrollRef"
            bottom="50"
            height="100%"
            :down="downOption"
            :up="upOption"
            @init="mescrollInit"
            @down="downCallback"
            @up="upCallback"
            class="scroll-view"
            v-if="activeTab === 'tab1' && IncomeList.length > 0"
          >
            <view class="cash-list">
              <!-- 渲染列表数据 -->
              <view  v-for="(item, index) in IncomeList" :key="index" class="cash-list-item">
                <view>
                    <view class="itemName itemName2">
                      {{item.typeStr}}
                      <div v-if="item.status == 4">
                        {{ item.statusStr }}
                      </div>
                    </view>
                    <view class="itemTime">{{formatTime(item.applyTimestamp)}}</view>
                </view>
                <view>
                  <view class="itemPrice"> <span>{{ item | filterTransType }}</span>{{(item.amount/100).toFixed(2)}}</view>
                  <view 
                        class="itemStatus"
                        v-if="item.status != 4"
                        :class="{
                          'total-status-s': item.status == 2,
                          'total-status-f': item.status == 3,
                        }"
                        >
                        {{item.statusStr}}
                    </view>
                </view>
              </view>
              <view class="noMore" v-if="showNoMore1">暂无更多记录</view>
            </view>
           

          </mescroll-body>
         <!-- 没数据时候展示 -->
          <view class="list-empty" v-else>
            <view ><image
              class="empty-img"
              src="https://files.yunqueyi.com/image/png/common/20230817160035997.png"
              mode=""
            /></view>
             <view>暂无相关记录</view>
          </view>
        </view>
  
  
        <view v-show="activeTab === 'tab2'" class="tab-pane">
           <mescroll-body
              ref="mescrollRef2"
              bottom="50"
              height="100%"
              :down="downOption2"
              :up="upOption2"
              @init="mescrollInit2"
              @down="downCallback2"
              @up="upCallback2"
              class="scroll-view"
              v-if="activeTab === 'tab2' && withDrawList.length > 0"
            >
              <view class="cash-list">
                <!-- 渲染列表数据 -->
                <view v-for="(item, index) in withDrawList" :key="index" class="cash-list-item">
                  <view>
                      <view class="itemName">{{item.typeStr}}</view>
                      <view class="itemTime">{{formatTime(item.applyTimestamp)}}</view>
                  </view>
                  <view>
                    <view class="itemPrice">{{(item.amount/100).toFixed(2)}}</view>
                    <view 
                        class="itemStatus"
                        :class="{
                          'total-status-s': item.status == 2,
                          'total-status-f': item.status == 3,
                        }"
                        >
                        {{item.statusStr}}
                    </view>
                    <!-- <view class="itemStatusCon">
                        <view class="itemStatus">{{item.statusStr}}</view>
                        <view><img  class="itemArrow" src="https://files.yunqueyi.com/image/png/common/20230814201340626.png" alt=""/></view>
                      
                    </view> -->
                  </view>
                 
                </view>
                <view class="noMore" v-if="showNoMore2">暂无更多记录</view>
              </view>
            </mescroll-body>
             <!-- 没数据时候展示 -->
          <view class="list-empty" v-else>
            <view ><image
              class="empty-img"
              src="https://files.yunqueyi.com/image/png/common/20230817160035997.png"
              mode=""
            /></view>
             <view>暂无相关记录</view>
          </view>
        </view>
      </view>
    </view>
    <u-modal
        :show="showModal"
        title="提示"
        content="目前仅支持到云鹊医App提现，待后续升级…"
        confirm-color="#00BDA5"
        width="300"
        @confirm="cashSureBtn"
        confirm-text="我知道了"
      ></u-modal>
  </view>
  
</template>

<script>
import { balanceList,balanceProfitList,balanceInfo,accountPayMes } from "@/api/detection.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  filters: {
    filterDate(time) {
      return new Date(new Date(time).getTime()).format('yyyy/MM/dd hh:mm:ss');
    },
    filterPrice(price) {
      return toDecimal2(price);
    },
    filterTransType(item) {
      {
        {
          item.transType == 1 ? '+' : '-';
        }
      }
      if (item.transType == 1) {
        if (item.status == 4) {
          return '-';
        }
        return '+';
      } else {
        return '-';
      }
    },
  },
  mixins: [MescrollMixin],
  data() {
    return {
      activeTab: 'tab1',
      loading1:true,
      loading2:true,
      showModal:false,
      showNoMore1:false,
      showNoMore2:false,
     // 第一个tab
      mescroll: null,
      downOption: {
        isLock: true,
      },
      upOption: {
        auto: false,
        empty: {
          use: false,
        },
        textNoMore: "暂无更多记录",
      },
      //第二个tab
      downOption2: {
        isLock: true,
      },
      upOption2: {
        auto: false,
        empty: {
          use: false,
        },
        textNoMore: "暂无更多记录",
      },
      // 卡片数据
      IncomeList:[],
      withDrawList:[],
      myAmount:0 ,
      myRemark:"2小时到账，每日限取10次，还剩10次",
      lowPriceRemark:'满10元可提现',
      amountFreeze:0, // 待到账金额
      amountWithdrawal:0, // 累计提现
      remainTimes:0, // 剩余次数
      amountSum:0, // 累计收益
      pageNo: 0,
      pageSize: 10,
      pageNo2: 0,
      pageSize2: 10,
      balaceType: 4,
      // 收益到账记录
    };
  },
  onShow() {
    this.balanceInfo();
    this.accountPayMes();
    
    if(this.activeTab === 'tab1'){
      this.pageNo = 0;
      this.balanceProfitList()
    }else{
      this.pageNo2 = 0;
      this.balanceList();
    }
  },
  onLoad(options) {
   
    const that = this;
    that.balanceProfitList()
    uni.$on("reload", function () {
      that.pageNo = 0;
      that.pageNo2 = 0;
      that.balanceProfitList()
      if(that.activeTab === 'tab1'){
        that.pageNo = 0;
        that.balanceProfitList()
      }else{
        that.pageNo2 = 0;
        that.balanceList();
      }
    });
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;

      if(tab === "tab2"){
        this.pageNo2 = 0;
        this.balanceList();
      }else{
        this.pageNo = 0;
        this.balanceProfitList()
      }
    },
    // 去提现按钮点击
    getCashTo(){
      this.showModal = true
    },
    cashSureBtn(){
      this.showModal = false
    },
    // 获取个人账户信息
    balanceInfo() {
      balanceInfo().then((res) => {
        let { code, data, message } = res;
        if (code == "000000") {
         const {amount,amountFreeze,amountSum,amountWithdrawal,remainTimes} = data || {}
          this.myAmount = (amount/100).toFixed(2)
          this.amountFreeze = (amountFreeze/100).toFixed(2)
          this.amountWithdrawal = (amountWithdrawal/100).toFixed(2)
          this.amountSum = (amountSum/100).toFixed(2)
          this.remainTimes =  (remainTimes/100).toFixed(2)

        } else {
          this.$toast(message || "操作失败");
        }
      });
    },
    accountPayMes() {
      accountPayMes().then((res) => {
        let { code, data, message } = res;
        if (code == "000000") {
          // const { remark } = data[0]
            data.map((v) => {
              if (v.type === 1) {
                this.myRemark = v.remark
              }else{
                this.myRemark = '2小时到账，每日限取10次，还剩10次'
              }
            });

        } else {
          this.$toast(message || "操作失败");
        }
      });
    },
     // 获取收益明细
     balanceProfitList() {
      this.pageNo = this.pageNo + 1;
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        source:0,
        status:0 
      };
      balanceProfitList(data)
        .then((res) => {
          if (res.code === "000000") {
            if (this.pageNo === 1) {
              this.IncomeList = [];
            }
            this.IncomeList = [...this.IncomeList, ...res.data.contentList];
            const totalCount = res.data.total;
            const curPageLen = this.pageNo * this.pageSize;
            const hasNext = curPageLen <= totalCount;
            if(totalCount <= 10){
              this.showNoMore1 = true
              this.mescroll.endSuccess(0, false);
            }else{
              this.showNoMore1 = false
              this.mescroll.endSuccess(curPageLen, hasNext);
            }
          
          } else {
            // this.IncomeList = [];
            this.mescroll.endSuccess(0, false);
          }
        })
        .catch(() => {
          this.IncomeList = [];
          this.mescroll.endSuccess(0, false);
        });
    },
    // 提现明细
    balanceList() {
      this.pageNo2 = this.pageNo2 + 1;
      const data = {
        pageNo: this.pageNo2,
        pageSize: this.pageSize2,
        type:this.balaceType
      };
      balanceList(data)
        .then((res) => {
          if (res.code === "000000") {
            if (this.pageNo2 === 1) {
              this.withDrawList = [];
            }
            this.withDrawList = [...this.withDrawList, ...res.data.contentList];
            // // 向上取整
            // this.withDrawList = this.withDrawList.map((v) => {
            //  
            //   if (v.tradeSalePromotionGoodsId === 0) {
            //     v.costPricePromotion = v.costPrice;
            //   }
            //   return v;
            // });
            const totalCount = res.data.total;
            const curPageLen = this.pageNo2 * this.pageSize2;
            const hasNext = curPageLen <= totalCount;
            if(totalCount <= 10){
              this.showNoMore2 = true
              this.mescroll.endSuccess(0, false);
            }else{
              this.showNoMore2 = false
              this.mescroll.endSuccess(curPageLen, hasNext);
            }
           
          } else {
            // this.withDrawList = [];
            this.mescroll.endSuccess(0, false);
          }
        })
        .catch(() => {
          this.withDrawList = [];
          this.mescroll.endSuccess(0, false);
        });
    },
    // 时间格式化处理
    formatTime(date = 0, fmt = 'yyyy-MM-dd hh:mm:ss') {  
        date = new Date(date);// 当时间戳为10位时需要*1000，时间戳为13位的话不需*1000
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
          }
        }
        return fmt;
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
      this.balanceProfitList();
    },

    // 第二个tab
     //  init mescroll
     mescrollInit2(mescroll) {
      this.mescroll = mescroll;
    },
    // down 方法禁用了
    downCallback2() {
      return false;
    },
    // 上拉加载
    upCallback2(page) {
      this.balanceList();
    },
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss"
</style>
