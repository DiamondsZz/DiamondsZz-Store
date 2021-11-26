<template>
	<div id="echarts_profit_bar"></div>
</template>

<script >
import { defineComponent } from 'vue'
import * as Echarts from 'echarts'
import { numberHandler_U } from '@/utils'
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
			let BarChart = Echarts.init(document.getElementById('echarts_profit_bar'))
			// 绘制图表
			BarChart.setOption({
				grid: {
					left: '10%',
					top: '5%'
				},
				tooltip: {
					borderColor: '#EFEFEF',
					borderWidth: 1,
					//tooltip默认以html形式渲染，
					//此外还可以设置为 'richText' 表示以富文本的形式渲染，
					//渲染的结果在图表对应的 Canvas 中（目前 SVG 尚未支持富文本），
					//这对于一些没有 DOM 的环境（如微信小程序）有更好的支持。
					className: 'profit-bar-tooltip',
					formatter: (params) => {
						const x = Array.isArray(params) ? params[0].name : params.name
						return ` <div class="profit-bar-tooltip-head">${x}</div>
						<div class="profit-bar-tooltip-item">
						<div class="profit-bar-tooltip-item-til">当日收益：</div>0
						</div>
						<div class="profit-bar-tooltip-item">
						<div class="profit-bar-tooltip-item-til">当日收益率：</div>0
						</div>
					`
					},
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
						type: 'bar',
						itemStyle: {
							color: '#00AD8F'
						},
						data: this.barData.y.map((item) =>
							item < 0
								? {
										value: item,
										itemStyle: {
											color: '#D14A63'
										}
								  }
								: item
						)
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
						data: this.barData.y.map((item) =>
							item < 0
								? {
										value: item,
										itemStyle: {
											color: '#D14A63'
										}
								  }
								: item
						)
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
#echarts_profit_bar {
	width: 350vw / @screen;
	height: 300vw / @screen;
	:deep(.profit-bar-tooltip) {
		padding: 10vw / @screen 6vw / @screen;
		.profit-bar-tooltip-head {
			margin-bottom: 4vw / @screen;
		}
		.profit-bar-tooltip-item {
			display: flex;
			align-items: center;
			margin-bottom: 4vw / @screen;
			.profit-bar-tooltip-item-til {
				width: 100vw / @screen;
			}
		}
	}
}
</style>