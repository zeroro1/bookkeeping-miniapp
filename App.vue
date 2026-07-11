<template>
  <div>
    <block>
      <router-view />
    </block>
  </div>
</template>

<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { request } from './utils/request'

onLaunch(async () => {
  const token = uni.getStorageSync('token')
  const userId = uni.getStorageSync('userId')
  
  if (token && userId) {
    // 有缓存 token，尝试静默登录
    try {
      const loginRes = await new Promise((resolve, reject) => {
        uni.login({ provider: 'weixin', success: resolve, fail: reject })
      })
      await request('/auth/login', 'POST', { code: loginRes.code })
      // 静默登录成功，保留在首页
    } catch (err) {
      // token 失效，跳转登录页
      uni.removeStorageSync('token')
      uni.removeStorageSync('userId')
      uni.removeStorageSync('openid')
      uni.reLaunch({ url: '/pages/login/index' })
    }
  } else {
    // 无缓存，跳转登录页
    uni.reLaunch({ url: '/pages/login/index' })
  }
})
</script>

<style>
page {
  background-color: #F8FAFC;
  font-size: 28rpx;
  color: #1E293B;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.container {
  padding: 24rpx;
  padding-bottom: 160rpx;
  min-height: 100vh;
}

/* ===== Design Tokens ===== */
:root {
  --primary: #6366F1;
  --primary-light: #818CF8;
  --primary-dark: #4F46E5;
  --success: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
  --info: #3B82F6;
  --bg: #F8FAFC;
  --card-bg: #FFFFFF;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --border: #E2E8F0;
  --shadow: 0 1rpx 3rpx rgba(0,0,0,0.06), 0 1rpx 2rpx rgba(0,0,0,0.04);
  --shadow-md: 0 4rpx 12rpx rgba(0,0,0,0.06), 0 2rpx 6rpx rgba(0,0,0,0.04);
  --radius: 24rpx;
  --radius-sm: 16rpx;
}

/* ===== Utility Classes ===== */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-success { color: var(--success); }
.text-danger { color: var(--danger); }
.text-info { color: var(--info); }
.text-warning { color: var(--warning); }
.text-muted { color: var(--text-muted); }
.text-secondary { color: var(--text-secondary); }
.text-primary { color: var(--text-primary); }

/* ===== Card Component ===== */
.card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: var(--shadow);
}

/* ===== Button Components ===== */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: var(--radius-sm);
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, var(--danger) 0%, #DC2626 100%);
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
}

.btn-outline {
  background: transparent;
  border: 2rpx solid var(--border);
  color: var(--text-secondary);
}

.btn-block {
  width: 100%;
}
</style>
