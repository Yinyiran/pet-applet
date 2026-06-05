// ============ 同城数据 ============
const cityData = [
  { cat:'shop', icon:'🛒', cls:'shop', name:'宠乐多生活馆', tags:['4.9分','店铺'], desc:'进口主粮、零食、玩具一站式采购，会员享95折', addr:'余杭区文一西路998号' },
  { cat:'shop', icon:'🐾', cls:'shop', name:'爪爪宠物便利店', tags:['4.7分','店铺'], desc:'社区宠物便利店，主营主粮零食及基础用品', addr:'西湖区古墩路388号' },
  { cat:'hospital', icon:'💉', cls:'hospital', name:'瑞鹏宠物医院(城西院)', tags:['4.8分','医院'], desc:'24小时急诊，配备DR、彩超、生化分析仪等设备', addr:'拱墅区莫干山路688号' },
  { cat:'hospital', icon:'🩺', cls:'hospital', name:'芭比堂动物医院', tags:['4.9分','医院'], desc:'专科诊疗：骨科、眼科、牙科，拥有多名执业兽医师', addr:'上城区望江东路168号' },
  { cat:'beauty', icon:'🛁', cls:'beauty', name:'萌宠造型美容工作室', tags:['4.8分','美容'], desc:'韩国宠物美容师驻店，提供造型、SPA、药浴服务', addr:'余杭区荆长路58号' },
  { cat:'beauty', icon:'✂️', cls:'beauty', name:'小爪爪宠物美容', tags:['4.6分','美容'], desc:'专业洗护造型，使用进口洗护产品，宠物友好环境', addr:'西湖区紫荆花路22号' },
  { cat:'park', icon:'🌲', cls:'park', name:'汪汪宠物乐园', tags:['4.7分','乐园'], desc:'占地3000㎡，设有敏捷赛道、游泳池、草坪活动区和宠物咖啡', addr:'余杭区径山镇双溪路1号' },
  { cat:'park', icon:'🏕️', cls:'park', name:'毛小孩户外营地', tags:['4.8分','乐园'], desc:'宠物露营地，可烧烤、徒步、宠物摄影，周末亲子好去处', addr:'临安区青山湖街道8号' },
  { cat:'party', icon:'🎂', cls:'party', name:'宠爱一生宠友会', tags:['4.6分','聚会'], desc:'每月主题聚会：宠物生日趴、品种交流会、领养日活动', addr:'西湖区天目山路208号' },
  { cat:'party', icon:'🐶', cls:'party', name:'哈士奇俱乐部', tags:['4.8分','聚会'], desc:'二哈专属社群，定期组织线下遛狗、游泳、拆家大赛', addr:'余杭区五常大道77号' }
];

// ============ 同城筛选 ============
function filterCity(cat, el) {
  document.querySelectorAll('.city-filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderCityList(cat);
}

function renderCityList(cat) {
  const filtered = cat === 'all' ? cityData : cityData.filter(d => d.cat === cat);
  const listEl = document.getElementById('cityList');
  listEl.innerHTML = filtered.map((d, i) => `
    <div class="city-card" onclick="openCityDetail(${cityData.indexOf(d)})">
      <div class="city-card-img ${d.cls}">${d.icon}</div>
      <div class="city-card-info">
        <div class="city-card-name">${d.name}</div>
        <div class="city-card-tags">
          ${d.tags.map(t => `<span class="city-card-tag ${t.startsWith('4') ? 'score' : 'type'}">${t}</span>`).join('')}
        </div>
        <div class="city-card-desc">${d.desc}</div>
        <div class="city-card-addr">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${d.addr}
        </div>
      </div>
    </div>
  `).join('');
}

// ============ 同城详情 ============
function openCityDetail(idx) {
  const d = cityData[idx];
  document.getElementById('detailHero').className = 'city-detail-hero ' + d.cls;
  document.getElementById('detailHero').textContent = d.icon;
  document.getElementById('detailName').textContent = d.name;
  document.getElementById('detailScore').textContent = d.tags[0];
  document.getElementById('detailDist').textContent = '类型：' + d.tags[1];
  document.getElementById('detailDesc').textContent = d.desc + '。我们致力于为每一位毛孩子提供最优质的服务体验，欢迎携宠到店体验！';
  document.getElementById('detailAddr').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + d.addr;
  document.getElementById('detailBtnCall').onclick = () => showToast('拨打 ' + d.name);
  document.getElementById('detailBtnNav').onclick = () => showToast('导航至 ' + d.addr);
  document.getElementById('cityDetailOverlay').classList.remove('hidden');
}

function closeCityDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('cityDetailOverlay').classList.add('hidden');
}

