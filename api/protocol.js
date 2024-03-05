import { HTTP } from '@/service/http.js'
const $http = new HTTP()
/**
 * @description 获取type=的协议内容
 */
export const getProtocolContentByType = (type) => {
  return $http.request({
    method: 'GET',
    url: `/smartcontract/protocol/content?type=${type}`,
  });
};

export const checkProtocolByUnionid = (type) => {
  return $http.request({
    method: 'GET',
    url: `/smartcontract/protocol/sign/check/unionId/signForDoctorWeChat?userType=1&type=${type}`,
  });
};

export const saveProtocolByUnionid = (data) => {
  return $http.request({
    method: 'POST',
    url: `/smartcontract/protocol/sign/unionIdForDoctorWechat`,
	data:data
  });
};