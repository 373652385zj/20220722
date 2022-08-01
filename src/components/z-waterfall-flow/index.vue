<template>
	<view class="z-waterfall-flow">
		<view v-show="isLoading" class="loading">
			<uni-icons type="more-filled" size="30"></uni-icons>
			<text class="loading-text">图片资源加载中...({{progress}})</text>
		</view>
		<scroll-view style="height: 100%;" scroll-y="true" class="scroll-Y" :scroll-top="scrollTop" @scroll="scroll">
			<!-- <view class="waterfall-item-block" :style="{height: waterfallHeight + 'px'}"> -->
				<view class="waterfall-item" v-for="(item, index) in waterfallList" :key="index"
					:style="{
						width: item.width + 'px',
						height: item.height + 'px',
						top: item.top,
						left: item.left,
					}"
				>
					<image 
						class="images"
						:src="item.src"
						:style="{
							width: (item.width - 10) + 'px',
							height: (item.height - 40) + 'px',
						}"
						@click="previewImage(item.src)"
						@load="imageLoad($event, index)"
						@error="imageError($event, index)"
					></image>
					<view class="img-info" :style="{height: imgInfoBlockH + 'px'}">
						{{item.imgName}}
					</view>
				</view>
			<!-- </view> -->
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				waterfallList: [],
				imageLoadSerial: 0,
				isLoading: true,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				waterfallHeight: 700,
				progress: '--/--',
				imageList: [],
				imgInfoBlockH: 20 // 详情高度设置
			}
		},
		computed: {
			styleVar() {
				return {
					'--img-info-block-height': this.imgInfoBlockH
				}
			}
		},
		methods: {
			init(pageTotal, data) {
				console.log('data length', pageTotal, data.length, pageTotal !== data.length)
				this.progress = `${data.length}/${pageTotal}`
				if (pageTotal !== data.length) {
					this.isLoading = true
				} else {
					this.isLoading = false
					this.progress = `--/--`
				}
				if (!data.length) return
				console.log(data)
				let rightH = 0
				let leftH = 0
				this.imageList = []
				this.waterfallList = data.map((item, index) => {
					this.imageList.push(item.src.replace('thumbnailImages', 'viewImages'))
					item.height = item.height + this.imgInfoBlockH
					let lineNum = parseInt(((index + 1) / 2).toFixed())
					// if ((index + 1) % 2) {
					if (rightH <= leftH) {
						// 右
						item.left = '0'
						if (lineNum === 1) {
							item.top = '0px'
							rightH += parseInt(item.height)
						} else {
							item.top = rightH + 'px'
							rightH += parseInt(item.height)
						}
					} else {
						// 左
						item.left = '50%'
						if (lineNum === 1) {
							item.top = '0px'
							leftH += parseInt(item.height)
						} else {
							item.top = leftH + 'px'
							leftH += parseInt(item.height)
						}
					}
					if (index === data.length - 1) {
						console.log(444)
						this.goTop()
					}
					return item
				})
				console.log('waterfallList.length', this.waterfallList.length)
			},
			previewImage(src) {
				let previewSrc = src.replace('thumbnailImages', 'viewImages')
				console.log('预览图片1：', previewSrc)
				uni.previewImage({
					current: previewSrc,
					urls: this.imageList
				})
			},
			imageLoad(e, imgIndex) {
				console.log('load')
				console.log(e, imgIndex)
			},
			imageError(e, imgIndex) {
				console.log('error')
				console.log(e, imgIndex)
			},
			scroll(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop() {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				console.log("纵向滚动 scrollTop 值已被修改为 0")
				// uni.showToast({
				// 	icon: "none",
				// 	title: "纵向滚动 scrollTop 值已被修改为 0"
				// })
			}
		}
	}
</script>

<style lang="scss">
	// $img-info-Height: 60;
	.z-waterfall-flow {
		width: 100%;
		height: 100%;
		position: relative;
		.loading {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			text-align: center;
			padding-top: 100px;
			z-index: 100;
			background: white;
			.loading-text {
				display: block;
			}
		}
		.waterfall-item {
			padding: 5px;
			box-sizing: border-box;
			position: absolute;
			z-index: 90;
			display: flex;
			flex-direction: column;
			.images {
				width: 100%;
				height: 100%;
				background: gray;
			}
			.img-info {
				width: 100%;
				font-size: 12px;
				color: #999;
				border-top: none;
				box-sizing: border-box;
			}
		}
	}
</style>
