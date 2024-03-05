<template>
	<view class="cart-list">
		<view class="cart-item">
			<view class="order-title">
				<view v-if="goodsType != 15" class="shop-txt" :class="{'grey-item':cartParm.type == 1}">
					{{cartParm.title}}</view>
				<view class="order-status">{{showOrderStr}}</view>
			</view>
			<view class="order-goods" v-if="cartParm.list.length > 0">
				<view class="goods-item" v-for="(item ,i) in cartParm.list"
					v-if="i< (cartParm.showIndex =='all' ? cartParm.list.length : 2)" :key="i">
					<view class="good-img" :style="{backgroundImage:'url('+item.goodsImage+')'}">
						<!-- <image :src="item.goodsImage" class="img"></image> -->
					</view>
					<view class="good-info">
						<view class="goods-name-price">
							<view class="name">
								{{item.goodsName}}
							</view>
							<view class="price">¥{{exchangePrice(item.price)}}</view>
						</view>
						<view class="goods-specs-num">
							<view class="specs">{{item.goodsSpecification?item.goodsSpecification:''}}</view>
							<view class="num">×{{item.goodsQuantity}}</view>
						</view>
					</view>
				</view>
			</view>
			<slot></slot>
		</view>
	</view>
	</view>
</template>

<script>
	import {
		REFUND_TEXT
	} from '@/utils/enumerate';
	export default {
		data() {
			return {

			};
		},
		computed: {
			showOrderStr() {
				if (this.cartParm.refundStatus) {
					return REFUND_TEXT[this.cartParm.refundStatus] || '已取消';
				} else {
					return this.cartParm.statusTxt;
				}
			}
		},
		props: {
			cartParm: {
				default: () => {
					return {
						list: [],
						title: '',
						status: '',
						refundStatus: 0,
						statusTxt: '',
						type: 0,
						showIndex: 2,
					}
				},
				type: Object
			},
			goodsType: {
				type: String,
				default: '',
			},
		},
		onLoad(options) {},
		onShow(options) {},
		methods: {
		}
	};
</script>
<style lang="scss" scoped>
	.cart-list {
		padding: 0 32rpx 0 32rpx;

		.cart-item {
			background-color: #fff;
			border-radius: 8rpx;
			padding: 40rpx 30rpx 0 30rpx;
			margin-top: 24rpx;
			box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.05);

			.order-title {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.shop-txt {
					color: #3F4041;
					font-size: 30rpx;
					font-weight: 600;
					line-height: 30rpx;
				}

				.grey-item {
					color: rgba(151, 152, 153, 1);
					font-size: 28rpx;
					font-weight: normal;
				}

				.order-status {
					color: #449284;
					font-size: 24rpx;
				}
			}

			.pay-info {
				padding: 40rpx 0;

				.pay-btn {
					padding-top: 24rpx;

					.time {
						color: #53A89B;
						font-size: 24rpx;
						font-weight: bold;
					}
				}

				.pay-price,
				.pay-btn {
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.v1 {
						color: #ABACAD;
						font-size: 24rpx;
						margin-right: 12rpx;
					}

					.v2 {
						color: #515354;
						font-size: 28rpx;
					}

					.b1 {
						color: #949596;
						font-size: 24rpx;
						margin-right: 32rpx;
					}

					.btn {
						height: 50rpx;
						border-radius: 25rpx;
						background-color: #449284;
						font-size: 26rpx;
						font-weight: bold;
						padding: 0 24rpx;
						color: #fff;
					}

					.grey-btn {
						background-color: #fff;
						color: #979899;
						border: 1rpx solid #979899;
					}
				}
			}

			.order-goods {
				.goods-item {
					display: flex;
					padding: 36rpx 0;
					position: relative;

					.good-img {
						width: 120rpx;
						height: 120rpx;
						border-radius: 10rpx;
						background-repeat: no-repeat;
						background-size: cover;
						background-position: center;
						background-origin: border-box;
						background-clip: border-box;
						background-image: url();

						.img {
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}

						margin-right: 24rpx;
					}

					.good-info {
						flex: 1;
					}

					.goods-name-price {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						justify-content: space-between;

						.name {
							color: #3F4041;
							//display: flex;

							line-height: 32rpx;

							// align-content:flex-start;
							.wd180 {
								// max-width: 300rpx;
								line-height: 32rpx;
								display: inline-block;
							}

							.tag {
								display: inline-block;
								color: #CAA861;
								font-size: 24rpx;
								line-height: 24rpx;
								border: 1rpx solid #CAA861;
								border-radius: 4rpx;
								padding: 3rpx 8rpx;
								// height: 30rpx;
								// line-height: 30rpx;
								margin-left: 10rpx;
								box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.05);
								vertical-align: middle;
							}
						}

						.price {
							color: #4A4A4A;
						}
					}

					.goods-specs-num {
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 24rpx;
						line-height: 24rpx;

						// padding-top:8rpx;
						.specs {
							color: #979899;
						}

						.num {
							color: #A5A5A5;
						}
					}
				}

				.goods-item:after {
					position: absolute;
					content: " ";
					left: 0;
					bottom: 0;
					right: 0;
					height: 1PX;
					border-bottom: 1PX solid #F0F1F2;
					color: #F0F1F2;
					-webkit-transform-origin: 0 100%;
					-ms-transform-origin: 0 100%;
					transform-origin: 0 100%;
					-webkit-transform: scaleY(0.5);
					-ms-transform: scaleY(0.5);
					transform: scaleY(0.5);
				}
			}
		}
	}
</style>
