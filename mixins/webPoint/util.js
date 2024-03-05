const getPseudoSession = () => {
  const ps = wx.getStorageSync("PSEUDO_SESSION").name;
  if (!!ps) {
    return ps;
  } else {
    const rd = getRandmData();
    wx.setStorageSync("PSEUDO_SESSION", { name: rd });
    return rd;
  }
};
// 获取日期
function createdDay() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return `${year}-${month}-${day}`;
}
const created_day = createdDay();
const sourceObj = {
  network_type: "",
  device_ip: "",
  device_brand: "",
  device_model: "",
  created_day: created_day,
};
wx.getNetworkType({
  success(res) {
    sourceObj.network_type = res.networkType;
  },
});
// wx.getLocalIPAddress({
//   success (res) {
//     sourceObj.device_ip = res.localip
//   }
// });
wx.getSystemInfo({
  success(res) {
    sourceObj.device_brand = res.brand;
    sourceObj.device_model = res.model;
    sourceObj.app_version = res.system;
  },
});
/**
 * 返回 一个长度为10的 数字字符串
 */
export const getRandmData = () => {
  return Math.random().toString().slice(2, 12);
};

/**
 * 触发的事件 目前提供 click change
 * @type {Object}
 */
export const ACTIONS = {
  click: "ACTION_WEB_CLICK",
  change: "ACTION_WEB_CHANGE",
  pageIn: "ACTION_WEB_ENTER",
  pageAfter: "ACTION_WEB_AFTER",
};

/**
 * Object 校验
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
export const formatObject = (args) => {
  if (args === null) {
    throw new Error("args must be object.");
  }

  if (typeof args !== "object" || args.constructor !== Object) {
    console.warn("args showed be object. this args fromated to.");
    return {};
  }

  return args;
};

// 生成uid
export const generateUID = () => {
  return ("0000" + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
};

export const isObject = (args) => {
  return typeof args === "object" && Object.prototype.toString.call(args) === "[object Object]";
};

export const checkComponentTag = (obj = {}) => {
  const { component_tag } = obj;

  if (component_tag == undefined || component_tag == null)
    throw new Error("checkComponentTag: component_tag is undefined or null");
  if (typeof component_tag !== "string") {
    throw new Error("checkComponentTag: component_tag value showed be string");
  } else {
  }
  return true;
};

/**
 * 获取买点默认值
 */
export const getDefaultLogData = () => {
  const pages = getCurrentPages(); // 获取当前页面栈
  const currentPageUrl = pages.length - 1 >= 0 ? pages[pages.length - 1]["route"] : "";
  const lastPageUrl = pages.length - 2 >= 0 ? pages[pages.length - 2]["route"] : "";
  let view_path = "";
  if (currentPageUrl == "pages/login") {
    view_path = lastPageUrl;
  } else {
    view_path = currentPageUrl;
  }
  return {
    pseudo_session: getPseudoSession(), // 进入页面后的唯一标识
    pseudo_id: getPseudoSession(), // 每次发送埋点自动生成一个
    class_name: "wx_product_assistant", // 每个项目必有一个唯一值
    action: "ACTION_WEB_CLICK", // btn动作，页面创建，页面关闭  createPage
    view_path: view_path, // 控件class 对于H5来说是 页面的URL
    created: new Date().getTime(),
    user_token: "", // 拿不到
    mobile: uni.getStorageSync("mobile") || "", // 拿不到
    doctor_id: uni.getStorageSync("doctorID") || "", // 医生id
    device_brand: sourceObj.device_brand, // 拿不到
    device_model: sourceObj.device_model, // 拿不到
    app_version: sourceObj.app_version,
    device_type: "1", // 1:web
    device_ip: sourceObj.device_ip, // 拿不到
    web_data: {}, // "{commentId:1,patientId:xxx}",
    alternate_info: "",
    network_type: sourceObj.network_type,
    extra_info: "",
    web_data_type: "2", // 1：患教漫画 有错误信息时：3 默认：2。错误信息字段 content_msg 属于web_data 属性
    remark3: "3", // 1. 浏览器， 2. APP， 3.小程序
    created_day: sourceObj.created_day,
  };
};
