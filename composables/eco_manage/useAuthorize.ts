import { ref, onMounted, onUnmounted } from 'vue'
import { Response } from '@/types'
import { getStorage_U, notification_U } from '@/utils'
import { tbApi, pddApi, vipApi } from '@/api/league'
export default function useAuthorize(type: number) {
	const authorizeRes = ref(<Response>{})
	//授权
	const authorize = () => {
		const token = getStorage_U('eco_t')
		let url
		switch (type) {
			case 1:
				url = `https://oauth.taobao.com/authorize?response_type=token&client_id=${process.env.VUE_APP_API_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_API_REDIRECT_URL}/tb?ecotoken=${token}`
				break
			case 3:
				url = `https://jinbao.pinduoduo.com/open.html?response_type=code&client_id=bb34a6782f0c4b70ba5f300b324be332&redirect_uri=${process.env.VUE_APP_API_REDIRECT_URL}/pdd&state=${token}`
				break
			case 4:
				url = `https://auth.vip.com/oauth2/authorize?client_id=99c489c0&response_type=code&redirect_uri=${process.env.VUE_APP_API_REDIRECT_URL}/vip&code=${token}`
				break
		}

		window.open(url, '_blank', 'width=600,height=600')
	}
	//提交授权结果
	const authorizeConfirm = async (request: Function, params: any) => {
		try {
			const { status, data, msg } = await request(params)
			if (status === 200) {
				authorizeRes.value = {
					status,
					data,
					msg
				}
			}
		} catch (error: any) {
			notification_U('请求出错', error, 'error')
			console.log(error)
		}
	}
	// storage事件触发  判断拼多多或淘宝或唯品会
	const authorizeHandle = async (paramsType: string) => {
		// 请求参数
		let params
		switch (paramsType) {
			case 'eco_t_p':
				params = getStorage_U('eco_t_p') ? JSON.parse(getStorage_U('eco_t_p') as any) : {}
				authorizeConfirm(tbApi, {
					platformToken: params.appSessions,
					platformUserNick: params.name,
					platformUserId: params.id
				})
				break
			case 'eco_p_p':
				params = getStorage_U('eco_p_p') ? JSON.parse(getStorage_U('eco_p_p') as any) : {}
				authorizeConfirm(pddApi, {
					params: { code: params.code }
				})
				break
			case 'eco_v_p':
				params = getStorage_U('eco_v_p') ? JSON.parse(getStorage_U('eco_v_p') as any) : {}
				authorizeConfirm(vipApi, {
					params: { code: params.code }
				})
				break
		}
	}
	// storage事件监听器
	const storageListener = (e: any) => {
		if (e.newValue) {
			authorizeHandle(e.key)
		}
	}

	// 绑定storage监听事件
	const bindStorageListener = () => {
		window.addEventListener('storage', storageListener)
	}
	// 移除storage监听事件
	const removeStorageListener = () => {
		window.removeEventListener('storage', storageListener)
	}
	onMounted(bindStorageListener)
	onUnmounted(removeStorageListener)
	return {
		authorize,
		authorizeRes
	}
}
