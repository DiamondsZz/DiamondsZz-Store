<template>
	<a-tooltip :title="$attrs.set.title" :color="$attrs.set.color">
		<template #title><slot name="title"></slot></template>
		<QuestionCircleFilled class="icon" :style="{ color: '#1890FF' }" />
	</a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { QuestionCircleFilled } from '@ant-design/icons-vue'
export default defineComponent({
	components: { QuestionCircleFilled },
	methods: {}
})
</script>
<style lang="less" scoped>
.icon {
	margin-left: 6px;
}
</style>
