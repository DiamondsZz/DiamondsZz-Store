<template>
	<div class="emoji-items">
		<div class="emoji-item" v-for="(item, i) in 104" :key="i" @click="select(item, i)">
			<img
				:src="`https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${i + 1}.gif`"
				alt=""
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	components: {},
	setup(props, { emit }) {
		const select = (item: any, i: any) => {
			emit(
				'getEmoji',
				`https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${i + 1}.gif`
			)
		}
		return { select }
	}
})
</script>
<style lang="less" scoped>
.emoji-items {
	width: 240px;
	display: flex;
	flex-wrap: wrap;
	background-color: #fff;
	border-radius: 10px;
	.emoji-item {
		cursor: pointer;
		&:hover {
			background-color: rgba(0, 0, 0, 0.08);
		}
	}
}
</style>