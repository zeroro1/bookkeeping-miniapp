<template>
  <view class="container">
    <AccountForm
      :formData="formData"
      :categories="categories"
      :categoryIndex="categoryIndex"
      :showCategory="showCategory"
      @selectType="selectType"
      @amountInput="onAmountInput"
      @dateChange="onDateChange"
      @categoryChange="onCategoryChange"
      @fromAccountInput="onFromAccountInput"
      @toAccountInput="onToAccountInput"
      @remarkInput="onRemarkInput"
    />
    <view class="bottom-bar">
      <button class="btn btn-danger" @tap="handleDelete">删除</button>
      <button class="btn btn-primary" :class="{ 'btn-disabled': !canSubmit }" @tap="handleSubmit">
        保存
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AccountForm from '@/components/AccountForm.vue'
import { request } from '../../utils/request'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constant'

const isEdit = ref(false)
const editId = ref(null)
const formData = reactive({ type: null, amount: '', date: '', category: '', fromAccount: '', toAccount: '', remark: '' })
const categories = ref([])
const categoryIndex = ref(-1)
const showCategory = computed(() => formData.type !== 3)
const canSubmit = computed(() => formData.type && formData.amount && parseFloat(formData.amount) > 0)

onMounted(async () => {
  const pages = getCurrentPages()
  const query = pages[pages.length - 1].options
  if (query.id) {
    isEdit.value = true
    editId.value = query.id
    await loadAccountDetail(query.id)
  }
})

async function loadAccountDetail(id) {
  uni.showLoading({ title: '加载中..' })
  try {
    const res = await request('/account/' + id, 'GET')
    const item = res.data
    Object.assign(formData, { type: item.type, amount: String(item.amount), date: item.date, category: item.category, fromAccount: item.fromAccount, toAccount: item.toAccount, remark: item.remark })
    updateCategories(item.type)
  } catch (err) { console.error('加载失败', err) }
  finally { uni.hideLoading() }
}

function selectType(type) { formData.type = type; updateCategories(type) }
function updateCategories(type) {
  if (type === 1) categories.value = INCOME_CATEGORIES
  else if (type === 2) categories.value = EXPENSE_CATEGORIES
  else categories.value = []
  categoryIndex.value = -1; formData.category = ''
}
function onAmountInput(e) { formData.amount = e.detail.value }
function onDateChange(e) { formData.date = e.detail.value }
function onCategoryChange(e) { const idx = parseInt(e.detail.value); categoryIndex.value = idx; formData.category = categories.value[idx] || '' }
function onFromAccountInput(e) { formData.fromAccount = e.detail.value }
function onToAccountInput(e) { formData.toAccount = e.detail.value }
function onRemarkInput(e) { formData.remark = e.detail.value }

async function handleSubmit() {
  if (!formData.type) return uni.showToast({ title: '请选择类型', icon: 'none' })
  if (!canSubmit.value) return uni.showToast({ title: '请输入有效金额', icon: 'none' })
  const data = { type: formData.type, amount: parseFloat(formData.amount), date: formData.date, category: formData.category, fromAccount: formData.fromAccount, toAccount: formData.toAccount, remark: formData.remark }
  uni.showLoading({ title: '保存中..' })
  try {
    await request('/account/' + editId.value, 'PUT', data)
    uni.showToast({ title: '保存成功' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch (err) { console.error('提交失败', err) }
  finally { uni.hideLoading() }
}

function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条账目吗？',
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '删除中..' })
        try { await request('/account/' + editId.value, 'DELETE'); uni.showToast({ title: '删除成功' }); setTimeout(() => uni.navigateBack(), 1500) }
        catch (err) { console.error('删除失败', err) }
        finally { uni.hideLoading() }
      }
    }
  })
}
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 20rpx; background: #fff; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05); display: flex; gap: 16rpx; }
.bottom-bar .btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; border: none; }
.btn-primary { background: #1890ff; color: #fff; }
.btn-danger { background: #ff4d4f; color: #fff; }
.btn-disabled { background: #ccc !important; color: #fff !important; }
</style>