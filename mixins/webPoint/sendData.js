import { baseUrl } from "@/service/getBaseUrl";
let menuCode = require("./menuCode.json");
import { getDefaultLogData, getRandmData } from "./util";

/**
 * 发送数据到服务端
 * @param {object} params
 */
const sendMessageToServer = (params = {}) => {
  console.log(params, `${baseUrl}/file/log/trace1`, "请求结果");
  uni.request({
    url: `${baseUrl}/file/log/trace1`,
    method: "post",
    data: {
      datas: [params],
    },
    header: {
      "content-type": "application/json",
    },
    success: (res) => {
    },
    fail: (err) => {
    },
  });
};

/**
 * 发送前的数据处理
 * @param {object}} data
 */
const doWithData = (data) => {
  const pi = getRandmData();
  data.pseudo_id = pi; // 每次埋点必定要有新的 pseudo_id
  return data;
};

/**
 *  针对 click 等事件埋点menucode 不一样的问题
 *
 */
function handleMeunCode(ctag) {
  let ctagLast = "0#0#0";
  let ctagFirst = "";
  const pages = getCurrentPages(); //加载的页面
  const currentPage = pages[pages.length - 1]; //获取当前页面的对象
  const currentUrl = currentPage.route;
  if (ctag) {
    const index = ctag.indexOf("#");
    ctagLast = (index != -1 && ctag.substring(index)) || "#0#0";
  }
  menuCode.some(function (element) {
    const url = element.url;
    if (url == currentUrl) {
      return (ctagFirst = element.menuCode);
    }
  });
  return (ctagFirst || "0000000") + ctagLast; // 获取menucode 0000000 异常情况
}

/**
 * uplod buried data to server
 * whether in native
 * @param  {Object} params
 * {
 *   web_data => 存储接口中未定义的字段 web 专属，例如 错误信息等，特殊操作等；
 *   web_data_type => 有错误信息时：3 默认：2。错误信息字段 content_msg 属于web_data 属性；
 * }
 * @return {[type]}        [description]
 */
export default (params = {}, enter = "") => {
  if (params.action != "ACTION_WEB_ENTER" && params.action != "ACTION_WEB_AFTER") {
    // 处理白名单menucode
    params.component_tag = handleMeunCode(params.component_tag);
  }
  const dld = getDefaultLogData();
  let sendData = { ...dld, ...params };
  sendData = doWithData(sendData);
  sendMessageToServer(sendData);
};
