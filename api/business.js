import { HTTP } from "@/service/http.js";
const $http = new HTTP();
/**
 * @description // 根据手机号判断是否为企微用户
 */
export const checkCustomer = (mobile) => {
  return $http.request({
    method: "GET",
    url: `/wechats/work/wechat/check/customer?mobile=${mobile}`,
  });
};

export const getCounselor = (data) => {
  return $http.request({
    method: "GET",
    url: `/broker/counselor/undefined/${data.mobile}?type=${data.type}`,
  });
};
