// ============ 购物车 ============
let cartItems = [
  { emoji: '🦴', name: '鸡肉缠绕磨牙棒', price: 25.9, qty: 2, checked: true },
  { emoji: '🐟', name: '深海三文鱼冻干', price: 39.9, qty: 1, checked: true },
  { emoji: '🥩', name: '原切牛肉粒', price: 32.9, qty: 1, checked: true },
];

// 购物车选中的地址ID（null 表示未选择）
let cartSelectedAddressId = null;

// 初始化购物车角标
updateCartBadge();

function addToCart(emoji, name, price) {
  const existing = cartItems.find((i) => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ emoji, name, price, qty: 1, checked: true });
  }
  updateCartBadge();
  showToast('已加入购物车');
}

function removeFromCart(name) {
  cartItems = cartItems.filter((i) => i.name !== name);
  updateCartBadge();
  renderCart();
}

function updateQty(name, delta) {
  const item = cartItems.find((i) => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(name);
    return;
  }
  renderCart();
}

function toggleCheck(checked) {
  cartItems.forEach((i) => (i.checked = checked));
  renderCart();
}

function toggleCheckAll() {
  const checked = document.getElementById('cartCheckAll').checked;
  cartItems.forEach((i) => (i.checked = checked));
  renderCart();
}

function updateCartBadge() {
  const total = cartItems.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}

function renderCart() {
  const emptyEl = document.getElementById('cartEmpty');
  const contentEl = document.getElementById('cartContent');
  const itemsEl = document.getElementById('cartItems');
  const bottomEl = document.getElementById('cartBottom');

  if (cartItems.length === 0) {
    emptyEl.style.display = 'flex';
    contentEl.style.display = 'none';
    bottomEl.classList.add('hidden');
    return;
  }

  emptyEl.style.display = 'none';
  contentEl.style.display = 'block';
  bottomEl.classList.remove('hidden');

  // 渲染地址栏
  renderCartAddress();

  const allChecked = cartItems.every((i) => i.checked);
  document.getElementById('cartCheckAll2').checked = allChecked;

  const checkedTotal = cartItems.filter((i) => i.checked).reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotalPrice').textContent = checkedTotal.toFixed(1);

  const totalQty = cartItems.filter((i) => i.checked).reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartSubmitBtn').textContent = totalQty > 0 ? `结算(${totalQty})` : '结算';
  document.getElementById('cartSubmitBtn').disabled = totalQty === 0;

  itemsEl.innerHTML = cartItems
    .map(
      (item, idx) => `
    <div class="cart-item">
      <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="cartItems[${idx}].checked=this.checked;renderCart()">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price"><span class="unit">¥</span>${item.price.toFixed(1)}</div>
      </div>
      <div class="cart-qty">
        <div class="cart-qty-btn" onclick="updateQty('${item.name}', -1)">−</div>
        <div class="cart-qty-num">${item.qty}</div>
        <div class="cart-qty-btn" onclick="updateQty('${item.name}', 1)">+</div>
      </div>
    </div>
  `,
    )
    .join('');
}

// 零食全家桶：添加5个商品
function addFamilyBucket() {
  const items = [
    { emoji: '🍖', name: '磨牙洁齿棒', price: 19.9 },
    { emoji: '🐟', name: '三文鱼冻干', price: 29.9 },
    { emoji: '🧀', name: '芝士训练饼干', price: 15.9 },
    { emoji: '🥩', name: '原切牛肉粒', price: 24.9 },
    { emoji: '🍗', name: '鸡肉绕钙奶棒', price: 32.9 },
  ];
  items.forEach((i) => addToCart(i.emoji, i.name, i.price));
  showToast('已添加零食全家桶(5件)到购物车 🎉');

  var cartNav = document.querySelector('.nav-item[onclick*="cart"]');
  if (cartNav) switchTab('cart', cartNav);
}

// ============ 购物车地址选择 ============

// 渲染购物车顶部地址栏
function renderCartAddress() {
  const infoEl = document.getElementById('cartAddressInfo');
  if (!infoEl) return;

  // 自动选择默认地址
  if (!cartSelectedAddressId && typeof profileAddresses !== 'undefined' && profileAddresses.length > 0) {
    const defaultAddr = profileAddresses.find((a) => a.isDefault);
    cartSelectedAddressId = defaultAddr ? defaultAddr.id : profileAddresses[0].id;
  }

  if (cartSelectedAddressId && typeof profileAddresses !== 'undefined') {
    const addr = profileAddresses.find((a) => a.id === cartSelectedAddressId);
    if (addr) {
      infoEl.innerHTML = `
        <div class="cart-address-bar-name">${addr.name} <span>${addr.phone}</span></div>
        <div class="cart-address-bar-detail">${addr.region} ${addr.detail}</div>
      `;
      return;
    }
  }

  // 无地址
  cartSelectedAddressId = null;
  infoEl.innerHTML = '<div class="cart-address-bar-text">请选择收货地址</div>';
}

// 从购物车打开地址列表（选择模式）
function openCartAddressList() {
  if (typeof profileAddresses === 'undefined') return;
  window._cartAddressMode = true;
  if (typeof openAddressListPopup === 'function') {
    openAddressListPopup();
  }
}

// 在地址列表中选择地址（供地址卡片点击调用）
function selectCartAddress(id) {
  cartSelectedAddressId = id;
  renderCartAddress();
  if (typeof closeAddressListPopup === 'function') {
    closeAddressListPopup();
  }
  if (typeof renderAddressListPopupBody === 'function') {
    window._cartAddressMode = false;
  }
}
