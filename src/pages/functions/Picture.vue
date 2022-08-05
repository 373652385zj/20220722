<template>
	<view class="content">
		<uni-drawer ref="uniDrawer" mode="left">
			<scroll-view style="height: 100%;" scroll-y="true">
				<uni-section v-for="(item,index) in imgDictList" :key="index" :title="item.title" type="line">
					<view class="drawer-btn">
						<button class="detail-btn" type="primary" size="mini" @click="imgDictList[index].msgShow = !imgDictList[index].msgShow">
							{{item.msgShow ? '收起' : '打开'}}详情
						</button>
						<button class="detail-btn" type="primary" size="mini" @click="sectionHandle(item.value)">
							查看图片
						</button>
					</view>
					<uni-card v-show="item.msgShow" :title="item.title" extra="景区说明">
						<text class="uni-body">{{ item.message }}</text>
					</uni-card>
				</uni-section>
			</scroll-view>
		</uni-drawer>
		<z-waterfall-flow ref="zWaterfallFlow" />
		<view class="pagination">
			<view class="todo">
				<button class="btn" type="default" @click="$refs.uniDrawer.open()">切换</button>
				<button class="btn" type="primary" @click="init">刷新</button>
			</view>
			<uni-pagination v-model="pageIndex" :total="folderImgList[currentImageItem].length" :pageSize="pageSize" title="标题文字" @change="pageIndexChange" />
		</view>
	</view>
</template>

<script>
	// import imgList from "https://zsdl-zzj.com:83/images/data/images.json";
	// import imgDict from "https://zsdl-zzj.com:83/images/data/imagesDict.json";
	// import imgDetail from "https://zsdl-zzj.com:83/images/data/imagesDetail.json";
	import ZWaterfallFlow from "../../components/z-waterfall-flow/index";
	export default {
		name: "waterfall-flow",
		components: {
			ZWaterfallFlow,
		},
		data() {
			return {
				httpPath: "https://zsdl-zzj.com:83/images/",
				folderImgList: [],
				currentImageItem: "",
				imgDict: {},
				imgDictList: [],
				imageInfo: [],
				scenicSpot: {},
				loadData: [],
				pageIndex: 1,
				pageSize: 10,
				timer: {}
			}
		},
		onShareAppMessage() {
			console.log('onShareAppMessage')
			return {
				title: '个人图片集',
				path: 'pages/index/index'
			}
		},
		async onLoad() {
			this.folderImgList = await this.getImageList()
			this.imgDict = await this.getImageDict()
			this.scenicSpot = await this.getImageDetail()
			console.log("folderImgList", this.folderImgList)
			console.log("imgDict", this.imgDict)
			console.log("scenicSpot", this.scenicSpot)
			this.currentImageItem = Object.keys(this.imgDict)[0]
			await this.setDictList()
			await this.setPageIndex(1)
			this.init()
		},
		methods: {
			// 获取远程图片路径列表
			getImageList() {
				return new Promise((res, rej) => {
					uni.request({
						url: 'https://zsdl-zzj.com:83/images/data/images.json',
						success: (result) => {
							console.log('getImages', result)
							res(result.data)
						}
					})
				})
			},
			// 获取远程图片字典
			getImageDict() {
				return new Promise((res, rej) => {
					uni.request({
						url: 'https://zsdl-zzj.com:83/images/data/imagesDict.json',
						success: (result) => {
							console.log('getImagesDict', result)
							res(result.data)
						}
					})
				})
			},
			// 获取远程图片详情
			getImageDetail() {
				return new Promise((res, rej) => {
					uni.request({
						url: 'https://zsdl-zzj.com:83/images/data/imagesDetail.json',
						success: (result) => {
							console.log('getImagesDetail', result)
							res(result.data)
						}
					})
				})
			},
			setDictList() {
				Object.keys(this.imgDict).map(key => {
					this.imgDictList.push({
						title: this.imgDict[key],
						value: key,
						message: this.scenicSpot[key].message,
						msgShow: false
					})
				})
			},
			// 分页操作
			setPageIndex(index) {
				index = index - 1
				let begin = index * this.pageSize
				let end = index * this.pageSize + this.pageSize
				console.log(begin, end)
				this.loadData = this.folderImgList[this.currentImageItem].slice(begin, end)
				console.log(this.loadData)
			},
			async init() {
				let list = []
				let systemWH = await this.getSystemInfo()
				console.log('this.loadData', this.loadData)
				this.loadData.map(async (item, index) => {
					console.log(index, item)
					let p = await this.getImageProportion(this.httpPath + item)
					let w = parseInt((systemWH.width) / 2)
					let h = parseInt((w / p).toFixed())
					// console.log(p, w, h)
					list.push({
						src: this.httpPath + item,
						width: w,
						height: h,
						imgName: this.imgDict[this.currentImageItem]
					})
					console.log('index, this.loadData', index, this.loadData.length - 1)
					if (index === this.loadData.length - 1) {
						this.imageInfo = list
						console.log(555)
						console.log('imageInfo', this.imageInfo)
						await this.$refs.zWaterfallFlow.init(this.loadData.length, this.imageInfo)
						let timer = setInterval(() => {
							console.log(111)
							console.log(this.$refs.zWaterfallFlow.isLoading)
							if (this.$refs.zWaterfallFlow.isLoading) {
								this.$refs.zWaterfallFlow.init(this.loadData.length, this.imageInfo)
							} else {
								clearInterval(timer)
							}
						}, 500)
					}
				})
			},
			async sectionHandle(value) {
				this.currentImageItem = value
				await this.setPageIndex(1)
				this.pageIndex = 1
				this.$refs.zWaterfallFlow.isLoading = true
				console.log(666, this.$refs.zWaterfallFlow.isLoading)
				this.init()
				this.$refs.uniDrawer.close()
			},
			// 获取图片信息
			getImageProportion(url) {
				return new Promise((res, rej) => {
					uni.getImageInfo({
						src: url,
						success: function (image) {
							res(image.width / image.height)
						}
					});
				})
			},
			// 获取系统可视宽高
			getSystemInfo() {
				return new Promise((res, rej) => {
					uni.getSystemInfo({ 
						success: (resSystem) => {
							res({
								width: resSystem.windowWidth,
								height: resSystem.windowHeight
							})
						}
					})
				})
			},
			async pageIndexChange(e) {
				console.log(e)
				await this.setPageIndex(e.current)
				clearTimeout(this.timer)
				console.log(999, this.timer)
				this.timer = setTimeout(() => {
					this.$refs.zWaterfallFlow.isLoading = true
					this.init()
				}, 1000)
			},
		}
	}
</script>

<style lang="scss">
	.content {
		/* #ifdef MP */
		height: calc(100vh - 100px);
		/* #endif */
		height: calc(100vh - 164px);
		box-sizing: border-box;
		.drawer-btn {
			width: 100%;
			display: flex;
			padding-left: 15px;
			box-sizing: border-box;
		}
		.pagination {
			width: 100%;
			height: 120px;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			background: white;
			padding: 10px 0;
			z-index: 110;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			box-shadow: 0px 0px 14px 1px #999;
			.todo {
				display: flex;
				.btn {
					width: 40%;
				}
			}
			::v-deep .uni-pagination {
				height: 46px;
				padding: 0 10px;
			}
		}
	}
</style>
