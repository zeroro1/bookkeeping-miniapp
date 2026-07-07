<template>
  <view class="container">
    <!-- 月份选择 -->
    <view class="month-bar card">
      <text class="nav-arrow" @tap="changeMonth('prev')">&#8249;</text>
      <text class="month-text">{{ currentMonth }}</text>
      <text class="nav-arrow" @tap="changeMonth('next')">&#8250;</text>
    </view>

    <!-- 月度统计 -->
    <view class="summary-bar card">
      <view class="summary-item">
        <text class="summary-label">收入</text>
        <text class="summary-value text-success">{{ monthIncome }}</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">支出</text>
        <text class="summary-value text-danger">{{ monthExpense }}</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">结余</text>
        <text class="summary-value">{{ balance }}</text>
      </view>
    </view>

    <!-- 筛选 -->
    <view class="filter-bar card">
      <view
        v-for="(tab, i) in tabs"
        :key="i"
        class="filter-item"
        :class="{ active: activeType === i }"
        @tap="filterType(i)"
      >
        {{ tab }}
      </view>
    </view>

    <!-- 账目列表 -->
    <view class="list-container">
      <view
        v-for="item in accounts"
        :key="item.id"
        class="account-card card"
        @tap="goEdit(item)"
      >
        <view class="card-header flex-between">
          <text class="card-category">{{ item.category || '未分类' }}</text>
          <text class="card-amount" :class="amountClass(item)">
            {{ amountPrefix(item) }} ¥{{ item.amount }}
          </text>
        </view>
        <view class="card-body flex-between">
          <text class="card-remark text-secondary">{{ item.remark || '-' }}</text>
          <text class="card-date text-secondary">{{ item.date }}</text>
        </view>
        <view class="card-footer flex-between" v-if="item.fromAccount || item.toAccount">
          <text class="card-account text-secondary">{{ item.fromAccount || '' }}</text>
          <text class="card-account text-secondary">{{ item.toAccount || '' }}</text>
        </view>
      </view>

      <view class="empty-state" v-if="accounts.length === 0">
        <text class="empty-icon">&#x1f4e2;</text>
        <text class="empty-text">暂无账目记录</text>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="fab-btn" @tap="goAdd">+</view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { request } from '../../utils/request'
import dayjs from 'dayjs'

const accounts = ref([])
const currentMonth = ref(dayjs().format('YYYY-MM'))
const activeType = ref(0)
const tabs = ref(['全部', '收入', '支出', '转账'])

const monthIncome = ref('0.00')
const monthExpense = ref('0.00')
const balance = ref('0.00')

// 计算金额样式
function amountClass(item) {
  if (item.type === 1) return 'text-success'
  if (item.type === 2) return 'text-danger'
  return 'text-info'
}

function amountPrefix(item) {
  if (item.type === 1) return '+'
  if (item.type === 2) return '-'
  return '⇄'
}

// 加载账目
async function loadAccounts() {
  const userId = uni.getStorageSync('userId')
  if (!userId) return

  try {
    const params = { month: currentMonth.value }
    if (activeType.value > 0) params.type = activeType.value

    const res = await request('/account/list', 'GET', params)
    const list = res.data || []

    // 计算统计
    let inc = 0, exp = 0
    list.forEach(a => {
      if (a.type === 1) inc += parseFloat(a.amount)
      if (a.type === 2) exp += parseFloat(a.amount)
    })

    monthIncome.value = inc.toFixed(2)
    monthExpense.value = exp.toFixed(2)
    balance.value = (inc - exp).toFixed(2)
    accounts.value = list
  } catch (err) {
    console.error('加载失败', err)
  }
}

// 切换月份
function changeMonth(dir) {
  const now = dayjs(currentMonth.value)
  if (dir === 'prev') {
    currentMonth.value = now.subtract(1, 'month').format('YYYY-MM')
  } else {
    currentMonth.value = now.add(1, 'month').format('YYYY-MM')
  }
  loadAccounts()
}

// 筛选
function filterType(index) {
  activeType.value = index
  loadAccounts()
}

// 去编辑页
function goEdit(item) {
  uni.navigateTo({ url: '/pages/edit/index?id=' + item.id })
}

// 去新增页
function goAdd() {
  uni.navigateTo({ url: '/pages/edit/index' })
}

onMounted(() => {
  loadAccounts()
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 140rpx;
  min-height: 100vh;
}

.month-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
}

.nav-arrow {
  font-size: 32rpx;
  color: #1890ff;
  padding: 0 20rpx;
}

.month-text {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.summary-bar {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.summary-value {
  font-size: 36rpx;
  font-weight: bold;
}

.filter-bar {
  display: flex;
  padding: 10rpx 0;
}

.filter-item {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  padding: 12rpx 0;
}

.filter-item.active {
  color: #1890ff;
  font-weight: bold;
  border-bottom: 4rpx solid #1890ff;
}

.account-card {
  margin-bottom: 16rpx;
}

.card-category {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.card-amount {
  font-size: 32rpx;
  font-weight: bold;
}

.card-remark, .card-date {
  font-size: 24rpx;
}

.card-account {
  font-size: 22rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 80rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  z-index: 100;
}
</style>
