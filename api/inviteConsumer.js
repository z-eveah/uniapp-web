import { HTTP } from '@/service/http.js'
const $http = new HTTP()

// 邀请居民检测
// /applet/user/qrcode/hospital

export const getHospitalQrcode = (data) => {
  return $http.request({
    url: `/applet/user/qrcode/hospital`,
    method: 'GET',
  });
};

export const getDownloadHospitalQrcode = (data) => {
  return $http.request({
    url: `/applet/user/qrcode/hospital/download`,
    method: 'GET',
  });
};