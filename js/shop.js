// ============ 商品列表页（独立页面） ============

// 商品数据：按分类组织
const shopProducts = {
  snack: [
    { id: 'chicken-stick', name: '鸡肉缠绕磨牙棒', emoji: '🦴', price: 25.9, orig: 39.9, sales: 3280, tag: 'hot', tagText: '热卖' },
    { id: 'salmon-freeze', name: '深海三文鱼冻干', emoji: '🐟', price: 39.9, orig: 59.9, sales: 1890, tag: 'new', tagText: '新品' },
    { id: 'cheese-biscuit', name: '芝士训练饼干', emoji: '🧀', price: 18.9, orig: 29.9, sales: 5120, tag: 'best', tagText: '爆款' },
    { id: 'beef-grain', name: '原切牛肉粒', emoji: '🥩', price: 32.9, orig: 45.9, sales: 2460, tag: 'hot', tagText: '热卖' },
    { id: 'teeth-stick', name: '磨牙洁齿棒', emoji: '🦴', price: 19.9, orig: 39.9, sales: 5890, tag: 'hot', tagText: '限时' },
    { id: 'duck-strip', name: '鸭肉缠绕薯条', emoji: '🍟', price: 22.9, orig: 36.9, sales: 1760, tag: 'new', tagText: '新品' },
    { id: 'lamb-grain', name: '羊肉粒零食', emoji: '🍖', price: 28.9, orig: 42.9, sales: 1350, tag: '', tagText: '' },
    { id: 'shrimp-dry', name: '南极磷虾干', emoji: '🦐', price: 35.9, orig: 55.9, sales: 980, tag: 'new', tagText: '新品' }
  ],
  staple: [
    { id: 'chicken-rice', name: '鸡肉益生菌粮', emoji: '🍚', price: 89.0, orig: 128.0, sales: 2100, tag: 'best', tagText: '爆款' },
    { id: 'salmon-rice', name: '三文鱼全期粮', emoji: '🐠', price: 108.0, orig: 158.0, sales: 1680, tag: 'hot', tagText: '热卖' },
    { id: 'beef-can', name: '牛肉蔬菜罐头', emoji: '🥫', price: 15.9, orig: 22.9, sales: 4320, tag: 'hot', tagText: '热卖' },
    { id: 'lamb-can', name: '羊肉胡萝卜罐头', emoji: '🥘', price: 16.9, orig: 24.9, sales: 2980, tag: '', tagText: '' },
    { id: 'puppy-milk', name: '幼犬羊奶粉', emoji: '🍼', price: 68.0, orig: 98.0, sales: 1560, tag: '', tagText: '' },
    { id: 'senior-food', name: '老年犬配方粮', emoji: '🦴', price: 128.0, orig: 168.0, sales: 890, tag: 'new', tagText: '新品' }
  ],
  brand: [
    { id: 'brand-royal', name: '皇家犬粮小型犬', emoji: '👑', price: 158.0, orig: 198.0, sales: 3450, tag: 'best', tagText: '大牌' },
    { id: 'brand-purina', name: '冠能全价犬粮', emoji: '⭐', price: 138.0, orig: 168.0, sales: 2890, tag: 'hot', tagText: '热卖' },
    { id: 'brand-hills', name: '希尔思处方粮', emoji: '💊', price: 228.0, orig: 268.0, sales: 760, tag: '', tagText: '' },
    { id: 'brand-acana', name: '爱肯拿草原犬粮', emoji: '🌾', price: 198.0, orig: 248.0, sales: 1230, tag: 'hot', tagText: '热卖' },
    { id: 'brand-orijen', name: '渴望六种鱼', emoji: '🐟', price: 258.0, orig: 298.0, sales: 980, tag: 'best', tagText: '大牌' },
    { id: 'brand-nulo', name: 'Nulo自由系列', emoji: '🏃', price: 168.0, orig: 208.0, sales: 650, tag: '', tagText: '' }
  ],
  clothes: [
    { id: 'cloth-vest', name: '秋冬保暖马甲', emoji: '🦺', price: 49.9, orig: 79.9, sales: 1890, tag: 'hot', tagText: '热卖' },
    { id: 'cloth-rain', name: '宠物透明雨衣', emoji: '🌂', price: 35.9, orig: 55.9, sales: 1340, tag: '', tagText: '' },
    { id: 'cloth-sweater', name: '针织毛衣', emoji: '🧶', price: 42.9, orig: 68.9, sales: 980, tag: 'new', tagText: '新品' },
    { id: 'cloth-shoe', name: '防滑小鞋子', emoji: '👟', price: 29.9, orig: 45.9, sales: 760, tag: '', tagText: '' },
    { id: 'cloth-collar', name: '真皮项圈', emoji: '⭕', price: 68.0, orig: 98.0, sales: 1120, tag: 'best', tagText: '爆款' },
    { id: 'cloth-bow', name: '蝴蝶结发饰', emoji: '🎀', price: 12.9, orig: 19.9, sales: 2560, tag: 'hot', tagText: '热卖' }
  ],
  toy: [
    { id: 'toy-ball', name: '耐咬发声球', emoji: '⚽', price: 19.9, orig: 29.9, sales: 4320, tag: 'best', tagText: '爆款' },
    { id: 'toy-rope', name: '互动拔河绳', emoji: '🪢', price: 22.9, orig: 35.9, sales: 2870, tag: 'hot', tagText: '热卖' },
    { id: 'toy-frisbee', name: '户外飞盘', emoji: '🥏', price: 25.9, orig: 39.9, sales: 1980, tag: '', tagText: '' },
    { id: 'toy-plush', name: '发声毛绒玩具', emoji: '🧸', price: 18.9, orig: 28.9, sales: 3450, tag: 'hot', tagText: '热卖' },
    { id: 'toy-teaser', name: '逗猫棒套装', emoji: '🎣', price: 15.9, orig: 25.9, sales: 5120, tag: 'best', tagText: '爆款' },
    { id: 'toy-tunnel', name: '折叠隧道', emoji: '🕳️', price: 39.9, orig: 59.9, sales: 1230, tag: '', tagText: '' }
  ],
  clean: [
    { id: 'clean-shampoo', name: '宠物香波', emoji: '🧴', price: 39.9, orig: 55.9, sales: 2890, tag: 'hot', tagText: '热卖' },
    { id: 'clean-tooth', name: '宠物牙膏套装', emoji: '🪥', price: 29.9, orig: 45.9, sales: 1670, tag: '', tagText: '' },
    { id: 'clean-wipe', name: '除菌湿巾', emoji: '🧻', price: 15.9, orig: 24.9, sales: 5430, tag: 'best', tagText: '爆款' },
    { id: 'clean-ear', name: '耳部清洁液', emoji: '👂', price: 25.9, orig: 38.9, sales: 1230, tag: '', tagText: '' }
  ],
  health: [
    { id: 'health-vitamin', name: '综合维生素片', emoji: '💊', price: 68.0, orig: 98.0, sales: 1870, tag: 'hot', tagText: '热卖' },
    { id: 'health-probiotic', name: '宠物益生菌', emoji: '🦠', price: 45.9, orig: 68.9, sales: 2340, tag: 'best', tagText: '爆款' },
    { id: 'health-joint', name: '关节养护片', emoji: '🦵', price: 78.0, orig: 118.0, sales: 980, tag: '', tagText: '' },
    { id: 'health-calcium', name: '液体钙', emoji: '🥛', price: 55.9, orig: 79.9, sales: 1450, tag: '', tagText: '' }
  ]
};

// 分类顺序（全部排列）
const catOrder = ['all', 'snack', 'staple', 'brand', 'clothes', 'toy', 'clean', 'health'];

// 当前状态
var currentShopCat = 'all';
var currentShopFilter = 'default';
var currentShopKeyword = '';

// ============ 打开商品列表页 ============
function openShopPage(cat, tabEl) {
  // 更新首页Tab高亮（仅当从首页Tab点击时）
  if (tabEl) {
    document.querySelectorAll('.shop-cat-tab').forEach(function(t) { t.classList.remove('active'); });
    tabEl.classList.add('active');
  }

  // 切换到shopPage
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('shopPage').classList.add('active');

  // 显示返回按钮
  document.getElementById('headerBack').classList.remove('hidden');
  document.getElementById('headerBack').onclick = goBackFromShop;

  // 滚动到顶部
  setTimeout(function() {
    var main = document.querySelector('.main-content');
    if (main) main.scrollTop = 0;
  }, 50);

  // 高亮对应分类
  switchShopCategory(cat || 'all', null);
}

// ============ 从商品列表返回首页 ============
function goBackFromShop() {
  document.getElementById('shopPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.getElementById('headerBack').classList.add('hidden');
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var homeNav = document.querySelector('.nav-item[onclick*="home"]');
  if (homeNav) homeNav.classList.add('active');
}

// ============ 切换分类 ============
function switchShopCategory(cat, el) {
  currentShopCat = cat;
  currentShopFilter = 'default';
  currentShopKeyword = '';
  var input = document.getElementById('shopSearchInput');
  if (input) input.value = '';
  var clear = document.getElementById('shopSearchClear');
  if (clear) clear.classList.add('hidden');

  // 同步侧边栏高亮
  document.querySelectorAll('.shop-sidebar-item').forEach(function(s) { s.classList.remove('active'); });
  if (el && el.classList.contains('shop-sidebar-item')) {
    el.classList.add('active');
  } else {
    var target = document.querySelector('.shop-sidebar-item[data-cat="' + cat + '"]');
    if (target) target.classList.add('active');
  }

  // 重置筛选
  document.querySelectorAll('.shop-filter-chip').forEach(function(c) { c.classList.remove('active'); });
  var defaultChip = document.querySelector('.shop-filter-chip[data-filter="default"]');
  if (defaultChip) defaultChip.classList.add('active');

  renderShopList();
}

// ============ 设置筛选 ============
function setShopFilter(filter, el) {
  currentShopFilter = filter;
  document.querySelectorAll('.shop-filter-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
  renderShopList();
}

// ============ 搜索过滤 ============
function filterShopProducts() {
  var input = document.getElementById('shopSearchInput');
  currentShopKeyword = input.value.trim().toLowerCase();
  var clear = document.getElementById('shopSearchClear');
  if (clear) clear.classList.toggle('hidden', currentShopKeyword === '');
  renderShopList();
}

function clearShopSearch() {
  document.getElementById('shopSearchInput').value = '';
  currentShopKeyword = '';
  document.getElementById('shopSearchClear').classList.add('hidden');
  renderShopList();
}

// ============ 获取产品列表 ============
function getProducts() {
  if (currentShopCat === 'all') {
    var all = [];
    for (var i = 1; i < catOrder.length; i++) {
      var cat = catOrder[i];
      var items = shopProducts[cat] || [];
      all = all.concat(items.map(function(p) {
        var p2 = Object.assign({}, p);
        p2.fromCat = cat;
        return p2;
      }));
    }
    return all;
  }
  return (shopProducts[currentShopCat] || []).slice();
}

// ============ 渲染商品列表 ============
function renderShopList() {
  var list = document.getElementById('shopList');
  if (!list) return;
  var products = getProducts();

  // 关键词过滤
  if (currentShopKeyword) {
    products = products.filter(function(p) {
      return p.name.toLowerCase().indexOf(currentShopKeyword) !== -1;
    });
  }

  // 排序
  if (currentShopFilter === 'sales') {
    products.sort(function(a, b) { return b.sales - a.sales; });
  } else if (currentShopFilter === 'price-asc') {
    products.sort(function(a, b) { return a.price - b.price; });
  } else if (currentShopFilter === 'price-desc') {
    products.sort(function(a, b) { return b.price - a.price; });
  }

  if (products.length === 0) {
    list.innerHTML = '<div class="shop-empty">' +
      '<div class="shop-empty-icon">🔍</div>' +
      '<div class="shop-empty-text">暂无相关商品</div>' +
      '<div class="shop-empty-sub">换个分类或关键词试试吧</div>' +
      '</div>';
    return;
  }

  list.innerHTML = products.map(function(p) {
    return '<div class="shop-product-card" onclick="openProductDetail(\'' + p.id + '\')">' +
      '<div class="shop-product-img-wrap">' +
        '<div class="shop-product-img">' + p.emoji + '</div>' +
        (p.tag ? '<span class="shop-product-tag ' + p.tag + '">' + p.tagText + '</span>' : '') +
      '</div>' +
      '<div class="shop-product-info">' +
        '<div class="shop-product-name">' + p.name + '</div>' +
        '<div class="shop-product-meta">' +
          '<span class="shop-product-price"><span class="unit">¥</span>' + p.price + '</span>' +
          '<span class="shop-product-orig">¥' + p.orig + '</span>' +
        '</div>' +
        '<div class="shop-product-sales">已售 ' + formatSales(p.sales) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function formatSales(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}
