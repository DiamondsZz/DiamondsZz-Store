<template>
	<div class="verify-code">
		<a-button class="verify-code-get diamonds-blue" :disabled="!!timer" @click="getCode">{{
			verifyCode.text
		}}</a-button>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { codeApi } from '@/api/login'
import { message } from 'ant-design-vue'
export default defineComponent({
	components: {},
	data() {
		return {
			//验证码
			verifyCode: {
				text: '获取验证码',
				//验证码
				code: undefined
			},
			//定时器
			timer: null,
			phone: null
		}
	},
	methods: {
		//获取验证码
		async getCode() {
			if (!this.phone) return message.warning('请输入手机号')
			try {
				const { status, msg } = <any>await codeApi({
					params: {
						phone: this.$attrs.phone,
						codeType: this.$attrs.type
					}
				})
				if (status === 200) {
					message.success(msg || '验证码发送成功')
				}
			} catch (error) {}

			//是否开启定时器
			if (!this.timer) {
				//倒计时
				let time = 60

				this.timer = setInterval(() => {
					time--
					//1分钟结束
					if (time <= 0) {
						this.verifyCode.text = '获取验证码'
						clearInterval(this.timer as any)
						this.timer = null
						return
					}
					this.verifyCode.text = `剩余${time}秒`
				}, 1000) as any
			}
		}
	},
	watch: {
		'$attrs.phone'(phone) {
			this.phone = phone
		}
	},
	beforeDestroy() {
		if (this.timer) {
			clearInterval(this.timer as any)
			this.timer = null
		}
	}
})
</script>
<style lang="less" scoped>
.verify-code {
	margin-left: 15px;
	.verify-code-get {
		border: none;
		box-shadow: none;
	}
}
</style>