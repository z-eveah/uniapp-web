import { HTTP } from "@/service/http.js";
const $http = new HTTP();
// 获取送检项目
export const getSampleProject = (hospitalId) => {
  return $http.request({
    url: `/store/detection/project/list/${hospitalId}`,
    method: "GET",
  });
};
// 根据检测项目查询样本list、数量
export const getSampleList = (data) => {
  return $http.request({
    url: "/store/detection/project/service/records",
    method: "POST",
    data: data,
  });
};
// 获取寄件地址
export const getMailingAddress = (data) => {
  return $http.request({
    url: "/store/detection/project/sendAddress/info",
    method: "POST",
    data: data,
  });
};
// 样本送检提交
export const submitProject = (data) => {
  return $http.request({
    url: "/store/detection/project/sendForDoctorWechat",
    method: "POST",
    data: data,
    showErr: false,
  });
};
// 获取寄件时间
export const getSendHopeTime = () => {
  return $http.request({
    url: "/store/detection/project/sendHopeTime/list",
    method: "GET",
  });
};

// 获取机构id
export const getUserInfo = () => {
  return $http.request({
    url: "/api-ws/doctors/0/base",
    method: "GET",
  });
};
// 获取默认备注
export const getProjectNotes = (data) => {
  return $http.request({
    url: "/store/detection/project/notes",
    method: "POST",
    data: data,
  });
};

// 寄建地址列表
export const getSendAddressList = (data) => {
  return $http.request({
    url: "/store/detection/address/sender/list",
    method: "POST",
    data: data,
  });
};
// 寄建最新使用标识更新
export const updateLastUsed = (data) => {
  return $http.request({
    url: "/store/detection/address/sender/updateLastUsed",
    method: "POST",
    data: data,
  });
};
