<template>
	<view class="z-audio">
		<!-- <button type="default" @click="audioPlay">播放</button> -->
		<view class="slider-block">
			<view class="audio-number">{{format(slider.current)}}</view>
			<slider class="audio-slider" :activeColor="slider.color" block-size="16" :value="slider.current" :max="slider.duration" @changing="slider.seek=true,slider.current=$event.detail.value"
						 @change="slider.seek=true,clickSeek($event.detail.value)"></slider>
			<view class="audio-number">{{format(slider.duration)}}</view>
		</view>
		<view class="play-block">
			<view class="play-btn front" @click="front">
				<image src="@/static/front.svg" mode=""></image>
			</view>
			<view class="play-btn play" @click="playOrPause">
				<image v-show="slider.paused" src="@/static/play.svg" mode=""></image>
				<image v-show="!slider.paused" src="@/static/pause.svg" mode=""></image>
			</view>
			<view class="play-btn next" @click="next">
				<image src="@/static/next.svg" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				audio: uni.getBackgroundAudioManager(),
				current: {
					poster: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/7fbf26a0-4f4a-11eb-b680-7980c8a877b8.png',
					name: '致爱丽丝',
					author: '暂无',
					src: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
				},
				slider: {
					current: 0,
					duration: 0,
					seek: Boolean,
					color: '#169af3',
					loading: Boolean,
					continue: Boolean,
					paused: false,
				}
			}
		},
		created() {
			
		},
		methods: {
			init(item) {
				this.current = item
				if (item.src) {
					console.log("创建")
					this.playMusic(item)
					this.slider.paused = false
				}
				this.audio.obeyMuteSwitch = false
				//音频播放事件
				this.audio.onPlay(() => {
					console.log("播放")
					this.slider.paused = false
					this.slider.loading = false
				})
				// 重要 缺失 音频进入可以播放状态
				this.audio.onCanplay(() => {
					console.log("可播放状态")
					if(this.audio.duration){
						// this.duration = this.audio.duration
						console.log(this.audio.duration)
					}
					
				})
				//音频进度更新事件
				this.audio.onTimeUpdate(() => {
					// console.log("开始监听")
					/* 
					判断是否点击过进度条，若点击过，则不要对当前进度条时间current赋currentTime的值
					因为音频进度更新事件运行频率过快，两个时间会引起冲突，
					因此需要通过设置开关，判断seek真假，若seek为假则未点击进度条，若seek为真则跳过此次赋值并修改seek值重置为假
					*/
					if (!this.seek) {
						this.slider.current = this.audio.currentTime
					}else{
						console.log("修改一次进度条")
						// this.audio.seek(this.current_tmp)
						// this.current = this.current_tmp
						console.log(this.slider.current)
						this.slider.seek = false
					}
					if(this.audio.duration){
						this.slider.duration = this.audio.duration
					}
				})
				//音频暂停事件
				this.audio.onPause(() => {
					console.log("暂停")
					this.slider.paused = true
				})
				//音频结束事件
				this.audio.onEnded(() => {
					console.log('音频结束', this.current)
					if (this.slider.continue) {
						this.next(this.current)
					} else {
						this.slider.paused = true
						this.slider.current = 0
					}
				})
				//音频完成更改进度事件
				this.audio.onSeeked(() => {
					// this.current = this.audio.currentTime
				})
				// 拖动事件
				this.audio.onSeeking(() => {
					// this.current = this.audio.currentTime
				})
			},
			playMusic(item) {
				this.audio.src = item.src
				this.audio.title = item.name
				this.audio.coverImgUrl = item.poster
				setTimeout(() => {
					this.audioPlay()
				}, 500)
			},
			audioPlay() {
				this.audio.play()
			},
			audioPause() {
				this.audio.pause()
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(
					Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//点击进度条按钮
			clickSeek(val) {
				console.log("点击进度条")
				this.slider.current = val
				this.audio.seek(val)
			},
			next() {
				this.$emit('next', this.current)
			},
			playOrPause() {
				if (this.slider.paused) {
					this.audioPlay()
				} else {
					this.audioPause()
				}
			},
			front() {
				this.$emit('front', this.current)
			},
		}
	}
</script>

<style lang="scss">
	.z-audio {
		
		.slider-block {
			width: 100%;
			height: 50px;
			display: flex;
			line-height: 40px;
			.audio-slider {
				width: 100%;
			}
		}
		.play-block {
			width: 100%;
			display: flex;
			justify-content: space-around;
			.play-btn {
				width: 30px;
				height: 30px;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
