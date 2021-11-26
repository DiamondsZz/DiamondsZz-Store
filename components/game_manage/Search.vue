<template>
	<div class="search">
		<div class="items">
			<div class="item" v-for="(item, itemIndex) in $attrs.options" :key="itemIndex">
				<span class="item-name">{{ item.name }}</span
				>：
				<a-input
					class="item-action item-action-inp"
					v-if="item.type === 1"
					v-model:value="item.value"
					:placeholder="item.placeholder"
				></a-input>

				<a-select
					class="item-action item-action-select"
					v-if="item.type === 2"
					v-model:value="item.value"
					allowClear
					:placeholder="item.placeholder"
				>
					<a-select-option
						v-for="(selectItem, selectItemIndex) in item.options"
						:key="selectItemIndex"
						:value="selectItem.key"
					>
						{{ selectItem.value }}
					</a-select-option>
				</a-select>
				<a-range-picker
					v-model:value="item.value"
					class="item-action item-action-range"
					v-if="item.type === 3"
					show-time
					format="YYYY-MM-DD HH:mm"
					:placeholder="item.placeholder"
				/>
				<a-input-group
					class="item-action item-action-input-group"
					v-if="item.type === 4"
					compact
				>
					<a-select
						style="width: 40%"
						v-model:value="item.selectValue"
						:placeholder="item.selectPlaceholder"
						allowClear
					>
						<a-select-option
							v-for="(selectItem, selectItemIndex) in item.options"
							:key="selectItemIndex"
							:value="selectItem.key"
						>
							{{ selectItem.value }}
						</a-select-option>
					</a-select>
					<a-input
						style="width: 60%"
						v-model:value="item.inpValue"
						:placeholder="item.inpPlaceholder"
					/>
				</a-input-group>

				<a-input-group compact v-if="item.type === 5">
					<a-input-number
						v-model:value="item.startValue"
						style="width: 100px; text-align: center"
						:placeholder="item.startPlaceholder"
					/>
					<a-input
						style="width: 30px; border-left: 0; pointer-events: none"
						placeholder="~"
					/>
					<a-input-number
						v-model:value="item.endValue"
						style="width: 100px; text-align: center; border-left: 0"
						:placeholder="item.endPlaceholder"
					/>
				</a-input-group>

				<a-input-group
					class="item-action item-action-input-group item-action-input-group-time"
					v-if="item.type === 6"
					compact
				>
					<a-select
						style="width: 30%"
						v-model:value="item.selectValue"
						:placeholder="item.selectPlaceholder"
						allowClear
					>
						<a-select-option
							v-for="(selectItem, selectItemIndex) in item.options"
							:key="selectItemIndex"
							:value="selectItem.key"
						>
							{{ selectItem.value }}
						</a-select-option>
					</a-select>
					<a-range-picker
						style="width: 70%"
						showTime
						v-model:value="item.timeValue"
						:placeholder="item.timePlaceholder"
					/>
				</a-input-group>
			</div>
			<div class="item-btns">
				<a-button type="primary" @click="search">查询</a-button>
				<a-button class="item-btn-reset" @click="reset">重置</a-button>
			</div>
		</div>

		<slot name="extra"></slot>
	</div>
</template>

<script >
/**
 * 1: input
 * 2: select
 * 3: range-picker
 */
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Search',
	components: {},
	methods: {
		//转换数值

		//搜索
		search() {
			//搜索参数
			let params = {}
			let value
			for (const item of this.$attrs.options) {
				switch (item.type) {
					case 3:
						value = [
							this.$Day(item.value[0]).format('YYYY-MM-DD HH:mm'),
							this.$Day(item.value[1]).format('YYYY-MM-DD HH:mm')
						]
						break
					case 6:
						value = [
							this.$Day(item.timeValue[0]).format('YYYY-MM-DD HH:mm'),
							this.$Day(item.timeValue[1]).format('YYYY-MM-DD HH:mm')
						]
						break
					default:
						value = item.value
				}
				params = {
					...params,
					...{ [item.field]: value }
				}
			}
			this.$attrs.onSearch(params)
		},
		//重置
		reset() {
			//数据重置
			for (let item of this.$attrs.options) {
				//日期选择框
				if (item.type === 3) {
					item.value = []
				}
				//输入组合
				else if (item.type === 4) {
					item.selectValue = undefined
					item.inpValue = undefined
				} else if (item.type === 5) {
					item.startValue = undefined
					item.endValue = undefined
				} else if (item.type === 6) {
					item.selectValue = undefined
					item.timeValue = []
				} else {
					item.value = undefined
				}
			}
			this.$attrs.onReset()
		}
	}
})
</script>
<style lang="less" scoped>
.search {
	margin-bottom: 15px;
	padding: 24px 24px 0;
	border-radius: 10px;
	background-color: #fff;
	overflow: hidden;
}
.items {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	.item {
		display: flex;
		align-items: center;
		margin-right: 45px;
		margin-bottom: 24px;
		.item-name {
			flex-shrink: 0;
		}
		.item-action {
		}

		.item-action-select {
			width: 200px;
		}
		.item-action-inp {
			width: 200px;
		}
		.item-action-input-group {
			width: 350px;
		}
		.item-action-input-group-time {
			width: 480px;
		}
	}
	.item-btns {
		margin-bottom: 24px;
		:deep(.ant-btn) {
			width: 70px;
			margin-right: 20px;
		}
		.item-btn-reset {
			background-color: #e9e9e9;
			color: #fff;
			border: none;
		}
	}
}
</style>