// 服务包协议
export const SERVICE_PACKAGE_PROTOCOL_TYPE = "17";
export const SERVICE_PACKAGE_PROTOCOL_NAME = "健康服务包用户须知";

// 确保微信后台已经配置了以下环境的生产环境域名！！！
export const ENV_CONFIG = {
  baseUrl: {
    dev: "https://dev-sc.yunqueyi.com",
    test: "https://test1-sc.yunqueyi.com",
    uat: "https://uat-sc.yunqueyi.com",
    prod: "https://sc.yunqueyi.com",
  },
  medUrl: {
    dev: "https://dev-medical.yunqueyi.com",
    test: "https://test1-medical.yunqueyi.com",
    uat: "https://uat-medical.yunqueyi.com",
    prod: "https://medical.yunqueyi.com",
  },
  phomeUrl: {
    dev: "https://dev-phome.yunqueyi.com",
    test: "https://test1-phome.yunqueyi.com",
    uat: "https://uat-phome.yunqueyi.com",
    prod: "https://phome.yunqueyi.com",
  },
  baseDsisUrl: {
    dev: "https://dev-dsis.yunqueyi.com",
    test: "https://test1-dsis.yunqueyi.com",
    uat: "https://uat-dsis.yunqueyi.com",
    prod: "https://dsis.yunqueyi.com",
  },
  qiniuUrl: {
    dev: "https://dev-sc.yunqueyi.com/contents/admin/qiniu/token",
    test: "https://test1-sc.yunqueyi.com/contents/admin/qiniu/token",
    uat: "https://uat-sc.yunqueyi.com/contents/admin/qiniu/token",
    prod: "https://sc.yunqueyi.com/contents/admin/qiniu/token",
  },
  qiniuFileUrl: {
    dev: "https://dev-sc.yunqueyi.com/contents/admin/qiniu/token1",
    test: "https://test1-sc.yunqueyi.com/contents/admin/qiniu/token1",
    uat: "https://uat-sc.yunqueyi.com/contents/admin/qiniu/token1",
    prod: "https://sc.yunqueyi.com/contents/admin/qiniu/token1",
  },
  qiniuImgUrl: {
    dev: "https://test1-videos.yunqueyi.com",
    test: "https://test1-file.yunqueyi.com",
    uat: "https://test1-file.yunqueyi.com",
    prod: "https://files.yunqueyi.com",
  },
  qiniuResourceUrl: {
    dev: "https://test1-videos.yunqueyi.com",
    test: "https://test1-videos.yunqueyi.com",
    uat: "https://test1-videos.yunqueyi.com",
    prod: "https://video.yunqueyi.com",
  },
};

//渠道定义,此处定义需要隐藏专属标识的chanelId
export const excludeProject = ["StateGrid_GRKE"];

// 核销上传核销图片的类型
export const UPLOAD_TYPE = {
  picture: 1,
  video: 2,
  pdf: 3,
};
