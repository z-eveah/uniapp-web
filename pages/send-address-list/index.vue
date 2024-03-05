<template>
  <view class="mall_container address-list-container">
    <view class="page-content">
      <view v-if="addressList.length == 0" class="no-data">
        <img class="no-icon" src="https://test1-file.yunqueyi.com/image/png/common/20220705112744798.png" alt="" />
        <text class="no-msg">暂无地址</text>
      </view>
      <view v-if="addressList" class="address-list-content mall_content">
        <u-radio-group v-model="selectSendAddressItemId" placement="column" @change="addressChange">
          <view v-for="item in addressList" :key="item.id" class="address-li" @click="addressClick(item)">
            <view class="address-li-l">
              <view class="checkbox">
                <u-radio :name="item.id" active-color="#00BDA5"> </u-radio>
              </view>
              <view class="address-msg">
                <view class="name">
                  <text>{{ item.userName }}</text>

                  <text>{{ item.mobilePhone }}</text>
                </view>
                <view class="address-detail">
                  <text>{{ item.provinceName }}{{ item.cityName }}{{ item.countyName }}{{ item.address }}</text>
                </view>
              </view>
            </view>
            <view class="address-li-r" @click.stop="goAddAddress(item)">
              <view>
                <img
                  src="https://test1-file.yunqueyi.com/image/png/common/20220705112831104.png"
                  alt=""
                  class="edit-icon"
                  @click.stop="goAddAddress(item)"
                />
              </view>
            </view>
          </view>
        </u-radio-group>
      </view>
      <view class="add-address">
        <view class="add-btn" @click="goAddAddress('')">
          <img
            class="button-icon"
            src="https://test1-file.yunqueyi.com/image/png/common/20220705112856181.png"
            alt=""
          />
          新增地址
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { getSendAddressList, updateLastUsed } from "@/api/sample.js";
import { mapMutations } from "vuex";

export default {
  components: {},
  data() {
    return {
      addressList: [],
      selectSendAddressItem: {},
      selectSendAddressItemId: "",
      selectID: "",
      radio: "1",
      loading: false,
      finished: true,
      form: "",
      doctorId: "",
      pageFrom: "",
      isAddAdress: {
        pageType: "",
        id: "",
      },
      parmsAddress: {
        pageNo: 1,
        pageSize: 30,
      },
    };
  },
  onLoad(options) {
    this.doctorId = options.doctorId || "";
    this.hospitalId = options.hospitalId || "";
    uni.removeStorageSync("selectSendAddressItem");
    this.recommendationOrderId = options.recommendationOrderId;
    this.getBillList();
  },
  beforeUnmount() {
    const val = uni.getStorageSync("selectSendAddressItem");
    if (!val && this.addressList.length) {
      uni.setStorageSync("selectSendAddressItem", JSON.stringify(this.selectSendAddressItem));
    }
  },
  methods: {
    ...mapMutations({
      setExpressInfo: "SET_EXPRESS_INFO",
      setExpressChange: "SET_EXPRESS_CHANGE",
    }),
    addressChange(val) {
      const item = this.addressList.filter((v) => {
        if (v.id == val) {
          return v;
        }
      })[0];
      this.addressClick(item);
    },
    addressClick(item) {
      const params = {
        id: item.id,
        hospitalId: this.hospitalId,
      };
      updateLastUsed(params).then((res) => {
        if (item) {
          uni.setStorageSync("selectSendAddressItem", JSON.stringify(item));
        }
        this.setExpressInfo(item);
        this.setExpressChange(true);
        uni.navigateBack({});
      });
    },
    goAddAddress(item) {
      this.setExpressInfo(item);
      this.setExpressChange(true);
      let edite = item ? 1 : "";
      console.log(item);
      let id = item ? item.id : "";
      uni.navigateTo({
        url: `/pages/change-address/index?id=${id}&hospitalId=${this.hospitalId}&edite=${edite}`,
      });
    },
    getBillList() {
      this.loading = true;
      const params = {
        bizType: 2,
        doctorId: this.doctorId,
      };
      getSendAddressList(params).then((res) => {
        if (res && res.code == "000000") {
          this.addressList = res.data.list;
          this.addressList.forEach((v) => {
            if (v.lastUsed) {
              this.selectSendAddressItemId = v.id;
            }
          });
          this.handelAddress();
        }
      });
    },
    handelAddress() {
      // this.addressList.filter((item) => {
      //   if (item.lastUsed) {
      //     this.selectSendAddressItem = item;
      //     return (this.selectID = item.lastUsed);
      //   }
      // });
      this.addressList.filter((item) => {
        if (item.lastUsed) {
          this.selectSendAddressItem = item;
          return (this.selectID = item.lastUsed);
        }
      });
      if (!this.selectSendAddressItem.id) {
        this.selectID = this.addressList[0].id;
        this.selectSendAddressItem = this.addressList[0];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
