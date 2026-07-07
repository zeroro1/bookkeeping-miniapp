// 后端 API 地址
const BASE_URL = 'http://localhost:8080/api'

/**
 * 通用请求方法
 */
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    uni.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: {
        'Content-Type': method === 'GET' ? 'application/json' : 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      success(res) {
        if (res.statusCode === 200) {
          if (res.data && res.data.code === 200) {
            resolve(res.data)
          } else {
            uni.showToast({ title: res.data?.message || '请求失败', icon: 'none' })
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userId')
          uni.reLaunch({ url: '/pages/login/index' })
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

module.exports = {
  BASE_URL,
  request,
  get: (url, data) => request(url, 'GET', data),
  post: (url, data) => request(url, 'POST', data),
  put: (url, data) => request(url, 'PUT', data),
  del: (url, data) => request(url, 'DELETE', data)
}
