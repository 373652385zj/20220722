<template>
	<view class="test">
		<button type="default" @click="toMime">去我的页面</button>
		<button type="default" @click="authorize">授权</button>
		<button type="default" @click="login">登录login</button>
		<button type="default" @click="getUserInfo">获取用户信息</button>
		<button type="default" @click="payment">支付</button>
	</view>
</template>

<script>
export default {
	methods: {
		toMime() {
			uni.navigateTo({
				url: '/pages/index/mime'
			})
		},
		authorize() {
			wx.getSetting({
			  success(res) {
					console.log(res.authSetting)
			    if (!res.authSetting['scope.camera']) {
			      wx.authorize({
			        scope: 'scope.camera',
			        success (res1) {
			          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
			          console.log(res1)
			        }
			      })
			    }
			  }
			})
		},
		// wxc98e339e86f3c8d9 a0ad3cad14729e250d2c3068828d7065
		login() {
			wx.login({
				success: (res) => {
					console.log('wx.login success', res)
					wx.request({
						url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxc98e339e86f3c8d9&secret=a0ad3cad14729e250d2c3068828d7065&js_code=${res.code}&grant_type=authorization_code`,
						method: 'GET',
						success(res1) {
							console.log(res1)
						}
					})
				},
				fail: (err) => {
					console.log('wx.login error', err)
				}
			})
		},
		getUserInfo() {
			wx.getUserInfo({
				success: (res) => {
					console.log('wx.getUserInfo success', res)
				},
				fail: (err) => {
					console.log('wx.getUserInfo error', err)
				}
			})
		},
		// 微信支付，需要提前做很多准备，暂时不操作
		payment() {
			wx.requestPayment({
			  timeStamp: (new Date()).getTime(),
			  nonceStr: '',
			  package: '',
			  signType: 'MD5',
			  paySign: '',
			  success: (res) => {
					console.log('支付 success：', res)
				},
			  fail: (err) => {
					console.log('支付 error：', err)
				}
			})
		}
	}
}
</script>

<style></style>
