import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setTitle_U, getStorage_U, isOk_U, user_U, getSkipUrl_U } from '@/utils'
import { RouteWhiteList, ManagerRouteList } from '@/constant'
export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Index',
		component: () => import('@/components/Layout.vue'),
		children: [
			{
				path: '/',
				name: 'Home',
				meta: { type: 'home' },
				component: () => import('@/views/Home/Index.vue')
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/Login/Login.vue')
	},
	{
		path: '/tb',
		name: 'Tb',
		component: () => import('@/views/Callback/Tb.vue')
	},
	{
		path: '/pdd',
		name: 'Pdd',
		component: () => import('@/views/Callback/Pdd.vue')
	},
	{
		path: '/vip',
		name: 'Vip',
		component: () => import('@/views/Callback/Vip.vue')
	},

	{
		path: '/404',
		name: 'NotFound',
		component: () => import('@/components/404.vue')
	},
	{
		path: '/:pathMatch(.*)',
		name: 'NotFound',
		meta: {
			title: '404'
		},
		component: () => import('../components/404.vue')
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	//设置页面title
	setTitle_U(to.meta.title as string)

	// 获取token
	const token = getStorage_U('')
	//用户信息
	const user = user_U()

	try {
		if (token) {
			if (to.name === 'Login') {
				next(getSkipUrl_U())
			} else {
				isOk_U(to.name as any) ||
				RouteWhiteList.includes(to.name as any) ||
				(ManagerRouteList.includes(to.name as any) && (user as any).type === 2)
					? next()
					: next('/404')
			}
		} else {
			if (RouteWhiteList.includes(to.name as any)) {
				next()
			} else {
				next({ path: '/login' })
			}
		}
	} catch (error) {
		next(getSkipUrl_U())
	}
})
export default router
