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

// ============ 体质检测分析 ============
function generateConstitutionAnalysis(answers, isCat) {
  const age = answers[isCat ? 'age' : 'dAge'] || '';
  const isYoung = age.includes('幼');
  const isOld = age.includes('老');

  // 猫咪维度
  const catDims = [
    {
      key: 'company', label: '情绪陪伴', healthy: ['充足陪伴'],
      tag: '情绪敏感', emoji: '💔',
      texts: {
        '无陪伴': '长期独处容易产生焦虑情绪，建议多陪伴互动',
        '少量陪伴': '陪伴时间有限，可通过益智玩具缓解孤独感'
      }
    },
    {
      key: 'stomach', label: '肠胃健康', healthy: ['肠胃健康'],
      tag: '肠胃敏感', emoji: '🍽️',
      texts: {
        '软便': '肠胃较为敏感，建议低敏易消化配方',
        '便秘': '肠道蠕动偏弱，需增加膳食纤维摄入',
        '频繁呕吐': '消化系统负担较重，建议少食多餐'
      }
    },
    {
      key: 'skin', label: '皮毛健康', healthy: ['皮肤健康'],
      tag: '皮毛养护', emoji: '🐾',
      texts: {
        '掉毛重': '换毛期营养不足，需补充优质蛋白和Omega-3',
        '皮屑瘙痒': '皮肤屏障受损，建议Omega脂肪酸滋养',
        '毛发干枯': '毛发缺乏光泽，卵磷脂美毛配方有助改善'
      }
    },
    {
      key: 'urinary', label: '泌尿健康', healthy: ['泌尿健康'],
      tag: '泌尿调理', emoji: '💧',
      texts: {
        '尿频上火': '泌尿系统偏热，建议清热利尿配方',
        '泪痕重': '内火偏旺，低敏清淡饮食有助减轻泪痕'
      }
    },
    {
      key: 'joint', label: '关节健康', healthy: ['关节健康'],
      tag: '关节养护', emoji: '🦴',
      texts: { '关节老化': '关节灵活度下降，氨糖软骨素有助舒缓' }
    },
    {
      key: 'allergy', label: '过敏体质', healthy: ['无过敏'],
      tag: '过敏体质', emoji: '⚠️',
      texts: {
        '肉类过敏': '对特定肉类蛋白敏感，需严格规避过敏源',
        '谷物过敏': '谷物不耐受，建议选择无谷低敏配方'
      }
    }
  ];

  // 狗狗维度
  const dogDims = [
    {
      key: 'dWalk', label: '运动活力', healthy: ['3～5次', '每天1次以上'],
      tag: '运动不足', emoji: '🏃',
      texts: {
        '＜1次': '运动量严重不足，需关注体重管理与关节负担',
        '1～2次': '运动量偏少，适当增加户外活动时间更有益健康'
      }
    },
    {
      key: 'dStomach', label: '肠胃健康', healthy: ['肠胃健康'],
      tag: '肠胃敏感', emoji: '🍽️',
      texts: {
        '拉稀': '肠道菌群失衡，益生菌调理配方有助改善',
        '挑食': '食欲不稳定，适口性好的鲜肉配方更受欢迎',
        '积食': '消化能力偏弱，建议小颗粒易消化配方'
      }
    },
    {
      key: 'dSkin', label: '皮肤健康', healthy: ['皮肤健康'],
      tag: '皮肤养护', emoji: '🐾',
      texts: {
        '异位性皮炎': '皮肤敏感体质，低敏配方配合Omega脂肪酸有助缓解',
        '季节性脱毛': '换毛期营养需求增加，美毛配方有助减少异常掉毛',
        '瘙痒泛红': '皮肤屏障受损，抗炎舒缓配方有助修护'
      }
    },
    {
      key: 'dTear', label: '泪痕上火', healthy: ['无异常'],
      tag: '泪痕调理', emoji: '💧',
      texts: {
        '顽固泪痕': '泪腺分泌旺盛，清淡低盐配方有助减轻泪痕',
        '易上火': '内火偏旺，鸭肉等凉性食材有助清热降火'
      }
    },
    {
      key: 'dJoint', label: '关节健康', healthy: ['关节健康'],
      tag: '关节养护', emoji: '🦴',
      texts: {
        '髌骨不良': '髌骨问题需长期养护，关节保护配方有助舒缓',
        '关节老化': '关节磨损加剧，氨糖+软骨素双重养护'
      }
    },
    {
      key: 'dMetabolism', label: '代谢健康', healthy: ['代谢正常'],
      tag: '代谢调理', emoji: '⚖️',
      texts: {
        '肥胖高血脂': '体重管理刻不容缓，低脂高纤配方有助控制体重',
        '胰腺敏感': '胰腺负担较重，低脂易消化配方减轻胰腺压力'
      }
    },
    {
      key: 'dAllergy', label: '过敏体质', healthy: ['无过敏'],
      tag: '过敏体质', emoji: '⚠️',
      texts: {
        '肉类过敏': '对特定肉类蛋白敏感，需严格规避过敏源',
        '谷物过敏': '谷物不耐受，无谷低敏配方更适合'
      }
    }
  ];

  const dims = isCat ? catDims : dogDims;
  const issues = [];
  const tags = [];
  let summaryParts = [];

  dims.forEach(dim => {
    const val = answers[dim.key];
    if (!val) return;

    const selected = Array.isArray(val) ? val : [val];
    const problems = selected.filter(v => !dim.healthy.includes(v));

    if (problems.length > 0) {
      issues.push({ ...dim, problems, count: problems.length });
      tags.push({ label: dim.tag, emoji: dim.emoji });
      // 取第一个问题的文本作为该维度摘要
      const firstProblem = problems[0];
      const text = dim.texts[firstProblem];
      if (text) summaryParts.push(text);
    }
  });

  // 体质类型：问题最多的维度，或并列
  issues.sort((a, b) => b.count - a.count);
  const topIssues = issues.filter(i => i.count === (issues[0]?.count || 0));

  let typeLabel, typeEmoji, description;

  if (issues.length === 0) {
    typeLabel = '健康活力型';
    typeEmoji = isCat ? '🐱' : '🐶';
    description = isYoung
      ? '小宝贝目前身体状态很棒，正处于快速成长期，均衡营养是关键'
      : isOld
      ? '毛孩子整体健康状况良好，保持当前养护习惯，适量补充关节和心脏营养'
      : '爱宠各方面指标都很健康，继续保持科学喂养，适当预防即可';
  } else if (topIssues.length === 1) {
    typeLabel = topIssues[0].tag;
    typeEmoji = topIssues[0].emoji;
    const ageHint = isYoung ? '幼年' : isOld ? '老年' : '成年';
    description = `${ageHint}期${isCat ? '猫咪' : '狗狗'}以「${topIssues[0].label}」为主要体质特征。` +
      summaryParts.slice(0, 2).join('；') + '。' +
      (isCat ? '定制配餐已针对性调整营养配比，帮助改善体质。' : '定制颗粒已优化配方，针对性改善核心问题。');
  } else {
    const labels = topIssues.map(i => i.label).join(' · ');
    typeLabel = labels;
    typeEmoji = topIssues[0].emoji;
    const ageHint = isYoung ? '幼年' : isOld ? '老年' : '成年';
    description = `${ageHint}期${isCat ? '猫咪' : '狗狗'}呈现复合型体质特征，${topIssues.map(i => i.label).join('与')}需同时关注。` +
      summaryParts.slice(0, 2).join('；') + '。' +
      '多维度定制颗粒组合，全面覆盖营养调理需求。';
  }

  return {
    typeLabel,
    typeEmoji,
    description,
    tags: tags.length > 0 ? tags : [{ label: '健康活力', emoji: isCat ? '🐱' : '🐶' }]
  };
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

  // 英雄区 - 体质检测分析
  const heroImg = document.getElementById('posterHero').querySelector('.poster-hero-img');
  heroImg.className = 'poster-hero-img ' + (isCat ? 'cat-bg' : 'dog-bg');

  const analysis = generateConstitutionAnalysis(answers, isCat);
  const tagsHTML = analysis.tags.map(t =>
    `<span class="constitution-tag"><span class="tag-emoji">${t.emoji}</span>${t.label}</span>`
  ).join('');

  document.getElementById('posterHeroContent').innerHTML = `
    <div class="constitution-header">
      <div class="constitution-badge">
        <span class="badge-emoji">${analysis.typeEmoji}</span>
        <span class="badge-label">${analysis.typeLabel}</span>
      </div>
    </div>
    <div class="constitution-desc">${analysis.description}</div>
    <div class="constitution-tags">${tagsHTML}</div>
  `;

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

// ============ 生成海报图片 ============
function generatePosterImage() {
  if (typeof html2canvas === 'undefined') {
    showToast('海报生成库加载中，请稍后重试');
    return;
  }

  const scrollEl = document.querySelector('#posterPage .poster-scroll');
  const barEl = document.querySelector('#posterPage .poster-buy-bar');
  if (!scrollEl) return;

  // 隐藏底部栏（避免截入图片）
  if (barEl) barEl.style.display = 'none';
  // 滚动到顶部
  scrollEl.scrollTop = 0;

  showToast('正在生成海报...');

  html2canvas(scrollEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f8f4f0',
      logging: false
    }).then(canvas => {
      if (barEl) barEl.style.display = '';
      const dataUrl = canvas.toDataURL('image/png');
      document.getElementById('posterPreviewImg').src = dataUrl;
      document.getElementById('posterPreviewOverlay').classList.remove('hidden');
    }).catch(err => {
      if (barEl) barEl.style.display = '';
      console.error('生成海报失败:', err);
      showToast('海报生成失败，请重试');
    });
}

// ============ 关闭海报预览 ============
function closePosterPreview(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('posterPreviewOverlay').classList.add('hidden');
  document.getElementById('posterPreviewImg').src = '';
}

// ============ dataUrl 转 Blob ============
function dataUrlToBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

// ============ 保存海报到相册 ============
function downloadPosterImage() {
  const img = document.getElementById('posterPreviewImg');
  if (!img.src || img.src === window.location.href) {
    showToast('请先生成海报');
    return;
  }
  const link = document.createElement('a');
  link.download = '梵优茗宠_AI配餐方案.png';
  link.href = img.src;
  // 某些浏览器需要将 a 标签添加到 DOM 中
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('已保存海报图片 📷');
}

// ============ 分享海报（底部按钮） ============
function sharePoster() {
  const img = document.getElementById('posterPreviewImg');
  // 如果还没生成图片，先生成，生成完自动打开预览弹窗
  if (!img.src || img.src.startsWith('data:image') === false) {
    generatePosterImage();
    return;
  }
  // 已生成，直接打开预览弹窗
  document.getElementById('posterPreviewOverlay').classList.remove('hidden');
}

// ============ 分享海报图片（预览弹窗内按钮） ============
function sharePosterImage() {
  const img = document.getElementById('posterPreviewImg');
  if (!img.src || img.src === window.location.href) {
    showToast('请先生成海报');
    return;
  }

  const blob = dataUrlToBlob(img.src);
  const file = new File([blob], '梵优茗宠_AI配餐方案.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      title: '梵优茗宠 · AI定制配餐方案',
      text: '我家毛孩子的专属AI配餐方案，科学定制，营养更精准！',
      files: [file]
    }).catch(() => {});
  } else if (navigator.share) {
    navigator.share({
      title: '梵优茗宠 · AI定制配餐方案',
      text: '我家毛孩子的专属AI配餐方案，科学定制，营养更精准！',
      url: window.location.href
    }).catch(() => {});
  } else {
    showToast('请长按海报图片分享给好友 📲');
  }
}
