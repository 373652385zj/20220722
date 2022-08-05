<template>
	<view class="set-user-info">
		<view class="info-input">
			<view>用户类型: </view>
			<input v-model="userType" class="weui-input" placeholder="请输入用户类型" maxlength="6"/>
			<text class="message">{{message}}</text>
		</view>
		<view class="save-bth">
			<button type="primary" @click="submit" :disabled="disabled">提交</button>
		</view>
	</view>
</template>

<script>
	import { encrypt } from '../../utils/crypto.js'
	import cryptoDict from '../../utils/cryptoDict.json'
	export default {
		data() {
			return {
				userType: '',
				msgType: 'success',
				messageText: '--',
				disabled: true,
				message: ''
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userType',
				success: (res) => {
					console.log('本地缓存 success: ', res.data);
					this.userType = res.data
					// let number = cryptoDict[encrypt(this.userType)]
					// this.toPage(number)
				},
				fail: (err) => {
					console.log('本地缓存 error: ', err);
				}
			});
		},
		watch: {
			userType(val) {
				if (val.length === 6) {
					this.disabled = false
				} else {
					this.disabled = true
				}
			}
		},
		methods: {
			toPage(number) {
				console.log('number', number)
				this.message = ''
				if (number === "01") {
					uni.redirectTo({
						url: '/pages/index/mime'
					})
				} else if (number === "02") {
					uni.redirectTo({
						url: '/pages/functions/CollectingAddress'
					})
				} else {
					this.message = '该用户类型无效'
				}
			},
			submit() {
				uni.setStorage({
					key: 'userType',
					data: this.userType,
					success: () => {
						console.log('setStorage success');
						let number = cryptoDict[encrypt(this.userType)]
						this.toPage(number)
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
		.info-input {
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
			.message {
				font-size: 12px;
				color: red;
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
