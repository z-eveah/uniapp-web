<template>
  <u-popup :show="show" round="22rpx" mode="bottom" :catch-move="true">
    <view class="multi-check"> </view>
  </u-popup>
</template>

<script>
import { getSampleProject } from "@/api/sample.js";
export default {
  data() {
    return {
      show: false,
      list: [],
    };
  },
  created() {},
  onShow() {},
  methods: {
    getSampleProject(id) {
      getSampleProject(id).then((res) => {
        if (res.code == "000000") {
          this.list = res.data;
        }
      });
    },
    open() {
      this.show = true;
      this.getSampleProject(475838);
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
