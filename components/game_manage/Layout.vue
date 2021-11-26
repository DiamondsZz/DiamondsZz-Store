<template>
	<a-layout class="layout">
		<a-layout-header class="layout-top">
			<div class="layout-top-left"></div>
			<div class="layout-top-middle"></div>
			<div class="layout-top-right">
				<a-dropdown>
					<a-avatar :size="40">
						<template #icon><UserOutlined /></template>
					</a-avatar>
					<template #overlay>
						<a-menu>
							<a-menu-item> 退出登录 </a-menu-item>
						</a-menu>
					</template>
				</a-dropdown>
			</div>
		</a-layout-header>
		<a-layout>
			<a-layout-sider>
				<a-menu
					mode="inline"
					theme="dark"
					v-model:selectedKeys="menuCurrent"
					v-model:openKeys="openKeys"
				>
					<template v-for="item in Menus">
						<a-sub-menu v-if="item.children" :key="item.key">
							<template #title>
								<component :is="item.icon" />
								<span>{{ item.name }}</span>
							</template>
							<template v-for="child in item.children" :key="child.key">
								<a-menu-item @click="menuSwitch(child.path)">
									<component :is="child.icon" />
									<span>{{ child.name }}</span>
								</a-menu-item>
							</template>
						</a-sub-menu>
						<template v-else
							><a-menu-item :key="item.key" @click="menuSwitch(item.path)">
								<component :is="item.icon" />
								<span>{{ item.name }}</span>
							</a-menu-item>
						</template>
					</template>
				</a-menu></a-layout-sider
			>
			<a-layout class="layout-right">
				<a-layout-content> <router-view /> </a-layout-content>
			</a-layout>
		</a-layout>
	</a-layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { Menus } from '@/constant'
export default defineComponent({
	components: { UserOutlined },
	setup() {
		const $router = (<any>getCurrentInstance()).proxy.$root.$router
		const $route = (<any>getCurrentInstance()).proxy.$root.$route
		const menuCurrent = ref([$route.meta.type])
		const openKeys = ref($route.meta.parent ? [$route.meta.parent] : [])

		const menuSwitch = (key: string) => {
			$router.push({
				path: key
			})
		}
		return { Menus, menuCurrent, openKeys, menuSwitch }
	}
})
</script>
<style lang="less" scoped>
.layout {
	height: 100vh;
	.layout-top {
		display: flex;
		padding: 0;
		.layout-top-left {
			flex-basis: 200px;
		}
		.layout-top-middle {
			flex-grow: 1;
		}
		.layout-top-right {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-basis: 80px;
		}
	}
	.layout-right {
		width: calc(100vw - 200px);
		height: calc(100vh - 64px);
		overflow: scroll;
		padding: 15px 0 15px 15px;
	}
}
</style>