<template>
	<view>
		<view class="agreement">
			<rich-text :nodes="agreeText"></rich-text>
		</view>
		<view v-if="!pstatus" @click="saveProtocol" class="btn">我已同意</view>
	</view>
</template>

<script>
	import { getProtocolContentByType,checkProtocolByUnionid,saveProtocolByUnionid } from '@/api/protocol.js';
	export default {
		data(){
			return {
				agreeText: '',
				pstatus: true, //是否已签署协议
				ptype: '', // 当前协议类型
				redirectUrl: '', // 如果页面需要跳转
			}
		},
		onLoad(options){
			// 协议类型 ptype，协议名称 pname，协议状态 pstatus 0未签署，1已签署
			const { ptype, pname, redirectUrl } = options;
			this.ptype = ptype;
			this.redirectUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '';
			console.log(`redirectUrl: `, this.redirectUrl);
			uni.setNavigationBarTitle({
				title: pname
			});
			this.getProtocolContent(ptype);
			this.checkProtocol(ptype);
		},
		methods: {
			// 获取协议内容
			getProtocolContent(ptype){
				getProtocolContentByType(ptype).then(res=>{
					const protoData = res.data;
				     this.agreeText = protoData.replace('【','[').replace('】',']').substr(protoData.indexOf('<p'),protoData.lastIndexOf('</p>')-protoData.indexOf('<p'))
					
				})
			},
			// 校验是否签署过协议
			checkProtocol(ptype){
				checkProtocolByUnionid(ptype).then(res=>{
					this.pstatus = res.data;
				})
			},
			// 签署协议
			saveProtocol(){
				saveProtocolByUnionid({
					protocolType:this.ptype,
					userType: '1'
				}).then(res=>{
					if(this.redirectUrl){
						uni.redirectTo({
							url: this.redirectUrl
						});
					}else{
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.agreement{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 32rpx 128rpx 32rpx;
		color: #676869;
		rich-text{
			width: 100%;
			overflow-x: hidden;
			overflow-y: scroll;
		}
		.agree-wrap{
			width: 600rpx;
			box-sizing: border-box;
			background: #fff;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			border-radius: 6rpx;
			.btn-close{
				float: right;
			}
			.agree-texts{
				width: 480rpx;
				height: 720rpx;
				background: #fff;
				font-size:28rpx;
				font-weight:400;
				color:rgba(103,104,105,1);
				line-height:42rpx;
				padding: 0 60rpx;
				margin-bottom: 60rpx;
				text-align: left;
				overflow-x: hidden;
				overflow-y: auto;
				rich-text{
					width: 100%;
					overflow-x: hidden;
					overflow-y: scroll;
				}
			}
		}
	}
	.btn{
		width: 690rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background:rgba(68,146,132,1);
		border-radius:44rpx;
		position: fixed;
		bottom: 40rpx;
		left: 30rpx;
		font-size:34rpx;
		font-weight:700;
		color:rgba(255,255,255,1);
	}
</style>
