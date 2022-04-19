<template>
	<div>
		<div class="text">
			<div class="text-head">
				<el-tooltip effect="light">
					<template #content>
						<Emoji @getEmoji="addEmoji" />
					</template>
					<SmileOutlined />
				</el-tooltip>

				<el-tag @click="addTextTag(item)" v-for="(item, i) in fields" :key="i">
					{{ item }}
				</el-tag>
			</div>
			<div class="text-body" id="editor" contenteditable></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, nextTick, watch } from 'vue'
import { Plus, CircleCloseFilled, Loading } from '@element-plus/icons-vue'
import { SmileOutlined } from '@ant-design/icons-vue'
import Emoji from './emoji.vue'
import Material from '@/components/material.vue'
export default defineComponent({
	props: {
		fields: {
			type: Array,
			default: []
		}
	},
	components: { Loading, Emoji, CircleCloseFilled, SmileOutlined, Plus, Material },
	setup(props: any, { emit }) {
		const { fields } = props

		// 表情
		const emotions = [
			'微笑',
			'撇嘴',
			'色',
			'发呆',
			'得意',
			'流泪',
			'害羞',
			'闭嘴',
			'睡',
			'大哭',
			'尴尬',
			'发怒',
			'调皮',
			'呲牙',
			'惊讶',
			'难过',
			'酷',
			'冷汗',
			'抓狂',
			'吐',
			'偷笑',
			'可爱',
			'白眼',
			'傲慢',
			'饥饿',
			'困',
			'惊恐',
			'流汗',
			'憨笑',
			'大兵',
			'奋斗',
			'咒骂',
			'疑问',
			'嘘',
			'晕',
			'折磨',
			'衰',
			'骷髅',
			'敲打',
			'再见',
			'擦汗',
			'抠鼻',
			'鼓掌',
			'糗大了',
			'坏笑',
			'左哼哼',
			'右哼哼',
			'哈欠',
			'鄙视',
			'委屈',
			'快哭了',
			'阴险',
			'亲亲',
			'吓',
			'可怜',
			'菜刀',
			'西瓜',
			'啤酒',
			'篮球',
			'乒乓',
			'咖啡',
			'饭',
			'猪头',
			'玫瑰',
			'凋谢',
			'示爱',
			'爱心',
			'心碎',
			'蛋糕',
			'闪电',
			'炸弹',
			'刀',
			'足球',
			'瓢虫',
			'便便',
			'月亮',
			'太阳',
			'礼物',
			'拥抱',
			'强',
			'弱',
			'握手',
			'胜利',
			'抱拳',
			'勾引',
			'拳头',
			'差劲',
			'爱你',
			'NO',
			'OK',
			'爱情',
			'飞吻',
			'跳跳',
			'发抖',
			'怄火',
			'转圈',
			'磕头',
			'回头',
			'跳绳',
			'挥手',
			'激动',
			'街舞',
			'献吻',
			'左太极',
			'右太极'
		]

		//文本初始化
		const textInit = (value: any) => {
			const editor = document.querySelector('#editor') as any
			let html = ''
			fields.forEach((item: any) => (html = tagCreate(`[${item}]`, value)))
			html = emojiCreate(html)
			editor.innerHTML = html
		}
		const tagCreate = (target: any, word: any) => {
			while (word.includes(target)) {
				word = word.replace(
					target,
					`<div class="text-tag" contenteditable="false">${target.slice(
						1,
						target.length - 1
					)}<span onclick="const editor = document.querySelector('#editor');editor.removeChild(this.parentNode);">×</span></div>`
				)
			}
			return word
		}
		const emojiCreate = (word: any) => {
			for (let emojiIndex in emotions) {
				while (word.includes(`[${emotions[emojiIndex]}]`)) {
					word = word.replace(
						`[${emotions[emojiIndex]}]`,
						`<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${emojiIndex}.gif">`
					)
				}
			}
			return word
		}
		//编辑器html文本格式化
		const htmlFormat = () => {
			const editor = document.querySelector('#editor') as any

			let word = editor.innerHTML
			//图片处理
			word = imgRegExpReplace(word)
			//tag
			fields.forEach((item: any) => {
				word = tagReplace(
					word,
					`<div class="text-tag" contenteditable="false">${item}<span>×</span></div>`,
					`[${item}]`
				)
				word = tagReplace(
					word,
					`<div class="text-tag" contenteditable="false">${item}<span onclick="const editor = document.querySelector('#editor');editor.removeChild(this.parentNode);">×</span></div>`,
					`[${item}]`
				)
			})

			return word
		}
		const tagReplace = (word: any, target: any, text: any) => {
			while (word.includes(target)) {
				word = word.replace(target, text)
			}
			return word
		}
		const imgRegExpReplace = (wordTarget: any) => {
			//.查找单个字符
			const imgRegExp = /<img src=.{60,70}\.gif">/
			const match = imgRegExp.exec(wordTarget)

			if (match) {
				const target = match[0]

				if (target) {
					const index = target
						.replace(
							'<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/',
							''
						)
						.replace('.gif">', '') as any

					if (emotions[index]) {
						wordTarget = wordTarget.replace(target, `[${emotions[index]}]`)
						wordTarget = imgRegExpReplace(wordTarget)
					}
				}
			}

			return wordTarget
		}
		const addTextTag = (tagName: any) => {
			const editor = document.querySelector('#editor') as any
			//获取选择对象
			const selection = window.getSelection() as any
			if (selection.type === 'Caret') {
				//获取选区
				const range = selection.getRangeAt(0)
				//创建tag
				const tag = document.createElement('div')
				const close = document.createElement('span')

				if (
					selection.focusNode.id === 'editor' ||
					selection.focusNode.parentNode.id === 'editor'
				) {
					close.innerText = '×'
					//绑定删除标签节点事件
					close.onclick = function () {
						const parentNode = (this as any).parentNode
						editor.removeChild(parentNode)
					}

					tag.className = 'text-tag'
					tag.innerText = tagName
					tag.appendChild(close)
					tag.setAttribute('contenteditable', 'false')
					range.insertNode(tag)
					//将当前的选区折叠到末尾
					selection.collapseToEnd()
				}
			}
		}
		const addEmoji = (emoji: any) => {
			//获取选择对象
			const selection = window.getSelection() as any
			if (selection.type === 'Caret') {
				//获取选区
				const range = selection.getRangeAt(0)
				//创建表情
				const img = document.createElement('img')
				if (
					selection.focusNode.id === 'editor' ||
					selection.focusNode.parentNode.id === 'editor'
				) {
					img.src = emoji
					range.insertNode(img)
					//将当前的选区折叠到末尾
					selection.collapseToEnd()
				}
			}
		}

		onMounted(() => {})
		return {
			addTextTag,
			addEmoji
		}
	}
})
</script>
<style lang="less" scoped>
.action {
	.el-button {
		margin: 0 10px 10px 0;
	}
}
:deep(.text) {
	border-radius: 9px;
	border: 1px solid #eaeaea;
	background-color: #fff;
	.text-head {
		background-color: #f8f8f8;
		padding: 8px 14px;
		border-radius: 9px 9px 0px 0px;
		.anticon {
			font-size: 16px;
		}
		.el-tag {
			margin-left: 6px;
			background: #ffffff;
			border-radius: 4px;
			border: 1px solid rgba(185, 185, 185, 0.3);
			color: #999999;
			font-size: 12px;
			cursor: pointer;
			user-select: none;
		}
	}
	.text-body {
		border-radius: 0px 0px 9px 9px;
		padding: 5px 8px;
		min-height: 100px;
		&:focus {
			outline: none;
		}
		img {
			vertical-align: bottom;
		}
		.text-tag {
			display: inline-block;
			height: 20px;
			line-height: 20px;
			text-align: center;
			background: #ffffff;
			border-radius: 4px;
			border: 1px solid rgba(185, 185, 185, 0.3);
			color: #999999;
			font-size: 12px;
			margin: 0 4px;
			padding: 0 5px;
			user-select: none;
			cursor: pointer;
		}
	}
}
</style>
