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
          <text class="logo-icon">璐?/text>
        </view>
        <text class="app-title">璁拌处鏈?/text>
        <text class="app-subtitle">杞绘澗璁板綍姣忎竴绗旀敹鏀?/text>
      </view>
      <view class="login-card card">
        <button class="login-btn" :loading="logging" @tap="handleLogin">
          <text class="login-btn-text">寰俊鐧诲綍</text>
        </button>
        <text class="login-hint">鐧诲綍鍚庡嵆鍙繚瀛樺拰绠＄悊鎮ㄧ殑璐︾洰</text>
      </view>
      <text class="footer-text">鐧诲綍淇℃伅浠呯敤浜庤瘑鍒偍鐨勮韩浠?/text>
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
    const authRes = await request('/auth/login', 'POST', { code: loginRes.code })
    uni.setStorageSync('token', authRes.data.token)
    uni.setStorageSync('userId', authRes.data.userId)
    uni.setStorageSync('openid', authRes.data.openid)

    const retried = await retryPendingAction()
    if (retried) {
      uni.reLaunch({ url: '/pages/index/index' })
    } else {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.reLaunch({ url: '/pages/index/index' })
      }
    }
  } catch (err) {
    console.error('登录失败', err)
    uni.showToast({ title: '登录失败，请重试', icon: 'none' })
  } finally {
    logging.value = false
  }
}

async function retryPendingAction() {
  let retried = false
  try {
    const pendingStr = uni.getStorageSync('pendingAccount')
    if (pendingStr) {
      const pendingData = JSON.parse(pendingStr)
      uni.removeStorageSync('pendingAccount')
      if (pendingData.type !== null && pendingData.amount) {
        const data = {
          type: pendingData.type,
          amount: parseFloat(pendingData.amount),
          date: pendingData.date,
          category: pendingData.category,
          fromAccount: pendingData.fromAccount || '',
          toAccount: pendingData.toAccount || '',
          remark: pendingData.remark || ''
        }
        await request('/account', 'POST', data)
        retried = true
      }
    }
    const pendingDeleteId = uni.getStorageSync('pendingDelete')
    if (pendingDeleteId) {
      uni.removeStorageSync('pendingDelete')
      await request('/account/' + pendingDeleteId, 'DELETE')
      retried = true
    }
  } catch (err) {
    console.error('重试 pending 操作失败', err)
  }
  return retried
}
        await request('/account', 'POST', data)
        uni.showToast({ title: '娣诲姞鎴愬姛', icon: 'success' })
      }
    }

    // 灏濊瘯鎭㈠寰呭垹闄ょ殑璐︾洰
    const pendingDeleteId = uni.getStorageSync('pendingDelete')
    if (pendingDeleteId) {
      uni.removeStorageSync('pendingDelete')
      await request('/account/' + pendingDeleteId, 'DELETE')
      uni.showToast({ title: '鍒犻櫎鎴愬姛', icon: 'success' })
    }
  } catch (err) {
    console.error('閲嶈瘯 pending 鎿嶄綔澶辫触', err)
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
.login-card {
  background: #FFFFFF;
  border-radius: 32rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
  margin-bottom: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-btn {
  width: 100%; height: 96rpx; border-radius: 48rpx;
  font-size: 32rpx; font-weight: 600; color: #fff;
  border: none;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.35);
  display: flex; align-items: center; justify-content: center;
}
.login-btn::after { border: none; }
.login-btn-text { font-size: 32rpx; }
.login-hint { font-size: 24rpx; color: #64748B; margin-top: 20rpx; }
.footer-text { text-align: center; font-size: 24rpx; color: rgba(255, 255, 255, 0.6); margin-top: auto; padding-bottom: 60rpx; }
</style>
