<template>
	<view class="collecting-address">
		<view v-if="!addressId" class="form-content">
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
						<textarea v-model="form[item.value]" class="weui-input" :placeholder="item.placeholder" :disabled="item.disable"/>
						<text class="message">{{item.tip}}</text>		
					</view>
				</view>
			</view>
			<view class="save-bth">
				<!-- <navigator open-type="exit" target="miniProgram">完成</navigator> -->
				<button type="primary" @click="submit" :disabled="disabled">提交</button>
			</view>
		</view>
		<view v-else class="address-id-content">
			<view class="form">
				<view class="info-block info-input">
					<view class="label">录入编号: </view>
					<input :value="addressId" class="weui-input" disabled/>
				</view>
			</view>
			<view class="save-bth">
				<!-- <navigator open-type="exit" target="miniProgram">完成</navigator> -->
				<button type="primary" @click="copy">复制录入编号</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Area from '@/utils/area.json'
	export default {
		data() {
			return {
				form: {
					idNo: '',
					name: '',
					phone: '',
					address: '',
					detailAddress: '',
          productContent: ''
				},
				// form: {
				// 	idNo: '0000000001',
				// 	name: '林庆',
				// 	phone: '15105958273',
				// 	address: '北京市/北京市/东城区',
				// 	detailAddress: '某某某地',
				//   productContent: '默认发货两颗柚子（一红一白）'
				// },
				formList: [
					{value: 'idNo', label: '表码', placeholder: '请输入表码', type: 'input', tip: ''},
					{value: 'name', label: '姓名', placeholder: '请输入姓名', type: 'input', tip: ''},
					{value: 'phone', label: '手机号', placeholder: '请输入手机号', type: 'input', tip: ''},
					{value: 'address', label: '地址', placeholder: '请选择地址', type: 'select', tip: ''},
					{value: 'detailAddress', label: '详细地址', placeholder: '请输入详细地址', type: 'textarea', tip: ''},
					{value: 'productContent', label: '发货内容', placeholder: '请输入发货内容', type: 'textarea', tip: '', disable: true},
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
				classes: '1-2',
				addressId: ''
			}
		},
		onLoad() {
			// uni.getStorage({
			// 	key: 'addressId',
			// 	success: (res) => {
			// 		console.log('本地缓存 success: ', res.data);
			// 		this.addressId = res.data
			// 	},
			// 	fail: (err) => {
			// 		console.log('本地缓存 error: ', err);
			// 	}
			// });
			console.log('Area', Area)
			this.areaArray = Area
			this.getProductContent()
			console.log(this.$dayjs().format('YYYY-MM-DD hh:mm'))
		},
		methods: {
			getProductContent() {
				uni.request({
					url: 'https://zsdl-zzj.com:8122/getProductContent',
					method: 'POST',
					data: {
						phone: '15105958777',
						tableNo: '001',
					},
					success: res => {
						console.log('test', res)
						this.form.productContent = res.data.data[0].productContent
					}
				})
			},
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
				// this.$refs.popup.open('bottom')
				// name: '',
				// phone: '',
				// address: '',
				// detailAddress: ''
				if (!this.form.idNo) {this.toast('请输入表码'); return}
				if (!this.form.name) {this.toast('请输入姓名'); return}
				if (!this.form.phone) {this.toast('请输入手机号'); return}
				if (!this.form.address) {this.toast('请输入省市区'); return}
				if (!this.form.detailAddress) {this.toast('请输入详细地址'); return}
				console.log(this.form)
				uni.request({
					url: 'https://zsdl-zzj.com:8122/addAddress',
					method: 'POST',
					data: {
						id: this.form.idNo,
						dateTime: this.$dayjs().format('YYYY-MM-DD hh:mm') + ':00',
						addressName: this.form.name,
						addressPhone: this.form.phone,
						address: this.form.address,
						detailAddress: this.form.detailAddress,
						productContent: this.form.productContent
					},
					success: res => {
						console.log('地址发送成功：', res.data.data[0].id,)
						this.toast(res.data.message)
						// this.addressId = res.data
						uni.setStorage({
							key: 'addressId',
							data: res.data.data[0].id,
							success: () => {
								console.log('setStorage success');
							}
						});
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
			copy() {
				uni.setClipboardData({
					data: this.addressId,//要被复制的内容
					success:()=>{//复制成功的回调函数
						uni.showToast({//提示
							title:'复制成功'
						})
					}
				});
			}
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
			z-index: 100;
		}
	}
</style>
