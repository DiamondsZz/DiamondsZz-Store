<template>
	<div class="form">
		<a-form
			:ref="$attrs.set.ref"
			:model="$attrs.set.model"
			:rules="$attrs.set.rules"
			:labelCol="$attrs.set.labelCol"
			:wrapperCol="$attrs.set.wrapperCol"
		>
			<div v-for="(item, i) in $attrs.set.items" :key="i">
				<a-form-item v-if="!item.isHidden" :name="item.name">
					<a-input
						v-if="item.type === 1"
						v-model:value="$attrs.set.model[item.name]"
					></a-input>

					<a-select
						:mode="item.mode"
						v-if="item.type === 2"
						v-model:value="$attrs.set.model[item.name]"
						allowClear
						@change="selectChange($event, item, $attrs.set.model[item.name])"
					>
						<a-select-option
							v-for="(select, selectKey) in item.options"
							:key="selectKey"
							:value="select.key"
							>{{ select.value }}</a-select-option
						>
					</a-select>
					<a-checkbox
						v-if="item.type === 3"
						v-model:checked="$attrs.set.model[item.name]"
					></a-checkbox>

					<a-input-number
						style="width: 100%"
						v-if="item.type === 4"
						v-model:value="$attrs.set.model[item.name]"
					></a-input-number>

					<a-textarea
						v-if="item.type === 5"
						v-model:value="$attrs.set.model[item.name]"
						:autoSize="{ minRows: 4, maxRows: 4 }"
					></a-textarea>
					<template #label>
						{{ item.label }}
						<Tip v-if="item.isTip" class="tip" :set="{ title: item.isTip }" />
					</template>
				</a-form-item>
			</div>
		</a-form>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tip from '@/components/Tip.vue'
export default defineComponent({
	name: 'Form',
	components: { Tip },
	methods: {
		selectChange(params: any, item: any, value: any) {
			this.$emit('selectChange', item, value)
		}
	},
	watch: {
		'$attrs.isValidate'() {
			;(this.$refs[(this as any).$attrs.set.ref] as any)
				.validate()
				.then(() => {
					this.$emit('validateSuccess')
				})
				.catch((error: any) => {
					console.log(error)
				})
		},
		'$attrs.isReset'() {
			;(this.$refs[(this as any).$attrs.set.ref] as any).resetFields()
		},
		'$attrs.isClearValidate'() {
			;(this.$refs[(this as any).$attrs.set.ref] as any).clearValidate()
		}
	}
})
</script>
<style lang="less" scoped>
.form {
	:deep(.ant-form) {
		.ant-form-item-label {
			label {
				.tip {
					margin-top: 12px;
					margin-left: 0;
				}
			}
		}
	}
}
</style>
