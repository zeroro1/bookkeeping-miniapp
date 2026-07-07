const { get, del } = require('../../utils/request')
const dayjs = require('dayjs')

Page({
  data: {
    accounts: [],
    currentMonth: '',
    monthIncome: 0,
    monthExpense: 0,
    balance: 0,
    activeType: 0
  },

  onLoad() {
    this.loadMonth()
    this.loadAccounts()
  },

  // 加载当前月份
  loadMonth() {
    const now = dayjs()
    this.setData({
      currentMonth: now.format('YYYY-MM')
    })
  },

  // 加载账目列表
  loadAccounts() {
    const userId = wx.getStorageSync('userId')
    if (!userId) return

    const { activeType, currentMonth } = this.data
    const params = { month: currentMonth }
    if (activeType > 0) params.type = activeType

    get('/account/list?userId=' + userId, params)
      .then(res => {
        const accounts = res.data || []
        // 计算月度统计
        let income = 0, expense = 0
        accounts.forEach(a => {
          if (a.type === 1) income += parseFloat(a.amount)
          if (a.type === 2) expense += parseFloat(a.amount)
        })
        this.setData({
          accounts,
          monthIncome: income.toFixed(2),
          monthExpense: expense.toFixed(2),
          balance: (income - expense).toFixed(2)
        })
      })
      .catch(err => {
        console.error('加载失败', err)
      })
  },

  // 切换月份
  changeMonth(e) {
    const dir = e.currentTarget.dataset.dir
    const now = dayjs(this.data.currentMonth)
    let newMonth
    if (dir === 'prev') {
      newMonth = now.subtract(1, 'month').format('YYYY-MM')
    } else {
      newMonth = now.add(1, 'month').format('YYYY-MM')
    }
    this.setData({ currentMonth: newMonth }, () => {
      this.loadAccounts()
    })
  },

  // 筛选类型
  filterType(e) {
    const type = parseInt(e.currentTarget.dataset.type)
    this.setData({ activeType: type }, () => {
      this.loadAccounts()
    })
  },

  // 去添加页
  goAdd() {
    wx.navigateTo({ url: '/pages/edit/index' })
  },

  // 去编辑页
  goEdit(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({ url: '/pages/edit/index?id=' + item.id })
  }
})
