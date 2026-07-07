<template>
  <view class="container">
    <!-- Logo 区域 -->
    <view class="logo-section">
      <text class="logo-icon">&#x1f4d3;</text>
      <text class="app-title">记账本</text>
      <text class="app-desc">轻松记录每一笔收支</text>
    </view>

    <!-- 登录按钮 -->
    <view class="login-section">
      <button class="btn btn-primary" :loading="logging" @tap="handleLogin">
        微信登录
      </button>
      <view class="test-login">
        <text class="test-text">开发测试：</text>
        <button class="btn-test" size="mini" :loading="logging" @tap="handleTestLogin">
          使用测试账号
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { request } from '../../utils/request'
import { ref } from 'vue'

const logging = ref(false)

async function handleLogin() {
  logging.value = true
  try {
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      })
    })

    await request('/auth/login', 'POST', { code: loginRes.code })

    uni.setStorageSync('token', loginRes.data.token)
    uni.setStorageSync('userId', loginRes.data.userId)
    uni.setStorageSync('openid', loginRes.data.openid)

    uni.switchTab({ url: '/pages/index/index' })
  } catch (err) {
    console.error('登录失败', err)
  } finally {
    logging.value = false
  }
}

async function handleTestLogin() {
  logging.value = true
  try {
    const res = await request('/auth/test-login', 'GET')
    uni.setStorageSync('token', res.data.token)
    uni.setStorageSync('userId', res.data.userId)
    uni.setStorageSync('openid', res.data.openid)
    uni.switchTab({ url: '/pages/index/index' })
  } catch (err) {
    console.error('测试登录失败', err)
  } finally {
    logging.value = false
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
  margin-bottom: 100rpx;
}

.logo-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.app-title {
  font-size: 56rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
}

.app-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.login-section {
  padding: 0 60rpx;
}

.btn {
  width: 100%;
  height: 96rpx;
  border-radius: 48rpx;
  font-size: 32rpx;
  color: #fff;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn::after {
  border: none;
}

.test-login {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
}

.test-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 24rpx;
  margin-right: 16rpx;
}

.btn-test {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 24rpx;
}
</style>
