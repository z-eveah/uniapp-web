import { HTTP } from "@/service/http.js";
const $http = new HTTP();

// 获取服务详情
export const getServiceDetail = (data) => {
  return $http.request({
    url: `/store/goods/medical/service/detail/${data.goodsId}/${data.saleType}`,
    method: "GET",
  });
};
// 获取商品详情

export const getGoodsDetailById = (data) => {
  return $http.request({
    url: `/store/goods/getGoodsDetailById/v2?goodsId=${data.goodsId}&saleType=${data.saleType}`,
    method: "GET",
  });
};
// 获取商品列表页面
// /store/app/hospital/goods/list
export const getGoodsList = (data) => {
  return $http.request({
    url: `/store/app/hospital/goods/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&saleType=${data.saleType}`,
    method: "GET",
    showErr: false,
  });
};
// 居民健康服务列表页 任务收益
// /trade/detection/excitation/getFeeByDoctorId
export const getFeeByDoctorId = (data) => {
  return $http.request({
    url: `/trade/detection/excitation/getFeeByDoctorId`,
    method: "GET",
  });
};
// 任务列表
// /membership/missions/list
export const getMissionsList = (data) => {
  return $http.request({
    url: `/membership/missions/list`,
    method: "GET",
  });
};
// 邀请居民检测
// /applet/user/qrcode/hospital

export const getHospitalQrcode = (data) => {
  return $http.request({
    url: `/applet/user/qrcode/hospital`,
    method: "GET",
  });
};
// check 用户权限
// https://dev-sc.yunqueyi.com/store/hospital/check

export const hospitalCheck = (data) => {
  return $http.request({
    url: `/store/hospital/check`,
    method: "GET",
  });
};

// icon配置化
export const getHomeBtns = (data) => {
  return $http.request({
    url: `/api-ws/doctor/applet/home`,
    method: "GET",
  });
};
