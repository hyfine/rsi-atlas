import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

export const root=fileURLToPath(new URL('../',import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const xml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const markdown=value=>String(value).replaceAll('|','\\|').replace(/[\r\n]+/g,' ');
function architectureSVG(family){
  const marker=`architecture-arrow-${family.id}`;
  const map=new Map(family.nodes.map(node=>[node.id,node]));
  const port=(node,side)=>{
    const[x,y,w,h]=node.box;
    const ports={left:[x,y+h/2],right:[x+w,y+h/2],top:[x+w/2,y],bottom:[x+w/2,y+h]};
    assert.ok(Object.hasOwn(ports,side),`Unknown family port ${side}`);
    return ports[side];
  };
  const edges=family.diagram.edges.map(edge=>{
    assert.ok(map.has(edge.from)&&map.has(edge.to),`Unknown family edge ${family.id}`);
    const [from,to]=edge.ports.split('-');
    const points=[port(map.get(edge.from),from),...(edge.via??[]),port(map.get(edge.to),to)];
    const pathData=points.map(([x,y],index)=>(index?'L':'M')+x+' '+y).join('');
    let label='';
    if(edge.label){
      assert.ok(edge.at?.length===2,`Missing family edge label position ${family.id}`);
      const [x,y]=edge.at,width=Array.from(edge.label).reduce((n,c)=>n+(/[^\x00-\x7F]/.test(c)?13:7),14);
      label=`<g class="edge-caption"><rect x="${x-width/2}" y="${y-15}" width="${width}" height="22" rx="5"/><text class="edge-label" x="${x}" y="${y}" text-anchor="middle">${xml(edge.label)}</text></g>`;
    }
    return `<path class="edge${edge.optional?' advice':''}" data-from="${edge.from}" data-to="${edge.to}" d="${pathData}" marker-end="url(#${marker})"/>${label}`;
  }).join('');
  const nodes=family.nodes.map((node,index)=>{
    const [x,y,w,h]=node.box;
    let shape=`<rect class="node ${node.type}" x="${x}" y="${y}" width="${w}" height="${h}" rx="15"/>`;
    if(node.shape==='database')shape=`<path class="node ${node.type}" d="M${x} ${y+17}C${x} ${y-4} ${x+w} ${y-4} ${x+w} ${y+17}V${y+h-17}C${x+w} ${y+h+4} ${x} ${y+h+4} ${x} ${y+h-17}Z"/><ellipse class="database-cap" cx="${x+w/2}" cy="${y+17}" rx="${w/2}" ry="16"/>`;
    if(node.shape==='gate')shape=`<path class="node ${node.type}" d="M${x+24} ${y}H${x+w-24}L${x+w} ${y+h/2}L${x+w-24} ${y+h}H${x+24}L${x} ${y+h/2}Z"/>`;
    const labelY=y+(h<=80?27:node.shape==='database'?48:33),detailY=labelY+27;
    const detail=node.detail.map((line,i)=>`<text class="node-detail" x="${x+w/2}" y="${detailY+i*22}" text-anchor="middle">${xml(line)}</text>`).join('');
    const stack=node.shape==='stack'?`<path class="stack-mark" d="M${x+14} ${y+14}H${x+38}M${x+14} ${y+20}H${x+38}M${x+14} ${y+26}H${x+38}"/>`:'';
    return `<g class="architecture-node" data-node="${index}" data-component="${node.id}">${shape}${stack}<text class="node-label" x="${x+w/2}" y="${labelY}" text-anchor="middle">${xml(node.label)}</text>${detail}</g>`;
  }).join('');
  const regions=family.diagram.regions.map(region=>{const[x,y,w,h]=region.box;return `<g class="architecture-region"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20"/><text x="${x+16}" y="${y+23}">${xml(region.label)}</text></g>`;}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" data-topology="${family.diagram.kind}" role="img" aria-labelledby="architecture-title-${family.id} architecture-desc-${family.id}">
<title id="architecture-title-${family.id}">${family.code} 家族：${xml(family.title)}整体思想架构</title>
<desc id="architecture-desc-${family.id}">本文原创分类架构，不是某篇论文原图。${xml(family.idea)} ${xml(family.distinction)}</desc>
<style>.node{fill:var(--node,#152b43);stroke:var(--line,#43647f);stroke-width:1.6}.state,.candidate{stroke:var(--accent,#69d8c8);stroke-width:2.5}.gate{stroke:var(--gold,#ffd08a)}.edge{fill:none;stroke:var(--accent,#69d8c8);stroke-width:2}.advice{stroke:var(--gold,#ffd08a);stroke-dasharray:6 4}.node-label{fill:var(--text,#edf5ff);font:20px system-ui,sans-serif;font-weight:650}.node-detail{fill:var(--muted,#b8cadb);font:14px system-ui,sans-serif}.edge-label{fill:var(--muted,#b8cadb);font:13px system-ui,sans-serif}.edge-caption rect{fill:var(--bg,#0b1727)}.selected .node{stroke:var(--focus,#fff);stroke-width:3.5}.database-cap{fill:none;stroke:var(--accent,#69d8c8);stroke-width:1.5}.stack-mark{stroke:var(--accent,#69d8c8);stroke-width:2}.architecture-region rect{fill:var(--panel,#102238);fill-opacity:.6;stroke:var(--line,#43647f);stroke-dasharray:5 6}.architecture-region text{fill:var(--muted,#b8cadb);font:14px system-ui,sans-serif}</style>
<rect width="1200" height="900" rx="20" fill="var(--bg,#0b1727)"/>
<defs><marker id="${marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent,#69d8c8)"/></marker></defs>
<text x="600" y="39" text-anchor="middle" fill="var(--text,#edf5ff)" font-family="system-ui,sans-serif" font-size="26" font-weight="700">${family.code} · ${xml(family.archetype)}</text>
<text x="600" y="69" text-anchor="middle" fill="var(--muted,#b8cadb)" font-family="system-ui,sans-serif" font-size="14">${xml(family.diagram.caption)}</text>
${regions}
${edges}
${nodes}
<rect x="30" y="790" width="1140" height="86" rx="14" fill="var(--panel,#102238)" stroke="var(--line,#43647f)"/>
<text x="52" y="817" fill="var(--text,#edf5ff)" font-family="system-ui,sans-serif" font-size="14">持久对象：${xml(family.persistent)}</text>
<text x="52" y="844" fill="var(--muted,#b8cadb)" font-family="system-ui,sans-serif" font-size="13">${xml(family.boundary)}</text>
<text x="600" y="895" text-anchor="middle" fill="var(--muted,#b8cadb)" font-family="system-ui,sans-serif" font-size="12">原创家族架构，不是某篇论文原图；虚线表示可选更新或建议审计，不保证所有方法实现。</text>
</svg>\n`;
}

function flowSVG(family,scene){
  const coordinates=[[150,130],[460,130],[770,130],[770,300],[460,300],[150,300]];
  const lines=['M265 130H345','M575 130H655','M770 175V255','M655 300H575','M345 300H265'];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 480" role="img" aria-labelledby="flow-title-${family.id}"><title id="flow-title-${family.id}">${family.code} 家族代表流程：${xml(scene.title)}</title><rect width="920" height="480" rx="20" fill="#101c2d"/><defs><marker id="flow-arrow-${family.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#63d4ca"/></marker></defs><text x="460" y="42" text-anchor="middle" fill="#edf5ff" font-family="system-ui,sans-serif" font-size="25">${xml(scene.title)}</text><text x="460" y="71" text-anchor="middle" fill="#b0c1d5" font-family="system-ui,sans-serif" font-size="14">代表方法或分析性协议，不代替家族整体架构；不是所有论文共同算法。</text>${lines.map(d=>`<path d="${d}" fill="none" stroke="#63d4ca" stroke-width="2" marker-end="url(#flow-arrow-${family.id})"/>`).join('')}<path d="M35 300H14V130H35" fill="none" stroke="#ffcb78" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#flow-arrow-${family.id})"/>${scene.steps.map((step,index)=>{const[x,y]=coordinates[index];return `<g data-step="${index}"><rect x="${x-115}" y="${y-45}" width="230" height="90" rx="14" fill="#17283e" stroke="#36516c"/><text x="${x}" y="${y-12}" text-anchor="middle" fill="#63d4ca" font-family="system-ui,sans-serif" font-size="13">STEP ${index+1}</text><text x="${x}" y="${y+20}" text-anchor="middle" fill="#edf5ff" font-family="system-ui,sans-serif" font-size="18">${xml(step.label)}</text></g>`;}).join('')}<text x="460" y="395" text-anchor="middle" fill="#b0c1d5" font-family="system-ui,sans-serif" font-size="15">变化：${xml(scene.object)}</text><text x="460" y="426" text-anchor="middle" fill="#ffcb78" font-family="system-ui,sans-serif" font-size="14">具体冻结边界、反馈局限与所读版本见 HTML。</text><text x="460" y="454" text-anchor="middle" fill="#b0c1d5" font-family="system-ui,sans-serif" font-size="13">虚线表示回流可能，不保证每轮改善，不是实验轨迹。</text></svg>\n`;
}

function guide(families,prefix,figureGuide){
  return `# A–F 家族整体思想架构

六张图不再复用同一种八节点循环。每种拓扑突出该类真正改变的资产与反馈结构；它们是原创分析视图，不冒充领域统一分类、论文原图或已完成复现实验。

| 家族 | 一眼识别的结构 | 持久对象 |
|---|---|---|
${families.map(family=>`| ${family.code} · ${family.title} | ${family.archetype} | ${markdown(family.persistent)} |`).join('\n')}

家族架构、代表方法流程和论文原图是三种层次。虚线表示可选更新或建议审计，不声称每篇论文均实现。[论文原图与许可](${figureGuide})单列。

${families.map(family=>`## ${family.code}. ${family.title}\n\n**图的读法：${family.archetype}。** ${family.diagram.caption}\n\n${family.idea}\n\n![${family.code} 家族整体思想架构](${prefix}pics/family-${family.id}-architecture.svg)\n\n[交互架构](${prefix}pics/family-${family.id}-architecture.html) · [代表流程](${prefix}pics/family-${family.id}-flow.html)\n\n- **持久对象：**${family.persistent}。\n- **方法边界：**${family.distinction}\n- **验证重点：**${family.evidence}\n- **固定与外部依赖：**${family.boundary}\n\n原始来源：${family.sources.map(source=>`[${source.name}](${source.url})`).join(' · ')}。\n`).join('\n')}`;
}

function paperGuide(manifest,prefix){
  return `# 论文原图：来源、版本与复用许可\n\n与家族原创架构分开：下列为明确 CC BY 4.0 的原论文 HTML/PDF 图形区域截图，不是本文重绘，也不是全领域共享的算法。局部裁图明确标记，仅转换显示/裁取区域，未改动图内内容；完整图与图注通过原文访问。作者结论不等于本文复现。\n\n目前嵌入 ${manifest.figures.length} 幅已核验图或明确标记的局部，其余条目保留原文与明确的图像状态；不声称所有论文已经配图，也不为未知图号制造“Figure 1”。arXiv 非独占分发许可不自动授予本项目再分发权。\n\n${manifest.figures.map(figure=>`## ${figure.paper}\n\n![${figure.paper} 原论文 ${figure.figure}](${prefix}${figure.asset})\n\n**原图：**${figure.figure}，${figure.version}。[原论文图位置](${figure.source_url}) · [许可：CC BY 4.0](${figure.license_url})。\n\n**作者署名：**${figure.authors.map(markdown).join('；')}。\n\n**如何读图：**${figure.explanation}\n\n**版本与变更：**${figure.changes}。图内原有标签保留英文，不将其伪装为中文原创家族图。文件 SHA-256：\`${figure.sha256}\`。\n`).join('\n')}\n## 全部精选论文的图像状态\n\n| 论文 | 状态 | 来源 |\n|---|---|---|\n${manifest.papers.map(paper=>`| ${markdown(paper.method)} | ${paper.status==='included_cc_by'?'已嵌入授权原图/明确局部':paper.status==='link_only_license_not_granted'?'所查版本未提供再分发许可，仅链接':'尚未逐图核验，仅链接'} | [原文](${paper.primary_url})${paper.license_url?` · [所查许可](${paper.license_url})`:''} |`).join('\n')}\n`;
}

function wireChapters(destination,families,manifest){
  const chapterRoot=path.join(destination,'docs/zh/chapters');
  const targets={a:'02_Training_Environments_and_AI_Research.md',b:'02_Training_Environments_and_AI_Research.md',c:'03_Agent_Skills_and_Harness.md',d:'03_Agent_Skills_and_Harness.md',e:'04_Meta_RSI_Evaluation_and_Safety.md',f:'04_Meta_RSI_Evaluation_and_Safety.md'};
  const attachments=[];
  for(const name of new Set(Object.values(targets))){
    const file=path.join(chapterRoot,name);
    assert.ok(fs.existsSync(file),`Missing chapter for family images: ${file}`);
    const original=fs.readFileSync(file,'utf8');
    let text=original;
    for(const family of families.filter(item=>targets[item.id]===name)){
      const start=`<!-- family-${family.id}-architecture:start -->`,end=`<!-- family-${family.id}-architecture:end -->`;
      const asset=path.relative(chapterRoot,path.join(destination,'pics',`family-${family.id}-architecture.svg`)).split(path.sep).join('/');
      const html=asset.replace(/\.svg$/,'.html');
      const guideName='../08_Family_Architectures.md';
      const block=`${start}\n![${family.code} 家族整体思想架构](${asset})\n\n[交互架构](${html}) · [六家族说明](${guideName})。${family.idea} 这是家族级原创架构；下方流程图是代表方法或参考协议，二者不互相替代。\n${end}\n\n`;
      const old=new RegExp(`${start}[\\s\\S]*?${end}\\s*`);
      if(old.test(text))text=text.replace(old,block);
      else{
        const flow=new RegExp(`^!\\[[^\\]]*\\]\\([^\\n)]*family-${family.id}-flow\\.svg\\)\\s*$`,'m');
        assert.ok(flow.test(text),`No expected family-${family.id} flow anchor in ${name}`);
        text=text.replace(flow,match=>block+match);
      }
      const flowAsset=path.relative(chapterRoot,path.join(destination,'pics',`family-${family.id}-flow.svg`)).split(path.sep).join('/');
      text=text.replace(new RegExp(`\\]\\([^\\n)]*family-${family.id}-flow\\.svg\\)`,'g'),`](${flowAsset})`);
    }
    for(const figure of manifest.figures.filter(item=>targets[item.family]===name)){
      const start=`<!-- paper-figure-${figure.id}:start -->`,end=`<!-- paper-figure-${figure.id}:end -->`;
      const asset=path.relative(chapterRoot,path.join(destination,figure.asset)).split(path.sep).join('/');
      const block=`${start}\n![${figure.paper} 原论文 ${figure.figure}](${asset})\n\n原论文 ${figure.figure}（${figure.version}），[作者原文及图注](${figure.source_url})；[CC BY 4.0](${figure.license_url})。${figure.authors.join('；')}。${figure.changes}。${figure.explanation}\n${end}\n\n`;
      const prior=new RegExp(`${start}[\\s\\S]*?${end}\\s*`);
      if(prior.test(text)){text=text.replace(prior,block);attachments.push({paper:figure.paper,chapter:name,placement:'existing_paper_block'});continue;}
      const heading=new RegExp(`^#{2,4}[^\\n]*(?:${figure.heading_pattern})[^\\n]*$`,'mi');
      const match=text.match(heading);
      if(match){text=text.replace(heading,value=>value+'\n\n'+block.trimEnd());attachments.push({paper:figure.paper,chapter:name,placement:'paper_heading'});}
      else{
        const endOfArchitecture=`<!-- family-${figure.family}-architecture:end -->`;
        assert.ok(text.includes(endOfArchitecture));
        text=text.replace(endOfArchitecture,endOfArchitecture+'\n\n'+block.trimEnd());
        attachments.push({paper:figure.paper,chapter:name,placement:'family_example_explicitly_labelled'});
      }
    }
    assert.equal(fs.readFileSync(file,'utf8'),original,`Chapter changed while wiring images: ${file}`);
    if(text!==original)fs.writeFileSync(file,text);
  }
  return attachments;
}

export function buildFamilyDiagrams(){
  const catalog=read('data/family-architectures.json'),scenes=read('data/dynamic-scenes.json');
  const manifest=read('data/paper-figures.json');
  const template=fs.readFileSync(path.join(root,'scripts/family.template.html'),'utf8');
  assert.equal(template.split('__FAMILY_DATA__').length,2);
  for(const family of catalog.families){
    assert.ok(family.nodes.length>=7&&family.nodes.length<=10);
    assert.equal(new Set(family.nodes.map(node=>node.id)).size,family.nodes.length);
    assert.ok(family.archetype&&family.diagram.kind&&family.diagram.edges.length>=family.nodes.length-1);
    const scene=scenes.scenes.find(item=>item.id===family.scene);
    assert.ok(scene);
    const architecture=architectureSVG(family),flow=flowSVG(family,scene);
    for(const [kind,svg]of [['architecture',architecture],['flow',flow]]){
      const filename=`family-${family.id}-${kind}`;
      fs.writeFileSync(path.join(root,'pics',filename+'.svg'),svg);
      const payload=JSON.stringify({family,scene,default_view:kind}).replaceAll('<','\\u003c');
      const html=template.replace('__ARCHITECTURE_SVG__',architecture).replace('__FLOW_SVG__',flow).replace('__FAMILY_DATA__',payload);
      fs.writeFileSync(path.join(root,'pics',filename+'.html'),html);
    }
  }
  fs.writeFileSync(path.join(root,'docs/zh/08_Family_Architectures.md'),guide(catalog.families,'../../','09_Paper_Figures.md'));
  fs.writeFileSync(path.join(root,'docs/zh/09_Paper_Figures.md'),paperGuide(manifest,'../../'));
  const publicAttachments=wireChapters(root,catalog.families,manifest);
  const count=catalog.families.length;
  return {families:count,architecture_svgs:count,architecture_html:count,flow_svgs:count,flow_html:count,licensed_paper_figures:manifest.figures.length,paper_attachments:publicAttachments};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,2,'Only the canonical repository is maintained; external notes mirroring has been retired');
  console.log(JSON.stringify(buildFamilyDiagrams()));
}
