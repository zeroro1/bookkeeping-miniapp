const { post } = require('../../utils/request')

Page({
  data: {},

  // 微信登录
  handleLogin() {
    wx.showLoading({ title: '登录中...' })
    wx.login({
      success: (res) => {
        if (res.code) {
          post('/auth/login', { code: res.code })
            .then(data => {
              wx.setStorageSync('token', data.data.token)
              wx.setStorageSync('userId', data.data.userId)
              wx.setStorageSync('openid', data.data.openid)
              wx.hideLoading()
              wx.switchTab({ url: '/pages/index/index' })
            })
            .catch(err => {
              wx.hideLoading()
              wx.showToast({ title: err.message || '登录失败', icon: 'none' })
            })
        } else {
          wx.hideLoading()
          wx.showToast({ title: '登录失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '登录失败', icon: 'none' })
      }
    })
  },

  // 测试登录
  handleTestLogin() {
    wx.showLoading({ title: '登录中...' })
    post('/auth/test-login', {})
      .then(data => {
        wx.setStorageSync('token', data.data.token)
        wx.setStorageSync('userId', data.data.userId)
        wx.setStorageSync('openid', data.data.openid)
        wx.hideLoading()
        wx.switchTab({ url: '/pages/index/index' })
      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({ title: err.message || '登录失败', icon: 'none' })
      })
  }
})
