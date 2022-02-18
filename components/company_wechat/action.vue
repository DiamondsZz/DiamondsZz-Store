<template>
	<div>
		<div class="action">
			<el-button @click="modalOpen(item)" v-for="(item, i) in types" :key="i"
				><el-icon class="el-icon--left"><Plus /></el-icon>{{ item }}</el-button
			>
		</div>
		<div class="modal">
			<el-dialog width="432px" v-model="dialog.visible" :show-close="false">
				<template v-slot:title>
					<div>添加{{ dialog.type }}</div>
					<div>
						<el-icon @click="modalClose"><CircleCloseFilled /></el-icon>
					</div>
				</template>

				<div class="modal-text">
					<div class="modal-text-head">
						<el-tooltip effect="light">
							<template #content>
								<Emoji @getEmoji="addEmoji" />
							</template>
							<SmileOutlined />
						</el-tooltip>

						<el-tag @click="addTextTag('随机表情')" contenteditable="false">
							随机表情
						</el-tag>
						<el-tag @click="addTextTag('称呼/昵称')">称呼/昵称</el-tag>
					</div>
					<div class="modal-text-body" id="editor" contenteditable></div>
				</div>

				<template v-slot:footer>
					<el-button @click="modalClose">取消</el-button>
					<el-button @click="modalConfirm">确定</el-button>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import { SmileOutlined } from '@ant-design/icons-vue'
import Emoji from './emoji.vue'
export default defineComponent({
	components: { Emoji, CircleCloseFilled, SmileOutlined, Plus },
	setup() {
		const types = ['文字', '图片', '视频', '文件', '链接', '小程序', '视频号', '素材库']
		const dialog = reactive({ type: '文字', visible: false })
		let editor = null as any
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
		const modalOpen = (type: any) => {
			dialog.visible = true
			dialog.type = type

			switch (type) {
				case '文字':
					break
			}
		}
		const modalClose = () => {
			dialog.visible = false
		}
		const modalConfirm = () => {
			const editor = document.querySelector('#editor') as any

			let word = editor.innerHTML
			//图片处理
			word = imgRegExpReplace(word)
			console.log('===>', word)
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
			//获取选择对象
			const selection = window.getSelection() as any
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
				tag.className = 'modal-text-tag'
				tag.innerText = tagName
				tag.appendChild(close)
				tag.setAttribute('contenteditable', 'false')
				range.insertNode(tag)
				//将当前的选区折叠到末尾
				selection.collapseToEnd()
			}
		}
		const removeTextTag = (item: any, i: any) => {}
		const addEmoji = (emoji: any) => {
			//获取选择对象
			const selection = window.getSelection() as any
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

		onMounted(() => {})
		return {
			types,
			dialog,
			modalOpen,
			modalClose,
			modalConfirm,
			addTextTag,
			removeTextTag,
			addEmoji
		}
	}
})
</script>
<style lang="less" scoped>
.action {
	.el-button {
	}
}
.modal {
	:deep(.el-dialog) {
		border-radius: 20px;
		background-color: transparent;
		.el-dialog__header {
			display: flex;
			justify-content: space-between;
			padding: 12px 18px;
			background: #3d7df9;
			border-radius: 20px 20px 0px 0px;
			color: #fff;
			.el-icon {
				font-size: 16px;
				cursor: pointer;
				color: #fff;
			}
		}
		.el-dialog__body {
			color: #333333;
			font-size: 12px;
			background-color: #fff;
			padding: 15px;
			.modal-text {
				border-radius: 9px;
				border: 1px solid #eaeaea;
				.modal-text-head {
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
				.modal-text-body {
					border-radius: 0px 0px 9px 9px;
					padding: 5px 8px;
					min-height: 100px;
					&:focus {
						outline: none;
					}
					img {
						vertical-align: bottom;
					}
					.modal-text-tag {
						display: inline-block;
						width: 70px;
						height: 20px;
						line-height: 20px;
						text-align: center;
						background: #ffffff;
						border-radius: 4px;
						border: 1px solid rgba(185, 185, 185, 0.3);
						color: #999999;
						font-size: 12px;
						cursor: pointer;
						margin: 0 4px;
						user-select: none;
					}
				}
			}
		}
		.el-dialog__footer {
			background-color: #fff;
			border-radius: 0px 0px 20px 20px;
			padding: 12px 18px 20px;
			border-top: 1px solid #f6f6f6;
			.el-button {
				border: none;
				&:nth-child(1) {
					color: #999999;
					background-color: #f7f7f7;
				}
				&:nth-child(2) {
					color: #fff;
					background-color: #3d7df9;
				}
			}
		}
	}
}
</style>
