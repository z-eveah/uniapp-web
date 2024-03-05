<script>
import { getToken, logoutUser } from "@/api/login.js";
import { isProd } from "@/service/getBaseUrl";
import arms from "./utils/arms.js";
export default {
  onLaunch() {
    this.getToken();
    uni.$on("logout", () => {
      console.log("logout");
      this.pageNum = 0;
      logoutUser().then(() => {});
    });
    isProd && arms.appLaunch();
  },
  onShow: () => {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  onError: function (err) {
    isProd && arms.error(err);
  },
  methods: {
    getToken() {
      uni.login({
        provider: "weixin",
        success: (res) => {
          const code = res.code;
          getToken(code).then((res) => {
            if (res.data.token) {
              uni.setStorageSync("token", res.data.token);
              uni.$emit("reload");
              this.checkSubStatus();
            }
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
@import "./common/uni.css";
@import "./common/index.scss";
/*每个页面公共css */
@import "tailwindcss/components";
@import "tailwindcss/utilities";
</style>
