<template>
	<div id="echarts_line"></div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	components: {},
	data() {
		return {}
	},
	methods: {
		initLineEcharts() {
			// 基于准备好的dom，初始化echarts实例
			let LineChart = window.echarts.init(document.getElementById('echarts_line'))
			// 绘制图表
			LineChart.setOption({
				legend: {
					left: 100,
					icon: 'roundRect',
					data: ['已领取金额', '已领取笔数', '未领取金额', '未领取笔数']
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				// toolbox: {
				// 	right: 30,
				// 	feature: {
				// 		saveAsImage: {}
				// 	}
				// },
				xAxis: {
					type: 'category',
					data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				},
				yAxis: { type: 'value' },
				series: [
					{
						name: '已领取金额',
						type: 'line',
						smooth: 0.6,
						stack: '总量',
						symbol: 'none',
						data: [10, 632, 101, 134, 90, 5, 210],
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#F6BD16' }
							])
						}
						// areaStyle: {
						// 	opacity: 0.8
						// }
					},
					{
						name: '已领取笔数',
						type: 'line',
						smooth: 0.6,
						stack: '总量',
						symbol: 'none',
						data: [770, 52, 191, 234, 290, 630, 310],
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#5AD8A6' }
							])
						}
						// areaStyle: {
						// 	opacity: 0.8
						// }
					},
					{
						name: '未领取金额',
						type: 'line',
						stack: '总量',
						smooth: 0.6,
						symbol: 'none',
						data: [150, 232, 21, 154, 590, 330, 410],
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#E8684A' }
							])
						}
						// areaStyle: {
						// 	opacity: 0.8
						// }
					},
					{
						name: '未领取笔数',
						type: 'line',
						stack: '总量',
						smooth: 0.6,
						symbol: 'none',
						data: [320, 32, 601, 334, 90, 330, 990],
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#8A35FF' },
								{ offset: 1, color: '#1821FF' }
							])
						}
						// areaStyle: {
						// 	opacity: 0.8
						// }
					}
				]
			})
		}
	},
	created() {},
	mounted() {
		this.initLineEcharts()
	},
	unmounted() {}
})
</script>
<style lang="less" scoped>
#echarts_line {
	height: 400px;
}
</style>