let fanProgress=1,fanFrame=null,fanSelected='A',fanInitialized=false,fanActivated=false;
const fanReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const fanNames={
  A:['Models & training','模型与训练'],B:['Tasks & environments','数据、任务与环境'],C:['Memory & skills','记忆与技能'],
  D:['Harness & workflows','Harness 与工作流'],E:['Feedback & evaluation','反馈与评价'],F:['Research & meta-improvement','科研与元改进'],
};
function updateMethodFan(){
  for(const [index,sector]of Array.from(document.querySelectorAll('#fan-canvas .fan-sector')).entries()){
    const phase=Math.min(1,Math.max(0,fanProgress*6-index));
    const eased=phase*phase*(3-2*phase),rotation=Number(sector.dataset.foldAngle)*(1-eased);
    sector.setAttribute('transform',`rotate(${rotation} 600 650)`);
    sector.style.opacity=String(.16+.84*eased);
    sector.style.pointerEvents=phase===1?'auto':'none';
    sector.setAttribute('aria-hidden',phase===1?'false':'true');
    sector.querySelectorAll('[tabindex]').forEach(node=>node.setAttribute('tabindex',phase===1?'0':'-1'));
  }
  $('fan-angle').textContent=Math.round(fanProgress*180)+'° / 180°';
  $('fan-play').textContent=fanFrame===null?t('Unfold','展开'):t('Pause','暂停');
  $('fan-play').setAttribute('aria-pressed',String(fanFrame!==null));
  window.rsiFanState={progress:fanProgress,angle:fanProgress*180,completed:fanProgress===1,playing:fanFrame!==null,selected:fanSelected,sectors:6};
}
function stopMethodFan(){
  if(fanFrame!==null)cancelAnimationFrame(fanFrame);
  fanFrame=null;
  if(fanInitialized)updateMethodFan();
}
function playMethodFan(reset=false){
  stopMethodFan();
  if(reset||fanProgress===1)fanProgress=0;
  const start=performance.now(),initial=fanProgress;
  const animate=now=>{
    if(document.hidden||currentView!=='survey'){stopMethodFan();return;}
    fanProgress=Math.min(1,initial+(now-start)/5200);
    if(fanProgress===1){fanFrame=null;updateMethodFan();return;}
    fanFrame=requestAnimationFrame(animate);
    updateMethodFan();
  };
  if(fanReduced()){fanProgress=1;updateMethodFan();return;}
  fanFrame=requestAnimationFrame(animate);
  updateMethodFan();
}
function selectFanFamily(code){
  fanSelected=code;
  const eligible=methods.filter(record=>array(record.families).includes(code)&&['method','framework','theory'].includes(record.kind)).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  const old=eligible.filter(record=>record.date<'2025-01-01'),recent=eligible.filter(record=>record.date>='2025-01-01');
  const groups=[[t('Historical foundations & classics','理论基础与经典方法'),old],[t('Recent methods & evolving systems','近年方法与演化系统'),recent]];
  const family=architectures.find(item=>item.code===code);
  $('fan-selected').innerHTML='<h3>'+esc(code+' · '+t(...fanNames[code]))+'</h3><p>'+esc(language==='zh'?family.idea:tr.families?.[code]?.idea||family.archetype_en)+'</p>'+groups.map(([label,records])=>'<h4>'+esc(label)+'</h4><div class="fan-method-list">'+records.map(record=>'<article class="fan-method-card"><button type="button" data-fan-record="'+esc(record.id)+'">'+esc(record.method)+'</button><span>'+esc(record.date)+' · '+esc(kindName(record.kind))+'</span></article>').join('')+'</div>').join('')+'<p class="fan-protocol">'+t('Support records such as benchmarks, surveys and announcements remain in the main method library, rather than masquerading as algorithms.','基准、综述和公司发布等支撑记录保留在主方法库，不冒充算法。')+'</p>';
  $('fan-selected').querySelectorAll('[data-fan-record]').forEach(button=>button.onclick=()=>showMethod(button.dataset.fanRecord));
  $('fan-category-picker').querySelectorAll('[data-fan-pick]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.fanPick===code)));
  updateMethodFan();
}
function renderMethodFan(){
  const first=!fanInitialized;
  $('fan-canvas').innerHTML=drawMethodFan(methods,atlas.families,language);
  $('fan-category-picker').innerHTML=Object.entries(fanNames).map(([code,names])=>'<button type="button" data-fan-pick="'+code+'">'+esc(code+' · '+t(...names))+'</button>').join('');
  const choose=(nodes,attribute,action)=>nodes.forEach(node=>{
    node.addEventListener('click',()=>action(node.dataset[attribute]));
    if(node.tagName.toLowerCase()==='g')node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();action(node.dataset[attribute]);}});
  });
  choose(document.querySelectorAll('[data-fan-family]'),'fanFamily',selectFanFamily);
  choose(document.querySelectorAll('[data-fan-method]'),'fanMethod',showMethod);
  choose(document.querySelectorAll('[data-fan-pick]'),'fanPick',selectFanFamily);
  fanInitialized=true;
  if(first){
    $('fan-replay').onclick=()=>playMethodFan(true);
    $('fan-play').onclick=()=>fanFrame===null?playMethodFan():stopMethodFan();
    $('fan-open').onclick=()=>{stopMethodFan();fanProgress=1;updateMethodFan();};
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMethodFan();});
  }
  selectFanFamily(fanSelected);
  window.rsiFanReady=true;
}
function activateMethodFan(){
  if(!fanActivated){fanActivated=true;playMethodFan(true);}
}
