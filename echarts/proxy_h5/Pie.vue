<template>
	<div id="echarts_pie"></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Day from 'dayjs'
import * as Echarts from 'echarts'
import { EChartsType } from 'echarts'
export default defineComponent({
	props: ['pieData'],
	components: {},
	setup() {},
	data() {
		return {
			pieChart: {}
		}
	},
	methods: {
		Day,
		//初始化echarts
		initEcharts() {
			// 基于准备好的dom，初始化echarts实例
			this.pieChart = Echarts.init(document.getElementById('echarts_pie') as HTMLElement)
			// 绘制图表
			;(this.pieChart as EChartsType).setOption({
				legend: { top: '0%' },
				series: [
					{
						type: 'pie',
						radius: ['40%', '70%'],
						color: ['#E95F45', '#D5251F', '#1FB6AC'],
						top: '20%',
						label: {
							show: false
						},
						data: [
							{ value: this.pieData.tb.num, name: '淘宝' },
							{ value: this.pieData.jd.num, name: '京东' },
							{ value: this.pieData.pdd.num, name: '拼多多' }
						]
					}
				]
			})
		},
		//图表重置
		chartResize() {
			;(this.pieChart as EChartsType).resize()
		}
	},
	mounted() {
		this.initEcharts()
	},
	unmounted() {
		window.removeEventListener('resize', this.chartResize)
	},
	created() {
		window.addEventListener('resize', this.chartResize)
		this.$watch('pieData', () => {
			;(this.pieChart as EChartsType).setOption({
				series: [
					{
						...((this.pieChart as EChartsType).getOption() as any).series[0],
						data: [
							{ value: this.pieData.tb.num, name: '淘宝' },
							{ value: this.pieData.jd.num, name: '京东' },
							{ value: this.pieData.pdd.num, name: '拼多多' }
						]
					}
				]
			})
		})
	}
})
</script>
<style lang="less" scoped>
@screen: 3.75;
#echarts_pie {
	width: 150vw / @screen;
	height: 150vw / @screen;
}
</style>