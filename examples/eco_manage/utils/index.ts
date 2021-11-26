import Vue from 'vue'
import Cookie from 'js-cookie'

import { notification, message } from 'ant-design-vue'
import { routes } from '@/router'
export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
export const isPhantomJS = UA && /phantomjs/.test(UA)
export const isFF = UA && UA.match(/firefox\/(\d+)/)

//设置title
export function setTitle_U(title: string) {
	document.title = title || 'Vue'
}

//获取cookie
export function getCookie_U(field: string) {
	return Cookie.get(field)
} //设置cookie
export function setCookie_U(field: string, value: any) {
	return Cookie.set(field, value, { expires: 7 })
} //清除cookie
export function removeCookie_U(field: string) {
	return Cookie.remove(field)
}
//获取storage
export function getStorage_U(field: string) {
	return localStorage.getItem(field)
} //设置storage
export function setStorage_U(field: string, value: any) {
	return localStorage.setItem(field, typeof value === 'object' ? JSON.stringify(value) : value)
} //清除storage
export function removeStorage_U(field: string) {
	return localStorage.removeItem(field)
}

//换行
export function lineBreak_U(text: string) {
	try {
		if (text) {
			let textArr = text.split('')
			textArr.forEach((item, index) => {
				if (index !== 0 && index % 30 === 0) {
					textArr[index] = textArr[index] + '\n'
				}
			})
			return textArr.join('')
		}
		return text
	} catch (error) {
		message.error(error.message)
	}
}

export function notification_U(message: string, description: string, type: string) {
	notification[type]({
		message: lineBreak_U(message),
		description: lineBreak_U(description)
	})
}

export function copy_U(text: string) {
	//创建input元素
	let input = document.createElement('input')
	document.body.appendChild(input)
	input.value = text
	//input元素选中状态
	input.select()
	//复制内容到剪切板
	document.execCommand('copy')
	//移除input元素
	document.body.removeChild(input)

	message.info('复制成功！')
}
export function ellipsis_U(text: string, length: number) {
	try {
		return text && text.length > (length || 15)
			? `${text.slice(0, length || 15)}...`
			: text || '无'
	} catch (error) {
		console.log(error)
	}
}

//处理返回文案参数
export function handleTextParams_U(data: any) {
	try {
		let params = {}
		for (const item of data) {
			for (const child of item.children) {
				params = { ...params, [child.field]: child.value }
			}
		}
		return params
	} catch (error) {
		message.error(error.message)
	}
}
//初始化返回文案参数
export function initTextParams_U(target: any, data: any) {
	try {
		for (const item of target) {
			for (const child of item.children) {
				child.value = data[child.field]
			}
		}
	} catch (error) {
		message.error(error.message)
	}
}

export function user_U() {
	try {
		return getStorage_U('') ? JSON.parse(getStorage_U('') as any) : {}
	} catch (error) {
		message.error(error.message)
	}
}

export function menus_U() {
	try {
		const userInfo = getStorage_U('') ? JSON.parse(getStorage_U('') as any) : {}
		if (userInfo.role) {
			return userInfo.role.menuList || []
		}
		return []
	} catch (error) {
		message.error(error.message)
	}
}
export function isOk_U(to: string) {
	return menus_U().find((item: any) => to.toLowerCase().includes(item))
}

export function getSkipUrl_U() {
	try {
		return (routes[0].children as any).find((item: any) =>
			item.name.toLowerCase().includes(menus_U()[0])
		).path
	} catch (error) {
		message.error(error.message)
	}
}
