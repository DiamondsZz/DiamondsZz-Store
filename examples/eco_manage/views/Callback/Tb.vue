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
			if (this.$route.hash) {
				const appSessions = this.$route.hash.split('&')[0].split('=')[1]
				const id = this.$route.hash.split('&')[8].split('=')[1]
				const name = this.$route.hash.split('&')[9].split('=')[1]
				if (appSessions && id && name) {
					// 中文name需要decodeURIComponent解码
					setStorage_U(
						'eco_t_p',
						JSON.stringify({ appSessions, id, name: decodeURIComponent(name) })
					)
				} else {
					message.error('授权失败')
				}
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
