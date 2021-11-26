
<template>
	<div class="date">
		<div class="date-body">
			<div class="date-body-item" @click="selectDate('start')">
				<div class="date-body-item-time">
					{{ datePicker.startTime && Day(datePicker.startTime).format('YYYY-MM-DD') }}
				</div>
				<van-icon
					name="close"
					v-if="datePicker.startTime"
					@click.stop="clearDate('start')"
				/>
				<CaretDownFilled v-else />
			</div>
			<div class="date-body-item" @click="selectDate('end')">
				<div class="date-body-item-time">
					{{ datePicker.endTime && Day(datePicker.endTime).format('YYYY-MM-DD') }}
				</div>
				<van-icon name="close" v-if="datePicker.endTime" @click.stop="clearDate('end')" />
				<CaretDownFilled v-else />
			</div>
			<div class="date-body-btn">
				<van-button
					type="default"
					:disabled="!datePicker.endTime || !datePicker.startTime"
					@click="dateQuery"
					>确定</van-button
				>
			</div>
		</div>

		<van-action-sheet
			v-model:show="datePicker.datePickerVisible"
			title="选择日期"
			@cancel="datePickerCancel"
		>
			<van-datetime-picker
				v-model="datePicker.currentDate"
				type="date"
				:min-date="datePicker.minDate"
				:max-date="datePicker.maxDate"
				@confirm="dateConfirm"
				@cancel="dateCancel"
			/>
		</van-action-sheet>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Day from 'dayjs'
import { CaretDownFilled } from '@ant-design/icons-vue'
export default defineComponent({
	components: { CaretDownFilled },
	data() {
		return {
			datePicker: {
				startOrEnd: 'start',
				datePickerVisible: false,
				currentDate: undefined,
				minDate: new Date(Day().subtract(7, 'year').format()),
				maxDate: new Date(Day().format()),
				diff: undefined,
				startTime: '',
				endTime: ''
			}
		}
	},

	methods: {
		Day,
		selectDate(type: string) {
			this.datePicker.startOrEnd = type
			this.datePicker.datePickerVisible = !this.datePicker.datePickerVisible
		},
		datePickerCancel() {
			this.datePicker.datePickerVisible = false
		},
		dateCancel() {
			this.datePicker.datePickerVisible = false
		},
		dateConfirm() {
			this.datePicker.datePickerVisible = false
			if (this.datePicker.startOrEnd === 'start')
				this.datePicker.startTime = this.datePicker.currentDate as any
			if (this.datePicker.startOrEnd === 'end')
				this.datePicker.endTime = this.datePicker.currentDate as any

			const diff = Day(this.datePicker.endTime).diff(Day(this.datePicker.startTime), 'day')
			if (this.datePicker.startTime && this.datePicker.endTime) {
				if (diff === 0) this.$emit('getDateNum', 1)
				this.$emit('getDateNum', diff)
			} else this.$emit('getDateNum', 0)
		},
		//清空日期
		clearDate(type: string) {
			if (type === 'start') this.datePicker.startTime = undefined as any
			if (type === 'end') this.datePicker.endTime = undefined as any
			this.$emit('getDateNum', 0)
		},
		//日期查询
		dateQuery() {
			//计算日期差值
			this.datePicker.diff = Day(this.datePicker.endTime).diff(
				Day(this.datePicker.startTime),
				'day'
			) as any
			if ((this.datePicker.diff as any) < 0) return (<any>this).$toast('日期不合法')
			this.$emit('getDate', {
				startTime: this.datePicker.startTime,
				endTime: this.datePicker.endTime
			})
		}
	}
})
</script>

<style lang="less" scoped>
@screen: 3.75;
.date {
	margin-bottom: 15vw / @screen;
	:deep(.date-body) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.date-body-item {
			display: flex;
			align-items: center;
			padding: 0 10vw / @screen;
			width: 110vw / @screen;
			height: 30vw / @screen;
			border: 1px solid #e2e2e2;
			font-size: 12vw / @screen;
			border-radius: 6vw / @screen;
			.date-body-item-time {
				flex-grow: 1;
				font-weight: 600;
			}
			.anticon {
				color: #8a9eac;
				font-size: 14vw / @screen;
			}
			&:nth-child(1) {
				position: relative;
				&::after {
					position: absolute;
					right: -12vw / @screen;
					content: '/';
					color: #8a9eac;
				}
			}
		}
		.date-body-btn {
			.van-button {
				width: 72vw / @screen;
				height: 30vw / @screen;
				font-size: 12vw / @screen;
				border-radius: 6vw / @screen;
				color: #999;
			}
		}
	}
}
</style>