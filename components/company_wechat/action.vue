<template>
	<div>
		<div class="action">
			<el-button @click="modalOpen(item)" v-for="(item, i) in types" :key="i"
				><el-icon class="el-icon--left"><Plus /></el-icon>{{ item }}</el-button
			>
		</div>
		<div class="modal">
			<el-dialog
				width="432px"
				v-model="dialog.visible"
				:show-close="false"
				:close-on-click-modal="false"
			>
				<template v-slot:title>
					<div>添加{{ dialog.type }}</div>
					<div>
						<el-icon @click="modalClose"><CircleCloseFilled /></el-icon>
					</div>
				</template>
				<!--文字-->
				<div class="modal-text" v-if="dialog.type === '文字'">
					<div class="modal-text-head">
						<el-tooltip effect="light">
							<template #content>
								<Emoji @getEmoji="addEmoji" />
							</template>
							<SmileOutlined />
						</el-tooltip>

						<el-tag @click="addTextTag('随机表情')"> 随机表情 </el-tag>
						<el-tag @click="addTextTag('称呼/昵称')">称呼/昵称</el-tag>
					</div>
					<div class="modal-text-body" id="editor" contenteditable></div>
				</div>
				<!--链接-->
				<div class="modal-link" v-if="dialog.type === '链接'">
					<el-form
						ref="linkFormRef"
						:model="linkForm.model"
						:rules="linkForm.rules"
						label-width="60px"
					>
						<el-form-item label="链接" prop="link">
							<el-input v-model="linkForm.model.link"></el-input>
						</el-form-item>
						<el-form-item label="标题" prop="title">
							<el-input v-model="linkForm.model.title"></el-input>
						</el-form-item>
						<el-form-item label="描述" prop="des" class="modal-link-form-item">
							<el-input
								v-model="linkForm.model.des"
								type="textarea"
								:rows="3"
							></el-input>
							<el-upload
								class="modal-link-form-item-right"
								action="https://jsonplaceholder.typicode.com/posts/"
								:show-file-list="false"
								:on-change="upload"
							>
								<el-icon v-if="linkForm.model.loading"><Loading /></el-icon>
								<div v-else>
									<el-avatar
										v-if="linkForm.model.img"
										:size="40"
										:src="linkForm.model.img"
									></el-avatar>

									<el-icon v-else><Plus /></el-icon>
								</div>
							</el-upload>
						</el-form-item>
					</el-form>
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
import { defineComponent, reactive, ref, onMounted, nextTick, watch } from 'vue'
import { Plus, CircleCloseFilled, Loading } from '@element-plus/icons-vue'
import { SmileOutlined } from '@ant-design/icons-vue'
import Emoji from './emoji.vue'
export default defineComponent({
	components: { Loading, Emoji, CircleCloseFilled, SmileOutlined, Plus },
	setup(props: any, { emit }) {
		const types = ['文字', '图片', '视频', '文件', '链接', '小程序', '视频号', '素材库']
		const dialog = reactive({ type: '文字', visible: false })
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
		const linkFormRef = ref()
		const linkForm = reactive({
			rules: {
				link: [
					{
						required: true,
						message: '请输入链接'
					}
				],
				title: [
					{
						required: true,
						message: '请输入标提'
					}
				],
				des: [
					{
						required: true,
						message: '请输入描述'
					}
				]
			},
			model: {
				link: undefined,
				title: undefined,
				des: undefined,
				img: undefined,
				loading: false
			}
		})
		const wordIndex = ref()
		const modalOpen = (type: any, val: any, i: any) => {
			dialog.type = type
			wordIndex.value = i

			switch (type) {
				case '文字':
					dialog.visible = true
					nextTick(() => val && textInit(val))
					break
				case '链接':
					dialog.visible = true
					nextTick(() => {
						linkFormRef.value.resetFields()
						//这里进行解构处理,linkForm.model = val会有响应式依赖问题
						val && (linkForm.model = { ...val })
					})

					break
			}
		}
		const modalClose = () => {
			dialog.visible = false
		}
		const modalConfirm = () => {
			switch (dialog.type) {
				case '文字':
					emit('getText', { text: htmlFormat(), index: wordIndex.value })
					dialog.visible = false
					break
				case '链接':
					linkFormConfirm(linkFormRef)
					dialog.visible = false
					break
			}
		}
		const linkFormConfirm = (form: any) => {
			if (!form.value) return
			form.value.validate((valid: any) => {
				if (valid) {
					emit('getLink', { model: { ...linkForm.model }, index: wordIndex.value })
				} else {
					return false
				}
			})
		}
		const upload = (file: any, fileList: any) => {
			linkForm.model.loading = true
			if (file.status === 'success') {
				linkForm.model.loading = false
			}
		}
		//文本初始化
		const textInit = (value: any) => {
			const editor = document.querySelector('#editor') as any
			let html = ''
			html = tagCreate('[随机表情]', value)
			html = tagCreate('[称呼/昵称]', html)
			html = emojiCreate(html)
			editor.innerHTML = html
		}
		const tagCreate = (target: any, word: any) => {
			while (word.includes(target)) {
				word = word.replace(
					target,
					`<div class="modal-text-tag" contenteditable="false">${target.slice(
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
			//随机表情
			word = tagReplace(
				word,
				'<div class="modal-text-tag" contenteditable="false">随机表情<span>×</span></div>',
				'[随机表情]'
			)
			word = tagReplace(
				word,
				`<div class="modal-text-tag" contenteditable="false">随机表情<span onclick="const editor = document.querySelector('#editor');editor.removeChild(this.parentNode);">×</span></div>`,
				'[随机表情]'
			)
			//称呼/昵称
			word = tagReplace(
				word,
				'<div class="modal-text-tag" contenteditable="false">称呼/昵称<span>×</span></div>',
				'[称呼/昵称]'
			)
			word = tagReplace(
				word,
				`<div class="modal-text-tag" contenteditable="false">称呼/昵称<span onclick="const editor = document.querySelector('#editor');editor.removeChild(this.parentNode);">×</span></div>`,
				'[称呼/昵称]'
			)
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

					tag.className = 'modal-text-tag'
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
			types,
			dialog,
			linkForm,
			linkFormRef,
			upload,
			modalOpen,
			modalClose,
			modalConfirm,
			addTextTag,
			addEmoji,
			linkFormConfirm
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
			.modal-link {
				.modal-link-form-item {
					&:nth-last-child(1) {
						.el-form-item__content {
							display: flex;
							.el-textarea {
								width: 74%;
							}
							.modal-link-form-item-right {
								height: 100%;
								background: #ffffff;
								border-radius: 4px;
								border: 1px solid #cacaca;
								flex-grow: 1;
								margin-left: 15px;
								.el-upload {
									width: 100%;
									height: 100%;
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}
						}
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
