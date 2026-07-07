App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token')
    const userId = wx.getStorageSync('userId')
    if (token && userId) {
      // 已登录
    } else {
      // 未登录，跳转登录页
      wx.reLaunch({ url: '/pages/login/index' })
    }
  }
})
