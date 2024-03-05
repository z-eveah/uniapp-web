<template>
  <view class="express-lose">
    <img
      class="lose-icon"
      src="https://test1-file.yunqueyi.com/image/png/common/20220704181035424.png"
      alt=""
    >
    <p class="lose-tip">
      下单失败！
    </p>
    <view
      v-if="loseMessage"
      class="lose-msg"
    >
      {{ loseMessage }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    loseMessage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
     
    };
  },
  mounted() {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
