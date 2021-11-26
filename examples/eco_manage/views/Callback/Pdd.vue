<template></template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setStorage_U } from '@/utils'
import { message } from 'ant-design-vue'
export default defineComponent({
	components: {},
	methods: {
		// 获取参数
		getParams() {
			const code = this.$route.query.code
			if (code) {
				setStorage_U('eco_p_p', JSON.stringify({ code }))
			} else {
				message.error('授权失败')
			}
			window.close()
		}
	},
	created() {
		this.getParams()
	}
})
</script>
<style lang="less" scoped>
</style>
