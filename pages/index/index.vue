<template>
  <view class="container">
    <view class="header-card">
      <view class="header-top">
        <MonthPicker v-model="currentMonth" @change="onMonthChange" />
      </view>
      <view class="summary-grid">
        <view class="summary-item">
          <text class="summary-label">收入</text>
          <text class="summary-value income">{{ monthIncome }}</text>
        </view>
        <view class="summary-divider"></view>
        <view class="summary-item">
          <text class="summary-label">支出</text>
          <text class="summary-value expense">{{ monthExpense }}</text>
        </view>
        <view class="summary-divider"></view>
        <view class="summary-item">
          <text class="summary-label">结余</text>
          <text class="summary-value" :class="balanceClass">{{ balance }}</text>
        </view>
      </view>
    </view>

    <view class="tabs-card card">
      <view class="tabs-list">
        <view v-for="(tab, i) in tabs" :key="i" class="tab-item" :class="{ active: activeType === i }" @tap="filterType(i)">
          <text class="tab-label">{{ tab }}</text>
        </view>
      </view>
    </view>

    <view class="list-container">
      <view v-for="item in accounts" :key="item.id" class="account-card card" @tap="goDetail(item)">
        <view class="card-left flex-center">
          <view class="category-icon" :class="typeClass(item)">
            <text class="category-icon-text">{{ getCategoryIcon(item) }}</text>
          </view>
        </view>
        <view class="card-center flex-between" style="flex:1;padding-left:20rpx;">
          <view class="card-info">
            <view class="flex-between" style="width:100%">
              <text class="card-category">{{ getCategoryName(item) }}</text>
              <text class="card-amount" :class="typeClass(item)">{{ amountText(item) }}</text>
            </view>
            <text class="card-remark" v-if="item.remark">{{ item.remark }}</text>
            <text class="card-extra" v-if="item.fromAccount || item.toAccount">
              {{ item.fromAccount || '' }} ⇄ {{ item.toAccount || '' }}
            </text>
          </view>
        </view>
        <text class="card-date">{{ item.date }}</text>
      </view>

      <view class="empty-state" v-if="accounts.length === 0">
        <text class="empty-icon">◇</text>
        <text class="empty-text">暂无账目记录</text>
        <text class="empty-hint">点击下方按钮开始记账吧</text>
      </view>
    </view>

    <view class="fab-btn" @tap="goAdd">
      <text class="fab-icon">+</text>
    </view>

    <!-- 登录状态提示 -->
    <view class="login-hint-bar" v-if="!isLoggedIn">
      <text class="login-hint-text">未登录，添加账目需先登录</text>
      <text class="login-link" @tap="goLogin">去登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '../../utils/request'
import dayjs from 'dayjs'
import MonthPicker from '@/components/MonthPicker.vue'

const accounts = ref([])
const currentMonth = ref(dayjs().format('YYYY-MM'))
const activeType = ref(0)
const tabs = ref(['全部', '收入', '支出', '转账'])
const isLoggedIn = ref(false)

const monthIncome = ref('0.00')
const monthExpense = ref('0.00')
const balance = ref('0.00')

function getCategoryName(item) {
  if (item.type === 3) return '转账'
  return item.category || '未分类'
}

function getCategoryIcon(item) {
  if (item.type === 1) return '▲'
  if (item.type === 2) return '▼'
  return '⇄'
}

function typeClass(item) {
  if (item.type === 1) return 'type-income'
  if (item.type === 2) return 'type-expense'
  return 'type-transfer'
}

function amountText(item) {
  if (item.type === 1) return '+ ' + item.amount
  if (item.type === 2) return '- ' + item.amount
  return item.amount
}

const balanceClass = computed(() => {
  const b = parseFloat(balance.value)
  if (b > 0) return 'text-success'
  if (b < 0) return 'text-danger'
  return ''
})

async function loadAccounts() {
  try {
    const params = { month: currentMonth.value }
    if (activeType.value > 0) params.type = activeType.value
    const res = await request('/account/list', 'GET', params)
    const list = res.data || []
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
    accounts.value = []
  }
}

function onMonthChange(month) {
  currentMonth.value = month
  loadAccounts()
}

function filterType(index) {
  activeType.value = index
  loadAccounts()
}

function goDetail(item) {
  uni.navigateTo({ url: '/pages/detail/index?id=' + item.id })
}

function goAdd() {
  uni.navigateTo({ url: '/pages/add/index' })
}

function goLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}

onShow(() => {
  isLoggedIn.value = !!uni.getStorageSync('token')
  loadAccounts()
})
</script>

<style scoped>
.container { padding: 0; padding-bottom: 240rpx; min-height: 100vh; background: #F8FAFC; }
.header-card {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border-radius: 0 0 32rpx 32rpx;
  padding: 160rpx 32rpx 32rpx;
  margin-bottom: 0;
  box-shadow: 0 8rpx 32rpx rgba(99, 102, 241, 0.25);
}
.header-top { display: flex; justify-content: center; margin-bottom: 28rpx; }
.summary-grid {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.15);
  border-radius: 20rpx; padding: 24rpx 0;
  backdrop-filter: blur(8rpx);
}
.summary-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.summary-label { font-size: 22rpx; color: rgba(255,255,255,0.75); margin-bottom: 8rpx; }
.summary-value { font-size: 36rpx; font-weight: 700; color: #fff; }
.summary-value.income { color: #86EFAC; }
.summary-value.expense { color: #FCA5A5; }
.summary-divider { width: 1rpx; height: 60rpx; background: rgba(255,255,255,0.15); }
.tabs-card { margin-top: 24rpx; padding: 12rpx 16rpx; }
.tabs-list { display: flex; gap: 12rpx; }
.tab-item {
  flex: 1; text-align: center;
  padding: 14rpx 0; border-radius: 12rpx;
  background: #F1F5F9;
  font-size: 26rpx; color: #64748B;
  transition: all 0.2s;
}
.tab-item.active {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  color: #fff; font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.3);
}
.list-container { padding: 24rpx 24rpx 0; }
.account-card {
  display: flex; align-items: center;
  padding: 24rpx; margin-bottom: 16rpx;
  transition: transform 0.15s;
}
.account-card:active { transform: scale(0.98); }
.category-icon {
  width: 72rpx; height: 72rpx;
  border-radius: 20rpx;
  display: flex; align-items: center; justify-content: center;
}
.category-icon.type-income { background: #ECFDF5; }
.category-icon.type-expense { background: #FEF2F2; }
.category-icon.type-transfer { background: #EFF6FF; }
.category-icon-text { font-size: 32rpx; font-weight: bold; }
.category-icon.type-income .category-icon-text { color: #10B981; }
.category-icon.type-expense .category-icon-text { color: #EF4444; }
.category-icon.type-transfer .category-icon-text { color: #3B82F6; }
.card-category { font-size: 28rpx; font-weight: 600; color: #1E293B; }
.card-remark { font-size: 24rpx; color: #94A3B8; margin-top: 6rpx; }
.card-extra { font-size: 22rpx; color: #CBD5E1; margin-top: 4rpx; }
.card-amount { font-size: 32rpx; font-weight: 700; }
.card-amount.type-income { color: #10B981; }
.card-amount.type-expense { color: #EF4444; }
.card-amount.type-transfer { color: #3B82F6; }
.card-date { font-size: 22rpx; color: #94A3B8; white-space: nowrap; margin-left: 16rpx; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }
.empty-icon { font-size: 80rpx; color: #CBD5E1; margin-bottom: 24rpx; }
.empty-text { font-size: 28rpx; color: #94A3B8; margin-bottom: 8rpx; }
.empty-hint { font-size: 24rpx; color: #CBD5E1; }
.fab-btn {
  position: fixed; right: 40rpx; bottom: 180rpx;
  width: 108rpx; height: 108rpx; border-radius: 50%;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  box-shadow: 0 8rpx 28rpx rgba(99, 102, 241, 0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; transition: transform 0.2s;
}
.fab-btn:active { transform: scale(0.9); }
.fab-icon { font-size: 56rpx; color: #fff; font-weight: 300; line-height: 1; }
.login-hint-bar {
  position: fixed;
  bottom: 100rpx;
  left: 40rpx;
  right: 180rpx;
  background: #FFF7ED;
  border: 1rpx solid #FED7AA;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
}
.login-hint-text { font-size: 24rpx; color: #C2410C; }
.login-link { font-size: 24rpx; color: #6366F1; font-weight: 600; }
</style>
