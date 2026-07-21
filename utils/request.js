// 后端 API 地址
const BASE_URL = 'https://www.jizhangben.me/api'

/**
 * 通用请求方法
 * @param {boolean} needAuth - 是否需要携带 token，默认 true
 */
export function request(url, method = 'GET', data = {}, needAuth = true) {
  return new Promise((resolve, reject) => {
    const token = needAuth ? uni.getStorageSync('token') : ''
    const header = {
      'Content-Type': 'application/json'
    }
    if (token) {
      header['Authorization'] = 'Bearer ' + token
    }

    uni.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          if (res.data && res.data.code === 200) {
            resolve(res.data)
          } else {
            uni.showToast({ title: res.data?.message || '请求失败', icon: 'none' })
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // 清除本地 token
          uni.removeStorageSync('token')
          uni.removeStorageSync('userId')
          uni.removeStorageSync('openid')
          reject({ code: 401, message: '未登录' })
        } else {
          uni.showToast({ title: '请求失败', icon: 'none' })
          reject({ code: res.statusCode, message: '请求失败' })
        }
      },
      fail(err) {
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject({ code: -1, message: '网络错误' })
      }
    })
  })
}

export function get(url, data) {
  return request(url, 'GET', data)
}

export function post(url, data) {
  return request(url, 'POST', data)
}

export function put(url, data) {
  return request(url, 'PUT', data)
}

export function del(url, data) {
  return request(url, 'DELETE', data)
}