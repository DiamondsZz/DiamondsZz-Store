import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { useEffect } from 'react'
const Water = () => {
	useEffect(() => {
		initWater()
	}, [])
	function initWater() {
		let water = echarts.init(document.querySelector('#water') as HTMLElement)
		water.setOption({
			series: [
				{
					type: 'liquidFill',
					data: [0.65],
					radius: '225px',
					label: {
						formatter: function () {
							return '{a|当前总资金池} \n{b|3,204,234,310}'
						},
						fontSize: 24,
						color: '#fff',
						rich: {
							a: {
								padding: [0, 0, 80, 0],
								color: '#000',
								fontSize: 16
							},
							b: { padding: [0, 0, 20, 0] }
						}
					},
					backgroundStyle: {
						color: 'transparent'
					},
					outline: {
						itemStyle: {
							borderWidth: 12,
							borderColor: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: '#86C9F7' // 0% 处的颜色
									},
									{
										offset: 0.6,
										color: '#4E98ED' // 100% 处的颜色
									}
								]
							},
							shadowColor: 'transparent'
						}
					},
					itemStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: '#86C9F7' // 0% 处的颜色
								},
								{
									offset: 0.4,
									color: '#4E98ED' // 100% 处的颜色
								}
							]
						},
						shadowColor: 'transparent'
					}
				}
			]
		})
	}
	return <div id="water" style={{ width: 300, height: 250 }}></div>
}
export default Water
