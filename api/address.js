import { HTTP } from '@/service/http.js'
const $http = new HTTP()

/**
 * @description 机构寄件地址删除
 */
export const deleteAddress = (id) => {
  return $http.request({
    url: `/store/detection/address/sender/delete/${id}`,
    method: 'GET',
  });
};

/**
 * @description 机构寄件地址新增与编辑
 */
export const saveAddress = (params) => {
  return $http.request({
    method: 'POST',
    url: '/store/detection/address/sender/save',
    data: params,
  });
};

/**
 * @description 获取默认收货地址
 */
export const getDefaultAddress = (doctorId) => {
  return $http.request({
    method: 'GET',
    url: `/healths/address/defaultForDoctorWeChat?doctorId=${doctorId}&entry=1`,
  });
};

/**
 * @description 获取收货地址列表
 */
export const getAddressList = () => {
  return $http.request({
    method: 'GET',
    url: `/healths/address/getAddressListForDoctorWeChat?userType=1&type=2`,
  });
};
/**
 * @description 新增收货地址列表
 */
export const addAddressList = (data) => {
  return $http.request({
    method: 'POST',
    url: `/healths/address/saveAddressForDoctorWechat`,
	data:data
  });
};

/**
 * @description 删除收货地址列表
 */
export const deleteAddressList = (data) => {
  return $http.request({
    method: 'POST',
    url: `/healths/address/delForDoctorWechat`,
	data:data
  });
};