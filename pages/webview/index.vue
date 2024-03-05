<template>
  <view>
    <web-view :src="url" class="pt100"> </web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: "",
    };
  },
  onLoad(option) {
    uni.login({
      provider: "weixin",
      success: (res) => {
        this.code = res.code;
        this.url = "https://mp.weixin.qq.com/s/85jjQDvroNCatZ7uVzQVKg";
        console.log("comics webview url=> ", this.url);
      },
    });
    this.title = option.title || "云鹊医";
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
