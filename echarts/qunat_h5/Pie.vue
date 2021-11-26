<template>
	<div id="echarts_pie"></div>
</template>

<script >
import { defineComponent } from 'vue'
import * as Echarts from 'echarts'
import { numberHandler_U } from '@/utils'
export default defineComponent({
	props: ['pieData'],
	components: {},
	data() {
		return {
			pieChart: {}
		}
	},
	methods: {
		initPieEcharts() {
			// 基于准备好的dom，初始化echarts实例
			let PieChart = Echarts.init(document.getElementById('echarts_pie'))
			// 绘制图表
			PieChart.setOption({
				tooltip: {
					trigger: 'item'
				},
				series: [
					{
						name: '资产',
						type: 'pie',
						radius: ['40%', '70%'],
						left: 10,
						top: -30,
						label: {
							show: false
						},
						data: this.pieData
					}
				]
			})

			return PieChart
		}, //图表重置
		chartResize() {
			this.pieChart.resize()
		}
	},
	created() {
		window.addEventListener('resize', this.chartResize)
	},
	mounted() {
		this.pieChart = this.initPieEcharts()
		this.$watch('pieData', () => {
			this.pieChart.clear()
			this.pieChart = this.initPieEcharts()
		})
	},
	unmounted() {
		window.removeEventListener('resize', this.chartResize)
	}
})
</script>
<style lang="less" scoped>
@screen: 3.75;
#echarts_pie {
	width: 330vw / @screen;
	height: 240vw / @screen;
}
</style>