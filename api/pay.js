import { HTTP } from '@/service/http.js'
import { data } from 'uview-ui/libs/mixin/mixin';
const $http = new HTTP()
/**
 * @description 获取送详情信息
 */
export const jsApiPrepay = (data) => {
  return $http.request({
    method: 'POST',
    url: `/trade/center/jsapi_prepay_for_doctor_wechat`,
	data:data
  });
};
// 
export const jsApiPrepayNew = (data) => {
  return $http.request({
    method: 'POST',
    url: `/trade/center/jsapi_prepay/partMoneyForDoctorWechat`,
	  data:data
  });
};
