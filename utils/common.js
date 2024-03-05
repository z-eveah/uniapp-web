export function toDecimal2(x) {
  if (isNaN(x)) {
    return "";
  }
  let f = x / 100;
  let s = f.toString();
  let rs = s.indexOf(".");
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + 2) {
    s += "0";
  }
  return s;
}

export function mToArr(data) {
  const str = String(toDecimal2(data));

  return str.split(".");
}

export const serviceExpInfo = () => {
  return [
    {
      isHtml: false,
      title: "产品名称",
      name: "medicCommonName",
    },
    {
      isHtml: false,
      title: "品牌名/商品名",
      name: "medicGoodsName",
    },
    {
      isHtml: false,
      title: "英文名称",
      name: "englishName",
    },
    {
      isHtml: false,
      title: "汉语拼音",
      name: "letterPinyin",
    },
    {
      isHtml: false,
      title: "型号",
      name: "modelNo",
    },
    {
      isHtml: false,
      title: "规格",
      name: "specifications",
    },
    {
      isHtml: true,
      title: "项目概述",
      name: "projectDesc",
    },
    {
      isHtml: false,
      title: "检验原理",
      name: "checkPrinciple",
    },
    {
      isHtml: false,
      title: "主要组成成分",
      name: "mainComponents",
    },
    {
      isHtml: false,
      title: "储存条件",
      name: "storageCondition",
    },
    {
      isHtml: false,
      title: "有效期",
      name: "expiredTime",
    },
    {
      isHtml: false,
      title: "样本要求",
      name: "sampleRequest",
    },
    {
      isHtml: false,
      title: "检验方法",
      name: "checkMethod",
    },
    {
      isHtml: false,
      title: "阳性判断值或者参考区间",
      name: "referenceInterval",
    },
    {
      isHtml: false,
      title: "检验结果的解释",
      name: "testResultsAnswer",
    },
    {
      isHtml: false,
      title: "检验方法局限性",
      name: "testResultsLimit",
    },
    {
      isHtml: false,
      title: "产品性能指标",
      name: "productPerformanceIndex",
    },
    {
      isHtml: true,
      title: "注意事项",
      name: "announcements",
    },
    {
      isHtml: false,
      title: "服务提供商名称",
      name: "serviceProviderName",
    },
    {
      isHtml: false,
      title: "服务提供商地址",
      name: "serviceProviderAddress",
    },
    {
      isHtml: false,
      title: "适用人群",
      name: "suitableCrowd",
    },
  ];
};

export const merger = (...opts) => {
  let res = {};
  let combine = (opt) => {
    for (let prop in opt) {
      if (opt.hasOwnProperty(prop)) {
        if (Object.prototype.toString.call(opt[prop]) === "[object Object]") {
          res[prop] = merger(res[prop], opt[prop]);
        } else {
          res[prop] = opt[prop];
        }
      }
    }
  };
  for (let i = 0; i < opts.length; i++) {
    combine(opts[i]);
  }
  return res;
};

export const getCurrentPage = () => {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
};

export const serialize = function (obj) {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      if (p === "scene") {
        str.push(encodeURIComponent(p) + "=" + obj[p]);
      } else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  return str.join("&");
};
