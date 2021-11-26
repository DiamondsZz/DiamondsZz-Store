<template>
	<div id="echarts_pie"></div>
</template>

<script>
export default {
	methods: {
		initPieEcharts() {
			// 基于准备好的dom，初始化echarts实例
			let PieChart = window.echarts.init(document.getElementById('echarts_pie'))

			let labelSet = {
				alignTo: 'labelLine',
				formatter: ({ name, value, percent }) => {
					return `{name|${name}}\n{percent|${value}(${percent}%) }`
				},
				minMargin: 5,
				edgeDistance: 10,
				lineHeight: 15
			}

			// 绘制图表
			PieChart.setOption({
				title: {
					text: '渠道微信',
					left: 20,
					top: 15,
					textStyle: {
						fontSize: 16
					}
				},
				legend: {
					bottom: 20,
					left: 80
				},
				color: ['#D14A63', '#52C3F1', '#00AD8F', '#FCC441'],
				series: [
					{
						name: '渠道微信',
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
							let isLeft = params.labelRect.x < PieChart.getWidth() / 2
							let points = params.labelLinePoints
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
								name: '在看',
								label: {
									...labelSet,
									rich: {
										name: {
											fontSize: 10,
											color: '#D14A63'
										},
										percent: {
											fontSize: 10,
											color: '#D14A63'
										}
									}
								}
							},
							{
								value: this.$attrs.data[1],
								name: '关注',
								label: {
									...labelSet,
									rich: {
										name: {
											fontSize: 10,
											color: '#52C3F1'
										},
										percent: {
											fontSize: 10,
											color: '#52C3F1'
										}
									}
								}
							},
							{
								value: this.$attrs.data[2],
								name: '点赞',
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
								value: this.$attrs.data[3],
								name: '阅读',
								label: {
									...labelSet,
									rich: {
										name: {
											fontSize: 10,
											color: '#FCC441'
										},
										percent: {
											fontSize: 10,
											color: '#FCC441'
										}
									}
								}
							}
						]
					}
				]
			})
		}
	},
	watch: {
		'$attrs.data'() {
			this.initPieEcharts()
		}
	},
	created() {},
	mounted() {}
}
</script>

<style lang="less" scoped>
#echarts_pie {
	width: 390px;
	height: 300px;
	background-color: #fff;
	border-radius: 6px;
}
</style>