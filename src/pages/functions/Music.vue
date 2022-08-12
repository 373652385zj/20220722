<template>
	<view class="music">
		<!-- <audio :src="audio.src"></audio> -->
		<uni-list>
			<view v-for="(item, index) in audio" :key="item.id" class="music-list-item">
				<view class="item" @click="toMusic($event, item)">
					<image class="poster" :src="httpPost + item.poster" mode="" @error="imageSrcError($event, index)"></image>
					<view class="text-block">
						<view class="music-name">{{ item.name }}</view>
						<view class="music-author">{{ item.author }}</view>
					</view>
				</view>
			</view>
		</uni-list>
		<view class="music-fix-box">
			<!-- <audio
				style="width: 100%; text-align: left"
				id="myAudio"
				:src="current.src"
				:poster="current.poster"
				:name="current.name"
				:author="current.author"
				:loop="true"
				controls
			></audio> -->
			<z-audio ref="zAudio" @next="next" @front="front"></z-audio>
		</view>
	</view>
</template>

<script>
	import ZAudio from '@/components/z-audio/index.vue'
	export default {
		components: {
			ZAudio,
		},
		data() {
			return {
				httpPost: 'https://zsdl-zzj.com:84/music/',
				audio: [],
				current: {
					poster: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/7fbf26a0-4f4a-11eb-b680-7980c8a877b8.png',
					name: '致爱丽丝',
					author: '暂无',
					src: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
				},
				audioAction: {
					method: 'pause'
				}
			}
		},
		async mounted() {
			this.audio = await this.getMusicList()
			console.log('this.audio', this.audio)
			this.current = this.setCurrentMusic(this.audio[0])
			this.audioCtx = wx.createAudioContext('myAudio')
		},
		methods: {
			getMusicList() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://zsdl-zzj.com:8122/getMusicList',
						method: 'POST',
						data: {},
						success: res => {
							console.log('getMusicList', res)
							resolve(res.data.data)
						}
					})
				})
			},
			toMusic(e, item) {
				console.log(item)
				this.$refs.zAudio.init(this.setCurrentMusic(item))
			},
			imageSrcError(event, index) {
				console.log('imageSrcError', event, index)
				this.audio[index].poster = 'images/default.jpeg'
				console.log(this.audio[index])
			},
			setCurrentMusic(item) {
				return {
					id: item.id,
					poster: this.httpPost + item.poster,
					name: item.name,
					author: item.author,
					src: this.httpPost + item.src,
				}
			},
			next(item) {
				console.log(item, Number(item.id), this.audio.length)
				if (Number(item.id) === this.audio.length) {
					this.$refs.zAudio.init(this.setCurrentMusic(this.audio[0]))
				} else {
					console.log(this.setCurrentMusic(this.audio[Number(item.id)]))
					this.$refs.zAudio.init(this.setCurrentMusic(this.audio[Number(item.id)]))
				}
			},
			front(item) {
				console.log(item, Number(item.id), this.audio.length)
				if (Number(item.id) === 1) {
					this.$refs.zAudio.init(this.setCurrentMusic(this.audio[this.audio.length - 1]))
				} else {
					console.log(this.setCurrentMusic(this.audio[Number(item.id) - 2]))
					this.$refs.zAudio.init(this.setCurrentMusic(this.audio[Number(item.id) - 2]))
				}
			}
		}
	}
</script>

<style lang="scss">
	.music {
		height: 100vh;
		overflow: scroll;
		padding-bottom: 92px;
		box-sizing: border-box;
		.music-list-item {
			cursor: pointer;
			.item {
				padding: 10px;
				display: flex;
				border-bottom: 1px solid rgba(0,0,0,.1);
				&:active {
					background: #1aad19;
				}
				.poster {
					width: 50px;
					height: 50px;
					margin-right: 10px;
				}
				.text-block {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.music-name {
						color: rgba(0,0,0,.9);
						font-size: 16px;
					}
					.music-author {
						color: rgba(0,0,0,.5);
						font-size: 14px;
					}
				}
			}
		}
		::v-deep .music-fix-box {
			width: 100%;
			position: fixed;
			bottom: 0;
			padding: 10px;
			box-sizing: border-box;
			background: white;
			.uni-audio-default {
				width: 100%;
			}
		}
	}
</style>
