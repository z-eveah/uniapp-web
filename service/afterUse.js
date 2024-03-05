import { baseUrl } from "./getBaseUrl";
// 封装处理成功回调
const successCallback = (res, cb, fail) => {
  if (res.data.code == "000000") {
    cb && cb(res.data);
  } else {
    uni.showToast({
      title: res.data.message,
      icon: "none",
    });
    fail && fail(res.data);
  }
};

const request = ({ url, data = {}, method = "GET", cb = () => {} }) => {
  console.log("request: ", method, "-", url, "-", data);
  return uni.request({
    url,
    method,
    data,
    success: (res) => {
      console.log("response: ", url, "-", res);
      successCallback(res, cb);
    },
  });
};

/**
 * @description 查询先用后付订单信息
 * @param { String } tradeOrderPayLogId
 * @param { Function } cb
 */
export const getTradeOrderPayLog = (tradeOrderPayLogId, cb) => {
  const unionId = uni.getStorageSync("unionId");
  request({
    url: `${baseUrl}/trade/order/partAmount/payLog/${tradeOrderPayLogId}?unionId=${unionId}`,
    method: "GET",
    cb,
  });
};
/**
 * @description 预支付
 */
export const payPartMoney = (data, cb, fail) => {
  request({
    url: `${baseUrl}/trade/center/jsapi_prepay/partMoney`,
    method: "POST",
    data,
    cb,
  });
};

