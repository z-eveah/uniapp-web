<template>
	<view class="modal-container">
		<view class="bg"></view>
		<view class="modal-wrap-o">
			<view class="modal-wrap">
				<view class="modal-texts" :class="{ convert: modelObj.content.length == 0,'tc':modelObj.tc == 1 }">
					<text class="text-title" v-if="modelObj.title">{{ modelObj.title }}</text>
					<view v-if="modelObj.content.length > 0">
						<view>
							<text class="text-desc">{{ modelObj.content }}</text>
						</view>
					</view>
					<view v-else>
						<view class="convert-info">
							<view class="conver-item">
								<view class="l-item">居民姓名:</view>
								<view class="r-item">{{ info.name }}</view>
							</view>
							<view class="conver-item">
								<view class="l-item">手机号码:</view>
								<view class="r-item">{{ info.mobile }}</view>
							</view>
              <view class="conver-item border-t">
              	<view class="l-item">医生姓名:</view>
              	<view class="r-item">
                  <view class="doc-box">
                    <view>{{doctorInfo.doctorName}}</view>
                    <view class="txt">{{doctorInfo.department?doctorInfo.department+' | ':''}}{{doctorInfo.title?doctorInfo.title:''}}</view>
                  </view> 
                </view>
              </view>
						</view>
						<view class="convert-tips">仅限该居民使用，绑定后无法更换</view>
						<!-- <view class="convert-opt" @click="bindFun">
							<image src="https://file.yunqueyi.com/health/applet/con12.png" class="icon"></image>
							绑定其他居民
						</view> -->
					</view>
				</view>
				<view class="model-btns">
					<view class="btn cancel" @click="btnFun('cancel')" v-if="modelObj.btnNum == 2">{{ modelObj.cancelBtnTxt }}</view>
					<view class="btn" @click="btnFun('success')">{{ modelObj.sureBtnTxt }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
  import { mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		modelObj: {
			type: Object,
			default: () => {
				return {
					content: '',
					title: '提示',
					btnNum: 1,
					sureBtnTxt: '确定',
					cancelBtnTxt: '取消',
          tc:'0'
				};
			}
		},
		info: {
			type: Object,
			default: () => {
				return {
					name: '',
					mobile: ''
				};
			}
		},
		doctorId: {
			type: Number | String,
			default: ''
		}
	},
  computed: {
  	...mapGetters(['doctorInfo'])
  },
	methods: {
		btnFun(str) {
			this.$emit(str);
		},
		bindFun() {
			uni.navigateTo({
				url: `/pages/health/bindAccount?doctorId=${this.doctorId}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.modal-container {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 100;
	.bg {
		background: rgba(0, 0, 0, 0.6);
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 101;
	}

	.modal-wrap-o {
		width: 600rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 102;
		.modal-wrap {
			width: 600rpx;
			box-sizing: border-box;
			background: #fff;
			border-radius: 8rpx;
      .tc{
        text-align: center;
      }
			.modal-texts {
				width: 536rpx;
				padding: 60rpx 32rpx;
				.text-title {
					font-size: 36rpx;
					font-weight: 700;
					color: rgba(51, 51, 51, 1);
					line-height: 36rpx;
					text-align: center;
					margin-bottom: 24rpx;
					display: block;
				}
				.text-desc {
					font-size: 28rpx;
					color: #676869;
					line-height: 42rpx;
				}
			}
			.convert {
				// padding-bottom:32rpx;
			}
		}
		.model-btns {
			display: flex;
			position: relative;

			height: 100rpx;
			.btn {
				flex: 1;
				height: 100rpx;
				align-items: center;
				justify-content: center;
				display: flex;
				color: #449284;
				font-size: 34rpx;
			}
			.cancel {
				color: #999;
				position: relative;
			}
			.cancel:before {
				//border-radius: 3px;
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				width: 1px;
				height: 200%;
				background: #f0f1f2;
				//border: 1px solid #F0F1F2;
				//border-top:0 none;
				-webkit-transform-origin: 0 0;
				-moz-transform-origin: 0 0;
				-ms-transform-origin: 0 0;
				-o-transform-origin: 0 0;
				transform-origin: 0 0;
				-webkit-transform: scale(0.5, 0.5);
				-ms-transform: scale(0.5, 0.5);
				-o-transform: scale(0.5, 0.5);
				transform: scale(0.5, 0.5);
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
			}
		}
		.model-btns:before {
			//border-radius: 3px;
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 200%;
			height: 1px;
			border: 1px solid #f0f1f2;
			//border-top:0 none;
			-webkit-transform-origin: 0 0;
			-moz-transform-origin: 0 0;
			-ms-transform-origin: 0 0;
			-o-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scale(0.5, 0.5);
			-ms-transform: scale(0.5, 0.5);
			-o-transform: scale(0.5, 0.5);
			transform: scale(0.5, 0.5);
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
		}
	}
	.convert-info {
		background: #f8f9fa;
		padding: 32rpx 32rpx 0 32rpx;
		border-radius: 12rpx;
		.conver-item {
			display: flex;
			align-items: center;
			//justify-content: space-between;
			color: #979899;
			font-size: 30rpx;
			padding-bottom: 32rpx;
			//height: 30rpx;
			line-height: 30rpx;
			view {
				//height: 30rpx;
				line-height: 30rpx;
			}
      .l-item{
        width:140rpx;
      }
			.r-item {
				color: #373839;
        .doc-box{
          // text-align: center;
        }
        .txt{
          color: #676869;
          padding-top: 10rpx;
          font-size: 24rpx;
        }
			}
		}
    .border-t{
      padding-top:32rpx;
      border-top:1rpx solid #E7E8E9;
      align-items: flex-start;
    }
      
	}
	.convert-tips {
		padding: 16rpx 0 30rpx 0;
		color: #979899;
		font-size: 24rpx;
		line-height: 30rpx;
	}
	.convert-opt {
		display: flex;
		align-items: center;
		color: #449284;
		font-size: 28rpx;
		height: 24rpx;
		line-height: 24rpx;
		.icon {
			width: 30rpx;
			height: 30rpx;
			margin-right: 8rpx;
		}
	}
}
</style>
