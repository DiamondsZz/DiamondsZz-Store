<template>
	<div>
		<div v-if="isEdit" class="diamonds-flex diamonds-align-items-center">
			<a-input style="max-width: 80%" v-model:value="changeValue"></a-input>
			<div class="diamonds-flex diamonds-flex-direction-column" style="margin-left: 6px">
				<div class="diamonds-cursor-pointer">
					<CloseOutlined :style="{ fontSize: '10px' }" @click="isEdit = false" />
				</div>
				<div class="diamonds-cursor-pointer">
					<CheckOutlined :style="{ fontSize: '10px' }" @click="confirm" />
				</div>
			</div>
		</div>

		<div v-else class="diamonds-flex diamonds-align-items-center">
			<span class="diamonds-ellipsis" style="max-width: 80%">{{ initValue }}</span>
			<EditOutlined
				:style="{ fontSize: '10px', marginLeft: '6px' }"
				v-if="!isEdit"
				@click="isEdit = true"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import {
	QuestionCircleFilled,
	EditOutlined,
	CloseOutlined,
	CheckOutlined
} from '@ant-design/icons-vue'
export default defineComponent({
	props: ['initValue'],
	components: { QuestionCircleFilled, EditOutlined, CloseOutlined, CheckOutlined },
	setup(props: any) {
		const isEdit = ref(false)

		const changeValue = ref()

		const { initValue } = toRefs(props)

		return {
			initValue,
			changeValue,
			isEdit
		}
	},
	methods: {
		//确认提交
		confirm() {
			this.isEdit = false
			this.$emit('save', this.changeValue)
		}
	},

	created() {}
})
</script>
<style lang="less" scoped>
.icon {
	margin-left: 6px;
}
</style>
