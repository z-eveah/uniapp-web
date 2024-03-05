<template>
  <view class="qualification-container">
    <view class="title"> 云鹊医首营资质查询 </view>
    <view
      v-for="(item, index) in reportList"
      :key="index"
      class="qualification-item"
      :class="{ 'margin-left': item.margin, 'font-weight': item.reportUrl == null }"
    >
      <view class="child-item">{{ item.name }}</view>
      <view
        ><button
          v-if="item.reportUrl"
          type="primary"
          class="child-btn"
          :plain="true"
          text="点击查看"
          hover-class="btn-hover"
          @click="checkReport(item)"
        >
          点击查看
        </button></view
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reportList: [
        {
          name: "云鹊重庆首营企业资质-医疗器械",
          reportUrl:
            "https://files.yunqueyi.com/application/pdf/common/to下游云鹊重庆首营企业资质-医疗器械.pdf?version=1.1",
        },
        {
          name: "检测项目资质",
        },
        {
          name: "博尔诚胃癌肠癌早期筛查项目资质清单",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/博尔诚胃癌肠癌早期筛查项目资质清单.pdf",
          margin: true,
        },
        {
          name: "博厚IgG食物不耐受项目资质清单",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/博厚IgG食物不耐受项目资质清单.pdf",
          margin: true,
        },
        /* {
			name: '基准膀胱癌早期筛查项目资质清单',
			reportUrl: 'https://files.yunqueyi.com/application/pdf/common/基准膀胱癌早期筛查项目资质清单.pdf',
			margin: true
		}, */
        {
          name: "莱盟肝癌早筛项目资质清单",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/莱盟肝癌早筛项目资质清单.pdf",
          margin: true,
        },
        {
          name: "锐翌结直肠癌早期筛查项目资质清单",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/锐翌结直肠癌早期筛查项目资质清单.pdf?v=1.1",
          margin: true,
        },
        {
          name: "圣美肺结节良恶性鉴定项目资质清单",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/圣美肺结节良恶性鉴定项目资质清单.pdf",
          margin: true,
        },
        {
          name: "奕检结直肠癌早期筛查项目资质清单",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/奕检结直肠癌早期筛查项目资质清单.pdf",
          margin: true,
        },
        {
          name: "医疗器械产品资质",
        },
        // {
        //   name: "幽门螺杆菌染色液 Ⅳ型 1人次盒",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/幽鉴幽门螺杆菌染色液Ⅳ型.pdf",
        //   margin: true,
        // },
        {
          name: "噗噗管 - 便隐血检测试剂(胶体金法)",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/噗噗管便隐血检测试剂.pdf",
          margin: true,
        },
        {
          name: "博尔诚 - 一次性使用游离DNA保存管",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/博尔诚一次性使用游离DNA保存管.pdf",
          margin: true,
        },
        {
          name: "博厚(奥姆莱特) - 血液采集卡",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/博厚奥姆莱特血液采集卡.pdf",
          margin: true,
        },
        {
          name: "博厚老款 - 血液采集卡",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/博厚老款-血液采集卡.pdf",
          margin: true,
        },
        {
          name: "莱盟(甘倍康)(莱盟君泰) - 一次性使用真空采血管 ",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/莱盟一次性使用真空采血管.pdf",
          margin: true,
        },
        // {
        //   name: "新型冠状病毒（2019-nCoV）抗原检测试剂盒（乳胶法）",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/新型冠状病毒.pdf",
        //   margin: true,
        // },
        {
          name: "莱盟(甘倍康)(厦门志煊) - 一次性使用真空采血管 ",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/莱盟厦门志煊一次性使用真空采血管.pdf",
          margin: true,
        },
        {
          name: "锐翌 - 粪便检验预处理装置 ",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/锐翌粪便检验预处理装置.pdf",
          margin: true,
        },
        {
          name: "汉博(宫颈癌) - 免疫显色试剂 HB-X1人份盒",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/汉博宫颈癌免疫显色试剂20200415.pdf",
          margin: true,
        },
        {
          name: "锐翌 - 粪便标本采集保存管",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/锐翌粪便标本采集保存管20180545.pdf",
          margin: true,
        },
        {
          name: " 幽幽管 - 幽门螺杆菌抗原检测试剂(乳胶法)",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/幽幽管幽门螺杆菌抗原20213401126.pdf",
          margin: true,
        },
        {
          name: "普施康 - 生化九项检测试剂盘(微流控比色法)",
          reportUrl:
            "https://files.yunqueyi.com/application/pdf/common/20220815/普施康生化九项检测试剂盘20212400655.pdf",
          margin: true,
        },
        {
          name: "普施康 - 综合Ⅰ生化十三项检测试剂盘(微流控干化学法)",
          reportUrl:
            "https://files.yunqueyi.com/application/pdf/common/20220815/施康综合生化十三项检测试剂湘械准20212400654.pdf",
          margin: true,
        },
        {
          name: "普施康 - 生化分析仪MS100",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/20220815/普施康生化分析.pdf",
          margin: true,
        },
        {
          name: "九州通 - 一次性使用末梢采血针",
          reportUrl:
            "https://files.yunqueyi.com/application/pdf/common/20220815/九州通一次性使用末梢采血针津械注准20192220126.pdf",
          margin: true,
        },
        {
          name: "常卫清 - 粪便检验预处理装置",
          reportUrl:
            "https://files.yunqueyi.com/application/pdf/common/20220815/常卫清粪便检验预处理装置浙杭械备20190697号.pdf",
          margin: true,
        },
        {
          name: "九州通 - 医用酒精消毒棉片",
          reportUrl:
            "https://files.yunqueyi.com/application/pdf/common/20220815/九州通医用酒精消毒棉片鲁械注准20172640675.pdf",
          margin: true,
        },
        //  new
        // {
        //   name: "尿大夫-尿液分析试纸条",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/尿大夫-尿液分析试纸条.pdf",
        //   margin: true,
        // },
        // {
        //   name: "施得美-自风干型疤痕护理硅凝胶国",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/施得美-自风干型疤痕护理硅凝胶国.pdf",
        //   margin: true,
        // },
        /* {
            name: '尿立检-一次性使用采样器',
            reportUrl: 'https://files.yunqueyi.com/application/pdf/common/尿立检-一次性使用采样器.pdf',
            margin: true
        }, */
        {
          name: "九州通-一次性使用静脉采血器",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/九州通-一次性使用静脉采血器.pdf",
          margin: true,
        },
        {
          name: "九州通-一次性使用捆扎止血带",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/九州通-一次性使用捆扎止血带.pdf",
          margin: true,
        },
        /* {
            name: '基准-尿目测试纸条',
            reportUrl: 'https://files.yunqueyi.com/application/pdf/common/基准-尿目测试纸条.pdf',
            margin: true
        }, */
        // {
        //   name: "奕检-一次性使用负压血样采集容器",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/奕检-一次性使用负压血样采集容器.pdf",
        //   margin: true,
        // },
        {
          name: "芯超-甲胎蛋白检测",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/芯超-甲胎蛋白检测.pdf",
          margin: true,
        },
        // {
        //   name: "圣美-细胞保存液",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/圣美-细胞保存液.pdf",
        //   margin: true,
        // },
        // {
        //   name: "圣美-真空采血管",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/圣美-真空采血管.pdf",
        //   margin: true,
        // },
        {
          name: "博厚-变应原IgE检测采样盒",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/博厚-变应原IgE检测采样盒.pdf",
          margin: true,
        },
        {
          name: "鑫之盛-一次性使用捆扎式止血带",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/鑫之盛-一次性使用捆扎式止血带.pdf",
          margin: true,
        },
        {
          name: "厦门志煊-一次性使用真空采血管",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/厦门志煊-一次性使用真空采血管.pdf",
          margin: true,
        },
        {
          name: "药明泽康-干血样本采集保存管",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/药明泽康-干血样本采集保存管.pdf",
          margin: true,
        },
        {
          name: "药明泽康-酒精棉片",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/药明泽康-酒精棉片.pdf",
          margin: true,
        },
        {
          name: "药明泽康-一次性末梢采血器",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/药明泽康-一次性末梢采血器.pdf",
          margin: true,
        },
        {
          name: "郑州辉文锐(普施康)-一次性使用真空采血管",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/郑州辉文锐普施康-一次性使用真空采血管.pdf",
          margin: true,
        },
        {
          name: "和瑞-一次性使用真空采血管",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/和瑞-一次性使用真空采血管.pdf",
          margin: true,
        },
        // {
        //   name: "欧蒙-创口贴",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/欧蒙-创口贴.pdf",
        //   margin: true,
        // },
        // {
        //   name: "欧蒙-血样标本采集卡",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/欧蒙-血样标本采集卡.pdf",
        //   margin: true,
        // },
        // {
        //   name: "欧蒙-一次性使用采血器",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/欧蒙-一次性使用采血器.pdf",
        //   margin: true,
        // },
        // {
        //   name: "欧蒙-医用酒精消毒棉",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/欧蒙-医用酒精消毒棉.pdf",
        //   margin: true,
        // },
        // {
        //   name: "欧蒙-医用棉签",
        //   reportUrl: "https://files.yunqueyi.com/application/pdf/common/欧蒙-医用棉签.pdf",
        //   margin: true,
        // },
        {
          name: "博厚食物不耐受48-90项(安洁达)-一次性末梢采血器",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/博厚安洁达-一次性末梢采血器.pdf",
          margin: true,
        },
        {
          name: "博厚食物不耐受48-90项(九州通)-医用酒精消毒棉片",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/博厚九州通-医用酒精消毒棉片.pdf",
          margin: true,
        },
        {
          name: "博厚食物不耐受48-90项(九州通)-弹性创可贴",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/博后九州通-弹性创可贴.pdf",
          margin: true,
        },
        {
          name: "博厚食物不耐受48-90项-血液采集卡",
          reportUrl: "https://files.yunqueyi.com/application/pdf/common/博厚-血液采集卡.pdf",
          margin: true,
        },
      ],
    };
  },
  methods: {
    checkReport(item) {
      let { reportUrl } = item;
      let url = reportUrl.match(/\?url=(.+)/);
      url = url?.[1] ?? reportUrl;
      let newPath = wx.env.USER_DATA_PATH + "/" + "资质查看.pdf";
      uni.showLoading({ title: "加载中" });
      uni.downloadFile({
        url,
        filePath: newPath,
        success: (res) => {
          uni.openDocument({
            filePath: newPath,
            showMenu: true,
            success: (res) => {
              uni.hideLoading();
              console.log("打开文档成功");
            },
            fail: (err) => {
              uni.hideLoading();
              console.log(err);
              this.$toast("打开失败");
            },
          });
        },
        fail: (err) => {
          uni.hideLoading();
          console.log(err);
          this.$toast("下载失败！");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qualification-container {
  padding: 20rpx;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 36rpx;
  }

  .qualification-item {
    height: 130rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    .child-item {
      width: auto;
    }
    &.font-weight {
      font-weight: 700;
      font-size: 36rpx;
    }
    /deep/.child-btn {
      width: 200rpx;
      height: 80rpx;
      font-size: 30rpx;
      color: #2979ff;
      border-color: #a0cfff;
      background-color: #ecf5ff;
    }
    .btn-hover {
      background: #2979ff;
      color: #fff;
    }
  }
}
</style>
