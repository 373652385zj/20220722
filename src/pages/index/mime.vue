<template>
	<view class="mine">
		<uni-card class="mine-card" :title="userInfo.nickName" :thumbnail="userInfo.avatarUrl">
			<button type="primary" @click="toUserInfoSetPage">完善信息</button>
		</uni-card>
		<view class="btn-block">
			<ul class="ul-block">
				<li v-for="(item,index) in navInfo" class="btn" @click="toPage(item.page)">
					<span class="title">{{item.title}}</span>
					<span class="arrow">></span>
				</li>
			</ul>
		</view>
		<view v-if="!userInfoFlag" class="login-btn">
			<!-- <button type="primary" @click="toUserInfoSetPage">完善信息</button> -->
			<!-- <button type="primary" @click="login">登录获取更多权限</button> -->
			<button type="primary" @click="clearUserType">清除用户类型缓存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginFlag: false, // 登录判断
				userInfoFlag: false, // 用户详细信息授权判断
				userInfo: {
					avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
					nickName: '某人',
				},
				navInfo: [
					{page: 'Picture', title: '图片'},
					{page: 'Music', title: '音乐'},
					{page: 'Knowledge', title: '知识'},
					{page: 'Memo', title: '备忘录'}
				]
			}
		},
		onLoad() {
			uni.hideHomeButton(); 
			// 判断是否登录
			// wx.checkSession({
			// 	success: (res) => {
			// 		console.log('检测登录状态 success：',res)
			// 		this.loginFlag = true
			// 	},
			// 	fail: (err) => {
			// 		console.log('检测登录状态 error：', err)
			// 		this.loginFlag = false
			// 	}
			// })
			
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log('本地缓存 success: ', res.data);
					this.userInfo = res.data
				},
				fail: (err) => {
					console.log('本地缓存 error: ', err);
					// #ifdef MP
					// 获取用户默认信息
					wx.getUserInfo({
						success: (res) => {
							console.log('获取默认信息 success：', res)
							this.userInfo = res.userInfo
							console.log(this.userInfo)
						},
						fail: (err) => {
							console.log('获取默认信息 error：', err)
						}
					})
					// #endif
				}
			});
		},
		methods: {
			toPage(pageName) {
				console.log('to page:' + pageName)
				uni.navigateTo({
					url: '/pages/functions/' + pageName
				})
			},
			toUserInfoSetPage() {
				uni.navigateTo({url: '/pages/index/setUserInfo'})
			},
			// wxc98e339e86f3c8d9 a0ad3cad14729e250d2c3068828d7065
			login() {
				// #ifdef MP
				wx.login({
					success: (res) => {
						console.log('wx.login success', res)
						wx.request({
							url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxc98e339e86f3c8d9&secret=a0ad3cad14729e250d2c3068828d7065&js_code=${res.code}&grant_type=authorization_code`,
							method: 'GET',
							success: (res1) => {
								console.log(res1)
							}
						})
					},
					fail: (err) => {
						console.log('wx.login error', err)
					}
				})
				// #endif
			},
			clearUserType() {
				uni.clearStorage({
					key: 'userType',
				})
			}
		}
	}
</script>

<style lang="scss">
	.mine {
		height: 100vh;
		overflow: hidden;
		.btn-block {
			margin: 15px;
			padding: 0 10px;
			border: 1px solid #EBEEF5;
			border-radius: 4px;
			background-color: #fff;
			box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px;
			.ul-block {
				.btn {
					border-bottom: 1px solid #EBEEF5;
					padding: 10px;
					display: flex;
					justify-content: space-between;
					cursor: pointer;
					.title {
						color: #999;
					}
					.arrow {
						color: #EBEEF5;
					}
					&:active {
						background: none;
						.title {
							color: #666;
						}
					}
					&:nth-last-child(1) {
						border-bottom: none;
					}
				}
			}
		}
		.login-btn {
			width: 100%;
			padding: 10px;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
		}
	}
</style>