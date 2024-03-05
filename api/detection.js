import { HTTP } from "@/service/http.js";
const $http = new HTTP();
/**
 * @description 获取送详情信息
 */
export const getDetectionSendDetail = (sendLogId) => {
  return $http.request({
    method: "GET",
    url: `/store/detectionSend/query/getDetectionSendDetail/${sendLogId}`,
  });
};

// 检测记录信息
export const getRecordInfo = (data) => {
  return $http.request({
    url: "/trade/detection/record/record/info",
    method: "GET",
    data,
  });
};

/**
 * 校验检测条码是否合规
 * @param {*} data
 * @returns
 */
export const validateDetectionCode = (data) => {
  return $http.request({
    url: "/trade/detection/sampleCode/validate",
    method: "POST",
    data,
  });
};
/**
 * @description 提交订单
 * @param {object} params 订单信息
 */
export const recommendationOrderSettle = (params) => {
  return $http.request({
    method: "POST",
    url: "/drug/recommendation/recommendationOrderSettle",
    data: params,
  });
};
// 检测商品详情
export const getGoodsInfo = (recordId) => {
  return $http.request({
    method: "get",
    url: `/trade/detection/order/goodsInfo/${recordId}`,
  });
};
// 获取药单详情
export const getDrugDetail = (drugId) => {
  return $http.request({
    method: "get",
    url: `/drug/recommendation/recommendationOrderDetail?recommendationOrderId=${drugId}`,
  });
};
// 生成订单
export const createOrderId = (data) => {
  return $http.request({
    method: "post",
    url: "/trade/center/order/createV3",
    data,
  });
};
//  获取检测详情 接口
export const getDetectionDetail = (id) => {
  return $http.request({
    method: "get",
    url: `/trade/detection/record/record/info/?detectionRecordId=${id}&userType=1`,
  });
};

// 检测详情节点查询
export const getDetectionDetailProces = (id) => {
  return $http.request({
    method: "get",
    url: `/trade/detection/record/process/${id}`,
  });
};

// 检测支付挂回款前置校验;
export const payBeforeVerify = (recordId) => {
  return $http.request({
    url: `/trade/detection/order/checkDetectRefund/${recordId}`,
    method: "GET",
    withCredentials: true,
  });
};

// 查询可支付金额信息;
export const payAmountOrder = (orderId) => {
  return $http.request({
    url: `/trade/order/partAmount/payAmount/${orderId}`,
    method: "GET",
  });
};

// 获取受检人信息
export const patientLog = (data) => {
  return $http.request({
    method: "GET",
    url: `/trade/detection/hospitalProject/detectServices/${data.hospitalId}/${data.patientId}`,
  });
};

// 内购检测提交前校验
export const internalPurchaseSubmitCheck = (data) => {
  return $http.request({
    method: "post",
    url: "/trade/detection/applet/record/internalPurchaseSubmitCheck",
    data: data,
  });
};

// 内购检测提交前校验
export const internalPurchaseSubmitBind = (data) => {
  return $http.request({
    method: "post",
    url: "/trade/detection/applet/record/internalPurchaseSubmit",
    data: data,
    withCredentials: true,
  });
};

// 生成订单预支付记录
export const payLog = (data) => {
  return $http.request({
    method: "post",
    url: "/trade/order/partAmount/payLog",
    data: data,
    withCredentials: true,
  });
};

// 根据机构查询检测服务列表
export const getByHospital = (id) => {
  return $http.request({
    url: `/trade/detection/record/internalPurchase/hospital/${id}`,
    method: "GET",
  });
};

// 根据机构查询检测服务列表
export const getInternalPurchaseEcho = (data) => {
  return $http.request({
    url: `/trade/detection/applet/record/internalPurchaseEcho`,
    method: "post",
    data,
  });
};

export const ocrIdCard = (data) => {
  return $http.request({
    url: `/store/ocr/idCard`,
    method: "post",
    data,
  });
};

export const savePatient = (data) => {
  return $http.request({
    url: `/healths/detection/patient/saveV2`,
    method: "post",
    data,
  });
};

//查询订单信息
export const getOrderInfo = (data) => {
  return $http.request({
    url: `/tis/insurance/order/info?yunOrderNo=${data.yunOrderNo}`,
    method: "GET",
  });
};

//绑码 早筛
export const bindBarcode = (data) => {
  return $http.request({
    url: `/trade/detection/app/record/record/bindingSampleCode`,
    method: "post",
    data,
  });
};

//绑码 快检
export const bindBarcodeV2 = (data) => {
  return $http.request({
    url: `/trade/detection/applet/record/record/bindingSampleCodeV2`,
    method: "post",
    data,
  });
};
//绑码 心电衣
export const bindBarcodeV3 = (data) => {
  return $http.request({
    url: `/trade/detection/applet/record/bindingSampleCodeByXin`,
    method: "post",
    data,
  });
};

//处理错误信息
export const orderInfoCheck = (yunOrderNo) => {
  return $http.request({
    url: `/tis/insurance/detection/order/info/check/${yunOrderNo} `,
    method: "post",
  });
};

// 余额明细
export const balanceList = (data) => {
  return $http.request({
    url: `/trade/account/balance/list?pageNo=${data.pageNo}&pageSize=${data.pageSize}&type=${data.type}`,
    method: "GET",
  });
};

// 累计收益明细
export const balanceProfitList = (data) => {
  return $http.request({
    url: `/trade/account/balance/profit/list?pageNo=${data.pageNo}&pageSize=${data.pageSize}&source=${data.source}&status=${data.status}`,
    method: "GET",
  });
};

// 个人账户余额信息

export const balanceInfo = () => {
  return $http.request({
    url: `/trade/account/balance/info`,
    method: "GET",
  });
};

// 个人提现次数

export const accountPayMes = () => {
  return $http.request({
    url: `/trade/pay/account/pay/list`,
    method: "GET",
  });
};

// 提交成功后查看收益

export const getAmoutByYunNo = (yunOrderNo) => {
  return $http.request({
    url: `/trade/account/hospital/amount/${yunOrderNo} `,
    method: "GET",
  });
};

export const chronicUploadCheck = (data) => {
  return $http.request({
    url: `/trade/detection/applet/record/chronicUploadCheck`,
    method: "post",
    data,
  });
};
