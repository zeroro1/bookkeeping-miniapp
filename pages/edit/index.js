const { post, put, del } = require('../../utils/request')
const { EXPENSE_CATEGORIES, INCOME_CATEGORIES } = require('../../utils/constant')

Page({
  data: {
    isEdit: false,
    editId: null,
    formData: {
      type: null,
      amount: '',
      date: '',
      category: '',
      fromAccount: '',
      toAccount: '',
      remark: ''
    },
    categories: [],
    categoryIndex: -1
  },

  onLoad(options) {
    // 设置默认日期
    const today = new Date()
    const dateStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0')
    this.setData({ 'formData.date': dateStr })

    // 编辑模式
    if (options.id) {
      this.setData({ isEdit: true, editId: options.id })
      this.loadAccountDetail(options.id)
    }
  },

  // 加载账目详情
  loadAccountDetail(id) {
    const userId = wx.getStorageSync('userId')
    wx.showLoading({ title: '加载中...' })
    wx.request({
      url: 'http://localhost:8080/api/account/' + id,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          const item = res.data.data
          this.setData({
            'formData': {
              type: item.type,
              amount: String(item.amount),
              date: item.date,
              category: item.category,
              fromAccount: item.fromAccount,
              toAccount: item.toAccount,
              remark: item.remark
            }
          })
          this.updateCategories(item.type)
        }
      }
    })
  },

  // 选择类型
  selectType(e) {
    const type = parseInt(e.currentTarget.dataset.type)
    const formData = { ...this.data.formData, type }
    this.setData({ formData })
    this.updateCategories(type)
  },

  // 更新分类列表
  updateCategories(type) {
    const cats = type === 1 ? INCOME_CATEGORIES :
                 type === 2 ? EXPENSE_CATEGORIES : []
    this.setData({ categories: cats, categoryIndex: -1 })
  },

  // 金额输入
  onAmountInput(e) {
    this.setData({ 'formData.amount': e.detail.value })
  },

  // 日期选择
  onDateChange(e) {
    this.setData({ 'formData.date': e.detail.value })
  },

  // 分类选择
  onCategoryChange(e) {
    const idx = parseInt(e.detail.value)
    this.setData({
      categoryIndex: idx,
      'formData.category': this.data.categories[idx] || ''
    })
  },

  // 转出账户
  onFromAccountInput(e) {
    this.setData({ 'formData.fromAccount': e.detail.value })
  },

  // 转入账户
  onToAccountInput(e) {
    this.setData({ 'formData.toAccount': e.detail.value })
  },

  // 备注
  onRemarkInput(e) {
    this.setData({ 'formData.remark': e.detail.value })
  },

  // 提交
  handleSubmit() {
    const { formData, isEdit, editId } = this.data

    if (!formData.type) {
      return wx.showToast({ title: '请选择类型', icon: 'none' })
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return wx.showToast({ title: '请输入有效金额', icon: 'none' })
    }

    const userId = wx.getStorageSync('userId')
    const data = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount,
      remark: formData.remark
    }

    wx.showLoading({ title: isEdit ? '保存中...' : '添加中...' })
    const requestFn = isEdit ?
      () => wx.request({
        url: 'http://localhost:8080/api/account/' + editId,
        method: 'PUT',
        header: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data: data
      }) :
      () => wx.request({
        url: 'http://localhost:8080/api/account',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data: data
      })

    requestFn().then(res => {
      wx.hideLoading()
      if (res.data.code === 200) {
        wx.showToast({ title: isEdit ? '保存成功' : '添加成功' })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({ title: res.data.message || '操作失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '请求失败', icon: 'none' })
    })
  },

  // 删除
  handleDelete() {
    const { editId } = this.data
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条账目吗？',
      success: (res) => {
        if (res.confirm) {
          const userId = wx.getStorageSync('userId')
          wx.request({
            url: 'http://localhost:8080/api/account/' + editId,
            method: 'DELETE',
            header: {
              'X-User-Id': userId,
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            success: (resp) => {
              if (resp.data.code === 200) {
                wx.showToast({ title: '删除成功' })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
              }
            }
          })
        }
      }
    })
  }
})
