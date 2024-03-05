import { HTTP } from "@/service/http.js";
const $http = new HTTP();

export const getProvice = (id) => {
  return $http.request({
    url: `/basic-data/position/provinces`,
    method: "GET",
  });
};

export const getCity = (provinceId) => {
  return $http.request({
    url: `/basic-data/position/cities?provinceId=${provinceId}`,
    method: "GET",
  });
};

export const getArea = (cityId) => {
  return $http.request({
    url: `/basic-data/position/counties?cityId=${cityId}`,
    method: "GET",
  });
};

export const getTown = (countyId) => {
  return $http.request({
    url: `/basic-data/position/towns?countyId=${countyId}`,
    method: "GET",
  });
};

export const getMobile = (type) => {
  return $http.request({
    url: `/basic-data/constants/mobile?type=${type}`,
    method: "GET",
  });
};
