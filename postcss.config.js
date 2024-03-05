const path = require("path");

module.exports = {
  plugins: [
    ...(process.env.UNI_PLATFORM !== "h5"
      ? [
          // 使用 postcss-class-name 包将小程序不支持的类名转换为支持的类名
          require("postcss-class-rename")({
            "\\\\:": "-",
            "\\\\.": "_",
          }),
          require("css-byebye")({
            rulesToRemove: [/\*/],
            map: false,
          }),
        ]
      : [
          require("autoprefixer")({
            remove: true,
          }),
        ]),
    require("tailwindcss")({
      config: path.resolve(__dirname, "./tailwind.config.js"),
    }),
  ],
};
