import { HTTP } from '@/service/http.js'
const $http = new HTTP()


// 居民健康服务列表页 任务收益
// /trade/detection/excitation/getFeeByDoctorId
export const getFeeByDoctorId = (data) => {
  return $http.request({
    url: `/trade/detection/excitation/getFeeByDoctorId`,
    method: 'GET',
  });
};
// 任务列表
// /membership/missions/list
export const getMissionsList = (data) => {
  return $http.request({
    url: `/membership/missions/list`,
    method: 'GET',
  });
};
// 邀请居民检测
// /applet/user/qrcode/hospital

export const getHospitalQrcode = (data) => {
  return $http.request({
    url: `/applet/user/qrcode/hospital`,
    method: 'GET',
  });
};