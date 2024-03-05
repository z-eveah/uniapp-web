function isDate8(sDate) {
  if (!/^[0-9]{8}$/.test(sDate)) {
    return false;
  }
  let year, month, day;
  year = sDate.substring(0, 4);
  month = sDate.substring(4, 6);
  day = sDate.substring(6, 8);
  let iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1700 || year > 2500) return false;
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) iaMonthDays[1] = 29;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > iaMonthDays[month - 1]) return false;
  return true;
}

function isDate6(sDate) {
  if (!/^[0-9]{6}$/.test(sDate)) {
    return false;
  }
  let year, month, day;
  year = sDate.substring(0, 4);
  month = sDate.substring(4, 6);
  if (year < 1700 || year > 2500) return false;
  if (month < 1 || month > 12) return false;
  return true;
}
/**
 * 身份证号码校验
 * @param string num
 * @returns 完全通过:true, string为错误提示 ,判断请用 ===
 * @author jingxing05
 */
export const checkIdCard = (num) => {
  //权重值
  let factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);

  //校验码
  let parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");

  //地区码省级  @todo市级地级代码也可以枚举
  let provinces = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古", //华北两市三省
    21: "辽宁",
    22: "吉林",
    23: "黑龙江", //东北三省
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东", //华东一市六省
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南", //华南五省
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏", //西南一市四省
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆", //西北五省
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外",
  };

  let varArray = new Array();
  let intweightSum = 0;
  let intCheckDigit;

  let intStrLen = num.length;
  let idNumber = num.toString().toUpperCase();

  // 基本位数判断
  if (intStrLen != 15 && intStrLen != 18) {
    console.log("身份证号为18位!");
    return false;
  }

  //省级信息 @todo 可以枚举市级 和 县级 区域的
  if (provinces[parseInt(idNumber.substr(0, 2))] == null) {
    console.log("身份证号前六位地区码有误!");
    return false;
  }

  // 判断每一位字符，顺便计算加权值
  for (let i = 0; i < intStrLen; i++) {
    varArray[i] = idNumber.charAt(i);
    if ((varArray[i] < "0" || varArray[i] > "9") && i != 17) {
      console.log("身份证号有错误字符!");
      return false;
    } else if (i < 17) {
      varArray[i] = varArray[i] * factorArr[i];
      intweightSum = intweightSum + varArray[i];
    }
  }

  if (intStrLen == 18) {
    //生日期校验
    let date8 = idNumber.substring(6, 14);
    if (!isDate8(date8)) {
      console.log("身份证出生日期错误!");
      return false;
    }

    // 校验码验证  余数在校验数组中的值
    intCheckDigit = parityBit[intweightSum % 11];

    // 最后一位和计算出的校验码是否一致
    if (varArray[17] != intCheckDigit) {
      console.log("身份证号有误，校验失败!");
      return false;
    }
  } else {
    var date6 = idNumber.substring(6, 12);
    if (!isDate6(date6)) {
      console.log("身份证出生日期错误!");
      return false;
    }
  }
  return true;
};
