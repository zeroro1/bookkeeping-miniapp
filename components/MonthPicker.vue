<template>
  <view class="ym-picker-wrap">
    <!-- 顶部按钮条 -->
    <view class="ym-picker-bar" @tap="togglePanel">
      <view class="ym-picker-nav" @tap.stop="prevMonth">
        <text class="ym-picker-arrow">‹</text>
      </view>
      <view class="ym-picker-center">
        <text class="ym-picker-label">{{ currentText }}</text>
        <text class="ym-picker-chevron">{{ panelOpen ? '▲' : '▼' }}</text>
      </view>
      <view class="ym-picker-nav" @tap.stop="nextMonth">
        <text class="ym-picker-arrow">›</text>
      </view>
    </view>
    <!-- 下拉面板 -->
    <view class="ym-picker-panel" v-if="panelOpen" @tap.stop>
      <!-- 年份滚动选择 -->
      <view class="ym-picker-year-row">
        <view class="ym-picker-year-nav" @tap.stop="prevYear">
          <text class="ym-picker-year-arrow">‹</text>
        </view>
        <text class="ym-picker-year-text">{{ selYear }}年</text>
        <view class="ym-picker-year-nav" @tap.stop="nextYear">
          <text class="ym-picker-year-arrow">›</text>
        </view>
      </view>
      <!-- 月份网格 -->
      <view class="ym-picker-grid">
        <view
          v-for="m in monthList"
          :key="m.val"
          class="ym-picker-cell"
          :class="{ 'ym-picker-cell-active': m.val === selMonth }"
          @tap="selectMonth(m.val)"
        >
          <text class="ym-picker-cell-text">{{ m.label }}</text>
        </view>
      </view>
    </view>
    <!-- 遮罩层 -->
    <view class="ym-picker-mask" v-if="panelOpen" @tap="closePanel" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'change'])

const panelOpen = ref(false)
const now = new Date()
const selYear = ref(now.getFullYear())
const selMonth = ref(now.getMonth() + 1)

const currentText = computed(() => selYear.value + '年' + String(selMonth.value).padStart(2, '0') + '月')

const monthList = computed(() => {
  const items = []
  for (let i = 1; i <= 12; i++) {
    items.push({ val: i, label: String(i).padStart(2, '0') + '月' })
  }
  return items
})

function togglePanel() {
  panelOpen.value = !panelOpen.value
}

function closePanel() {
  panelOpen.value = false
}

function prevMonth() {
  if (selMonth.value === 1) {
    selMonth.value = 12
    selYear.value--
  } else {
    selMonth.value--
  }
  sync()
}

function nextMonth() {
  if (selMonth.value === 12) {
    selMonth.value = 1
    selYear.value++
  } else {
    selMonth.value++
  }
  sync()
}

function prevYear() {
  selYear.value--
  sync()
}

function nextYear() {
  selYear.value++
  sync()
}

function selectMonth(m) {
  selMonth.value = m
  panelOpen.value = false
  sync()
}

function sync() {
  const v = selYear.value + '-' + String(selMonth.value).padStart(2, '0')
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<style scoped>
.ym-picker-wrap {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

/* 顶部按钮条 */
.ym-picker-bar {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10rpx 24rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  backdrop-filter: blur(8rpx);
  transition: background 0.2s;
}
.ym-picker-bar:active {
  background: rgba(255, 255, 255, 0.3);
}

.ym-picker-nav {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.15s;
  flex-shrink: 0;
}
.ym-picker-nav:active {
  background: rgba(255, 255, 255, 0.3);
}
.ym-picker-arrow {
  font-size: 44rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}

.ym-picker-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
}

.ym-picker-label {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}

.ym-picker-chevron {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* 下拉面板 */
.ym-picker-panel {
  position: absolute;
  top: calc(100% + 12rpx);
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 20rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.12);
  width: 400rpx;
  overflow: hidden;
  animation: ymFadeIn 0.2s ease;
}

@keyframes ymFadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-12rpx); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* 年份行 */
.ym-picker-year-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 0 0 16rpx;
  border-bottom: 1rpx solid #F1F5F9;
  margin-bottom: 16rpx;
}

.ym-picker-year-nav {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #F1F5F9;
  transition: background 0.15s;
  flex-shrink: 0;
}
.ym-picker-year-nav:active {
  background: #E2E8F0;
}
.ym-picker-year-arrow {
  font-size: 28rpx;
  color: #64748B;
  font-weight: bold;
  line-height: 1;
}

.ym-picker-year-text {
  font-size: 28rpx;
  color: #1E293B;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

/* 月份网格 */
.ym-picker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.ym-picker-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  border-radius: 16rpx;
  background: #F1F5F9;
  transition: all 0.15s;
}
.ym-picker-cell:active {
  transform: scale(0.95);
}

.ym-picker-cell-text {
  font-size: 24rpx;
  color: #475569;
}

.ym-picker-cell-active {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.3);
}
.ym-picker-cell-active .ym-picker-cell-text {
  color: #fff;
  font-weight: 600;
}

/* 遮罩 */
.ym-picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
}
</style>