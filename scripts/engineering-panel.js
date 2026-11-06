let engineeringLimit=18;
function renderEngineering(){
  const data=atlas.engineering_projects;
  if(!data?.projects?.length||!data.categories?.length)throw new Error('Engineering catalog is missing');
  const categories=new Map(data.categories.map(category=>[category.id,category]));
  const activityLabels={active:['Active','活跃'],moderate:['Moderate','一般'],low:['Low','低'],unknown:['Unknown','未知']};
  const pick=(field)=>field[language];
  const format=value=>value.toLocaleString('en-US');
  $('engineering-shortcut').innerHTML='<div class="panel"><strong>'+t('More engineering choices from the workbook','工作簿补充的工程导航')+'</strong><p>'+data.projects.length+' '+t('project entries across ','个工程入口，覆盖 ')+data.categories.length+' '+t('purpose categories; kept separate from the six source-pinned reviews.','类改进目的；与六个固定源码深读分开呈现。')+'</p><button type="button" class="engineering-more" id="engineering-jump">'+t('Browse engineering catalog ↓','进入工程导航 ↓')+'</button> '+link('docs/zh/13_Open_Source_Engineering.md',t('Full comparison guide ↗','完整对照指南 ↗'))+'</div>';
  $('engineering-jump').onclick=()=>$('engineering-catalog').scrollIntoView({behavior:'instant',block:'start'});
  const options=(id,items)=>{
    const selected=$(id).value;
    $(id).innerHTML=items.map(([value,label])=>'<option value="'+esc(value)+'">'+esc(label)+'</option>').join('');
    if(items.some(([value])=>value===selected))$(id).value=selected;
  };
  options('engineering-category',[['',t('All categories','全部分类')],...data.categories.map(category=>[category.id,pick(category.name)])]);
  options('engineering-activity',[['',t('All activity states','全部活跃度')],...Object.entries(activityLabels).map(([value,labels])=>[value,t(...labels)])]);
  options('engineering-sort',[['stars',t('Workbook stars ↓','工作簿 Star ↓')],['name',t('Repository A–Z','仓库名称 A–Z')],['category',t('Category','分类')],['activity',t('Activity','活跃度')]]);
  $('engineering-search').placeholder=t('Name, target, method, language…','名称、改进对象、方法、语言…');
  const chosen=$('engineering-category').value,activity=$('engineering-activity').value,sort=$('engineering-sort').value;
  const query=$('engineering-search').value.trim().toLowerCase();
  const projects=data.projects.filter(project=>{
    if(chosen&&project.category_id!==chosen||activity&&project.activity!==activity)return false;
    const category=categories.get(project.category_id);
    return !query||[project.repository,project.summary_en,project.summary_zh,project.target_zh,project.mechanism_zh,project.stack_zh,project.license_zh,category.name.en,category.name.zh].join(' ').toLowerCase().includes(query);
  }).sort((a,b)=>{
    if(sort==='name')return a.repository.localeCompare(b.repository);
    if(sort==='category')return a.category_id.localeCompare(b.category_id)||b.stars-a.stars;
    if(sort==='activity')return ['active','moderate','low','unknown'].indexOf(a.activity)-['active','moderate','low','unknown'].indexOf(b.activity)||b.stars-a.stars;
    return b.stars-a.stars||a.repository.localeCompare(b.repository);
  });
  $('engineering-stats').innerHTML=[
    [data.projects.length,t('Unique engineering entries','唯一工程入口')],
    [data.categories.length,t('Primary purpose categories','工程目的主分类')],
    [data.source.workbook_active_count,t('Recorded active in the snapshot','工作簿记录为活跃')],
    [data.excluded.length,t('Excluded candidates retained','保留排除候选')],
  ].map(([value,label])=>'<div class="engineering-stat"><strong>'+format(value)+'</strong><span>'+esc(label)+'</span></div>').join('');
  $('engineering-categories').innerHTML=data.categories.map(category=>'<button class="engineering-category-button" type="button" data-engineering-category="'+category.id+'"><strong>'+data.projects.filter(project=>project.category_id===category.id).length+'</strong>'+esc(pick(category.name))+'</button>').join('');
  $('engineering-categories').querySelectorAll('[data-engineering-category]').forEach(button=>button.onclick=()=>{$('engineering-category').value=button.dataset.engineeringCategory;engineeringLimit=18;renderEngineering();});
  const shown=projects.slice(0,engineeringLimit);
  $('engineering-results').textContent=t('Matching projects: ','匹配工程：')+projects.length+' · '+t('Shown: ','当前展示：')+shown.length+' · '+t('Snapshot: ','快照：')+data.source.collected_on;
  $('engineering-projects').dataset.matchCount=String(projects.length);
  $('engineering-projects').innerHTML=shown.length?shown.map(project=>{
    const category=categories.get(project.category_id);
    const details=[
      [t('Target','改进对象'),project.target_zh],
      [t('Mechanism','核心机制'),project.mechanism_zh],
      [t('Implementation claim','实现形态主张'),project.implementation_zh],
      [t('Recorded author / institution','原记录作者 / 机构'),project.attribution_zh],
      [t('Stack','技术栈'),project.stack_zh],
      [t('Reference','论文 / 出处'),project.reference_zh],
      [t('Last commit relative to snapshot','相对快照的最近提交'),project.last_commit_zh],
      [t('Forks / commits','Fork / 提交数'),(project.forks===null?t('Not recorded','未记录'):format(project.forks))+' / '+(project.commits===null?t('Not recorded','未记录'):format(project.commits))],
    ];
    return '<article class="engineering-project" data-engineering-project="'+esc(project.id)+'"><span class="chip">'+esc(pick(category.name))+'</span><h3>'+link(project.url,project.repository,true)+'</h3><p><strong>'+format(project.stars)+' ★</strong><span class="engineering-license">'+esc(project.license_zh)+'</span><br><span class="meta">'+esc(t(...activityLabels[project.activity]))+' · '+t('workbook snapshot, not live metrics','工作簿快照，不是实时数据')+'</span></p><p>'+esc(language==='en'?project.summary_en:project.summary_zh)+'</p><p class="engineering-caveat">'+esc(language==='en'?pick(category.caveat):project.caveat_zh)+'</p><details><summary>'+t('Source fields · Chinese notes','展开原始字段与中文备注')+'</summary><dl>'+details.map(([label,value])=>'<dt>'+esc(label)+'</dt><dd>'+esc(value||t('Not recorded','未记录'))+'</dd>').join('')+'</dl></details><div class="card-links">'+link(project.url,t('Repository ↗','仓库 ↗'),true)+(project.deep_dive_id?link('docs/repo_deepdive/cases/'+project.deep_dive_id+'.md',t('Pinned-source deep dive ↗','固定源码深读 ↗')):'')+'</div><p class="engineering-source">'+t('Workbook source: ','工作簿定位：')+esc(project.source.sheet)+' / '+project.source.row+' · '+t('Not newly source-audited','未重新审计此源码')+'</p></article>';
  }).join(''):'<div class="engineering-empty">'+t('No projects match these filters.','没有匹配当前条件的工程。')+'</div>';
  $('engineering-more').hidden=shown.length>=projects.length;
  $('engineering-more').textContent=t('Show more projects','展示更多工程');
  $('engineering-exclusion-title').textContent=t('Excluded candidates and source reasons','排除候选及工作簿理由')+' · '+data.excluded.length;
  $('engineering-exclusion-note').textContent=t('These are the workbook author’s decisions, not new judgments of current repository contents. They are excluded from the included-project counts.','这些是工作簿的原记录判断，不是本次对仓库当前内容重新下结论；不计入收录工程数量。');
  $('engineering-excluded').innerHTML=data.excluded.map(item=>'<li>'+link(item.url,item.repository,true)+' · '+esc(item.category_zh)+'<br><span lang="zh-CN">'+esc(item.reason_zh)+'</span></li>').join('');
  $('engineering-provenance').innerHTML=t('Source: user-provided engineering workbook dated ','来源：用户提供的工程汇总工作簿，采集日 ')+esc(data.source.collected_on)+t('. Stars may be rounded from displayed k values; activity and licenses are recorded claims. The Excel file is not published. ', '。Star 可能由页面 k 值近似展开；活跃度与许可是原记录主张。不发布 Excel 文件。 ')+link('docs/zh/13_Open_Source_Engineering.md',t('Full comparison guide','完整对照指南'))+' · '+link('data/engineering-projects.json',t('Structured data','结构化数据'));
}
for(const id of ['engineering-search','engineering-category','engineering-activity','engineering-sort']){
  $(id).addEventListener(id==='engineering-search'?'input':'change',()=>{engineeringLimit=18;renderEngineering();});
}
$('engineering-more').addEventListener('click',()=>{engineeringLimit+=18;renderEngineering();});
