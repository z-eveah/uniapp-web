const path = require("path");
const fs = require("fs");
const axios = require("axios");
let pageJson = require("./pages.json");
const projectName = require("./package.json").name;
const menuCodeDtoList = [];
const objRouterInfo = {
  filePath: path.join(__dirname, "mixins/webPoint/menuCode.json"),
  handleRouterInfo: function (routerInfo) {
    let str = "";
    let titleDefault = "云鹊助手";
    if (projectName == "wx_product_health") {
      str = "health/";
      titleDefault = "云鹊健康";
    }
    if (routerInfo.pages) {
      routerInfo.pages.forEach((element) => {
        if (element) {
          const obj = {
            url: element.path,
            title: (element.style && element.style.navigationBarTitleText) || titleDefault,
            host: element.path,
            fullPath: str + element.path,
          };
          menuCodeDtoList.push(obj);
        }
      });
    }

    if (routerInfo.subPackages) {
      const subPackages = routerInfo.subPackages;
      subPackages.forEach((subElement) => {
        if (subElement.root) {
          subElement.pages.forEach((i) => {
            const obj = {
              url: subElement.root + "/" + i.path,
              title: (i.style && i.style.navigationBarTitleText) || titleDefault,
              host: i.path,
              fullPath: subElement.root + "/" + i.path,
            };
            menuCodeDtoList.push(obj);
          });
        }
      });
    }
    if (process.env.NODE_ENV === "production") {
      // 只有发行环境才执行生成埋点
      this.sendAllRouterInfo();
    }
  },
  sendAllRouterInfo: function () {
    // 向接口上报所有路由信息 获取meunCode
    const obj = {
      projectName: projectName,
      menuCodeDtoList: menuCodeDtoList,
    };
    const url = "https://sc.yunqueyi.com/basic-data/menuCode/upload";
    axios({
      method: "post",
      url: url,
      data: obj,
    }).then((res) => {
      this.generateMenuCode();
      return;
    });
  },
  deleOldJson: function (data) {
    // 删除老的Json 文件
    try {
      fs.unlink(this.filePath, (err) => {
        this.writerJsonFile(data);
      });
    } catch (err) {
      console.log(err);
    }
  },
  writerJsonFile(data) {
    // 写入新的生成json 文件
    fs.writeFileSync(this.filePath, data);
  },
  generateMenuCode: function () {
    const url = "https://sc.yunqueyi.com/basic-data/menuCode/fetch";
    axios
      .get(url, { params: { projectName: projectName } })
      .then((res) => {
        const resData = res.data;
        if (resData.code == "000000") {
          if (!resData.data) {
            return;
          }
          return this.deleOldJson(JSON.stringify(resData.data.menuCodeDtoList));
        } else {
        }
      })
      .catch(() => {
      });
  },
};
objRouterInfo.handleRouterInfo(pageJson);
module.exports = {
  productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
  configureWebpack: {
    plugins: [],
    optimization: {
      minimize: true,
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        const compile = options.compiler.compile;
        options.compiler.compile = (template, ...args) => {
          const t = menuCodeDtoList.filter((i) => {
            return args[0].resourcePath.startsWith(i.fullPath);
          })[0];
          if (t) {
            template = template.replace(
              /[\s\S]+?<[\d\D]+?>/,
              (_) => `${_}
						<login-pop ref="login-pop"/>
					`
            );
          }
          return compile(template, ...args);
        };
        return options;
      });
  },
};
