<template>
	<view class="set-user-info">
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		  <image class="avatar" mode="aspectFit" :src="avatarUrl"></image>
		</button> 
		<view class="nick-name-input">
			<view>昵称: </view>
			<input v-model="nickName" class="weui-input" placeholder="请输入昵称"/>
		</view>
		<view class="save-bth">
			<button type="primary" @click="saveUserInfo">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				nickName: ''
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log('本地缓存 success: ', res.data);
					this.avatarUrl = res.data.avatarUrl
					this.nickName = res.data.nickName
				},
				fail: (err) => {
					console.log('本地缓存 error: ', err);
				}
			});
		},
		methods: {
			onChooseAvatar(e) {
				const { avatarUrl } = e.detail 
				this.avatarUrl = avatarUrl
			},
			saveUserInfo() {
				let params = {
					avatarUrl: this.avatarUrl,
					nickName: this.nickName
				}
				console.log('saveUserInfo', params)
				uni.setStorage({
					key: 'userInfo',
					data: {
						avatarUrl: this.avatarUrl,
						nickName: this.nickName
					},
					success: function () {
						console.log('setStorage success');
						uni.navigateTo({
							url: '/pages/index/mime'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.set-user-info {
		.avatar-wrapper {
			width: 100px;
			height: 100px;
			padding: 0;
			margin-top: 10px;
			.avatar {
				width: 100%;
				height: 100%;
			}
		}
		.nick-name-input {
			padding: 10px;
			.weui-input {
				width: 100%;
				height: 40px;
				padding: 0 10px;
				margin: 5px 0;
				background: white;
				box-sizing: border-box;
				background: #efefef;
			}
		}
		.save-bth {
			width: 100%;
			padding: 10px;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
		}
	}
</style>
