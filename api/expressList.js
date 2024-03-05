import { HTTP } from "@/service/http.js";
const $http = new HTTP();
// 获取送检项目
export const getExpressList = (data) => {
  return $http.request({
    url: "/store/detectionSend/query/getList",
    method: "post",
    data,
  });
};
export const getUserData = (hospitalId) => {
  return $http.request({
    url: "/api-ws/doctors/0/base",
    method: "GET",
  });
};

export const getCancelReasonList = async () => {
  return $http.request({
    url: "/store/detection/project/cancel/SJQX",
    method: "post",
  });
};

// /store/detection/project/send/cancel/{tradeDetectionSendLogId}
export const sendCancelReason = async (id, data) => {
  return $http.request({
    url: "/store/detection/project/send/cancel/" + id,
    method: "post",
    data,
  });
};
