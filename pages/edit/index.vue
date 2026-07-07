<template>
  <view class="container">
    <!-- 类型选择 -->
    <view class="type-selector card">
      <view
        v-for="(type, i) in typeOptions"
        :key="i"
        class="type-item"
        :class="{ active: formData.type === type.value, [type.cls]: formData.type === type.value }"
        @tap="selectType(type.value)"
      >
        <text class="type-icon">{{ type.icon }}</text>
        <text>{{ type.label }}</text>
      </view>
    </view>

    <!-- 金额输入 -->
    <view class="amount-section card">
      <text class="amount-symbol">¥</text>
      <input
        class="amount-input"
        type="digit"
        placeholder="请输入金额"
        :value="formData.amount"
        @input="onAmountInput"
      />
    </view>

    <!-- 日期 -->
    <view class="form-item card">
      <text class="form-label">日期</text>
      <picker mode="date" :value="formData.date" @change="onDateChange">
        <view class="picker-value">{{ formData.date || '选择日期' }}</view>
      </picker>
    </view>

    <!-- 分类 -->
    <view class="form-item card" v-if="showCategory">
      <text class="form-label">分类</text>
      <picker mode="selector" :range="categories" :value="categoryIndex" @change="onCategoryChange">
        <view class="picker-value">{{ formData.category || '选择分类' }}</view>
      </picker>
    </view>

    <!-- 账户（转账时显示） -->
    <view class="account-section card" v-if="formData.type === 3">
      <text class="form-label">转出账户</text>
      <input class="form-input" placeholder="如：微信" :value="formData.fromAccount" @input="onFromAccountInput" />
      <text class="form-label" style="margin-top: 20rpx;">转入账户</text>
      <input class="form-input" placeholder="如：支付宝" :value="formData.toAccount" @input="onToAccountInput" />
    </view>

    <!-- 备注 -->
    <view class="form-item card">
      <text class="form-label">备注</text>
      <textarea
        class="form-textarea"
        placeholder="添加备注..."
        :value="formData.remark"
        @input="onRemarkInput"
        maxlength="200"
      />
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button class="btn btn-danger" v-if="isEdit" @tap="handleDelete">删除</button>
      <button
        class="btn btn-primary"
        :class="{ 'btn-disabled': !canSubmit }"
        @tap="handleSubmit"
      >
        {{ isEdit ? '保存' : '添加' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { request } from '../../utils/request'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constant'

const isEdit = ref(false)
const editId = ref(null)
const loading = ref(false)

const formData = reactive({
  type: null,
  amount: '',
  date: '',
  category: '',
  fromAccount: '',
  toAccount: '',
  remark: ''
})

const categories = ref([])
const categoryIndex = ref(-1)

const typeOptions = [
  { value: 1, label: '收入', icon: '↑', cls: 'income' },
  { value: 2, label: '支出', icon: '↓', cls: 'expense' },
  { value: 3, label: '转账', icon: '⇄', cls: 'transfer' }
]

const showCategory = computed(() => formData.type !== 3)
const canSubmit = computed(() => formData.type && formData.amount && parseFloat(formData.amount) > 0)

// 加载默认日期
const today = new Date()
formData.date = today.getFullYear() + '-' +
  String(today.getMonth() + 1).padStart(2, '0') + '-' +
  String(today.getDate()).padStart(2, '0')

onMounted(async () => {
  const query = getCurrentPages()[getCurrentPages().length - 1].options
  if (query.id) {
    isEdit.value = true
    editId.value = query.id
    await loadAccountDetail(query.id)
  }
})

async function loadAccountDetail(id) {
  uni.showLoading({ title: '加载中...' })
  try {
    const res = await request('/account/' + id, 'GET')
    const item = res.data
    Object.assign(formData, {
      type: item.type,
      amount: String(item.amount),
      date: item.date,
      category: item.category,
      fromAccount: item.fromAccount,
      toAccount: item.toAccount,
      remark: item.remark
    })
    updateCategories(item.type)
  } catch (err) {
    console.error('加载失败', err)
  } finally {
    uni.hideLoading()
  }
}

function selectType(type) {
  formData.type = type
  updateCategories(type)
}

function updateCategories(type) {
  if (type === 1) {
    categories.value = INCOME_CATEGORIES
  } else if (type === 2) {
    categories.value = EXPENSE_CATEGORIES
  } else {
    categories.value = []
  }
  categoryIndex.value = -1
  formData.category = ''
}

function onAmountInput(e) {
  formData.amount = e.detail.value
}

function onDateChange(e) {
  formData.date = e.detail.value
}

function onCategoryChange(e) {
  const idx = parseInt(e.detail.value)
  categoryIndex.value = idx
  formData.category = categories.value[idx] || ''
}

function onFromAccountInput(e) {
  formData.fromAccount = e.detail.value
}

function onToAccountInput(e) {
  formData.toAccount = e.detail.value
}

function onRemarkInput(e) {
  formData.remark = e.detail.value
}

async function handleSubmit() {
  if (!formData.type) {
    return uni.showToast({ title: '请选择类型', icon: 'none' })
  }
  if (!canSubmit.value) {
    return uni.showToast({ title: '请输入有效金额', icon: 'none' })
  }

  const userId = uni.getStorageSync('userId')
  const data = {
    type: formData.type,
    amount: parseFloat(formData.amount),
    date: formData.date,
    category: formData.category,
    fromAccount: formData.fromAccount,
    toAccount: formData.toAccount,
    remark: formData.remark
  }

  uni.showLoading({ title: isEdit.value ? '保存中...' : '添加中...' })
  try {
    if (isEdit.value) {
      await request('/account/' + editId.value, 'PUT', data)
      uni.showToast({ title: '保存成功' })
    } else {
      await request('/account', 'POST', data)
      uni.showToast({ title: '添加成功' })
    }
    setTimeout(() => uni.navigateBack(), 1500)
  } catch (err) {
    console.error('提交失败', err)
  } finally {
    uni.hideLoading()
  }
}

function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条账目吗？',
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '删除中...' })
        try {
          await request('/account/' + editId.value, 'DELETE')
          uni.showToast({ title: '删除成功' })
          setTimeout(() => uni.navigateBack(), 1500)
        } catch (err) {
          console.error('删除失败', err)
        } finally {
          uni.hideLoading()
        }
      }
    }
  })
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 160rpx;
  min-height: 100vh;
  background: #f5f5f5;
}

.type-selector {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 30rpx;
  border-radius: 12rpx;
  color: #999;
  font-size: 26rpx;
}

.type-item.active {
  color: #fff;
}

.type-item.income.active { background: #52c41a; }
.type-item.expense.active { background: #ff4d4f; }
.type-item.transfer.active { background: #1890ff; }

.type-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.amount-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.amount-symbol {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-right: 10rpx;
}

.amount-input {
  font-size: 64rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex: 1;
}

.form-item, .account-section {
  padding: 24rpx;
}

.form-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.picker-value {
  font-size: 30rpx;
  color: #333;
  padding: 16rpx 0;
}

.form-input {
  font-size: 30rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eee;
}

.form-textarea {
  font-size: 28rpx;
  width: 100%;
  height: 160rpx;
  padding: 16rpx 0;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.bottom-bar .btn {
  flex: 1;
  height: 88rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  border: none;
}

.btn-disabled {
  background: #ccc !important;
  color: #fff !important;
}
</style>
