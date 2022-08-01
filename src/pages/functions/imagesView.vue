<template>
	<view class="content">
		<uni-drawer ref="uniDrawer" mode="left">
			<scroll-view style="height: 100%;" scroll-y="true">
				<uni-section v-for="(item,index) in imgDictList" :title="item.title" type="line">
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
			<uni-pagination v-model="pageIndex" :total="folderImgList.hanKouJiangTan.length" :pageSize="pageSize" title="标题文字" @change="pageIndexChange" />
		</view>
	</view>
</template>

<script>
	import imgList from "../../utils/images.json";
	import imgDict from "../../utils/imagesDict.json";
	import ZWaterfallFlow from "../../components/z-waterfall-flow/index";
	export default {
		name: "waterfall-flow",
		components: {
			ZWaterfallFlow,
		},
		data() {
			return {
				httpPath: "https://zsdl-zzj.com:83/images/",
				folderImgList: imgList,
				currentImageItem: Object.keys(imgDict)[0],
				imgDictList: [],
				imageInfo: [],
				scenicSpot: {
					hanKouJiangTan: {
						message: '汉口江滩，位于湖北省武汉市江岸区，面积160万平方米，与沿江大道相邻，与武昌黄鹤楼景区相望，与长江百舸争流相映，构成武汉市中心区独具魅力的景观中心，是武汉市著名的风景游览胜地。'
					},
					huangHeLou: {
						message: '黄鹤楼，位于湖北省武汉市武昌区，地处蛇山之巅，濒临万里长江，为武汉市地标建筑；始建于三国吴黄武二年（223年），历代屡加重修，现存建筑以清代“同治楼”为原型设计，重建于1985年；因唐代诗人崔颢登楼所题《黄鹤楼》一诗而名扬四海。自古有“天下绝景”之美誉，与晴川阁、古琴台并称为“武汉三大名胜”，与湖南岳阳岳阳楼、江西南昌滕王阁并称为“江南三大名楼”，是“武汉十大景”之首、“中国古代四大名楼”之一、“中国十大历史文化名楼”之一，世称"天下江山第一楼"。'
					},
					huBeiShengBoWuGuan: {
						message: '湖北省博物馆筹建于1953年，坐落于湖北省武汉市武昌区东湖风景区，占地面积81909平方米，建筑面积49611平方米，展厅面积13427平方米，有中国规模最大的古乐器陈列馆。'
					},
				},
				loadData: [],
				pageIndex: 1,
				pageSize: 10,
				timer: {}
			}
		},
		async onLoad() {
			console.log(imgList)
			await this.setDictList()
			await this.setPageIndex(1)
			this.init()
		},
		methods: {
			setDictList() {
				Object.keys(imgDict).map(key => {
					this.imgDictList.push({
						title: imgDict[key],
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
				this.loadData = imgList[this.currentImageItem].slice(begin, end)
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
						imgName: imgDict[this.currentImageItem]
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
