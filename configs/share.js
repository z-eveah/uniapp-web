// 对整个应用可以转发和公众号模板消息打开的小程序页面进行配置
export default {
	index: {
		title: '云鹊健康',
		path: '/pages/index',
		imageUrl: 'https://file.yunqueyi.com/health/applet/share.png',
		shared: true,
	},
	mesList: {
		title: '云鹊健康',
		path: '',
		imageUrl: 'https://file.yunqueyi.com/health/applet/share.png',
		shared: true,
	},
	doctorDetail: {//这个页面配置不需要图片,且该路由携带参数
		title: '云鹊健康',
		path: '/pages/health/doctorDetail',
		shared: true,
	},
	convert: {
		title: '兑换码',
		path: '/pages/health/convert',
	},
	report: {
		title: '我的报告',
		path: '/pages/webviews/report',
	},
	scale: {
		title: '履约量表',
		path: '/pages/webviews/scale',
	},
	comics: {
		title: '漫画详情',
		path: '/pages/webviews/comicsWebview',
	},
	comics2: {
		title: '漫画详情',
		path: '/pages/health/comicsWebview',
	},
	followNotice: { //该路由携带参数
		title: '随访通知/预约提醒',
		path: '/pages/health/followNotice',
	}
}
