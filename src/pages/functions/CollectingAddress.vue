<template>
	<view class="collecting-address">
		<view class="form">
			<view v-for="item in formList" :key="item.value">
				<view class="info-block info-input" v-if="item.type === 'input'">
					<view class="label">{{item.label}}: </view>
					<input v-model="form[item.value]" class="weui-input" :placeholder="item.placeholder"/>
					<text class="message">{{item.tip}}</text>		
				</view>
				<view class="info-block info-select" v-else-if="item.type === 'select'">
					<view class="label">{{item.label}}: </view>
					<uni-data-picker
						:placeholder="item.placeholder"
						:popup-title="item.placeholder"
						:localdata="areaArray"
						v-model="areaIndex"
						@change="onchange"
					>
					</uni-data-picker>
					<text class="message">{{item.tip}}</text>	
				</view>
				<view class="info-block info-textarea" v-else>
					<view class="label">{{item.label}}: </view>
					<textarea v-model="form[item.value]" class="weui-input" :placeholder="item.placeholder" maxlength="6"/>
					<text class="message">{{item.tip}}</text>		
				</view>
			</view>
		</view>
		<view class="save-bth">
			<button type="primary" @click="submit" :disabled="disabled">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					phone: '',
					address: '',
					detailAddress: ''
				},
				formList: [
					{value: 'name', label: '姓名', placeholder: '请输入姓名', type: 'input', tip: ''},
					{value: 'phone', label: '手机号', placeholder: '请输入手机号', type: 'input', tip: ''},
					{value: 'address', label: '地址', placeholder: '请选择地址', type: 'select', tip: ''},
					{value: 'detailAddress', label: '详细地址', placeholder: '请输入详细地址', type: 'textarea', tip: ''},
				],
				disabled: false,
				areaIndex: '',
				areaArray: [{
					text: "一年级",
					value: "1-0",
					children: [{
						text: "1.1班",
						value: "1-1"
					},
					{
						text: "1.2班",
						value: "1-2"
					}]
				},
				{
					text: "二年级",
					value: "2-0",
					children: [{
						text: "2.1班",
						value: "2-1"
					},
					{
						text: "2.2班",
						value: "2-2"
					}]
				},
				{
					text: "三年级",
					value: "3-0",
					disable: true
				}],
				classes: '1-2'
			}
		},
		onLoad() {
			console.log(this.$dayjs().format('YYYY-MM-DD hh:mm'))
		},
		methods: {
			areaPickerChange(val) {
				console.log(val)
			},
			onchange(e) {
				let a = ''
				e.detail.value.map((item, index) => {
					a += item.text
					if (index !== e.detail.value.length - 1) {
						a += '/'
					}
				})
				this.form.address = a
				console.log('onchange:', e);
			},
			submit() {
				// name: '',
				// phone: '',
				// address: '',
				// detailAddress: ''
				if (!this.form.name) {this.toast('请输入姓名'); return}
				if (!this.form.phone) {this.toast('请输入手机号'); return}
				if (!this.form.address) {this.toast('请输入省市区'); return}
				if (!this.form.detailAddress) {this.toast('请输入详细地址'); return}
				console.log(this.form)
				uni.request({
					url: 'https://zsdl-zzj.com:8122/addAddress',
					method: 'POST',
					data: {
						phone: '15105958777',
						tableNo: '001',
						dateTime: this.$dayjs().format('YYYY-MM-DD hh:mm') + ':00',
						addressName: this.form.name,
						addressPhone: this.form.phone,
						address: this.form.address,
						detailAddress: this.form.detailAddress
					},
					success: res => {
						console.log('test', res)
						this.toast(res.data.message)
					}
				})
			},
			toast(content) {
				// #ifdef MP
				wx.showToast({
				  title: content,
				  icon: 'error',
				  duration: 2000
				})
				// #endif
				// #ifdef H5
				alert(content)
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	.collecting-address {
		.form {
			margin-bottom: 70px;
			.info-block {
				padding: 10px;
				.label {
					margin-bottom: 10px;
				}
			}
			.info-input {
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
			.info-select {
				::v-deep .input-value {
					height: auto;
					padding: 10px;
				}
				::v-deep .input-value-border {
					border: none;
					background: #efefef;
					border-radius: 0px;
				}
				::v-deep .placeholder {
					font-size: 17px;
				}
				::v-deep .selected-list {
					font-size: 17px;
				}
			}
			.info-textarea {
				.weui-input {
					width: 100%;
					background: #efefef;
					padding: 10px;
					box-sizing: border-box;
				}
			}
		}
		.save-bth {
			width: 100%;
			padding: 10px;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 999;
		}
	}
</style>
