<template>
	<div id="echarts_half_pie"></div>
</template>

<script>
export default {
	data() {
		return {
			chart: {}
		}
	},
	methods: {
		initHalfPieEcharts() {
			// 基于准备好的dom，初始化echarts实例
			let HalfPieChart = window.echarts.init(document.getElementById('echarts_half_pie'))
			let labelSet = {
				alignTo: 'labelLine',
				formatter: ({ name, value, percent }) => {
					return `{name|${name}}\n{percent|${this.$attrs.isAllEmpty ? 0 : value}(${
						this.$attrs.isAllEmpty ? 0 : percent
					}%) }`
				},
				minMargin: 5,
				edgeDistance: 10,
				lineHeight: 15
			}

			// 绘制图表
			HalfPieChart.setOption({
				title: {
					text: '微信状态',
					left: 20,
					top: 15,
					textStyle: {
						fontSize: 16
					}
				},
				legend: {
					bottom: 10,
					left: 140
				},
				color: ['#00AD8F', 'rgba(0,0,0,0.1)'],
				series: [
					{
						name: '微信状态',
						type: 'pie',
						width: 400,
						height: 250,
						top: 20,
						startAngle: 180,
						radius: ['35%', '55%'],

						labelLine: {
							length: 20,
							length2: 0,
							maxSurfaceAngle: 80
						},
						labelLayout: function (params) {
							let isLeft = params.labelRect.x < HalfPieChart.getWidth() / 2
							let points = params.labelLinePoints
							if (params.labelRect.x)
								points[2][0] = isLeft
									? params.labelRect.x
									: params.labelRect.x + params.labelRect.width

							return {
								labelLinePoints: points
							}
						},

						data: [
							{
								value: this.$attrs.data[0],
								name: '在线',
								label: {
									...labelSet,
									rich: {
										name: {
											fontSize: 10,
											color: '#00AD8F'
										},
										percent: {
											fontSize: 10,
											color: '#00AD8F'
										}
									}
								}
							},
							{
								value: this.$attrs.data[1],
								name: '离线',
								label: {
									...labelSet,
									rich: {
										name: {
											fontSize: 10,
											color: 'rgba(0,0,0,0.1)'
										},
										percent: {
											fontSize: 10,
											color: 'rgba(0,0,0,0.1)'
										}
									}
								}
							},
							{
								value: this.$attrs.data[0] + this.$attrs.data[1],
								itemStyle: {
									color: '#fff'
								}
							}
						]
					}
				]
			})

			return HalfPieChart
		}
	},
	watch: {
		'$attrs.data'() {
			this.chart = this.initHalfPieEcharts()
		}
	},
	created() {},
	mounted() {}
}
</script>

<style lang="less" scoped>
#echarts_half_pie {
	width: 390px;
	height: 200px;
	background-color: #fff;
	border-radius: 6px;
	margin-bottom: 10px;
}
</style>