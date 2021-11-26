<template>
	<div id="echarts_line"></div>
</template>

<script >
import { defineComponent } from 'vue'
import * as Echarts from 'echarts'
import { numberHandler_U } from '@/utils'
export default defineComponent({
	props: ['lineData'],
	components: {},
	data() {
		return {
			lineChart: {}
		}
	},
	methods: {
		initLineEcharts() {
			// 基于准备好的dom，初始化echarts实例
			let LineChart = Echarts.init(document.getElementById('echarts_line'))
			// 绘制图表
			LineChart.setOption({
				grid: {
					left: '10%',
					top: '12%'
				},
				legend: {
					left: '-1%',
					icon: 'square',
					itemStyle: { color: '#2E5BFF' },
					itemWidth: 8,
					itemHeight: 8,
					data: ['我的策略']
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
				xAxis: {
					axisPointer: {
						//移动端手柄
						handle: {
							show: true,
							color: '#7581BD',
							size: 20,
							margin: 35
						}
					}, //刻度
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#8C9FAD',
						fontSize: 10
					},
					axisLine: {
						lineStyle: { color: '#8C9FAD', opacity: 0.2 }
					},
					data: this.lineData.x
				},
				yAxis: {
					axisLabel: {
						color: '#8C9FAD',
						fontSize: 10,
						formatter: (value) => numberHandler_U(value)
					},
					//y轴间隔
					splitNumber: 6
				},
				dataZoom: [
					{
						type: 'inside'
					}
				],
				series: [
					{
						name: '我的策略',
						type: 'line',
						smooth: 0.6,
						symbolSize: 8,
						symbol: this.lineData.extra.current === 1 ? 'circle' : 'none',
						data: this.lineData.y,
						itemStyle: {
							color: '#2E5BFF',
							borderColor: '#2E5BFF'
						},
						lineStyle: {
							color: '#2E5BFF'
						}
					}
				]
			})

			return LineChart
		}, //图表重置
		chartResize() {
			this.lineChart.resize()
		}
	},
	created() {
		window.addEventListener('resize', this.chartResize)
	},
	mounted() {
		this.lineChart = this.initLineEcharts()
		this.$watch('lineData', () => {
			this.lineChart.dispose()
			this.lineChart = this.initLineEcharts()
		})
	},
	unmounted() {
		window.removeEventListener('resize', this.chartResize)
	}
})
</script>
<style lang="less" scoped>
@screen: 3.75;
#echarts_line {
	width: 350vw / @screen;
	height: 300vw / @screen;
}
</style>