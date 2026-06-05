// ============ 我的页 — 数据与交互 ============

// 全局状态
let profilePets = [
  { id: 1, type: 'cat', name: '咪咪', breed: '英短', weight: 4.5, birthday: '2023-06-15' },
  { id: 2, type: 'dog', name: '旺财', breed: '泰迪', weight: 6.2, birthday: '2024-01-08' }
];
let editPetId = null;

let profileAddresses = [
  { id: 1, name: '张三', phone: '138****1234', region: '浙江省杭州市西湖区', detail: '文三路123号', isDefault: true }
];
let editAddressId = null;

let profileOrders = [
  { id: 'OD20260601001', status: 'pendingPay', items: [{ name: '磨牙洁齿棒', img: '🦴', price: 19.9, qty: 2 }], total: 39.8, time: '2026-06-01 10:30', logistics: null },
  { id: 'OD20260528002', status: 'pendingShip', items: [{ name: '深海三文鱼冻干', img: '🐟', price: 39.9, qty: 1 }], total: 39.9, time: '2026-05-28 14:20', logistics: null },
  { id: 'OD20260525003', status: 'shipped', items: [{ name: '芝士训练饼干', img: '🧀', price: 18.9, qty: 3 }, { name: '原切牛肉粒', img: '🥩', price: 32.9, qty: 1 }], total: 89.6, time: '2026-05-25 09:15', logistics: { company: '顺丰速运', no: 'SF1234567890' } },
  { id: 'OD20260520004', status: 'completed', items: [{ name: '零食全家桶', img: '🎁', price: 89.0, qty: 1 }], total: 89.0, time: '2026-05-20 16:45', logistics: { company: '中通快递', no: 'ZT9876543210' } }
];
let currentOrderTab = 'all';
let currentOrderId = null;

let userProfile = { name: '毛毛家长', level: '达人', avatar: '🐱', memberLevel: 'silver', totalSpent: 350 };
let currentAfterSaleOrderId = null;
let currentAfterSaleType = null;

// ============ 页面渲染入口 ============
function renderProfilePage() {
  renderProfileUserCard();
  renderPetList();
  renderAddressList();
  renderMemberInfo();
  renderOrderList();
}

// ============ 用户卡片 ============
function renderProfileUserCard() {
  document.getElementById('profileAvatar').querySelector('span').textContent = userProfile.avatar;
  document.getElementById('profileUserName').textContent = userProfile.name;
  document.getElementById('profileLevelTag').innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ' + userProfile.level;

  const memberBadge = document.getElementById('profileMemberBadge');
  const badges = { silver: '🥈 银牌会员', gold: '🥇 金牌会员', diamond: '💎 黑钻会员' };
  memberBadge.textContent = badges[userProfile.memberLevel] || '🥈 银牌会员';
}

// ============ 个人信息编辑 ============
function openProfileEdit() {
  document.getElementById('profileNameInput').value = userProfile.name;
  document.getElementById('profileLevelSelect').value = userProfile.level;
  document.getElementById('profileEditOverlay').classList.remove('hidden');
}

function closeProfileEdit(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('profileEditOverlay').classList.add('hidden');
}

function saveProfile() {
  userProfile.name = document.getElementById('profileNameInput').value.trim() || userProfile.name;
  userProfile.level = document.getElementById('profileLevelSelect').value;
  closeProfileEdit();
  renderProfileUserCard();
  showToast('个人信息已更新');
}

// ============ 头像选择 ============
function openAvatarPicker() {
  document.getElementById('avatarPickerOverlay').classList.remove('hidden');
}

function closeAvatarPicker(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('avatarPickerOverlay').classList.add('hidden');
}

function selectAvatar(emoji) {
  userProfile.avatar = emoji;
  document.getElementById('profileAvatar').querySelector('span').textContent = emoji;
  closeAvatarPicker();
}

// ============ 宠物档案 ============
function renderPetList() {
  const list = document.getElementById('profilePetList');
  const empty = document.getElementById('profilePetEmpty');

  if (profilePets.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    document.getElementById('profileBirthdayBar').classList.add('hidden');
    return;
  }

  empty.classList.add('hidden');
  const typeMap = { cat: ['🐱', '猫咪'], dog: ['🐶', '狗狗'], other: ['🐰', '其他'] };

  list.innerHTML = profilePets.map(p => {
    const [icon, typeLabel] = typeMap[p.type] || ['🐾', '未知'];
    const age = calcPetAge(p.birthday);
    return `
      <div class="profile-pet-card">
        <div class="profile-pet-icon">${icon}</div>
        <div class="profile-pet-info">
          <div class="profile-pet-name">${p.name} <span class="profile-pet-type-tag">${typeLabel}</span></div>
          <div class="profile-pet-meta">
            <span>${p.breed}</span>
            <span>${p.weight ? p.weight + 'kg' : ''}</span>
            <span>${p.birthday ? '🎂 ' + p.birthday + ' (' + age + ')' : ''}</span>
          </div>
        </div>
        <div class="profile-pet-actions">
          <span class="profile-pet-edit" onclick="editPet(${p.id})">✏️</span>
          <span class="profile-pet-del" onclick="deletePet(${p.id})">🗑️</span>
        </div>
      </div>
    `;
  }).join('');

  // 生日提醒
  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const birthdayPets = profilePets.filter(p => {
    if (!p.birthday) return false;
    const bm = parseInt(p.birthday.split('-')[1]);
    return bm === thisMonth;
  });

  const bar = document.getElementById('profileBirthdayBar');
  if (birthdayPets.length > 0) {
    bar.classList.remove('hidden');
    document.getElementById('profileBirthdayText').textContent = `本月有${birthdayPets.length}只宠物过生日`;
  } else {
    bar.classList.add('hidden');
  }
}

function calcPetAge(birthday) {
  if (!birthday) return '';
  const b = new Date(birthday);
  const now = new Date();
  const months = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
  if (months < 12) return months + '个月';
  const years = Math.floor(months / 12);
  const remain = months % 12;
  return remain > 0 ? years + '岁' + remain + '个月' : years + '岁';
}

function openPetForm(petId) {
  editPetId = petId || null;
  const overlay = document.getElementById('petFormOverlay');
  const title = document.getElementById('petFormTitle');

  if (petId) {
    title.textContent = '编辑宠物';
    const pet = profilePets.find(p => p.id === petId);
    if (pet) {
      document.getElementById('petNameInput').value = pet.name;
      document.getElementById('petBreedInput').value = pet.breed;
      document.getElementById('petWeightInput').value = pet.weight || '';
      document.getElementById('petBirthdayInput').value = pet.birthday || '';
      document.querySelectorAll('.pet-type-chip').forEach(el => el.classList.toggle('active', el.dataset.type === pet.type));
    }
  } else {
    title.textContent = '添加宠物';
    document.getElementById('petNameInput').value = '';
    document.getElementById('petBreedInput').value = '';
    document.getElementById('petWeightInput').value = '';
    document.getElementById('petBirthdayInput').value = '';
    document.querySelectorAll('.pet-type-chip').forEach(el => el.classList.remove('active'));
  }

  overlay.classList.remove('hidden');
}

function closePetForm(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('petFormOverlay').classList.add('hidden');
  editPetId = null;
}

function selectPetType(type, el) {
  el.parentElement.querySelectorAll('.pet-type-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function getSelectedPetType() {
  const active = document.querySelector('.pet-type-chip.active');
  return active ? active.dataset.type : null;
}

function savePet() {
  const type = getSelectedPetType();
  const name = document.getElementById('petNameInput').value.trim();
  const breed = document.getElementById('petBreedInput').value.trim();
  const weight = parseFloat(document.getElementById('petWeightInput').value) || null;
  const birthday = document.getElementById('petBirthdayInput').value || null;

  if (!type) return showToast('请选择宠物类型');
  if (!name) return showToast('请输入宠物名称');
  if (!breed) return showToast('请输入宠物品种');

  if (editPetId) {
    const pet = profilePets.find(p => p.id === editPetId);
    if (pet) {
      pet.type = type;
      pet.name = name;
      pet.breed = breed;
      pet.weight = weight;
      pet.birthday = birthday;
    }
  } else {
    profilePets.push({
      id: Date.now(),
      type, name, breed, weight, birthday
    });
  }

  closePetForm();
  renderPetList();
  showToast(editPetId ? '宠物信息已更新' : '宠物添加成功');
  editPetId = null;
}

function editPet(id) {
  openPetForm(id);
}

function deletePet(id) {
  profilePets = profilePets.filter(p => p.id !== id);
  renderPetList();
  showToast('宠物已删除');
}

// ============ 收货地址 ============
function renderAddressList() {
  const list = document.getElementById('profileAddressList');
  const empty = document.getElementById('profileAddressEmpty');

  if (profileAddresses.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = profileAddresses.map(a => `
    <div class="profile-address-card${a.isDefault ? ' default' : ''}">
      <div class="profile-address-top">
        <div class="profile-address-name">${a.name} <span>${a.phone}</span></div>
        ${a.isDefault ? '<span class="profile-address-default-tag">默认</span>' : ''}
      </div>
      <div class="profile-address-text">${a.region} ${a.detail}</div>
      <div class="profile-address-actions">
        <span onclick="editAddress(${a.id})">✏️ 编辑</span>
        <span onclick="deleteAddress(${a.id})">🗑️ 删除</span>
        ${!a.isDefault ? `<span onclick="setDefaultAddress(${a.id})">⭐ 设为默认</span>` : ''}
      </div>
    </div>
  `).join('');
}

function openAddressForm(addrId) {
  editAddressId = addrId || null;
  const overlay = document.getElementById('addressFormOverlay');
  const title = document.getElementById('addressFormTitle');

  if (addrId) {
    title.textContent = '编辑收货地址';
    const addr = profileAddresses.find(a => a.id === addrId);
    if (addr) {
      document.getElementById('addrNameInput').value = addr.name;
      document.getElementById('addrPhoneInput').value = addr.phone;
      document.getElementById('addrRegionInput').value = addr.region;
      document.getElementById('addrDetailInput').value = addr.detail;
      document.getElementById('addrDefaultCheck').checked = addr.isDefault;
    }
  } else {
    title.textContent = '添加收货地址';
    document.getElementById('addrNameInput').value = '';
    document.getElementById('addrPhoneInput').value = '';
    document.getElementById('addrRegionInput').value = '';
    document.getElementById('addrDetailInput').value = '';
    document.getElementById('addrDefaultCheck').checked = false;
  }

  overlay.classList.remove('hidden');
}

function closeAddressForm(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('addressFormOverlay').classList.add('hidden');
  editAddressId = null;
}

function saveAddress() {
  const name = document.getElementById('addrNameInput').value.trim();
  const phone = document.getElementById('addrPhoneInput').value.trim();
  const region = document.getElementById('addrRegionInput').value.trim();
  const detail = document.getElementById('addrDetailInput').value.trim();
  const isDefault = document.getElementById('addrDefaultCheck').checked;

  if (!name) return showToast('请输入收货人姓名');
  if (!phone) return showToast('请输入联系电话');
  if (!region) return showToast('请输入所在地区');
  if (!detail) return showToast('请输入详细地址');

  if (isDefault) {
    profileAddresses.forEach(a => a.isDefault = false);
  }

  if (editAddressId) {
    const addr = profileAddresses.find(a => a.id === editAddressId);
    if (addr) {
      addr.name = name;
      addr.phone = phone;
      addr.region = region;
      addr.detail = detail;
      addr.isDefault = isDefault;
    }
  } else {
    profileAddresses.push({
      id: Date.now(),
      name, phone, region, detail, isDefault
    });
  }

  closeAddressForm();
  renderAddressList();
  showToast(editAddressId ? '地址已更新' : '地址添加成功');
  editAddressId = null;
}

function editAddress(id) {
  openAddressForm(id);
}

function deleteAddress(id) {
  profileAddresses = profileAddresses.filter(a => a.id !== id);
  renderAddressList();
  showToast('地址已删除');
}

function setDefaultAddress(id) {
  profileAddresses.forEach(a => a.isDefault = (a.id === id));
  renderAddressList();
  showToast('已设为默认地址');
}

// ============ 会员信息 ============
function renderMemberInfo() {
  const config = {
    silver: { icon: '🥈', name: '银牌会员', next: '金牌会员', threshold: 1000, color: '#9e9e9e' },
    gold: { icon: '🥇', name: '金牌会员', next: '黑钻会员', threshold: 5000, color: '#f5a623' },
    diamond: { icon: '💎', name: '黑钻会员', next: null, threshold: Infinity, color: '#7c4dff' }
  };

  const c = config[userProfile.memberLevel] || config.silver;
  const spent = userProfile.totalSpent;
  const pct = Math.min(100, Math.round((spent / c.threshold) * 100));

  document.getElementById('memberIcon').textContent = c.icon;
  document.getElementById('memberLevel').textContent = c.name;
  document.getElementById('memberProgressFill').style.width = pct + '%';
  document.getElementById('memberProgressFill').style.background = c.color;

  if (c.next) {
    document.getElementById('memberProgressText').textContent = `再消费 ¥${c.threshold - spent} 升级${c.next}`;
  } else {
    document.getElementById('memberProgressText').textContent = '已达最高等级，享受全部权益';
  }

  const memberCard = document.getElementById('profileMemberCard');
  memberCard.className = 'profile-member-card ' + userProfile.memberLevel;

  const badge = document.getElementById('profileMemberBadge');
  const badges = { silver: '🥈 银牌会员', gold: '🥇 金牌会员', diamond: '💎 黑钻会员' };
  badge.textContent = badges[userProfile.memberLevel];
}

function openMemberDetail() {
  document.getElementById('memberDetailOverlay').classList.remove('hidden');
}

function closeMemberDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('memberDetailOverlay').classList.add('hidden');
}

function handleRecharge(amount) {
  showToast(`确认充值 ¥${amount}？（演示模式）`);
  userProfile.totalSpent += amount;
  updateMemberLevel();
  renderMemberInfo();
}

function updateMemberLevel() {
  const spent = userProfile.totalSpent;
  if (spent >= 5000) userProfile.memberLevel = 'diamond';
  else if (spent >= 1000) userProfile.memberLevel = 'gold';
  else userProfile.memberLevel = 'silver';
}

function openCustomRecharge() {
  document.getElementById('customRechargeOverlay').classList.remove('hidden');
  document.getElementById('customRechargeAmount').value = '';
}

function closeCustomRecharge(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('customRechargeOverlay').classList.add('hidden');
}

function setCustomRecharge(amount) {
  document.getElementById('customRechargeAmount').value = amount;
}

function confirmCustomRecharge() {
  const amount = parseInt(document.getElementById('customRechargeAmount').value);
  if (!amount || amount < 1) return showToast('请输入有效金额');
  closeCustomRecharge();
  handleRecharge(amount);
}

// ============ 订单列表 ============
function switchOrderTab(tab, el) {
  currentOrderTab = tab;
  document.querySelectorAll('#profileOrderTabs .profile-order-tab').forEach(t => t.classList.remove('active'));
  const target = el || document.querySelector(`#profileOrderTabs .profile-order-tab[data-tab="${tab}"]`);
  if (target) target.classList.add('active');
  renderOrderList();
}

function renderOrderList() {
  const list = document.getElementById('profileOrderList');
  const empty = document.getElementById('profileOrderEmpty');
  const emptyText = document.getElementById('profileOrderEmptyText');

  let filtered = profileOrders;
  const tabLabels = {
    all: '暂无订单',
    pendingPay: '暂无待付款订单',
    pendingShip: '暂无待发货订单',
    shipped: '暂无已发货订单',
    completed: '暂无已完成订单'
  };

  if (currentOrderTab !== 'all') {
    filtered = profileOrders.filter(o => o.status === currentOrderTab);
  }

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    emptyText.textContent = tabLabels[currentOrderTab] || '暂无订单';
    return;
  }

  empty.classList.add('hidden');

  const statusMap = {
    pendingPay: { label: '待付款', cls: 'status-pending-pay', action: '去付款', actionFn: 'payOrder' },
    pendingShip: { label: '待发货', cls: 'status-pending-ship', action: '', actionFn: '' },
    shipped: { label: '已发货', cls: 'status-shipped', action: '确认收货', actionFn: 'confirmReceive' },
    completed: { label: '已完成', cls: 'status-completed', action: '', actionFn: '' }
  };

  list.innerHTML = filtered.map(o => {
    const s = statusMap[o.status];
    const itemsPreview = o.items.map(i => i.img).join(' ');
    const itemNames = o.items.map(i => i.name).join('、');
    return `
      <div class="profile-order-card" onclick="openOrderDetail('${o.id}')">
        <div class="profile-order-card-header">
          <span class="profile-order-card-no">订单号：${o.id}</span>
          <span class="profile-order-card-status ${s.cls}">${s.label}</span>
        </div>
        <div class="profile-order-card-items">
          <span class="profile-order-items-preview">${itemsPreview}</span>
          <span class="profile-order-items-names">${itemNames}</span>
        </div>
        <div class="profile-order-card-bottom">
          <span class="profile-order-card-time">${o.time}</span>
          <span class="profile-order-card-total">合计：<b>¥${o.total.toFixed(2)}</b></span>
          ${s.action ? `<span class="profile-order-card-action" onclick="event.stopPropagation(); ${s.actionFn}('${o.id}')">${s.action}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function openOrderDetail(orderId) {
  currentOrderId = orderId;
  const order = profileOrders.find(o => o.id === orderId);
  if (!order) return;

  const statusMap = {
    pendingPay: '待付款',
    pendingShip: '待发货',
    shipped: '已发货',
    completed: '已完成'
  };

  document.getElementById('orderDetailStatus').textContent = statusMap[order.status];
  document.getElementById('orderDetailNo').textContent = order.id;
  document.getElementById('orderDetailItems').innerHTML = order.items.map(i => `
    <div class="order-detail-item">
      <div class="order-detail-item-img">${i.img}</div>
      <div class="order-detail-item-info">
        <div class="order-detail-item-name">${i.name}</div>
        <div class="order-detail-item-price">¥${i.price.toFixed(2)} × ${i.qty}</div>
      </div>
      <div class="order-detail-item-subtotal">¥${(i.price * i.qty).toFixed(2)}</div>
    </div>
  `).join('');

  document.getElementById('orderDetailTotal').textContent = `¥${order.total.toFixed(2)}`;
  document.getElementById('orderDetailPay').textContent = `¥${order.total.toFixed(2)}`;

  // 物流信息
  const logisticsSection = document.getElementById('orderLogisticsSection');
  const uploadSection = document.getElementById('orderUploadSection');
  const afterSaleSection = document.getElementById('orderAfterSaleSection');

  if (order.logistics && (order.status === 'shipped' || order.status === 'completed')) {
    logisticsSection.classList.remove('hidden');
    document.getElementById('orderLogisticsCompany').textContent = order.logistics.company;
    document.getElementById('orderLogisticsNo').textContent = order.logistics.no;
  } else {
    logisticsSection.classList.add('hidden');
  }

  // 上传物流（待发货时可手动上传）
  if (order.status === 'pendingShip') {
    uploadSection.classList.remove('hidden');
  } else {
    uploadSection.classList.add('hidden');
  }

  // 售后（已发货/已完成可售后）
  if (order.status === 'shipped' || order.status === 'completed') {
    afterSaleSection.classList.remove('hidden');
  } else {
    afterSaleSection.classList.add('hidden');
  }

  document.getElementById('orderDetailOverlay').classList.remove('hidden');
}

function closeOrderDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('orderDetailOverlay').classList.add('hidden');
  currentOrderId = null;
}

function confirmShipment() {
  const input = document.getElementById('orderLogisticsInput').value.trim();
  if (!input) return showToast('请输入物流单号');

  const order = profileOrders.find(o => o.id === currentOrderId);
  if (order) {
    order.logistics = { company: '快递配送', no: input };
    order.status = 'shipped';
    showToast('发货成功，物流信息已更新');
  }

  document.getElementById('orderLogisticsInput').value = '';
  closeOrderDetail();
  renderOrderList();
}

function confirmReceive(orderId) {
  const order = profileOrders.find(o => o.id === orderId);
  if (order) {
    order.status = 'completed';
    showToast('已确认收货');
    renderOrderList();
  }
}

function payOrder(orderId) {
  const order = profileOrders.find(o => o.id === orderId);
  if (order) {
    order.status = 'pendingShip';
    showToast('支付成功（演示模式）');
    renderOrderList();
  }
}

// ============ 售后流程 ============
function applyAfterSale(type) {
  currentAfterSaleOrderId = currentOrderId;
  currentAfterSaleType = type;

  const title = document.getElementById('afterSaleTitle');
  title.textContent = type === 'refund' ? '申请退款' : '申请换货';

  document.getElementById('afterSaleReason').value = '';
  document.getElementById('afterSaleDesc').value = '';
  document.getElementById('afterSaleOverlay').classList.remove('hidden');

  closeOrderDetail();
}

function closeAfterSaleForm(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('afterSaleOverlay').classList.add('hidden');
}

function submitAfterSale() {
  const reason = document.getElementById('afterSaleReason').value;
  if (!reason) return showToast('请选择售后原因');

  const desc = document.getElementById('afterSaleDesc').value.trim();
  const typeLabel = currentAfterSaleType === 'refund' ? '退款' : '换货';

  // 模拟售后提交
  showToast(`${typeLabel}申请已提交，客服将在24小时内联系您`);
  closeAfterSaleForm();
}

// ============ 页面初始化 ============
// 首次切换到"我的"页时自动触发渲染
(function() {
  // 检查是否直接定位到profile
  if (window.location.hash === '#profile') {
    setTimeout(() => {
      switchTab('profile', document.querySelector('.nav-item:last-child'));
    }, 100);
  }
})();
