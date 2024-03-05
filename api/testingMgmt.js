import { HTTP } from "@/service/http.js";
const $http = new HTTP();
export const diagnosCreate = (data) => {
  return $http.request({
    url: `/diagnose/diagnose/unify/report/read/create`,
    method: "POST",
    data,
  });
};

export const getAdvice = (data) => {
  return $http.request({
    url: `/diagnose/diagnose/view/advice?readingReportId=${readingReportId}`,
    method: "POST",
    data,
  });
};

export const detailTid = (data) => {
  return $http.request({
    url: `/im/team/detail?tid=${tid}&unionId=${unionId}`,
    method: "POST",
    data,
  });
};

// 查询合作机构的报告列表-医生维度
export const getListByDoctor = (params) => {
  return $http.request({
    url: "/trade/detection/excitation/report/getList",
    method: "post",
    data: params,
    withCredentials: true,
  });
};
// 查询合作机构的检测项目名称列表
export const getHospitalReportNameList = (params) => {
  return $http.request({
    url: "/trade/detection/record/report/name/list",
    method: "get",
    params,
    withCredentials: true,
    showErr: false,
  });
};
// 检测结果枚举
export const getDetectResultEnum = () => {
  return $http.request({
    url: "/trade/detection/record/detectResultEnum",
    method: "get",
    withCredentials: true,
  });
};
// 是否订阅消息通知
export const detectionReportSubscribe = (data) => {
  return $http.request({
    url: `/trade/detection/detectionReportSubscribe/check`,
    method: "POST",
    data,
    showErr: false,
  });
};
// 是否关注云鹊科普公众号
export const detectionReportSubscribeWechat = () => {
  return $http.request({
    url: `/api-ws/wechat/yunqueyi/check/subscribe`,
    method: "get",
    withCredentials: true,
    showErr: false,
  });
};

// 订阅消息通
export const detectionSubscribe = () => {
  return $http.request({
    url: `/trade/detection/detectionReportSubscribe/subscribe`,
    method: "POST",
  });
};

// 取消订阅消息通
export const cancelSubscribe = () => {
  return $http.request({
    url: `/trade/detection/detectionReportSubscribe/unsubscribe`,
    method: "POST",
  });
};
