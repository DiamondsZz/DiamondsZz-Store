<template>
	<div id="echarts_patch_bar"></div>
</template>

<script >
import { defineComponent } from 'vue'
import * as Echarts from 'echarts'
export default defineComponent({
	props: ['barData'],
	components: {},
	data() {
		return {
			barChart: {}
		}
	},
	methods: {
		initbarEcharts() {
			// 基于准备好的dom，初始化echarts实例
			let BarChart = Echarts.init(document.getElementById('echarts_patch_bar'))
			// 绘制图表
			BarChart.setOption({
				grid: {
					left: '8%',
					top: '20%'
				},
				legend: {
					left: '-1%',
					icon: 'square',
					itemWidth: 8,
					itemHeight: 8,
					data: ['盈利', '亏损', '次数']
				},
				tooltip: {
					textStyle: {
						color: '#666666',
						fontSize: 10
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
					},
					//文本
					axisLabel: {
						color: '#8C9FAD',
						fontSize: 10
					},
					//刻度
					axisTick: {
						show: false
					},
					//x轴轴线
					axisLine: {
						lineStyle: { opacity: 0 }
					},

					data: this.barData.x
				},
				yAxis: [
					{
						name: '次数（总计0）',
						nameTextStyle: {
							padding: [0, 0, 0, 32]
						},
						axisLabel: {
							color: '#8C9FAD',
							fontSize: 10
						},
						position: 'left',
						//y轴间隔
						splitNumber: 6
					},
					{
						name: '盈亏',
						nameTextStyle: {
							padding: [0, 0, 0, 40]
						},
						axisLabel: {
							color: '#8C9FAD',
							fontSize: 10,
							formatter: '{value} %'
						},
						position: 'right',
						offset: -7,
						//y轴间隔
						splitNumber: 6
					}
				],
				dataZoom: [
					{
						type: 'inside'
					}
				],
				series: [
					{
						name: '盈利',
						type: 'bar',
						yAxisIndex: 1,
						itemStyle: {
							color: '#00AD8F'
						},

						data: this.barData.y.plus
					},
					{
						name: '亏损',
						type: 'bar',
						itemStyle: {
							color: '#D14A63'
						},
						data: this.barData.y.minus
					},
					{
						name: '次数',
						type: 'bar',
						itemStyle: {
							color: '#2E5BFF'
						},
						data: this.barData.y.count
					}
				]
			})

			return BarChart
		}, //图表重置
		chartResize() {
			this.barChart.resize()
		}
	},
	created() {
		window.addEventListener('resize', this.chartResize)
	},
	mounted() {
		this.barChart = this.initbarEcharts()
		this.$watch('barData', () => {
			this.barChart.setOption({
				xAxis: {
					...this.barChart.getOption().xAxis,
					data: this.barData.x
				},
				series: [
					{
						...this.barChart.getOption().series[0],
						data: this.barData.y
					}
				]
			})
		})
	},
	unmounted() {
		window.removeEventListener('resize', this.chartResize)
	}
})
</script>
<style lang="less" scoped>
@screen: 3.75;
#echarts_patch_bar {
	width: 325vw / @screen;
	height: 300vw / @screen;
}
</style>