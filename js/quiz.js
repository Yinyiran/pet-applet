// 重置答题状态
function resetQuiz() {
  // 清除所有单选
  document.querySelectorAll('#quizPage .quiz-radio').forEach(r => r.classList.remove('selected'));
  // 清除所有多选
  document.querySelectorAll('#quizPage .quiz-checkbox').forEach(c => c.classList.remove('selected'));
  // 清除所有输入
  document.querySelectorAll('#quizPage .quiz-input').forEach(i => {
    i.value = '';
    i.classList.remove('has-value');
  });
  // 隐藏题目集
  document.getElementById('catQuestions').classList.add('hidden');
  document.getElementById('dogQuestions').classList.add('hidden');
  // 隐藏条件字段
  document.getElementById('q2Field').classList.add('hidden');
  document.getElementById('q10Field').classList.add('hidden');
  document.getElementById('dQ2Field').classList.add('hidden');
  document.getElementById('dQ10Field').classList.add('hidden');
}

// ============ AI答题页 ============
function navigateToQuiz() {
  // 切换到答题页
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item-creator').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('quizPage').classList.add('active');
  // 显示返回按钮
  document.getElementById('headerBack').classList.remove('hidden');
  updateQuizProgress();
}

function goBackFromQuiz() {
  document.getElementById('quizPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.getElementById('headerBack').classList.add('hidden');
  document.querySelectorAll('.nav-item')[0].classList.add('active');
  // 重置答题状态
  resetQuiz();
}

// 单选
function selectRadio(el) {
  const group = el.parentElement;
  group.querySelectorAll('.quiz-radio').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');

  // 宠物类型切换
  if (group.dataset.name === 'petType') {
    if (el.dataset.value === '猫') {
      document.getElementById('catQuestions').classList.remove('hidden');
      document.getElementById('dogQuestions').classList.add('hidden');
    } else if (el.dataset.value === '狗') {
      document.getElementById('dogQuestions').classList.remove('hidden');
      document.getElementById('catQuestions').classList.add('hidden');
    }
    updateQuizProgress();
    return;
  }

  // 猫咪：Q1选"其他"时显示Q2
  if (el.dataset.value === '其他' && group.dataset.name === 'breed') {
    document.getElementById('q2Field').classList.remove('hidden');
  }
  if (el.dataset.value !== '其他' && group.dataset.name === 'breed') {
    document.getElementById('q2Field').classList.add('hidden');
    document.getElementById('q2Input').value = '';
    document.getElementById('q2Input').classList.remove('has-value');
  }

  // 猫咪：Q9选"多宠"时显示Q10
  if (el.dataset.value === '多宠' && group.dataset.name === 'mode') {
    document.getElementById('q10Field').classList.remove('hidden');
  }
  if (el.dataset.value !== '多宠' && group.dataset.name === 'mode') {
    document.getElementById('q10Field').classList.add('hidden');
    document.getElementById('q10Input').value = '';
    document.getElementById('q10Input').classList.remove('has-value');
  }

  // 狗狗：Q1选"其他"时显示Q2
  if (el.dataset.value === '其他' && group.dataset.name === 'dBreed') {
    document.getElementById('dQ2Field').classList.remove('hidden');
  }
  if (el.dataset.value !== '其他' && group.dataset.name === 'dBreed') {
    document.getElementById('dQ2Field').classList.add('hidden');
    document.getElementById('dQ2Input').value = '';
    document.getElementById('dQ2Input').classList.remove('has-value');
  }

  // 狗狗：Q9选"多宠"时显示Q10
  if (el.dataset.value === '多宠' && group.dataset.name === 'dMode') {
    document.getElementById('dQ10Field').classList.remove('hidden');
  }
  if (el.dataset.value !== '多宠' && group.dataset.name === 'dMode') {
    document.getElementById('dQ10Field').classList.add('hidden');
    document.getElementById('dQ10Input').value = '';
    document.getElementById('dQ10Input').classList.remove('has-value');
  }

  updateQuizProgress();
}

// 多选
function toggleCheckbox(el) {
  el.classList.toggle('selected');
  updateQuizProgress();
}

// 文本输入
function onQuizInput(el) {
  if (el.value.trim()) {
    el.classList.add('has-value');
  } else {
    el.classList.remove('has-value');
  }
  updateQuizProgress();
}

// 获取当前活跃的题目集
function getActiveSet() {
  const cat = document.getElementById('catQuestions');
  const dog = document.getElementById('dogQuestions');
  if (!cat.classList.contains('hidden')) return cat;
  if (!dog.classList.contains('hidden')) return dog;
  return null;
}

// 更新进度
function updateQuizProgress() {
  // 宠物类型选择器始终可见
  const petTypeField = document.querySelector('#quizPage [data-name="petType"]').closest('.quiz-field');
  let answered = petTypeField.querySelector('.quiz-radio.selected') ? 1 : 0;
  let totalVisible = 1;

  const activeSet = getActiveSet();
  if (activeSet) {
    const fields = activeSet.querySelectorAll('.quiz-field:not(.hidden)');
    fields.forEach(field => {
      totalVisible++;
      const radio = field.querySelector('.quiz-radio.selected');
      const checkbox = field.querySelector('.quiz-checkbox.selected');
      const input = field.querySelector('.quiz-input');
      if (radio || checkbox || (input && input.value.trim())) answered++;
    });
  }

  const pct = totalVisible > 0 ? Math.round((answered / totalVisible) * 100) : 0;
  document.getElementById('quizProgressFill').style.width = pct + '%';
  document.getElementById('quizProgressText').textContent = answered + '/' + totalVisible;
}

// 收集答案
function collectAnswers() {
  const result = {};

  // 宠物类型
  const petTypeEl = document.querySelector('#quizPage [data-name="petType"] .quiz-radio.selected');
  if (petTypeEl) result['petType'] = petTypeEl.dataset.value;

  // 收集活跃题目集中的答案
  const activeSet = getActiveSet();
  if (!activeSet) return result;

  // 单选
  activeSet.querySelectorAll('.quiz-radio-group').forEach(group => {
    const name = group.dataset.name;
    const selected = group.querySelector('.quiz-radio.selected');
    if (selected) result[name] = selected.dataset.value;
  });

  // 多选
  activeSet.querySelectorAll('.quiz-checkbox-group').forEach(group => {
    const name = group.dataset.name;
    const selected = Array.from(group.querySelectorAll('.quiz-checkbox.selected')).map(el => el.dataset.value);
    if (selected.length > 0) result[name] = selected;
  });

  // 填空 - 仅收集活跃题目集中的可见输入
  activeSet.querySelectorAll('.quiz-field:not(.hidden) .quiz-input').forEach(input => {
    if (input.value.trim()) result[input.id] = input.value.trim();
  });

  return result;
}

// ============ AI配餐方案生成引擎 ============
function generateMealPlan(petType, answers) {
  const meals = [];
  const isCat = petType === '猫';
  const ageKey = isCat ? 'age' : 'dAge';
  const weightKey = isCat ? 'q7Input' : 'dQ7Input';
  const age = answers[ageKey] || '';
  const weight = parseFloat(answers[weightKey]) || 4;
  const isYoung = age.includes('幼');
  const isOld = age.includes('老');

  if (isCat) {
    // 猫咪配餐
    meals.push({
      icon: '🍗', cls: 'c1', name: '鲜鸡肉冻干颗粒',
      effect: '优质动物蛋白，易消化吸收，助力肌肉健康',
      gram: Math.round(weight * 2.5) + 'g'
    });
    meals.push({
      icon: '🐟', cls: 'c2', name: '深海三文鱼颗粒',
      effect: '富含Omega-3，亮泽毛发，呵护皮肤健康',
      gram: Math.round(weight * 1.8) + 'g'
    });
    if (isOld) {
      meals.push({
        icon: '💊', cls: 'c3', name: '关节养护颗粒',
        effect: '葡萄糖胺+软骨素，延缓关节老化，灵活步履',
        gram: '3g'
      });
    }
    meals.push({
      icon: '🧬', cls: 'c4', name: '牛磺酸强化颗粒',
      effect: '保护视力与心脏功能，猫咪必需氨基酸',
      gram: '2g'
    });
    meals.push({
      icon: '🦠', cls: 'c5', name: '复合益生菌颗粒',
      effect: '平衡肠道菌群，减少软便与消化问题',
      gram: '3g'
    });
    if (isYoung) {
      meals.push({
        icon: '🥛', cls: 'c6', name: '成长钙磷颗粒',
        effect: '促进骨骼发育，幼猫成长关键营养',
        gram: '3g'
      });
    }
  } else {
    // 狗狗配餐
    meals.push({
      icon: '🥩', cls: 'c1', name: '鲜牛肉冻干颗粒',
      effect: '高蛋白低脂肪，强健肌肉，增强免疫力',
      gram: Math.round(weight * 3.5) + 'g'
    });
    meals.push({
      icon: '🍗', cls: 'c2', name: '鲜鸡肉能量颗粒',
      effect: '易消化优质蛋白，每日活力能量来源',
      gram: Math.round(weight * 2.8) + 'g'
    });
    if (isOld) {
      meals.push({
        icon: '🦴', cls: 'c3', name: '关节宝颗粒',
        effect: '氨糖+软骨素配方，守护关节灵活度',
        gram: '5g'
      });
    }
    meals.push({
      icon: '🧬', cls: 'c4', name: '卵磷脂美毛颗粒',
      effect: '含蛋黄卵磷脂，滋养毛囊，被毛蓬松亮泽',
      gram: '4g'
    });
    meals.push({
      icon: '🦠', cls: 'c5', name: '肠胃调理颗粒',
      effect: '多重益生菌+膳食纤维，呵护肠胃健康',
      gram: '4g'
    });
    meals.push({
      icon: '💪', cls: 'c6', name: '综合维生素颗粒',
      effect: '维生素A/D/E/B群全覆盖，均衡每日营养',
      gram: '3g'
    });
  }

  return meals;
}

function renderPoster(answers) {
  const petType = answers['petType'] || '猫';
  const isCat = petType === '猫';
  const breedKey = isCat ? 'breed' : 'dBreed';
  const genderKey = isCat ? 'gender' : 'dGender';
  const ageKey = isCat ? 'age' : 'dAge';
  const neuterKey = isCat ? 'neuter' : 'dNeuter';
  const weightKey = isCat ? 'q7Input' : 'dQ7Input';
  const activityKey = isCat ? 'activity' : 'dActivity';
  const modeKey = isCat ? 'mode' : 'dMode';
  const walkKey = isCat ? null : 'dWalk';

  const breed = answers[breedKey] || '';
  const name = answers[isCat ? 'q3Input' : 'dQ3Input'] || '宝贝';
  const gender = answers[genderKey] || '';
  const age = answers[ageKey] || '';
  const neuter = answers[neuterKey] || '';
  const weight = answers[weightKey] || '';
  const activity = answers[activityKey] || '';
  const mode = answers[modeKey] || '';
  const walk = walkKey ? answers[walkKey] : null;

  // 宠物信息卡片
  const infoItems = [
    { k: '品种', v: breed },
    { k: '性别', v: gender === '公' ? '弟弟 ♂' : gender === '母' ? '妹妹 ♀' : gender },
    { k: '年龄', v: age },
    { k: '绝育', v: neuter },
    { k: '体重', v: weight ? weight + 'kg' : '' },
    { k: '活动量', v: activity },
    { k: '饲养', v: mode }
  ];
  if (walk) infoItems.push({ k: '遛弯', v: walk });

  const emoji = isCat ? '🐱' : '🐶';
  const infoGrid = infoItems
    .filter(item => item.v)
    .map(item => `<div class="poster-info-item"><span class="key">${item.k}</span><span class="val">${item.v}</span></div>`)
    .join('');

  document.getElementById('posterPetInfo').innerHTML = `
    <div class="poster-pet-name"><span class="emoji">${emoji}</span>${name}</div>
    <div class="poster-info-grid">${infoGrid}</div>
  `;

  // 英雄区
  const heroImg = document.getElementById('posterHero').querySelector('.poster-hero-img');
  heroImg.className = 'poster-hero-img ' + (isCat ? 'cat-bg' : 'dog-bg');
  const heroTag = document.getElementById('posterHeroTag');
  heroTag.textContent = isCat ? '🐱 猫咪专属配餐' : '🐶 狗狗专属配餐';

  // 生成配餐
  const meals = generateMealPlan(petType, answers);
  const mealHTML = meals.map((m, i) => `
    <div class="poster-meal-item">
      <div class="poster-meal-dot ${m.cls}">${m.icon}</div>
      <div class="poster-meal-info">
        <div class="poster-meal-name">${m.name}</div>
        <div class="poster-meal-effect">${m.effect}</div>
      </div>
      <div class="poster-meal-gram">${m.gram}</div>
    </div>
  `).join('');
  document.getElementById('posterMealList').innerHTML = mealHTML;

  // 计算价格：4种颗粒约¥89/月起，6种约¥129/月起
  const basePrice = meals.length <= 4 ? 89 : 129;
  document.getElementById('posterBuyPrice').innerHTML = `¥${basePrice}<span>/月起</span>`;
  // 存当前单价到全局方便后续计算
  window._posterBasePrice = basePrice;

  // 滚动到顶部
  document.getElementById('posterPage').querySelector('.poster-scroll').scrollTop = 0;

  // 重置购买选项（默认一日一次餐 + 30天）
  document.querySelectorAll('[data-name="mealFreq"] .purchase-chip').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('[data-name="mealFreq"] .purchase-chip[data-value="1"]').forEach(c => c.classList.add('selected'));
  document.querySelectorAll('[data-name="mealDays"] .purchase-chip').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('[data-name="mealDays"] .purchase-chip[data-value="30"]').forEach(c => c.classList.add('selected'));
  document.getElementById('purchaseTotalPrice').textContent = '¥' + basePrice;
}

// 打开购买选项
function openPurchaseOptions() {
  // 确保总价正确
  updatePurchaseTotal();
  document.getElementById('purchaseOverlay').classList.remove('hidden');
}

function closePurchaseOptions(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('purchaseOverlay').classList.add('hidden');
}

function selectPurchaseOption(el) {
  const group = el.parentElement;
  group.querySelectorAll('.purchase-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  updatePurchaseTotal();
}

function updatePurchaseTotal() {
  const freqChip = document.querySelector('[data-name="mealFreq"] .purchase-chip.selected');
  const daysChip = document.querySelector('[data-name="mealDays"] .purchase-chip.selected');
  const freq = parseInt(freqChip?.dataset.value) || 1;
  const days = parseInt(daysChip?.dataset.value) || 30;
  const basePrice = window._posterBasePrice || 89;
  const total = Math.round(basePrice * freq * (days / 30));
  document.getElementById('purchaseTotalPrice').textContent = '¥' + total;
}

function confirmPurchase() {
  const freqChip = document.querySelector('[data-name="mealFreq"] .purchase-chip.selected');
  const daysChip = document.querySelector('[data-name="mealDays"] .purchase-chip.selected');
  const freq = parseInt(freqChip?.dataset.value) || 1;
  const days = parseInt(daysChip?.dataset.value) || 30;
  const totalPrice = document.getElementById('purchaseTotalPrice').textContent;
  const freqLabel = freq === 1 ? '一日一次餐' : '一日两次餐';

  closePurchaseOptions();
  showToast(`已下单：${freqLabel} × ${days}天，${totalPrice} 🛒`);
}

// 提交
function submitQuiz() {
  // 先验证宠物类型是否选择
  const petTypeEl = document.querySelector('#quizPage [data-name="petType"] .quiz-radio.selected');
  if (!petTypeEl) {
    showToast('请先选择宠物类型');
    return;
  }

  const activeSet = getActiveSet();
  if (!activeSet) {
    showToast('请先选择宠物类型');
    return;
  }

  const answers = collectAnswers();
  console.log('答题数据:', answers);

  // 校验必填（仅可见题目）
  const fields = activeSet.querySelectorAll('.quiz-field:not(.hidden)');
  let allFilled = true;
  fields.forEach(f => {
    const radio = f.querySelector('.quiz-radio.selected');
    const checkbox = f.querySelector('.quiz-checkbox.selected');
    const input = f.querySelector('.quiz-input');
    if (!radio && !checkbox && (!input || !input.value.trim())) {
      allFilled = false;
    }
  });

  if (!allFilled) {
    showToast('请完成所有题目后再提交');
    return;
  }

  const btn = document.getElementById('quizSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'AI分析中…';

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = '提交，开始AI配餐';

    // 生成海报 & 跳转
    renderPoster(answers);
    document.getElementById('quizPage').classList.remove('active');
    document.getElementById('posterPage').classList.add('active');
    document.getElementById('purchaseOverlay').classList.add('hidden');
  }, 800);
}

// 从海报返回首页（header返回按钮）
function goBackFromPoster() {
  document.getElementById('posterPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.getElementById('headerBack').classList.add('hidden');
  document.querySelectorAll('.nav-item')[0].classList.add('active');
}

