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

## AI答题页架构（逐题分页）
- **分页核心**：`js/quiz.js` 中 `buildQuestionList()` 遍历 DOM 可见字段构建题目列表，`showQuestion(idx)` 控制单题显示
- **题目容器**：所有 quiz-field 包裹在 `#quizQuestionsArea`，JS 通过 `style.display` 控制显隐
- **自动跳转**：单选题选择后 350ms 自动 `autoAdvanceNext()`；填空/多选题需手动点「下一题」
- **条件题目**：品种=其他 → q2Field；模式=多宠 → q10Field（猫/狗各有对应字段）
- **导航栏**：`#quizNav` 含 prev/next 按钮 + 题目指示器；仅当 total>1 时显示
- **提交按钮**：`#quizSubmitWrap` 初始 hidden，仅在最后一题答完后显示
- **动画**：`.quiz-questions-area .quiz-field` 使用 `quizFadeSlideIn` 入场动画
- **宠物类型**：大图标卡片式选择（`.quiz-radio-pet`），52px emoji，水平排列
- **选项布局**：普通题目选项垂直排列（`flex-direction: column`），一行一个
- **标题样式**：`.quiz-page-title` 使用渐变橙色文字（background-clip: text）
