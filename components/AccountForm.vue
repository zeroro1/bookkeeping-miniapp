<template>
  <view class="account-form">
    <view class="type-selector card">
      <view
        v-for="(type, i) in typeOptions"
        :key="i"
        class="type-item"
        :class="{ active: formData.type === type.value, [type.cls]: formData.type === type.value }"
        @tap="selectType(type.value)"
      >
        <text class="type-icon" :class="[type.cls + '-icon']">{{ type.icon }}</text>
        <text>{{ type.label }}</text>
      </view>
    </view>
    <view class="amount-section card">
      <text class="amount-symbol">¥</text>
      <input class="amount-input" type="digit" placeholder="输入金额" :value="formData.amount" @input="onAmountInput" />
    </view>
    <view class="form-item card">
      <text class="form-label">日期</text>
      <picker mode="date" :value="formData.date" @change="onDateChange">
        <view class="picker-value">{{ formData.date || '选择日期' }}</view>
      </picker>
    </view>
    <view class="form-item card" v-if="showCategory">
      <text class="form-label">分类</text>
      <picker mode="selector" :range="categories" :value="categoryIndex" @change="onCategoryChange">
        <view class="picker-value">{{ formData.category || '选择分类' }}</view>
      </picker>
    </view>
    <view class="account-section card" v-if="formData.type === 3">
      <text class="form-label">转出账户</text>
      <input class="form-input" placeholder="如：微信" :value="formData.fromAccount" @input="$emit('fromAccountInput', $event)" />
      <text class="form-label" style="margin-top: 20rpx;">转入账户</text>
      <input class="form-input" placeholder="如：支付宝" :value="formData.toAccount" @input="$emit('toAccountInput', $event)" />
    </view>
    <view class="form-item card">
      <text class="form-label">备注</text>
      <textarea class="form-textarea" placeholder="添加备注..." :value="formData.remark" @input="$emit('remarkInput', $event)" maxlength="200" />
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
  { value: 1, label: '收入', icon: '💰', cls: 'income' },
  { value: 2, label: '支出', icon: '🛒', cls: 'expense' },
  { value: 3, label: '转账', icon: '⇄', cls: 'transfer' }
]

function selectType(type) { emit('selectType', type) }
function onAmountInput(e) { emit('amountInput', e) }
function onDateChange(e) { emit('dateChange', e) }
function onCategoryChange(e) { emit('categoryChange', e) }
</script>

<style scoped>
.account-form { padding-bottom: 160rpx; }
.type-selector { display: flex; justify-content: space-around; padding: 20rpx; }
.type-item { display: flex; flex-direction: column; align-items: center; padding: 16rpx 24rpx; border-radius: 12rpx; color: #999; font-size: 24rpx; }
.type-item.active { color: #fff; }
.type-item.income.active { background: #52c41a; }
.type-item.expense.active { background: #ff4d4f; }
.type-item.transfer.active { background: #1890ff; }
.type-icon { font-size: 36rpx; margin-bottom: 6rpx; line-height: 1; }
.amount-section { display: flex; align-items: center; justify-content: center; padding: 20rpx 40rpx; }
.amount-symbol { font-size: 36rpx; font-weight: bold; color: #333; margin-right: 8rpx; }
.amount-input { font-size: 44rpx; font-weight: bold; color: #333; text-align: center; flex: 1; }
.form-item, .account-section { padding: 24rpx; }
.form-label { font-size: 26rpx; color: #666; margin-bottom: 12rpx; }
.picker-value { font-size: 30rpx; color: #333; padding: 16rpx 0; }
.form-input { font-size: 30rpx; padding: 16rpx 0; border-bottom: 1rpx solid #eee; }
.form-textarea { font-size: 28rpx; width: 100%; height: 160rpx; padding: 16rpx 0; }
</style>