<template>
	<view class="modal-container">
		<view class="bg"></view>
		<view class="modal-wrap-o">
			<view class="modal-wrap">
				<view class="modal-texts convert tc">
					<text class="text-title" v-if="modelObj.title">{{ modelObj.title }}</text>
					<view>
						<view>
							<text class="text-desc">{{ modelObj.content }}</text>
						</view>
					</view>
					
				</view>
        <slot></slot>
				
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
	z-index: 1300;
	.bg {
		background: rgba(0, 0, 0, 0.6);
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1301;
	}

	.modal-wrap-o {
		width: 600rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 1302;
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
