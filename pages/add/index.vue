<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">添加明细</text>
    </view>
    <AccountForm
      :formData="formData" :categories="categories" :categoryIndex="categoryIndex"
      :showCategory="showCategory"
      @selectType="selectType" @amountInput="onAmountInput" @dateChange="onDateChange"
      @categoryChange="onCategoryChange" @fromAccountInput="onFromAccountInput"
      @toAccountInput="onToAccountInput" @remarkInput="onRemarkInput"
    />
    <view class="bottom-bar">
      <button class="submit-btn" @tap="handleSubmit">确认添加</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AccountForm from '@/components/AccountForm.vue'
import { request } from '../../utils/request'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constant'

const formData = reactive({ type: null, amount: '', date: '', category: '', fromAccount: '', toAccount: '', remark: '' })
const categories = ref([])
const categoryIndex = ref(-1)
const showCategory = computed(() => formData.type !== 3)

const today = new Date()
formData.date = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0')

function selectType(type) { formData.type = type; updateCategories(type) }
function updateCategories(type) {
  if (type === 1) categories.value = INCOME_CATEGORIES
  else if (type === 2) categories.value = EXPENSE_CATEGORIES
  else categories.value = []
  categoryIndex.value = -1
  formData.category = ''
}
function onAmountInput(e) { formData.amount = e.detail.value }
function onDateChange(e) { formData.date = e.detail.value }
function onCategoryChange(e) {
  const idx = parseInt(e.detail.value)
  categoryIndex.value = idx
  formData.category = categories.value[idx] || ''
}
function onFromAccountInput(e) { formData.fromAccount = e.detail.value }
function onToAccountInput(e) { formData.toAccount = e.detail.value }
function onRemarkInput(e) { formData.remark = e.detail.value }

// 登录流程
async function doLogin() {
  return new Promise(async (resolve, reject) => {
    try {
      uni.showLoading({ title: '登录中...' })
      const loginRes = await new Promise((res, rej) => {
        uni.login({ provider: 'weixin', success: res, fail: rej })
      })
      const authRes = await request('/auth/login', 'POST', { code: loginRes.code })
      uni.setStorageSync('token', authRes.data.token)
      uni.setStorageSync('userId', authRes.data.userId)
      uni.setStorageSync('openid', authRes.data.openid)
      uni.hideLoading()
      resolve()
    } catch (err) {
      uni.hideLoading()
      reject(err)
    }
  })
}

async function handleSubmit() {
  if (!formData.type) return uni.showToast({ title: '请选择类型', icon: 'none' })
  if (!formData.amount || parseFloat(formData.amount) <= 0) return uni.showToast({ title: '请输入有效金额', icon: 'none' })

  const userId = uni.getStorageSync('userId')
  if (!userId) {
    // 未登录，先登录
    try {
      await doLogin()
    } catch (err) {
      return uni.showToast({ title: '登录失败，请重试', icon: 'none' })
    }
  }

  const data = {
    type: formData.type,
    amount: parseFloat(formData.amount),
    date: formData.date,
    category: formData.category,
    fromAccount: formData.fromAccount,
    toAccount: formData.toAccount,
    remark: formData.remark
  }

  uni.showLoading({ title: '添加中...' })
  try {
    await request('/account', 'POST', data)
    uni.hideLoading()
    uni.showToast({ title: '添加成功' })
    // 延迟返回，让用户看到成功提示
    setTimeout(() => uni.navigateBack(), 1500)
  } catch (err) {
    uni.hideLoading()
    console.error('提交失败', err)
    uni.showToast({ title: '添加失败', icon: 'none' })
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: #F8FAFC; }
.page-header {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  padding: 32rpx 32rpx 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.2);
}
.page-title { font-size: 34rpx; font-weight: 700; color: #fff; letter-spacing: 2rpx; }
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 24rpx 32rpx; background: #fff;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.04);
  z-index: 10;
}
.submit-btn {
  width: 100%; height: 96rpx; border-radius: 48rpx;
  font-size: 32rpx; font-weight: 600;
  border: none; color: #fff;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.3);
}
.submit-btn:active { opacity: 0.85; }
</style>
