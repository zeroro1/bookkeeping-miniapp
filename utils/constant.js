// 账目类型
const TYPE_INCOME = 1   // 收入
const TYPE_EXPENSE = 2  // 支出
const TYPE_TRANSFER = 3 // 转账

const TYPE_MAP = {
  1: { label: '收入', color: '#52c41a' },
  2: { label: '支出', color: '#ff4d4f' },
  3: { label: '转账', color: '#1890ff' }
}

// 常用分类
const EXPENSE_CATEGORIES = ['餐饮', '交通', '购物', '住房', '娱乐', '医疗', '教育', '其他']
const INCOME_CATEGORIES = ['工资', '奖金', '兼职', '理财', '其他']

module.exports = {
  TYPE_INCOME,
  TYPE_EXPENSE,
  TYPE_TRANSFER,
  TYPE_MAP,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES
}
