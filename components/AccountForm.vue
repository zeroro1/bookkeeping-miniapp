<template>
  <view class="account-form">
    <view class="type-selector card">
      <view v-for="(type, i) in typeOptions" :key="i" class="type-item" :class="{ active: formData.type === type.value }" @tap="selectType(type.value)">
        <view class="type-icon-wrap" :class="[type.cls, { active: formData.type === type.value }]">
          <text class="type-icon">{{ type.icon }}</text>
        </view>
        <text class="type-label">{{ type.label }}</text>
      </view>
    </view>
    <view class="amount-section card">
      <text class="amount-symbol">&yen;</text>
      <input class="amount-input" type="digit" placeholder="0.00" :value="formData.amount" @input="onAmountInput" placeholder-class="amount-placeholder" />
    </view>
    <view class="form-row card">
      <view class="form-row-left">
        <text class="form-icon">&#9776;</text>
        <text class="form-label">日期</text>
      </view>
      <picker mode="date" :value="formData.date" @change="onDateChange">
        <view class="picker-value">{{ formData.date || '' }}</view>
      </picker>
    </view>
    <view class="form-row card" v-if="showCategory">
      <view class="form-row-left">
        <text class="form-icon">&#9776;</text>
        <text class="form-label">分类</text>
      </view>
      <picker mode="selector" :range="categories" :value="categoryIndex" @change="onCategoryChange">
        <view class="picker-value">{{ formData.category || '' }}</view>
      </picker>
    </view>
    <view class="card" v-if="formData.type === 3">
      <view class="form-row-inner">
        <text class="form-label">转出账户</text>
        <input class="form-input" placeholder="如：微信" :value="formData.fromAccount" @input="onFromAccountInput" />
      </view>
      <view class="form-row-inner" style="margin-top:28rpx;">
        <text class="form-label">转入账户</text>
        <input class="form-input" placeholder="如：支付宝" :value="formData.toAccount" @input="onToAccountInput" />
      </view>
    </view>
    <view class="form-row remark-row card">
      <view class="form-row-left">
        <text class="form-icon">&#9998;</text>
        <text class="form-label">备注</text>
      </view>
      <textarea class="remark-input" placeholder="添加备注..." :value="formData.remark" @input="onRemarkInput" maxlength="200" :auto-height="false" style="height:120rpx;" />
    </view>
  </view>
</template>
<script setup>
const props = defineProps({
  formData: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  categoryIndex: { type: Number, default: -1 },
  showCategory: { type: Boolean, default: true }
})
const emit = defineEmits(['selectType', 'amountInput', 'dateChange', 'categoryChange', 'fromAccountInput', 'toAccountInput', 'remarkInput'])
const typeOptions = [
  { value: 1, label: '收入', icon: '\u25B2', cls: 'income' },
  { value: 2, label: '支出', icon: '\u25BC', cls: 'expense' },
  { value: 3, label: '转账', icon: '\u21C4', cls: 'transfer' }
]
function selectType(type) { emit('selectType', type) }
function onAmountInput(e) { emit('amountInput', e) }
function onDateChange(e) { emit('dateChange', e) }
function onCategoryChange(e) { emit('categoryChange', e) }
function onFromAccountInput(e) { emit('fromAccountInput', e) }
function onToAccountInput(e) { emit('toAccountInput', e) }
function onRemarkInput(e) { emit('remarkInput', e) }
</script>
<style scoped>
.account-form { padding-bottom: 20rpx; }
.type-selector { display: flex; justify-content: space-around; padding: 28rpx 20rpx; margin-bottom: 16rpx; }
.type-item { display: flex; flex-direction: column; align-items: center; padding: 12rpx 16rpx; border-radius: 16rpx; min-width: 80rpx; }
.type-icon-wrap { width: 88rpx; height: 88rpx; border-radius: 28rpx; display: flex; align-items: center; justify-content: center; background: #F1F5F9; margin-bottom: 12rpx; transition: all 0.2s; }
.type-icon { font-size: 40rpx; font-weight: bold; color: #94A3B8; }
.type-label { font-size: 24rpx; color: #64748B; font-weight: 500; }
.type-item.active .type-icon-wrap { box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1); }
.type-item.active .income .type-icon-wrap { background: linear-gradient(135deg, #10B981, #059669); }
.type-item.active .expense .type-icon-wrap { background: linear-gradient(135deg, #EF4444, #DC2626); }
.type-item.active .transfer .type-icon-wrap { background: linear-gradient(135deg, #3B82F6, #2563EB); }
.type-item.active .type-icon { color: #fff; }
.type-item.active .type-label { color: #1E293B; font-weight: 600; }
.amount-section { display: flex; align-items: center; justify-content: center; margin-bottom: 16rpx; min-height: 120rpx; }
.amount-symbol { font-size: 36rpx; font-weight: 700; color: #1E293B; margin-right: 12rpx; }
.amount-input { font-size: 80rpx; font-weight: 700; color: #1E293B; text-align: center; flex: 1; min-height: 100rpx;}
.amount-placeholder { color: #CBD5E1; font-size: 80rpx; font-weight: 700; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 24rpx 28rpx; margin-bottom: 16rpx; }
.form-row-left { display: flex; align-items: center; flex-shrink: 0; width: 140rpx; }
.form-icon { font-size: 32rpx; margin-right: 16rpx; color: #94A3B8; }
.form-label { font-size: 28rpx; color: #64748B; font-weight: 500; margin-right: 20rpx; white-space: nowrap; }
.picker-value { font-size: 28rpx; color: #1E293B; }
.form-row-inner { padding: 0 28rpx; margin-bottom: 16rpx; }
.form-input { font-size: 28rpx; color: #1E293B; padding: 16rpx 0; border-bottom: 1rpx solid #E2E8F0; flex: 1; }

/* 备注行：label 在上，输入框在下 */
.remark-row {
  flex-direction: column;
  align-items: stretch;
  gap: 16rpx;
  padding: 24rpx 28rpx;
}
.remark-row .form-row-left {
  margin-bottom: 4rpx;
}
.remark-input {
  font-size: 28rpx;
  color: #1E293B;
  width: 100%;
  padding: 16rpx 0;
  min-height: 120rpx;
}
</style>