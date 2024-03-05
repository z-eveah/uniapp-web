import { getUserInfo, uploadQiniu } from "@/api/user.js";
const user = {
  state: {
    userInfo: {},
    isSubmitWechat: {
      subMsg: false,
      subWechat: false,
    },
  },
  mutations: {
    SET_USER_INFO: (state, data) => {
      if (!uni.getStorageSync("mobile") && data.mobile) {
        uni.setStorageSync("mobile", data.mobile);
      }
      if (!uni.getStorageSync("doctorID") && data.doctorID) {
        uni.setStorageSync("doctorID", data.doctorID);
      }
      state.userInfo = data;
    },
    SET_SubmitWechat: (state, data) => {
      state.isSubmitWechat = data;
      console.log("--state.isSubmitWechat", state.isSubmitWechat);
    },
  },
  actions: {
    setUserInfo({ commit }, data) {
      commit("SET_USER_INFO", data);
    },
    getUserInfo({ state, commit }) {
      const userInfo = state.userInfo;
      if (JSON.stringify(userInfo) === "{}") {
        return getUserInfo().then((res) => {
          let obj = {
            mobile: res.data.mobile,
            hospital: res.data.hospital,
            avatarImageUrl: res.data.avatar_image_url,
            doctorID: res.data.id,
            name: res.data.name,
            hospitalId: res.data.hospital_id,
          };
          commit("SET_USER_INFO", obj);
          return obj;
        });
      } else {
        if (!uni.getStorageSync("mobile") && userInfo.mobile) {
          uni.setStorageSync("mobile", userInfo.mobile);
        }
        if (!uni.getStorageSync("doctorID") && userInfo.doctorID) {
          uni.setStorageSync("doctorID", userInfo.doctorID);
        }
        return userInfo;
      }
    },
    clearUserInfo({ state, commit }) {
      commit("SET_USER_INFO", {});
    },
    async loadFileToQiniu({ state, commit }, data) {
      const { tempFilePaths } = data;
      return await uploadQiniu(tempFilePaths);
    },
  },
};

export default user;
