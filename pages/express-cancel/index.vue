<template>
  <view class="express-cancel">
    <view class="express-cancel-form">
      <view class="express-cancel-title"> 取消原因 </view>
      <view v-for="(item, index) in fieldText" :key="index" class="express-cancel-form-item" @click="checkReason(item)">
        <view class="item-text">
          {{ item.name }}
        </view>
        <view class="item-btn" :class="activeCode === item.code ? 'actived' : ''" />
      </view>
      <view v-if="activeCode == 0" class="express-cancel-form-item express-cancel-form-textarea">
        <u-textarea
          v-model="notes"
          rows="2"
          autosize
          placeholder="请输入取消原因"
          placeholder-style="color:#999"
          maxlength="50"
          border="none"
          @input="(e) => textInput(e)"
        >
        </u-textarea>
        <view class="van-field__word-limit">
          <text class="van-field__word-num" :class="notes.length >= 50 ? 'van-field__word-num_error' : ''">{{
            notes.length || 0
          }}</text
          >/50
        </view>
      </view>
    </view>
    <view class="express-footer">
      <view class="express-btn express-footer-cancel" @click="cancel">
        <text>暂不取消</text>
      </view>
      <view class="express-btn" :class="btnDisable ? 'express-footer-disable' : ''" @click="sbumit">
        <text>确认取消</text>
      </view>
    </view>
    <!-- <footer class="van-hairline--top express-footer">
      <view class="express-footer-cancel" @click="cancel">
        <text>暂不取消</text>
      </view>
      <view @click="sbumit">
        <text>确认取消</text>
      </view>
    </footer> -->
    <u-popup :show="loading">
      <!-- <u-loading-icon class="express-cancel-loadingInco" mode="circle" :vertical="true"></u-loading-icon> -->
    </u-popup>
  </view>
</template>

<script>
import { getCancelReasonList, sendCancelReason } from "@/api/expressList.js";
export default {
  data() {
    return {
      loading: false,
      activeCode: null,
      fieldText: [],
      notes: "",
      sendLogId: "",
      activedItem: {},
    };
  },
  computed: {
    btnDisable: function () {
      if (this.activeCode === null) {
        return true;
      }
      if (this.activeCode == 0 && this.notes === "") {
        return true;
      }
      return false;
    },
  },
  mounted() {},
  onLoad(options) {
    this.sendLogId = options.sendLogId;
    this.getCancelReasonList();
  },
  methods: {
    // 获取取消原因列表
    getCancelReasonList() {
      console.log("getCancelReasonList", getCancelReasonList);
      getCancelReasonList().then((res) => {
        console.log(res);
        if (res.code === "000000") {
          this.fieldText = res.data;
        }
      });
    },
    // 检测切换
    checkReason(item) {
      this.activeCode = item.code;
      this.activedItem = item;
    },
    // 提交信息
    sbumit() {
      if (!this.activeCode) {
        this.$toast("请选择取消原因");
        return;
      }
      if (this.activeCode == 0 && this.notes === "") {
        this.$toast("请输入取消原因");
        return;
      }
      if (
        this.activeCode == 0 &&
        this.notes !== "" &&
        !/^[\u4E00-\u9FA5A-Za-z0-9_]|[,。：；“‘”’！@#￥%……&*、？,.:;"'"'!@#$%^&*/?+-=]+$/.test(this.notes)
      ) {
        return this.$toast("取消原因不能含有特殊字符");
      }
      this.loading = true;
      //  1 - APP, 2 - CRM, 3 - 小程序;
      const data = {
        dataFrom: 3,
        notes: this.activeCode == 0 && this.notes ? this.notes : this.activedItem.name,
      };
      const that = this;
      wx.requestSubscribeMessage({
        tmplIds: ["KsOGFg34qk9cVwMFZfQBeK-XKtEMJ0DeNHwg-z490jk"],
        success(res) {
          console.log("success", res);

          // that.cancelExpress(data);
        },
        fail(err) {
          console.log("err", err);
          // that.cancelExpress(data);
        },
        complete(res) {
          console.log("complete", res);
          const weChatPushFlag = res["KsOGFg34qk9cVwMFZfQBeK-XKtEMJ0DeNHwg-z490jk"] === "accept" ? 1 : 0;
          data.weChatPushFlag = weChatPushFlag;
          that.cancelExpress(data);
        },
      });
    },
    cancelExpress(data) {
      sendCancelReason(this.sendLogId, data)
        .then((res) => {
          this.afterResponse("取消成功");
          this.cancel();
        })
        .catch((err) => {
          this.afterResponse(err.message);
          this.cancel();
        });
    },
    afterResponse(msg) {
      setTimeout(() => {
        this.loading = false;
        // this.$toast(msg);
      }, 300);
    },
    // 取消 返回
    cancel() {
      uni.navigateBack();
      uni.$emit("reloadData");
    },
    textInput(value) {
      // eslint-disable-next-line
          const regStr =
            /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\\A9|\\AE]\u3030|\\uA9|\\uAE|\u3030/gi; // eslint-disable-line
      value = value.replace(regStr, " ");
      this.notes = value;
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
