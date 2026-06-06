// ============ 答题分页状态 ============
let quizCurrentIndex = 0;
let quizAutoAdvanceTimer = null;

// 重置答题状态
function resetQuiz() {
  // 清除定时器
  if (quizAutoAdvanceTimer) { clearTimeout(quizAutoAdvanceTimer); quizAutoAdvanceTimer = null; }
  quizCurrentIndex = 0;
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
  // 显示所有题目（恢复默认状态）
  document.querySelectorAll('#quizQuestionsArea .quiz-field').forEach(f => {
    f.style.display = '';
  });
  // 隐藏导航
  document.getElementById('quizNav').classList.add('hidden');
  document.getElementById('quizSubmitWrap').classList.add('hidden');
}

// ============ 构建可见题目列表 ============
function buildQuestionList() {
  const list = [];

  // 1. 宠物类型始终第一题
  const petField = document.querySelector('#quizPage [data-name="petType"]').closest('.quiz-field');
  list.push(petField);

  // 2. 获取活跃题目集中的可见题目
  const activeSet = getActiveSet();
  if (activeSet) {
    const fields = activeSet.querySelectorAll('.quiz-field');
    fields.forEach(field => {
      if (!field.classList.contains('hidden')) {
        list.push(field);
      }
    });
  }

  return list;
}

// ============ 题目类型判断 ============
function getQuestionType(field) {
  if (field.querySelector('.type-badge.multi')) return 'multi';
  if (field.querySelector('.type-badge.fill')) return 'fill';
  return 'single';
}

// ============ 题目是否已回答 ============
function isQuestionAnswered(field) {
  if (!field) return false;
  const radio = field.querySelector('.quiz-radio.selected');
  const checkbox = field.querySelector('.quiz-checkbox.selected');
  const input = field.querySelector('.quiz-input');
  if (radio) return true;
  if (checkbox) return true;
  if (input && input.value.trim()) return true;
  return false;
}

// ============ 显示指定题目 ============
function showQuestion(index) {
  const questions = buildQuestionList();
  if (questions.length === 0) return;
  if (index < 0) index = 0;
  if (index >= questions.length) index = questions.length - 1;

  quizCurrentIndex = index;

  // 隐藏所有题目
  document.querySelectorAll('#quizQuestionsArea .quiz-field').forEach(f => {
    f.style.display = 'none';
  });

  // 显示当前题目
  const current = questions[index];
  current.style.display = '';
  // 重新触发动画
  current.style.animation = 'none';
  current.offsetHeight; // 强制回流
  current.style.animation = '';

  // 更新导航和进度
  updateNavButtons(questions);
  updateQuizProgress(questions);

  // 自动聚焦第一个输入框
  setTimeout(() => {
    const input = current.querySelector('.quiz-input');
    if (input) input.focus();
  }, 360);
}

// ============ 导航按钮状态 ============
function updateNavButtons(questions) {
  const nav = document.getElementById('quizNav');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  const indicator = document.getElementById('quizNavIndicator');
  const submitWrap = document.getElementById('quizSubmitWrap');

  if (!questions) questions = buildQuestionList();
  const total = questions.length;
  if (total === 0) return;

  const current = questions[quizCurrentIndex];
  const isLast = quizCurrentIndex >= total - 1;
  const isAnswered = isQuestionAnswered(current);

  // 导航栏可见性
  if (total <= 1) {
    nav.classList.add('hidden');
    return;
  }
  nav.classList.remove('hidden');

  // 题目指示器
  indicator.textContent = (quizCurrentIndex + 1) + '/' + total;

  // 上一题
  if (quizCurrentIndex === 0) {
    prevBtn.classList.add('hidden');
  } else {
    prevBtn.classList.remove('hidden');
  }

  // 下一题 / 提交按钮
  if (isLast) {
    // 最后一题：显示提交按钮（需已答完）
    nextBtn.classList.add('hidden');
    if (isAnswered) {
      submitWrap.classList.remove('hidden');
    } else {
      submitWrap.classList.add('hidden');
    }
  } else {
    // 非最后一题
    submitWrap.classList.add('hidden');
    const qType = getQuestionType(current);
    if (qType === 'single') {
      // 单选题：自动跳转，隐藏"下一题"
      nextBtn.classList.add('hidden');
    } else {
      // 多选/填空：需要手动点击"下一题"
      if (isAnswered) {
        nextBtn.classList.remove('hidden');
      } else {
        nextBtn.classList.add('hidden');
      }
    }
  }
}

// ============ 上一题 ============
function goToPrevQuestion() {
  if (quizCurrentIndex > 0) {
    showQuestion(quizCurrentIndex - 1);
  }
}

// ============ 下一题 ============
function goToNextQuestion() {
  const questions = buildQuestionList();
  if (quizCurrentIndex < questions.length - 1) {
    showQuestion(quizCurrentIndex + 1);
  }
}

// ============ 自动跳转（单选用） ============
function autoAdvanceNext() {
  if (quizAutoAdvanceTimer) clearTimeout(quizAutoAdvanceTimer);
  quizAutoAdvanceTimer = setTimeout(() => {
    quizAutoAdvanceTimer = null;
    const questions = buildQuestionList();
    if (quizCurrentIndex < questions.length - 1) {
      showQuestion(quizCurrentIndex + 1);
    } else {
      // 已到最后一题，刷新按钮状态以显示提交按钮
      updateNavButtons(questions);
    }
  }, 350);
}

// ============ 更新进度条 ============
function updateQuizProgress(questions) {
  if (!questions) questions = buildQuestionList();
  const total = questions.length;

  let answered = 0;
  questions.forEach(field => {
    if (isQuestionAnswered(field)) answered++;
  });

  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  document.getElementById('quizProgressFill').style.width = pct + '%';
  document.getElementById('quizProgressText').textContent = answered + '/' + total;
}

// ============ 获取当前活跃的题目集 ============
function getActiveSet() {
  const cat = document.getElementById('catQuestions');
  const dog = document.getElementById('dogQuestions');
  if (!cat.classList.contains('hidden')) return cat;
  if (!dog.classList.contains('hidden')) return dog;
  return null;
}

// ============ 收集答案 ============
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

// ============ AI答题页入口 ============
function navigateToQuiz() {
  // 重置状态
  resetQuiz();

  // 切换到答题页
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item-creator').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('quizPage').classList.add('active');
  // 显示返回按钮
  document.getElementById('headerBack').classList.remove('hidden');

  // 显示第一题（宠物类型选择）
  showQuestion(0);
  // 暂时隐藏导航（选完宠物类型后才显示）
  document.getElementById('quizNav').classList.add('hidden');
}

function goBackFromQuiz() {
  document.getElementById('quizPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.getElementById('headerBack').classList.add('hidden');
  document.querySelectorAll('.nav-item')[0].classList.add('active');
  // 重置答题状态
  resetQuiz();
}

// ============ 单选处理 ============
function selectRadio(el) {
  const group = el.parentElement;
  group.querySelectorAll('.quiz-radio').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');

  // --- 宠物类型切换 ---
  if (group.dataset.name === 'petType') {
    if (el.dataset.value === '猫') {
      document.getElementById('catQuestions').classList.remove('hidden');
      document.getElementById('dogQuestions').classList.add('hidden');
    } else if (el.dataset.value === '狗') {
      document.getElementById('dogQuestions').classList.remove('hidden');
      document.getElementById('catQuestions').classList.add('hidden');
    }
    // 更新进度
    updateQuizProgress();
    // 自动跳转到第一道宠物题目
    autoAdvanceNext();
    return;
  }

  // --- 条件字段处理 ---
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

  // 更新进度 & 导航
  updateQuizProgress();
  updateNavButtons();

  // 单选题自动跳转下一题
  autoAdvanceNext();
}

// ============ 多选处理 ============
function toggleCheckbox(el) {
  el.classList.toggle('selected');
  updateQuizProgress();
  updateNavButtons();
}

// ============ 文本输入处理 ============
function onQuizInput(el) {
  if (el.value.trim()) {
    el.classList.add('has-value');
  } else {
    el.classList.remove('has-value');
  }
  updateQuizProgress();
  updateNavButtons();
}

// ============ 提交 ============
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

// ============ 购买选项 ============
function openPurchaseOptions() {
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

// ============ 海报返回 ============
function goBackFromPoster() {
  document.getElementById('posterPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.getElementById('headerBack').classList.add('hidden');
  document.querySelectorAll('.nav-item')[0].classList.add('active');
}
