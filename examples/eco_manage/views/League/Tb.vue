<template>
	<div>
		<Header />
		<Table :tableSet="tableSet" @selectChange="selectChange" @pageChange="pageChange">
			<template #tableHeader>
				<div class="table-head">
					<div class="table-head-items">
						<div class="table-head-item">
							<span class="table-head-item-til">关键字：</span>
							<a-input
								v-model:value="searchOptions.queryKey"
								placeholder="请输入昵称、联盟ID、用户ID"
							></a-input>
						</div>
						<div class="table-head-item">
							<span class="table-head-item-til">状态：</span>
							<a-select
								style="width: 160px"
								v-model:value="searchOptions.platformStatus"
								placeholder="请选择状态"
							>
								<a-select-option value=""> 全部 </a-select-option>
								<a-select-option :value="1"> 正常 </a-select-option>
								<a-select-option :value="0"> 失效 </a-select-option>
							</a-select>
						</div>
						<!-- <div class="table-head-item">
							<span class="table-head-item-til">时间：</span>
							<a-range-picker v-model:value="searchOptions.time"></a-range-picker>
						</div> -->
						<div class="table-head-btns">
							<a-button type="primary" @click="search">查询</a-button>
							<a-divider type="vertical"></a-divider
							><a-button @click="reset">重置</a-button>
						</div>
					</div>
					<div class="table-head-right">
						<a-button type="primary" @click="authorize">添加新授权</a-button>
						<a-divider type="vertical"></a-divider
						><a-button type="primary" @click="pullAccount">拉取账号授权</a-button>
					</div>
				</div>
			</template>

			<template #status="{ text }">
				<a-badge v-if="text === 1" color="#5B8FF9" text="授权正常" />
				<a-badge v-else color="#E8684A" text="授权过期"
			/></template>
			<template #createdTime="{ text }">
				{{ $Day(text || undefined).format('YYYY-MM-DD HH:mm:ss') }}
			</template>
			<template #expiredTime="{ text }">
				{{ $Day(text || undefined).format('YYYY-MM-DD HH:mm:ss') }}
			</template>
			<template #remark="{ text }">
				<a-tooltip>
					<template #title>{{ text }}</template>
					{{ ellipsis_U(text) }}
				</a-tooltip>
			</template>
			<template #token="{ text }">
				<a-tooltip>
					<template #title>{{ text }}</template>
					{{ ellipsis_U(text) }}
				</a-tooltip>
			</template>
			<template #action="{ record }">
				<div>
					<span class="diamonds-blue diamonds-cursor-pointer" @click="tracePid(record)"
						>追踪Pid</span
					>
					<a-divider type="vertical"></a-divider>
					<span class="diamonds-blue diamonds-cursor-pointer" @click="traceRecord(record)"
						>追踪记录</span
					>
					<a-divider type="vertical"></a-divider>
					<span class="diamonds-blue diamonds-cursor-pointer" @click="authorize"
						>更新授权</span
					>
					<a-divider type="vertical"></a-divider>
					<a-popconfirm
						title="是否删除授权？"
						ok-text="是"
						cancel-text="否"
						@confirm="deleteAuthorization(record)"
					>
						<span class="diamonds-red diamonds-cursor-pointer">删除授权</span>
					</a-popconfirm>
				</div>
			</template>
		</Table>

		<Modal :set="pullAccountModal" @confirm="pullAccountConfirm">
			<template #content
				><Form
					:set="pullAccountForm"
					:isValidate="pullAccountForm.isValidate"
					:isReset="pullAccountForm.isReset"
					@validateSuccess="pullAccountFormValidateSuccess"
				/>
			</template>
		</Modal>

		<Modal :set="tracePidModal" okText="修改" @confirm="tracePidConfirm">
			<template #content>
				<a-textarea
					v-model:value="tracePidModal.pid"
					:autoSize="{ minRows: 6, maxRows: 6 }"
				></a-textarea>
			</template>
		</Modal>
		<Modal :set="traceRecordModal" @confirm="traceRecordConfirm">
			<template #content>
				<Table
					:tableSet="traceRecordTableSet"
					@selectChange="traceRecordSelectChange"
					@pageChange="traceRecordPageChange"
				>
					<template #tableHeader>
						<div class="table-head">
							<div class="table-head-items">
								<div class="table-head-item">
									<span class="table-head-item-til">机器人ID：</span>
									<a-input
										v-model:value="traceRecordSearchOptions.robotId"
										placeholder="请输入机器人ID"
									></a-input>
								</div>
								<div class="table-head-item">
									<span class="table-head-item-til">微信ID：</span>
									<a-input
										v-model:value="traceRecordSearchOptions.wxId"
										placeholder="请输入微信ID"
									></a-input>
								</div>
								<div class="table-head-item">
									<span class="table-head-item-til">商品ID：</span>
									<a-input
										v-model:value="traceRecordSearchOptions.wxId"
										placeholder="请输入商品ID"
									></a-input>
								</div>
								<div class="table-head-item">
									<span class="table-head-item-til">Pid：</span>
									<a-input
										v-model:value="traceRecordSearchOptions.pid"
										placeholder="请输入Pid"
									></a-input>
								</div>

								<div class="table-head-btns">
									<a-button type="primary" @click="traceRecordSearch"
										>查询</a-button
									>
									<a-divider type="vertical"></a-divider
									><a-button @click="traceRecordReset">重置</a-button>
								</div>
							</div>
						</div>
					</template>
					<template #queryTime="{ text }">
						{{ $Day(text || undefined).format('YYYY-MM-DD HH:mm:ss') }}
					</template>
				</Table>
			</template>
		</Modal>
	</div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { defineComponent, reactive, ref, watch } from 'vue'
import Header from '@/components/Header.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import Form from '@/components/Form.vue'
import useAuthorize from '@/composables/useAuthorize'
import useData from '@/composables/useData'
import { getStorage_U, ellipsis_U } from '@/utils'
import {
	getLeagueListApi,
	deleteLeagueApi,
	tracePidApi,
	updatePidApi,
	traceRecordApi
} from '@/api/league'
export default defineComponent({
	components: { Header, Table, Modal, Form },
	setup(props) {
		const tableSet = reactive({
			columns: [
				{
					dataIndex: 'platformUserNick',
					key: 'account',
					title: '联盟账号'
				},
				{
					dataIndex: 'platformStatus',
					key: 'status',
					title: '授权状态',
					slots: { customRender: 'status' }
				},
				// {
				// 	dataIndex: 'remarks',
				// 	key: 'remark',
				// 	title: '备注',
				// 	slots: { customRender: 'remark' }
				// },
				{
					dataIndex: 'platformToken',
					key: 'token',
					title: '授权Token',
					slots: { customRender: 'token' }
				},
				{
					dataIndex: 'createTime',
					key: 'createdTime',
					title: '授权时间',
					slots: { customRender: 'createdTime' }
				},
				{
					dataIndex: 'expireTime',
					key: 'expiredTime',
					title: '过期时间',
					slots: { customRender: 'expiredTime' }
				},
				{
					dataIndex: 'action',
					key: 'action',
					title: '操作',
					slots: { customRender: 'action' }
				}
			],
			dataSource: [],
			selectedRowKeys: [],
			selectedRows: [],
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
				showSizeChanger: true
			}
		})

		//授权
		const { authorize, authorizeRes } = useAuthorize(1)
		//获取数据
		const { getData, dataRes } = useData(getLeagueListApi, {
			current: 1,
			size: 10,
			entity: { cpsType: 1 }
		})

		//监听授权结果
		watch(authorizeRes, () => {
			if ((authorizeRes.value.status = 200)) {
				message.success('授权成功！')
				tableSet.pagination.current = 1
				tableSet.pagination.pageSize = 10
				getData({
					current: 1,
					size: 10,
					entity: { cpsType: 1 }
				})
			}
		})

		//授权数据
		watch(dataRes, (res) => {
			tableSet.dataSource = res.data.records as any
			tableSet.pagination.total = res.data.total
		})
		return {
			authorize,
			getData,
			dataRes,
			tableSet
		}
	},
	data() {
		return {
			searchOptions: {},
			pullAccountModal: { title: '拉取账号', visible: false },
			pullAccountForm: {
				ref: 'pullAccountFormRef',
				wrapperCol: { span: 20 },
				labelCol: { span: 4 },
				model: { account: '', password: '' },
				rules: {
					account: [{ required: true, message: '请输入云端账号', trigger: 'change' }],
					password: [{ required: true, message: '请输入云端密码', trigger: 'change' }]
				},
				items: [
					{
						type: 1,
						label: '云端账号',
						name: 'account'
					},
					{
						type: 1,
						label: '云端密码',
						name: 'password'
					}
				],
				isValidate: false,
				isReset: false
			},
			tracePidModal: { title: '追踪Pid', visible: false, pid: '' },
			traceRecordModal: { title: '追踪Pid', visible: false, width: 1200 },
			current: { id: undefined },
			traceRecordTableSet: {
				columns: [
					{
						dataIndex: 'robot',
						key: 'robot',
						title: '机器人ID'
					},
					{
						dataIndex: 'name',
						key: 'name',
						title: '微信昵称'
					},
					{
						dataIndex: 'wxId',
						key: 'wxId',
						title: '微信ID'
					},
					{
						dataIndex: 'pid',
						key: 'pid',
						title: 'Pid'
					},
					{
						dataIndex: 'goodsId',
						key: 'goodsId',
						title: '商品ID'
					},
					{
						dataIndex: 'queryTime',
						key: 'queryTime',
						title: '查询时间',
						slots: { customRender: 'queryTime' }
					}
				],
				dataSource: [],
				selectedRowKeys: [],
				selectedRows: [],
				pagination: {
					current: 1,
					pageSize: 10,
					total: 0,
					showSizeChanger: true
				}
			},
			traceRecordSearchOptions: {}
		}
	},
	methods: {
		ellipsis_U,
		selectChange() {},
		pageChange() {
			this.getData({
				current: this.tableSet.pagination.current,
				size: this.tableSet.pagination.pageSize,
				entity: { ...this.searchOptions, cpsType: 1 }
			})
		},
		search() {
			this.tableSet.pagination.current = 1
			this.getData({
				current: this.tableSet.pagination.current,
				size: this.tableSet.pagination.pageSize,
				entity: { ...this.searchOptions, cpsType: 1 }
			})
		},
		reset() {
			this.searchOptions = {}
			this.tableSet.pagination.current = 1
			this.tableSet.pagination.pageSize = 10
			this.getData({
				current: this.tableSet.pagination.current,
				size: this.tableSet.pagination.pageSize,
				entity: { ...this.searchOptions, cpsType: 1 }
			})
		},
		pullAccount() {
			this.pullAccountForm.isReset = !this.pullAccountForm.isReset
			this.pullAccountModal.visible = true
		},
		//拉取账号
		pullAccountConfirm() {
			this.pullAccountForm.isValidate = !this.pullAccountForm.isValidate
		},
		//拉取账号表单验证
		pullAccountFormValidateSuccess() {
			this.pullAccountModal.visible = false
		},
		//删除
		async deleteAuthorization(record: any) {
			try {
				const { status, data, msg } = await (<any>deleteLeagueApi([record.id]))
				if (status === 200) {
					message.success(msg || '删除成功')
					this.reset()
				}
			} catch (error) {}
		},
		async tracePid(record: any) {
			this.current = record
			this.tracePidModal.visible = true
			try {
				const { status, data, msg } = <any>await tracePidApi({
					params: {
						cpsType: 1,
						oauthId: record.id
					}
				})
				if (status === 200) {
					this.tracePidModal.pid = data.join('\n')
				}
			} catch (error) {}
		},
		async tracePidConfirm() {
			try {
				const { status, data, msg } = <any>await updatePidApi({
					cpsType: 1,
					oauthId: this.current.id,
					stringList: this.tracePidModal.pid.split('\n')
				})
				if (status === 200) {
					this.tracePidModal.visible = false
					message.success(msg || '修改成功')
					this.reset()
				}
			} catch (error) {}
		},
		async getTraceRecord(params: any) {
			try {
				const { status, data, msg } = <any>await traceRecordApi({ params })
				if (status === 200) {
					this.traceRecordTableSet.dataSource = data.records
					this.traceRecordTableSet.pagination.total = data.total
				}
			} catch (error) {}
		},
		traceRecordSelectChange() {},
		traceRecordPageChange() {
			this.getTraceRecord({
				current: this.traceRecordTableSet.pagination.current,
				size: this.traceRecordTableSet.pagination.pageSize,
				entity: { ...this.traceRecordSearchOptions, cpsType: 1 }
			})
		},
		traceRecordSearch() {
			this.traceRecordTableSet.pagination.current = 1
			this.getData({
				current: this.traceRecordTableSet.pagination.current,
				size: this.traceRecordTableSet.pagination.pageSize,
				entity: { ...this.traceRecordSearchOptions, cpsType: 1 }
			})
		},
		traceRecordReset() {
			this.traceRecordSearchOptions = {}
			this.traceRecordTableSet.pagination.current = 1
			this.traceRecordTableSet.pagination.pageSize = 10
			this.getData({
				current: this.traceRecordTableSet.pagination.current,
				size: this.traceRecordTableSet.pagination.pageSize,
				entity: { ...this.traceRecordSearchOptions, cpsType: 1 }
			})
		},
		async traceRecord(record: any) {
			this.current = record
			this.traceRecordModal.visible = true
			this.getTraceRecord({
				current: 1,
				size: 10,
				entity: {
					cpsType: 1,
					oauthId: this.current.id
				}
			})
		},

		traceRecordConfirm() {
			this.traceRecordModal.visible = false
		}
	},
	async created() {}
})
</script>
<style lang="less" scoped>
.table-head {
	display: flex;
	align-items: center;
	.table-head-items {
		display: flex;
		align-items: center;
		.table-head-item {
			display: flex;
			align-items: center;
			margin-right: 25px;
			.table-head-item-til {
				flex-shrink: 0;
			}
		}
	}
	.table-head-right {
		margin-left: 20px;
	}
}
</style>