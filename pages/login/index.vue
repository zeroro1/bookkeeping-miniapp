<template>
  <view class="container">
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    <view class="content-wrapper">
      <view class="logo-section">
        <view class="logo-badge">
          <text class="logo-icon">￥</text>
        </view>
        <text class="app-title">记账本</text>
        <text class="app-subtitle">轻松记录每一笔收支</text>
      </view>
      <view class="login-card card">
        <button class="login-btn" :loading="logging" @tap="handleLogin">
          <text class="login-btn-icon">锁</text>
          <text>微信一键登录</text>
        </button>
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">或</text>
          <view class="divider-line"></view>
        </view>
        <button class="test-btn" :loading="logging" @tap="handleTestLogin">
          <text>使用测试账号</text>
        </button>
      </view>
      <text class="footer-text">已登录用户自动同步数据</text>
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
      uni.login({ provider: 'weixin', success: resolve, fail: reject })
    })
    await request('/auth/login', 'POST', { code: loginRes.code })
    uni.setStorageSync('token', loginRes.data.token)
    uni.setStorageSync('userId', loginRes.data.userId)
    uni.setStorageSync('openid', loginRes.data.openid)
    uni.reLaunch({ url: '/pages/index/index' })
  } catch (err) {
    console.error('登录失败', err)
    uni.showToast({ title: '登录失败，请重试', icon: 'none' })
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
    uni.reLaunch({ url: '/pages/index/index' })
  } catch (err) {
    console.error('测试登录失败', err)
    uni.showToast({ title: '登录失败，请重试', icon: 'none' })
  } finally {
    logging.value = false
  }
}
</script>
<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(160deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%);
  position: relative;
  overflow: hidden;
}
.bg-decoration { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
.circle { border-radius: 50%; background: rgba(255, 255, 255, 0.08); position: absolute; }
.circle-1 { width: 500rpx; height: 500rpx; top: -150rpx; right: -100rpx; }
.circle-2 { width: 300rpx; height: 300rpx; bottom: 100rpx; left: -80rpx; }
.circle-3 { width: 200rpx; height: 200rpx; bottom: -50rpx; right: 50rpx; }
.content-wrapper { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 100vh; padding: 0 48rpx; }
.logo-section { display: flex; flex-direction: column; align-items: center; padding-top: 160rpx; margin-bottom: 100rpx; }
.logo-badge {
  width: 160rpx; height: 160rpx; border-radius: 48rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}
.logo-icon { font-size: 80rpx; color: #fff; font-weight: bold; }
.app-title { font-size: 56rpx; font-weight: 700; color: #FFFFFF; margin-bottom: 12rpx; letter-spacing: 4rpx; }
.app-subtitle { font-size: 28rpx; color: rgba(255, 255, 255, 0.8); }
.login-card { background: #FFFFFF; border-radius: 32rpx; padding: 48rpx 40rpx; box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15); margin-bottom: 32rpx; }
.login-btn {
  width: 100%; height: 96rpx; border-radius: 48rpx;
  font-size: 32rpx; font-weight: 600; color: #fff;
  border: none;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.35);
  display: flex; align-items: center; justify-content: center; gap: 12rpx;
}
.login-btn::after { border: none; }
.login-btn-icon { font-size: 32rpx; }
.divider { display: flex; align-items: center; margin: 36rpx 0; }
.divider-line { flex: 1; height: 1rpx; background: #E2E8F0; }
.divider-text { font-size: 24rpx; color: #94A3B8; padding: 0 20rpx; }
.test-btn {
  width: 100%; height: 88rpx; border-radius: 44rpx;
  font-size: 28rpx; font-weight: 500; color: #64748B;
  background: transparent; border: 2rpx solid #E2E8F0;
}
.footer-text { text-align: center; font-size: 24rpx; color: rgba(255, 255, 255, 0.6); margin-top: auto; padding-bottom: 60rpx; }
</style>