/* ========================================
   commission.js — 分佣系统逻辑
   ======================================== */

// ==================== 分佣配置 ====================
const COMMISSION_CONFIG = {
  tiers: {
    梵优合伙人: {
      level: 1,
      name: '梵优合伙人',
      icon: '🌟',
      rates: [9],
      rateLabels: ['直属用户消费返佣 9%'],
      upgradeTo: '梵优主理人',
      upgradeCondition: '邀请20人 / 团队业绩 ¥5,000',
      color: 'orange',
    },
    梵优主理人: {
      level: 2,
      name: '梵优主理人',
      icon: '👑',
      rates: [6, 9],
      rateLabels: ['一级返佣 6%', '二级返佣 9%'],
      upgradeTo: '分公司',
      upgradeCondition: '邀请100人 / 团队业绩 ¥30,000',
      color: 'gold',
    },
    // 分公司: {
    //   level: 3,
    //   name: '分公司',
    //   icon: '💎',
    //   rates: [3, 6, 9],
    //   rateLabels: ['一级返佣 3%', '二级返佣 6%', '三级返佣 9%'],
    //   upgradeTo: null,
    //   upgradeCondition: null,
    //   color: 'diamond',
    // },
  },
  minWithdraw: 10,
  maxWithdraw: 50000,
  withdrawMethods: ['微信零钱', '银行卡'],
};

// ==================== 用户分佣数据 ====================
let commissionData = {
  totalEarned: 1580.5, // 累计收益
  pendingAmount: 243.0, // 待结算
  availableBalance: 1250.5, // 可提现余额
  inviteCount: 35, // 邀请总人数
  activeInviteCount: 28, // 活跃邀请人数
  totalViews: 992, // 总浏览量
  thisMonthEarned: 328.5, // 本月收益
};

// ==================== 收益明细 ====================
let commissionLog = [
  {
    id: 'c001',
    type: 'order',
    title: '直属用户消费返佣',
    fromUser: '小王',
    amount: 45.6,
    time: '2026-06-06 14:32',
    status: 'settled',
    level: 1,
    orderAmount: 507,
    rate: 9,
    items: [
      { name: '宠物冻干桶 500g', price: 89, qty: 1 },
      { name: '磨牙洁齿棒（30支装）', price: 39.9, qty: 2 },
      { name: '三文鱼油软胶囊×60粒', price: 128, qty: 2 },
      { name: '奶酪小饼干 200g', price: 29.9, qty: 1 },
    ],
  },
  {
    id: 'c002',
    type: 'order',
    title: '二级返佣到账',
    fromUser: '小李',
    amount: 27.8,
    time: '2026-06-05 18:15',
    status: 'settled',
    level: 2,
    orderAmount: 463,
    rate: 6,
    items: [
      { name: '牛肉粒零食大礼包', price: 89, qty: 1 },
      { name: '宠物湿粮罐头×12罐', price: 68, qty: 2 },
      { name: '猫咪益生菌粉 50g', price: 59, qty: 1 },
    ],
  },
  {
    id: 'c003',
    type: 'order',
    title: '直属用户消费返佣',
    fromUser: '张先生',
    amount: 89.0,
    time: '2026-06-04 10:22',
    status: 'pending',
    level: 1,
    orderAmount: 989,
    rate: 9,
    items: [
      { name: '全价宠物主粮 10kg', price: 259, qty: 2 },
      { name: '宠物维生素片×180粒', price: 79, qty: 1 },
      { name: '羊奶粉 400g', price: 68, qty: 3 },
      { name: '冻干鸡肉粒 300g', price: 69, qty: 1 },
      { name: '宠物益生菌 60包', price: 49, qty: 1 },
    ],
  },
  { id: 'c004', type: 'withdraw', title: '提现到微信零钱', fromUser: '', amount: -500.0, time: '2026-05-28 09:15', status: 'settled', level: 0 },
  {
    id: 'c005',
    type: 'order',
    title: '直属用户消费返佣',
    fromUser: '刘女士',
    amount: 132.0,
    time: '2026-05-25 16:40',
    status: 'settled',
    level: 1,
    orderAmount: 1467,
    rate: 9,
    items: [
      { name: '全价天然猫粮 8kg', price: 329, qty: 2 },
      { name: '猫咪冻干零食礼盒', price: 128, qty: 1 },
      { name: '化毛膏 50g', price: 45, qty: 2 },
      { name: '猫草片 100片', price: 38, qty: 1 },
      { name: '宠物鱼油 200ml', price: 89, qty: 1 },
      { name: '猫砂 6L×4袋', price: 69, qty: 2 },
    ],
  },
  {
    id: 'c006',
    type: 'order',
    title: '二级返佣到账',
    fromUser: '小赵',
    amount: 63.5,
    time: '2026-05-20 11:08',
    status: 'settled',
    level: 2,
    orderAmount: 1058,
    rate: 6,
    items: [
      { name: '狗粮大型犬专用 15kg', price: 399, qty: 1 },
      { name: '宠物钙片×200片', price: 79, qty: 2 },
      { name: '牛肉干训练零食 500g', price: 118, qty: 1 },
      { name: '宠物洗发水 500ml', price: 69, qty: 1 },
    ],
  },
  {
    id: 'c007',
    type: 'order',
    title: '直属用户消费返佣',
    fromUser: '陈女士',
    amount: 41.2,
    time: '2026-05-18 20:55',
    status: 'settled',
    level: 1,
    orderAmount: 458,
    rate: 9,
    items: [
      { name: '宠物羊奶粉 800g', price: 128, qty: 1 },
      { name: '冻干鸭肉粒 300g', price: 69, qty: 2 },
      { name: '宠物磨牙骨×10根', price: 49, qty: 1 },
      { name: '鸡肉冻干 200g', price: 59, qty: 1 },
    ],
  },
  { id: 'c008', type: 'withdraw', title: '提现到银行卡', fromUser: '', amount: -600.0, time: '2026-05-10 14:30', status: 'settled', level: 0 },
  {
    id: 'c009',
    type: 'order',
    title: '二级返佣到账',
    fromUser: '小周',
    amount: 156.8,
    time: '2026-05-08 09:42',
    status: 'settled',
    level: 2,
    orderAmount: 2613,
    rate: 6,
    items: [
      { name: '全价天然狗粮 20kg', price: 459, qty: 2 },
      { name: '宠物营养膏套装', price: 168, qty: 1 },
      { name: '牛肉粒零食 1kg', price: 138, qty: 2 },
      { name: '宠物鱼油软胶囊×120粒', price: 98, qty: 3 },
      { name: '宠物玩具礼包', price: 79, qty: 1 },
      { name: '洁齿水 500ml', price: 59, qty: 1 },
    ],
  },
  {
    id: 'c010',
    type: 'order',
    title: '直属用户消费返佣',
    fromUser: '赵先生',
    amount: 78.5,
    time: '2026-05-03 15:20',
    status: 'settled',
    level: 1,
    orderAmount: 872,
    rate: 9,
    items: [
      { name: '全价宠物主粮 8kg', price: 219, qty: 2 },
      { name: '宠物钙片×300片', price: 89, qty: 1 },
      { name: '冻干三文鱼皮 400g', price: 79, qty: 1 },
      { name: '猫咪零食礼包', price: 68, qty: 1 },
      { name: '宠物益生菌粉 100g', price: 59, qty: 1 },
    ],
  },
];

// ==================== 邀请用户列表 ====================
let inviteList = [
  {
    id: 'u001',
    name: '小王',
    avatar: '🐶',
    role: '梵优合伙人',
    joinTime: '2026-05-15',
    totalContribution: 456.0,
    status: 'active',
    browseCount: 128,
    browseTime: '2026-06-07 14:32',
  },
  {
    id: 'u002',
    name: '张先生',
    avatar: '🐱',
    role: '用户',
    joinTime: '2026-04-22',
    totalContribution: 890.0,
    status: 'active',
    browseCount: 95,
    browseTime: '2026-06-06 10:15',
  },
  {
    id: 'u003',
    name: '刘女士',
    avatar: '🐰',
    role: '梵优主理人',
    joinTime: '2026-04-10',
    totalContribution: 1320.0,
    status: 'active',
    browseCount: 210,
    browseTime: '2026-06-07 09:08',
  },
  {
    id: 'u004',
    name: '赵先生',
    avatar: '🐹',
    role: '用户',
    joinTime: '2026-03-28',
    totalContribution: 785.0,
    status: 'active',
    browseCount: 67,
    browseTime: '2026-06-05 16:42',
  },
  {
    id: 'u005',
    name: '陈女士',
    avatar: '🐦',
    role: '梵优合伙人',
    joinTime: '2026-03-15',
    totalContribution: 412.0,
    status: 'active',
    browseCount: 156,
    browseTime: '2026-06-07 11:20',
  },
  {
    id: 'u006',
    name: '小李',
    avatar: '🐠',
    role: '用户',
    joinTime: '2026-02-20',
    totalContribution: 278.0,
    status: 'active',
    browseCount: 43,
    browseTime: '2026-06-04 08:55',
    parentId: 'u001',
  },
  {
    id: 'u007',
    name: '小赵',
    avatar: '🐢',
    role: '用户',
    joinTime: '2026-02-18',
    totalContribution: 635.0,
    status: 'active',
    browseCount: 82,
    browseTime: '2026-06-06 18:30',
    parentId: 'u001',
  },
  {
    id: 'u008',
    name: '小周',
    avatar: '🐸',
    role: '梵优合伙人',
    joinTime: '2026-01-22',
    totalContribution: 1568.0,
    status: 'active',
    browseCount: 189,
    browseTime: '2026-06-07 07:15',
    parentId: 'u003',
  },
  {
    id: 'u009',
    name: '小明',
    avatar: '🐵',
    role: '用户',
    joinTime: '2026-05-08',
    totalContribution: 0,
    status: 'inactive',
    browseCount: 17,
    browseTime: '2026-05-30 12:00',
    parentId: 'u004',
  },
  {
    id: 'u010',
    name: '小红',
    avatar: '🐔',
    role: '用户',
    joinTime: '2026-05-20',
    totalContribution: 0,
    status: 'inactive',
    browseCount: 5,
    browseTime: '2026-05-28 09:30',
    parentId: 'u007',
  },
];

// ==================== 当前用户等级 ====================
function getUserLevel() {
  if (typeof userProfile !== 'undefined' && userProfile.level) {
    return userProfile.level;
  }
  return '梵优主理人';
}

function getTierConfig() {
  const level = getUserLevel();

  return COMMISSION_CONFIG.tiers[level] || COMMISSION_CONFIG.tiers['梵优合伙人'];
}

// ==================== 菜单入口渲染 ====================
function renderCommissionInfo() {
  const el = document.getElementById('commissionMenuValue');
  if (el) {
    el.textContent = '¥' + commissionData.availableBalance.toFixed(2);
  }
  const tagEl = document.getElementById('commissionMenuTag');
  if (tagEl) {
    const cfg = getTierConfig();
    tagEl.textContent = cfg.name;
    // 动态颜色
    if (cfg.level === 1) tagEl.style.background = 'linear-gradient(135deg, #f97316, #ea580c)';
    else if (cfg.level === 2) tagEl.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    else tagEl.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
  }
  const inviteBadge = document.getElementById('profileInviteBadge');
  if (inviteBadge) {
    inviteBadge.textContent = commissionData.inviteCount;
  }
}

// ==================== 分佣概览弹窗 ====================
function openCommissionOverview() {
  renderCommissionOverview();
  document.getElementById('commissionOverlay').classList.remove('hidden');
}

function closeCommissionOverview(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('commissionOverlay').classList.add('hidden');
}

function renderCommissionOverview() {
  const cfg = getTierConfig();
  // 等级卡片
  renderTierCard(cfg);

  // 统计数字
  document.getElementById('commTotalEarned').textContent = '¥' + commissionData.totalEarned.toFixed(2);
  document.getElementById('commPendingAmount').textContent = '¥' + commissionData.pendingAmount.toFixed(2);
  document.getElementById('commAvailableBalance').textContent = '¥' + commissionData.availableBalance.toFixed(2);

  // 最近收益明细
  renderRecentCommissionLog();
}

function renderTierCard(cfg) {
  const card = document.getElementById('commissionTierCard');
  if (!card) return;

  let colorClass = '';
  if (cfg.level === 1) colorClass = '';
  else if (cfg.level === 2) colorClass = 'gold';
  else colorClass = 'diamond';
  card.className = 'commission-tier-card ' + colorClass;

  // 等级标记
  const badge = document.getElementById('commTierBadge');
  let rate = cfg.rates.reduce((acc, cur) => acc + cur, 0);
  if (badge) badge.innerHTML = cfg.icon + ' ' + cfg.name + `<span class="commission-tier-rate-pct">佣金：${rate}%</span>`;

  // 返佣比例
  const labelEl = document.getElementById('commTierLabel');
  if (labelEl) {
    labelEl.innerHTML = `<div class="commission-tier-rate-label">${cfg.rateLabels.join('、')}</div>`;
  }
}

function renderRecentCommissionLog() {
  const list = document.getElementById('commissionLogList');
  if (!list) return;

  const recent = commissionLog.filter((l) => l.type === 'order').slice(0, 5);
  if (recent.length === 0) {
    list.innerHTML = '<div class="commission-log-empty">暂无收益记录</div>';
    return;
  }

  list.innerHTML = recent
    .map((item) => {
      const icon = item.type === 'withdraw' ? '💳' : item.level === 2 ? '🔄' : '💰';
      const amountClass = item.status === 'pending' ? 'commission-log-amount pending' : 'commission-log-amount';
      const prefix = item.amount > 0 ? '+' : '';
      return (
        '<div class="commission-log-item" onclick="openCommissionLogDetail(\'' +
        item.id +
        '\')">' +
        '<div class="commission-log-icon">' +
        icon +
        '</div>' +
        '<div class="commission-log-info">' +
        '<div class="commission-log-title">' +
        item.title +
        (item.fromUser ? '（' + item.fromUser + '）' : '') +
        '</div>' +
        '<div class="commission-log-meta">' +
        item.time +
        (item.status === 'pending' ? ' · 待结算' : '') +
        '</div>' +
        '</div>' +
        '<div class="' +
        amountClass +
        '">' +
        prefix +
        item.amount.toFixed(2) +
        '</div>' +
        '</div>'
      );
    })
    .join('');
}

// ==================== 收益明细弹窗 ====================
let commissionDetailTab = 'all';

function openCommissionDetail() {
  commissionDetailTab = 'all';
  renderCommissionDetail();
  document.getElementById('commissionDetailOverlay').classList.remove('hidden');
}

function closeCommissionDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('commissionDetailOverlay').classList.add('hidden');
}

function switchCommissionDetailTab(tab, el) {
  commissionDetailTab = tab;
  document.querySelectorAll('#commissionDetailTabs .commission-detail-tab').forEach((t) => t.classList.remove('active'));
  el.classList.add('active');
  renderCommissionDetailList();
}

function renderCommissionDetail() {
  // 统计
  document.getElementById('commDetailTotalEarned').textContent = '¥' + commissionData.totalEarned.toFixed(2);
  document.getElementById('commDetailPending').textContent = '¥' + commissionData.pendingAmount.toFixed(2);
  document.getElementById('commDetailAvailable').textContent = '¥' + commissionData.availableBalance.toFixed(2);

  // Tab 状态恢复
  const tabs = document.querySelectorAll('#commissionDetailTabs .commission-detail-tab');
  tabs.forEach((t) => {
    const tabVal = t.getAttribute('data-tab');
    if (tabVal === commissionDetailTab) t.classList.add('active');
    else t.classList.remove('active');
  });

  renderCommissionDetailList();
}

function renderCommissionDetailList() {
  const list = document.getElementById('commissionDetailList');
  if (!list) return;

  let filtered = commissionLog;
  if (commissionDetailTab === 'settled') filtered = commissionLog.filter((l) => l.status === 'settled' && l.type === 'order');
  else if (commissionDetailTab === 'pending') filtered = commissionLog.filter((l) => l.status === 'pending');
  else if (commissionDetailTab === 'withdraw') filtered = commissionLog.filter((l) => l.type === 'withdraw');

  if (filtered.length === 0) {
    list.innerHTML = '<div class="commission-log-empty">暂无记录</div>';
    return;
  }

  list.innerHTML = filtered
    .map((item) => {
      const icon = item.type === 'withdraw' ? '💳' : item.level === 2 ? '🔄' : '💰';
      const amountClass = item.status === 'pending' ? 'commission-log-amount pending' : 'commission-log-amount';
      const prefix = item.amount > 0 ? '+' : '';
      const clickAttr = item.type === 'order' ? ' onclick="openCommissionLogDetail(\'' + item.id + '\')"' : '';
      return (
        '<div class="commission-log-item"' +
        clickAttr +
        '>' +
        '<div class="commission-log-icon">' +
        icon +
        '</div>' +
        '<div class="commission-log-info">' +
        '<div class="commission-log-title">' +
        item.title +
        (item.fromUser ? '（' + item.fromUser + '）' : '') +
        '</div>' +
        '<div class="commission-log-meta">' +
        item.time +
        (item.status === 'pending' ? ' · 待结算' : '') +
        '</div>' +
        '</div>' +
        '<div class="' +
        amountClass +
        '">' +
        prefix +
        item.amount.toFixed(2) +
        '</div>' +
        '</div>'
      );
    })
    .join('');
}

// ==================== 提现弹窗 ====================
let withdrawAmount = '';
let withdrawMethod = '微信零钱';

function openWithdrawPopup() {
  withdrawAmount = '';
  withdrawMethod = '微信零钱';
  renderWithdrawPopup();
  document.getElementById('withdrawOverlay').classList.remove('hidden');
}

function closeWithdrawPopup(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('withdrawOverlay').classList.add('hidden');
}

function renderWithdrawPopup() {
  document.getElementById('withdrawBalance').textContent = '¥' + commissionData.availableBalance.toFixed(2);
  document.getElementById('withdrawMinHint').textContent = '最低提现金额 ¥' + COMMISSION_CONFIG.minWithdraw;

  const input = document.getElementById('withdrawAmountInput');
  if (input) input.value = withdrawAmount;

  // 预设金额按钮
  const presets = document.querySelectorAll('#withdrawPresets .withdraw-amount-preset');
  presets.forEach((p) => {
    const val = p.getAttribute('data-amount');
    if (val === withdrawAmount) p.classList.add('selected');
    else p.classList.remove('selected');
  });

  // 提现方式
  const methodSelect = document.getElementById('withdrawMethodSelect');
  if (methodSelect) methodSelect.value = withdrawMethod;

  // 实时计算
  updateWithdrawPreview();

  // 提交按钮状态
  updateWithdrawSubmitBtn();
}

function selectWithdrawPreset(amount, el) {
  withdrawAmount = amount;
  document.querySelectorAll('#withdrawPresets .withdraw-amount-preset').forEach((p) => p.classList.remove('selected'));
  el.classList.add('selected');
  const input = document.getElementById('withdrawAmountInput');
  if (input) input.value = amount;
  updateWithdrawPreview();
  updateWithdrawSubmitBtn();
}

function onWithdrawAmountInput(el) {
  withdrawAmount = el.value;
  document.querySelectorAll('#withdrawPresets .withdraw-amount-preset').forEach((p) => p.classList.remove('selected'));
  updateWithdrawPreview();
  updateWithdrawSubmitBtn();
}

function onWithdrawMethodChange(el) {
  withdrawMethod = el.value;
}

function updateWithdrawPreview() {
  const preview = document.getElementById('withdrawPreview');
  if (!preview) return;
  const amount = parseFloat(withdrawAmount);
  if (isNaN(amount) || amount <= 0) {
    preview.textContent = '请输入提现金额';
    preview.style.color = '#b0a090';
    return;
  }
  if (amount < COMMISSION_CONFIG.minWithdraw) {
    preview.textContent = '提现金额不得低于 ¥' + COMMISSION_CONFIG.minWithdraw;
    preview.style.color = '#ef4444';
    return;
  }
  if (amount > commissionData.availableBalance) {
    preview.textContent = '余额不足，当前可提现 ¥' + commissionData.availableBalance.toFixed(2);
    preview.style.color = '#ef4444';
    return;
  }
  preview.textContent = '实际到账：¥' + amount.toFixed(2) + '（免手续费）';
  preview.style.color = '#059669';
}

function updateWithdrawSubmitBtn() {
  const btn = document.getElementById('withdrawSubmitBtn');
  if (!btn) return;
  const amount = parseFloat(withdrawAmount);
  if (isNaN(amount) || amount < COMMISSION_CONFIG.minWithdraw || amount > commissionData.availableBalance) {
    btn.disabled = true;
  } else {
    btn.disabled = false;
  }
}

function submitWithdraw() {
  const amount = parseFloat(withdrawAmount);
  if (isNaN(amount) || amount < COMMISSION_CONFIG.minWithdraw) {
    showToast('提现金额不能低于 ¥' + COMMISSION_CONFIG.minWithdraw);
    return;
  }
  if (amount > commissionData.availableBalance) {
    showToast('余额不足');
    return;
  }
  if (!withdrawMethod) {
    showToast('请选择提现方式');
    return;
  }

  // 执行提现
  commissionData.availableBalance -= amount;
  commissionData.totalEarned += 0; // totalEarned already includes this

  // 添加提现记录
  const now = new Date();
  const timeStr =
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0') +
    ' ' +
    String(now.getHours()).padStart(2, '0') +
    ':' +
    String(now.getMinutes()).padStart(2, '0');
  commissionLog.unshift({
    id: 'c' + Date.now(),
    type: 'withdraw',
    title: '提现到' + withdrawMethod,
    fromUser: '',
    amount: -amount,
    time: timeStr,
    status: 'settled',
    level: 0,
  });

  // 刷新所有视图
  renderCommissionInfo();
  renderCommissionOverview();
  closeWithdrawPopup();

  showToast('提现申请已提交，预计24小时内到账');
}

// ==================== 邀请明细弹窗 ====================
let inviteTabActive = 'total'; // 'total' | 'views'

function openInviteDetail() {
  inviteTabActive = 'total';
  renderInviteDetail();
  document.getElementById('inviteOverlay').classList.remove('hidden');
}

function closeInviteDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('inviteOverlay').classList.add('hidden');
}

function renderInviteDetail() {
  // 统计数据
  document.getElementById('inviteTotalCount').textContent = commissionData.inviteCount;
  document.getElementById('inviteViewsCount').textContent = commissionData.totalViews || 992;

  // Tab 激活状态
  document.querySelectorAll('#inviteDetailTabs .invite-tab').forEach(function (t) {
    t.classList.toggle('active', t.getAttribute('data-tab') === inviteTabActive);
  });

  renderInviteList();
}

function switchInviteTab(tab, el) {
  inviteTabActive = tab;
  renderInviteDetail();
}

function renderInviteList(filter) {
  var list = document.getElementById('inviteList');
  if (!list) return;

  var filtered =
    inviteTabActive === 'views'
      ? inviteList
          .filter(function (u) {
            return u.browseCount > 0;
          })
          .sort(function (a, b) {
            return b.browseCount - a.browseCount;
          })
      : inviteList.slice();

  if (filter) {
    var keyword = filter.toLowerCase();
    filtered = filtered.filter(function (u) {
      return u.name.toLowerCase().indexOf(keyword) !== -1 || u.id.toLowerCase().indexOf(keyword) !== -1;
    });
  }

  if (filtered.length === 0) {
    list.innerHTML = '<div class="invite-empty">' + (filter ? '未搜索到相关用户' : '暂无邀请记录') + '</div>';
    return;
  }

  list.innerHTML = filtered
    .map(function (u) {
      var rightHtml = '';
      if (inviteTabActive === 'views') {
        // rightHtml = '<div class="invite-item-views">👁 ' + u.browseCount + '</div>';
      } else {
        rightHtml = '<div class="invite-item-contribution">' + (u.totalContribution > 0 ? '¥' + u.totalContribution.toFixed(2) : '—') + '</div>';
      }

      return (
        '<div class="invite-item" onclick="openInviteUserDetail(\'' +
        u.id +
        '\')">' +
        '<div class="invite-item-avatar">' +
        u.avatar +
        '</div>' +
        '<div class="invite-item-info">' +
        '<div class="invite-item-name">' +
        u.name +
        '</div>' +
        '<div class="invite-item-meta">最近浏览：' +
        u.browseTime +
        '</div>' +
        '</div>' +
        rightHtml +
        '</div>'
      );
    })
    .join('');
}

function searchInvite(el) {
  renderInviteList(el.value);
}

// ==================== 邀请用户详情弹窗 ====================
function openInviteUserDetail(userId) {
  var user = inviteList.find(function (u) {
    return u.id === userId;
  });
  if (!user) return;

  document.getElementById('inviteUserAvatar').textContent = user.avatar;
  document.getElementById('inviteUserName').textContent = user.name;

  var roleClass = '';
  if (user.role === '梵优合伙人') roleClass = 'partner';
  else if (user.role === '梵优主理人') roleClass = 'manager';
  var roleEl = document.getElementById('inviteUserRole');
  roleEl.textContent = user.role;
  roleEl.className = 'invite-item-role ' + roleClass;

  document.getElementById('inviteUserJoinTime').textContent = user.joinTime;
  document.getElementById('inviteUserBrowseCount').textContent = user.browseCount;
  document.getElementById('inviteUserBrowseTime').textContent = user.browseTime;
  document.getElementById('inviteUserStatus').textContent = user.status === 'active' ? '已激活' : '未激活';
  document.getElementById('inviteUserContribution').textContent = '¥' + user.totalContribution.toFixed(2);

  document.getElementById('inviteUserOverlay').classList.remove('hidden');
}

function closeInviteUserDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('inviteUserOverlay').classList.add('hidden');
}

// ==================== 收益详情弹窗（点击明细条目） ====================
function openCommissionLogDetail(logId) {
  var log = commissionLog.find(function (l) { return l.id === logId; });
  if (!log) return;

  document.getElementById('commLogDetailTitle').textContent = log.title + (log.fromUser ? '（' + log.fromUser + '）' : '');

  // 顶部金额区
  var orderAmount = log.orderAmount || 0;
  var rate = log.rate || 0;
  var earned = log.amount || 0;
  document.getElementById('commLogDetailOrderAmount').textContent = '\u00a5' + orderAmount.toFixed(2);
  document.getElementById('commLogDetailFormula').textContent = '\u00a5' + orderAmount.toFixed(2) + ' \u00d7 ' + rate + '% = \u00a5' + earned.toFixed(2);
  document.getElementById('commLogDetailEarned').textContent = '+' + earned.toFixed(2);

  // 状态标签
  var statusEl = document.getElementById('commLogDetailStatus');
  if (log.status === 'pending') {
    statusEl.textContent = '待结算';
    statusEl.className = 'comm-log-detail-status pending';
  } else {
    statusEl.textContent = '已结算';
    statusEl.className = 'comm-log-detail-status settled';
  }

  // 时间
  document.getElementById('commLogDetailTime').textContent = log.time;

  // 商品列表
  var itemsContainer = document.getElementById('commLogDetailItems');
  if (log.items && log.items.length > 0) {
    itemsContainer.innerHTML = log.items.map(function (item) {
      return (
        '<div class="comm-log-detail-item">' +
        '<div class="comm-log-detail-item-name">' + item.name + '</div>' +
        '<div class="comm-log-detail-item-qty">\u00d7' + item.qty + '</div>' +
        '<div class="comm-log-detail-item-price">\u00a5' + (item.price * item.qty).toFixed(2) + '</div>' +
        '</div>'
      );
    }).join('');
  } else {
    itemsContainer.innerHTML = '<div class="commission-log-empty">暂无商品信息</div>';
  }

  document.getElementById('commissionLogDetailOverlay').classList.remove('hidden');
}

function closeCommissionLogDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('commissionLogDetailOverlay').classList.add('hidden');
}

// ==================== 分享邀请 ====================
function shareInviteLink() {
  const link = 'https://fanyoumingchong.com/invite';
  if (navigator.share) {
    navigator.share({ title: '梵优茗宠邀请', text: '快来和我一起给宠物囤好物，注册即得新人礼包！', url: link });
  } else {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        showToast('邀请链接已复制');
      });
    } else {
      showToast('邀请链接：' + link);
    }
  }
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    renderCommissionInfo();
  }, 250);
});
