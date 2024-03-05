import { HTTP } from "@/service/http.js";
const $http = new HTTP();
/**
 * @description 获取用户信息
 */
export const getUserInfo = () => {
  return $http.request({
    method: "GET",
    url: `/applet/user/getInfoByToken`,
  });
};
export const logoutUser = () => {
  return $http.request({
    method: "GET",
    url: `/account/logout/applet`,
    showErr: false,
  });
};
// 获取个人账户相关（余额）信息接口
export const getAccountInfoApplet = () => {
  return $http.request({
    method: "GET",
    url: `/api-ws/personal/center/account/coupon/applet`,
  });
};

export const getQiniuToken = () => {
  return $http.request({
    url: "/contents/admin/qiniu/token",
    method: "GET",
  });
};

// 获取token
export const uploadQiniu = async (tempFilePaths) => {
  let pm;
  const token_info = await $http.request({
    url: "/contents/admin/qiniu/token",
    method: "GET",
  });
  let token = token_info.data.qiniuToken;
  let fileExtension = tempFilePaths.substring(tempFilePaths.lastIndexOf(".") + 1);
  let key = `image/png/recipe-manage/${new Date().getTime()}.${fileExtension}`;
  pm = new Promise((resolve) => {
    uni.uploadFile({
      url: "https://upload.qiniup.com",
      name: "file",
      fileType: "image",
      filePath: tempFilePaths,
      header: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        key: key,
        token: token,
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        resolve(res);
      },
    });
  });
  return pm;
};
