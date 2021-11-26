<template>
	<a-modal
		:width="$attrs.set.width"
		:title="$attrs.set.title"
		:getContainer="() => mountComponent()"
		:okText="$attrs.set.okText"
		v-model:visible="$attrs.set.visible"
		@ok="confirm"
		:footer="$attrs.set.footer"
	>
		<template #title> <slot name="title"> </slot> </template>
		<template #footer> <slot name="footer"> </slot> </template>
		<slot name="content"> </slot>
	</a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Modal',
	components: {},
	methods: {
		confirm() {
			this.$emit('confirm')
		},
		mountComponent() {
			return document.querySelector((this as any).$attrs.set.mountDom || 'body')
		}
	},
	created() {}
})
</script>
<style lang="less" scoped>
.modal {
}
</style>
