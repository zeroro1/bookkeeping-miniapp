<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onLaunch } from 'dcloudio/uni-app'
onLaunch(() => {
  console.log('App Launch')
  // 检查登录状态
  const token = uni.getStorageSync('token')
  const userId = uni.getStorageSync('userId')
  if (!token || !userId) {
    uni.reLaunch({ url: '/pages/login/index' })
  }
})
</script>

<style>
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  padding: 20rpx;
}

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

.text-success { color: #52c41a; }
.text-danger { color: #ff4d4f; }
.text-info { color: #1890ff; }

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #fff;
  border: none;
}

.btn-primary { background: #1890ff; }
.btn-danger { background: #ff4d4f; }
.btn-success { background: #52c41a; }
.btn-default { background: #f0f0f0; color: #333; }
</style>
