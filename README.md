# 微信小程序记账应用 - 前端

## 技术栈
- uni-app (Vue 2/3 语法)
- 微信小程序

## 环境准备
1. 安装 HBuilderX
2. 导入项目文件夹 ookkeeping-miniapp
3. 修改 utils/request.js 中的 BASE_URL 为你的后端地址

## 运行
1. 用 HBuilderX 打开项目
2. 运行 -> 运行到小程序模拟器 -> 微信开发者工具
3. 在微信开发者工具中预览

## 功能
- 微信登录（支持测试模式）
- 记账（收入/支出/转账）
- 账目列表（按月筛选、分类筛选）
- 编辑/删除账目
- 月度统计

## 项目结构
`
bookkeeping-miniapp/
├── pages/
│   ├── login/      # 登录页
│   ├── index/      # 主页（账目列表）
│   └── edit/       # 编辑/新增页
├── utils/
│   ├── request.js  # HTTP 请求封装
│   └── constant.js # 常量定义
├── app.js
├── app.json
├── app.wxss
├── pages.json
└── manifest.json
`
