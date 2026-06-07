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
  thisMonthEarned: 328.5, // 本月收益
};

// ==================== 收益明细 ====================
let commissionLog = [
  { id: 'c001', type: 'order', title: '直属用户消费返佣', fromUser: '小王', amount: 45.6, time: '2026-06-06 14:32', status: 'settled', level: 1 },
  { id: 'c002', type: 'order', title: '二级返佣到账', fromUser: '小李', amount: 27.8, time: '2026-06-05 18:15', status: 'settled', level: 2 },
  { id: 'c003', type: 'order', title: '直属用户消费返佣', fromUser: '张先生', amount: 89.0, time: '2026-06-04 10:22', status: 'pending', level: 1 },
  { id: 'c004', type: 'withdraw', title: '提现到微信零钱', fromUser: '', amount: -500.0, time: '2026-05-28 09:15', status: 'settled', level: 0 },
  { id: 'c005', type: 'order', title: '直属用户消费返佣', fromUser: '刘女士', amount: 132.0, time: '2026-05-25 16:40', status: 'settled', level: 1 },
  { id: 'c006', type: 'order', title: '二级返佣到账', fromUser: '小赵', amount: 63.5, time: '2026-05-20 11:08', status: 'settled', level: 2 },
  { id: 'c007', type: 'order', title: '直属用户消费返佣', fromUser: '陈女士', amount: 41.2, time: '2026-05-18 20:55', status: 'settled', level: 1 },
  { id: 'c008', type: 'withdraw', title: '提现到银行卡', fromUser: '', amount: -600.0, time: '2026-05-10 14:30', status: 'settled', level: 0 },
  { id: 'c009', type: 'order', title: '二级返佣到账', fromUser: '小周', amount: 156.8, time: '2026-05-08 09:42', status: 'settled', level: 2 },
  { id: 'c010', type: 'order', title: '直属用户消费返佣', fromUser: '赵先生', amount: 78.5, time: '2026-05-03 15:20', status: 'settled', level: 1 },
];

// ==================== 邀请用户列表 ====================
let inviteList = [
  { id: 'u001', name: '小王', avatar: '🐶', level: 1, joinTime: '2026-05-15', totalContribution: 456.0, status: 'active' },
  { id: 'u002', name: '张先生', avatar: '🐱', level: 1, joinTime: '2026-04-22', totalContribution: 890.0, status: 'active' },
  { id: 'u003', name: '刘女士', avatar: '🐰', level: 1, joinTime: '2026-04-10', totalContribution: 1320.0, status: 'active' },
  { id: 'u004', name: '赵先生', avatar: '🐹', level: 1, joinTime: '2026-03-28', totalContribution: 785.0, status: 'active' },
  { id: 'u005', name: '陈女士', avatar: '🐦', level: 1, joinTime: '2026-03-15', totalContribution: 412.0, status: 'active' },
  { id: 'u006', name: '小李', avatar: '🐠', level: 2, joinTime: '2026-02-20', totalContribution: 278.0, status: 'active', parentId: 'u001' },
  { id: 'u007', name: '小赵', avatar: '🐢', level: 2, joinTime: '2026-02-18', totalContribution: 635.0, status: 'active', parentId: 'u001' },
  { id: 'u008', name: '小周', avatar: '🐸', level: 2, joinTime: '2026-01-22', totalContribution: 1568.0, status: 'active', parentId: 'u003' },
  { id: 'u009', name: '小明', avatar: '🐵', level: 2, joinTime: '2026-05-08', totalContribution: 0, status: 'inactive', parentId: 'u004' },
  { id: 'u010', name: '小红', avatar: '🐔', level: 3, joinTime: '2026-05-20', totalContribution: 0, status: 'inactive', parentId: 'u007' },
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

  // 更新邀请徽章
  const inviteBadge = document.getElementById('commInviteBadge');
  if (inviteBadge) {
    inviteBadge.textContent = commissionData.inviteCount;
  }
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
    labelEl.innerHTML = `<div class="commission-tier-rate-label">${cfg.rateLabels.join('')}</div>`;
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
        '<div class="commission-log-item">' +
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
      return (
        '<div class="commission-log-item">' +
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
function openInviteDetail() {
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
  document.getElementById('inviteActiveCount').textContent = commissionData.activeInviteCount;
  document.getElementById('inviteTotalContribution').textContent = '¥' + commissionData.totalEarned.toFixed(2);

  // 邀请码
  const codeEl = document.getElementById('inviteShareCode');
  if (codeEl) {
    codeEl.textContent = 'FYM' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  renderInviteList();
}

function renderInviteList(filter) {
  const list = document.getElementById('inviteList');
  if (!list) return;

  let filtered = inviteList;
  if (filter) {
    const keyword = filter.toLowerCase();
    filtered = inviteList.filter((u) => u.name.toLowerCase().includes(keyword) || u.id.toLowerCase().includes(keyword));
  }

  if (filtered.length === 0) {
    list.innerHTML = '<div class="invite-empty">' + (filter ? '未搜索到相关用户' : '暂无邀请记录') + '</div>';
    return;
  }

  list.innerHTML = filtered
    .map((u) => {
      let levelClass = 'l1';
      let levelLabel = '一级';
      if (u.level === 2) {
        levelClass = 'l2';
        levelLabel = '二级';
      } else if (u.level === 3) {
        levelClass = '';
        levelLabel = '三级';
      }

      return (
        '<div class="invite-item">' +
        '<div class="invite-item-avatar">' +
        u.avatar +
        '</div>' +
        '<div class="invite-item-info">' +
        '<div class="invite-item-name">' +
        u.name +
        '<span class="invite-item-level ' +
        levelClass +
        '">' +
        levelLabel +
        '</span>' +
        '</div>' +
        '<div class="invite-item-meta">' +
        u.joinTime +
        ' 加入' +
        (u.status === 'inactive' ? ' · 未激活' : '') +
        '</div>' +
        '</div>' +
        '<div class="invite-item-contribution">' +
        (u.totalContribution > 0 ? '¥' + u.totalContribution.toFixed(2) : '—') +
        '</div>' +
        '</div>'
      );
    })
    .join('');
}

function searchInvite(el) {
  renderInviteList(el.value);
}

// ==================== 分享邀请 ====================
function copyInviteCode() {
  const codeEl = document.getElementById('inviteShareCode');
  if (!codeEl) return;
  const code = codeEl.textContent;
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        showToast('邀请码已复制：' + code);
      })
      .catch(() => {
        showToast('邀请码：' + code);
      });
  } else {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('邀请码已复制：' + code);
  }
}

function shareInviteLink() {
  const code = document.getElementById('inviteShareCode')?.textContent || 'FYMPET';
  const link = 'https://fanyoumingchong.com/invite?code=' + code;
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
