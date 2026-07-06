// 后端 API 地址，开发阶段使用本地地址
const BASE_URL = 'http://localhost:8080/api'

// 通用请求方法
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    wx.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: {
        'Content-Type': method === 'GET' ? 'application/json' : 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userId')
          wx.reLaunch({ url: '/pages/login/index' })
          reject({ code: 401, message: '未登录' })
        } else {
          reject({ code: res.statusCode, message: '请求失败' })
        }
      },
      fail(err) {
        reject({ code: -1, message: '网络错误' })
      }
    })
  })
}

// GET 请求
function get(url, data) {
  return request(url, 'GET', data)
}

// POST 请求
function post(url, data) {
  return request(url, 'POST', data)
}

// PUT 请求
function put(url, data) {
  return request(url, 'PUT', data)
}

// DELETE 请求
function del(url, data) {
  return request(url, 'DELETE', data)
}

module.exports = {
  BASE_URL,
  get,
  post,
  put,
  del
}
