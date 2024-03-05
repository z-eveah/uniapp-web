import { HTTP } from "@/service/http.js";
const $http = new HTTP();

// 居民健康服务列表页 任务收益
// /trade/detection/excitation/getFeeByDoctorId
export const getDoctorAppointmentList = (data) => {
  return $http.request({
    url: `/tis/doctor/appointment/list`,
    method: "post",
    data,
  });
};

export const getScheduling = (data) => {
  return $http.request({
    url: `/tis/insurance/hosptial/scheduling`,
    method: "get",
    data,
  });
};
// /tis/doctor/appointment/code/check?verificationCode=111&yunOrderNo=111
export const codeCheck = ({ verificationCode, yunOrderNo }) => {
  return $http.request({
    url: `/tis/doctor/appointment/code/check?verificationCode=${verificationCode}&yunOrderNo=${yunOrderNo}`,
    method: "get",
  });
};
export const appointment = (data, cb) => {
  return $http.request({
    url: `/tis/insurance/appointment`,
    method: "POST",
    data,
  });
};

export const returnEquipment = (data) => {
  return $http.request({
    url: `/tis/doctor/return/equipment`,
    method: "get",
    data,
  });
};
