import { HTTP } from "@/service/http.js";
import { baseUrl } from "../service/getBaseUrl";
const $http = new HTTP();
// 根据code 获取 token
export const getToken = (code) => {
  return $http.request({
    url: `/applet/user/code/v2?code=${code}&type=3`,
    method: "GET",
  });
};
// 获取code
export const getCode = (code) => {
  return $http.request({
    url: `/applet/user/code?code=${code}&type=3`,
    method: "GET",
  });
};

//  微信授权登录
export const wxAuthLogin = (data) => {
  return $http.request({
    url: `/applet/user/encryption/mobile/v2`,
    method: "POST",
    data: data,
  });
};
// 手机授权登录
export const getAuthCode = (data) => {
  return $http.request({
    url: `/account/account/authCode/applet?mobilePhone=${data.mobilePhone}&code=${data.code}&type=3`,
    method: "GET",
  });
};

// 手机授权登录
export const phoneAuthLogin = (data) => {
  return $http.request({
    url: `/account/login/applet/authCode`,
    method: "POST",
    data: data,
  });
};

export const getProtocolName = (type) => {
  return $http.request({
    url: `/smartcontract/protocol/name?type=${type}`,
    method: "GET",
  });
};
