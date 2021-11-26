<template>
	<div id="echarts_bar"></div>
</template>

<script >
import { defineComponent } from 'vue'

export default defineComponent({
	components: {},
	data() {
		return {}
	},
	methods: {
		initBarEcharts() {
			// 基于准备好的dom，初始化echarts实例
			let barChart = window.echarts.init(document.getElementById('echarts_bar'))
			// 绘制图表
			barChart.setOption({
				legend: {},
				tooltip: {},
				dataset: {
					source: [
						['5-1', '全部订单', '比价订单'],
						['5-2', 43.3, 85.8],
						['5-3', 83.1, 73.4],
						['5-4', 86.4, 65.2],
						['5-5', 72.4, 53.9]
					]
				},
				xAxis: {
					type: 'category'
				},
				yAxis: {},
				series: [
					{
						type: 'bar',
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#35C3FF' },
								{ offset: 1, color: '#1890FF' }
							])
						}
					},
					{
						type: 'bar',
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#8A35FF' },
								{ offset: 1, color: '#1821FF' }
							])
						}
					}
				]
			})
		}
	},
	created() {},
	mounted() {
		this.initBarEcharts()
	},
	unmounted() {}
})
</script>
<style lang="less" scoped>
#echarts_bar {
	height: 400px;
}
</style>