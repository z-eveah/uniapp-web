import { HTTP } from '@/service/http.js'
const $http = new HTTP()
/**
 * @description 获取进群路径
 */
export const getEnterGroupPath = (hospitalId) => {
  return $http.request({
    method: 'GET',
    url: `/store/admin/hospital/getEnterGroupPath?hospitalId=${hospitalId}`,
  });
};

