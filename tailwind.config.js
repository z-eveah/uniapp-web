const path = require("path");
const resolve = (p) => {
  return path.resolve(__dirname, p);
};

module.exports = {
  mode: "jit", // 开启 jit 模式， tailwind 通过扫描模版路径按需生成 css
  corePlugins: {
    preflight: false, // base/reset 样式，一般 uniapp 都有预设样式，所以不需要 tailwindcss 的预设
    // 以下功能小程序不支持 https://v2.tailwindcss.com/docs/configuration#core-plugins
    container: false,
    space: false, // > 子节点选择器
    divideWidth: false, // The between elements border-width utilities like divide-x-2`
    divideColor: false, // The between elements border-color utilities like divide-gray-500
    divideStyle: false, // The divide-style utilities like divide-dotted`
    divideOpacity: false, // The divide-opacity utilities like ``
  },
  separator: "__", // 小程序项目将 : 选择器替换成 __，之后 hover:bg-red-500 将改为 hover__bg-red-500
  purge: {
    content: [
      resolve("./main.js"),
      resolve("./App.vue"),
      resolve("./pages/**/*.{vue,js,wxml}"),
      // resolve("./pagesDetection/**/*.{vue,js,wxml}"),
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      // 改成全数字
      sm: "20rpx",
      base: "24rpx",
      25: "25rpx",
      26: "26rpx",
      28: "28rpx",
      32: "32rpx",
      36: "36rpx",
    },
    fontFamily: {
      "p-medium": ["PingFangSC-Medium, PingFang SC"],
      "p-regular": ["PingFangSC-Regular, PingFang SC"],
    },
    lineHeight: {
      1: "10rpx",
      2: "20rpx",
      3: "30rpx",
      4: "40rpx",
      4.5: "45rpx",
      5: "50rpx",
      6: "60rpx",
    },
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      blue: {
        DEFAULT: "#1677fe",
        light: "#c5f3ec",
      },
      green: {
        DEFAULT: "#00bda5",
        light: "#f5f6f8",
      },
      grey: {
        DEFAULT: "#666666",
        light: "#999999",
      },
      black: {
        DEFAULT: "#ffffff",
        light: "#212121",
      },
      red: {
        DEFAULT: "#fb602d",
        light: "ff4b33",
      },
    },
    // 渐变色是 background 和 background-image 的结合
    // background 提供底色，background-image 提供渐变的能力
    backgroundImage: {
      "green-gradient": "linear-gradient(180deg, #00BDA5 0%, #20C5B0 52%, #F5F6F8 100%)",
    },
    borderWidth: {
      DEFAULT: "1rpx",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
    letterSpacing: {
      wide: "13rpx",
    },
    // 将 tailwind css 默认单位 rem 转成 rpx
    spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
      map[index] = `${index}rpx`;
      return map;
    }, {}),
    extend: {
      inset: {
        "-6": "-6rpx",
        "-8": "-8rpx",
        "-10": "-10rpx",
        "-12": "-12rpx",
      },
      borderRadius: {
        none: "0",
        sm: "10rpx",
        DEFAULT: "20rpx",
        md: "40rpx",
        lg: "50rpx",
        full: "60rpx",
        large: "80rpx",
        22: "22rpx",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
