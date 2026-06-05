# Project Memory — 梵优茗宠

## 技术栈
- 纯前端：HTML + CSS + Vanilla JS（无框架）
- 移动端优先设计，410px 容器模拟手机

## 页面架构
- 5个Tab：首页(homePage)、同城(cityPage)、轻创(creatorPage)、购物车(cartPage)、我的(profilePage)
- 子页面：AI答题(quizPage)、配餐海报(posterPage)、商品详情(detailPage)
- 弹窗/Sheet覆盖层：购买选项、同城详情、合作表单、课程详情、宠物表单、地址表单、订单详情、会员权益、充值、头像选择、售后表单、个人信息编辑

## 组件复用
- 通用Sheet弹窗基础类：`.pet-form-overlay` + `.pet-form-sheet`（底部滑出式）
- 表单控件：`.pet-form-input` / `.pet-form-select` / `.pet-form-textarea`
- 空状态：`.profile-*-empty` 系列

## 设计规范
- 主色 `--primary: #f97316`（橙色系）
- 暖米色背景 `--bg: #f8f4f0`
- 圆角系统：sm(8px) / default(12px) / lg(16px) / xl(20px)
- 弹窗动画：fadeIn + slideUp (cubic-bezier 0.34,1.56,0.64,1)
- Toast提示统一使用 showToast() 函数
