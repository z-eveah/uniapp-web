import { HTTP } from "@/service/http.js";
const $http = new HTTP();
/**
 * @description 查询先用后付订单信息
 * @param { String } tradeOrderPayLogId
 * @param { Function } cb
 */
export const getTradeOrderPayLog = (tradeOrderPayLogId) => {
  return $http.request({
    url: `/trade/order/partAmount/payLog/${tradeOrderPayLogId}`,
    method: "GET",
  });
};
/**
 * @description 预支付
 */
export const payPartMoney = (data) => {
  return $http.request({
    url: `/trade/center/jsapi_prepay/partMoneyForDoctorWechat`,
    method: "POST",
    data,
  });
};
