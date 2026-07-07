# 微信小程序记账应用 - 前端

## 技术栈
- uni-app (Vue 3 Composition API)
- 微信小程序

## 环境准备
1. 安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 安装微信开发者工具
3. 修改 utils/request.js 中的 BASE_URL 为你的后端地址

## 运行
1. 用 HBuilderX 打开本项目
2. 运行 -> 运行到小程序模拟器 -> 微信开发者工具
3. 在微信开发者工具中预览

## 功能
- 微信登录（支持测试模式）
- 记账（收入/支出/转账）
- 账目列表（按月筛选、分类筛选、月度统计）
- 编辑/删除账目

## 项目结构
`
bookkeeping-miniapp/
├── App.vue                    # 应用根组件
├── main.js                    # 入口文件
├── pages.json                 # 页面配置
├── manifest.json              # 应用配置
├── uni.scss                   # 全局样式变量
├── pages/
│   ├── login/index.vue        # 登录页
│   ├── index/index.vue        # 主页（账目列表）
│   └── edit/index.vue         # 新增/编辑页
├── static/                    # 静态资源
└── utils/
    ├── request.js             # HTTP 请求封装
    └── constant.js            # 常量定义
`

## 注意事项
- 使用 Vue 3 Composition API (<script setup>)
- 使用 uni-app 的 uni.xxx API 替代微信小程序原生 API
- 样式使用 rpx 单位适配不同屏幕
