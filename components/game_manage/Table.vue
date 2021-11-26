<script >
export default {
	methods: {
		//选择
		selectChange(selectedRowKeys, selectedRows) {
			this.$attrs.tableSet.selectedRowKeys = selectedRowKeys
			this.$attrs.tableSet.selectedRows = selectedRows
			this.$emit('selectChange')
		},
		//分页
		change(pagination) {
			this.$attrs.tableSet.pagination.pageSize = pagination.pageSize
			this.$attrs.tableSet.pagination.current = pagination.current
			this.$emit('pageChange')
		}
	},
	render() {
		//接收父组件定义的插槽内容，传入a-table
		const slots = this.$slots

		//a-table
		const table = (
			<a-table
				v-slots={slots}
				rowKey="id"
				columns={this.$attrs.tableSet.columns}
				dataSource={this.$attrs.tableSet.dataSource}
				pagination={{
					...this.$attrs.tableSet.pagination
				}}
				scroll={{
					...this.$attrs.tableSet.scroll
				}}
				rowSelection={{
					selectedRowKeys: this.$attrs.tableSet.selectedRowKeys,
					onChange: this.selectChange
				}}
				onChange={this.change}
			></a-table>
		)
		return (
			<div class="table">
				{/*表格头部 */}
				<div class="table-head">{slots.tableHeader()}</div>
				{/*表格内容 */}
				{table}
			</div>
		)
	}
}
</script>

<style scoped lang="less">
.table {
	background-color: #fff;
	padding: 15px 0;
	border-radius: 15px;
	.table-head {
		padding: 0 15px 15px 15px;
	}
}
</style>