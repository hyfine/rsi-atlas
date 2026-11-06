import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const directory=path.join(root,'docs/repo_deepdive');
export function validateImplementations(sourceRoot) {
  const meta=JSON.parse(fs.readFileSync(path.join(directory,'repositories.json'),'utf8'));
  const audits=JSON.parse(fs.readFileSync(path.join(directory,'source-audits.json'),'utf8'));
  assert.equal(meta.repos.length,6);
  assert.equal(new Set(meta.repos.map(repo=>repo.id)).size,6);
  assert.equal(audits.repos.length,6);
  let anchors=0,modules=0,flowSteps=0;
  for(const repo of meta.repos){
    assert.match(repo.commit,/^[a-f0-9]{40}$/);
    assert.ok(Number.isInteger(repo.stars)&&repo.stars>0);
    const audit=audits.repos.find(record=>record.id===`${repo.audit_name}@${repo.commit}`);
    assert.ok(audit,`Missing pinned source ${repo.id}`);
    assert.ok(audit.modules.length>=8);
    assert.ok(audit.flow.length>=6);
    modules+=audit.modules.length;flowSteps+=audit.flow.length;
    const ids=new Set(audit.modules.map(module=>module.id));
    assert.equal(ids.size,audit.modules.length);
    for(const edge of audit.architecture_edges)assert.ok(ids.has(edge.from)&&ids.has(edge.to),`Unknown graph node ${repo.id}`);
    assert.ok(fs.existsSync(path.join(directory,'cases',`${repo.id}.md`)));
    let checkout;
    if(sourceRoot){
      checkout=path.resolve(sourceRoot,repo.audit_name.split('/').at(-1));
      const commit=execFileSync('git',['-C',checkout,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
      assert.equal(commit,repo.commit,`Unpinned checkout ${repo.id}`);
    }
    for(const item of [audit.entry,...audit.modules,...audit.flow,...audit.commands]){
      assert.ok(item.path&&!item.path.startsWith('/')&&!item.path.split('/').includes('..'),`Nonportable source path ${repo.id}`);
      assert.ok(Number.isInteger(item.line)&&item.line>0);
      anchors++;
      if(checkout){
        const file=path.join(checkout,item.path);
        assert.ok(fs.existsSync(file)&&fs.statSync(file).isFile(),`Missing source file ${repo.id}/${item.path}`);
        const lines=fs.readFileSync(file,'utf8').split('\n');
        assert.ok(item.line<=lines.length,`Out-of-range anchor ${repo.id}/${item.path}:${item.line}`);
        if(item.symbol&&!/module|__main__/.test(item.symbol)){
          const symbol=item.symbol.split('(')[0];
          assert.ok(lines[item.line-1].includes(symbol),`Symbol anchor mismatch ${repo.id}/${item.path}:${item.line} ${symbol}`);
        }
      }
    }
    const text=fs.readFileSync(path.join(directory,'cases',`${repo.id}.md`),'utf8');
    assert.ok(text.includes(repo.commit));
    assert.equal((text.match(/```mermaid/g)??[]).length,2);
    assert.ok((text.match(/#L\d+/g)??[]).length>=20);
    assert.ok(text.includes('没有安装')&&text.includes('不是本次实际模型运行记录'));
  }
  const html=fs.readFileSync(path.join(directory,'implementation-atlas.html'),'utf8');
  assert.ok(!/<script[^>]+src=|<link[^>]+stylesheet/i.test(html));
  const match=html.match(/<script type="application\/json" id="implementation-data">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const embedded=JSON.parse(match[1]);
  assert.equal(embedded.repos.length,6);
  assert.equal(embedded.repos.reduce((n,repo)=>n+repo.modules.length,0),modules);
  const layouts=JSON.parse(fs.readFileSync(path.join(directory,'architecture-layouts.json'),'utf8'));
  let diagramNodes=0,diagramEdges=0;
  for(const repo of embedded.repos){
    const audit=audits.repos.find(record=>record.id===`${repo.audit_name}@${repo.commit}`);
    const layout=layouts[repo.id];
    assert.ok(layout,`Missing native layout ${repo.id}`);
    assert.equal(repo.architecture_asset,`pics/implementations/${repo.id}-architecture.svg`);
    const svg=fs.readFileSync(path.join(root,repo.architecture_asset),'utf8');
    assert.equal(repo.architecture_svg,svg,`Inline/download asset mismatch ${repo.id}`);
    assert.match(svg,/viewBox="0 0 1200 820"/);
    assert.ok(!/<(?:script|image|foreignObject)\b|@import|url\(["']?https?:/i.test(svg),`External or non-vector content ${repo.id}`);
    assert.ok(svg.includes('静态源码审计；未运行模型 / benchmark'));
    const visible=new Set(layout.nodes.map(node=>node[0]));
    assert.equal(visible.size,layout.nodes.length);
    const renderedIds=Array.from(svg.matchAll(/class="architecture-node" data-module="([^"]+)"/g),match=>match[1]);
    assert.deepEqual(renderedIds,Array.from(visible));
    for(const [id,x,y,w,h]of layout.nodes){
      const module=audit.modules.find(item=>item.id===id);
      assert.ok(module,`Unverified SVG node ${repo.id}/${id}`);
      assert.ok(x>=0&&y>=0&&x+w<=1200&&y+h<=720,`Out-of-bounds node ${repo.id}/${id}`);
      assert.ok(svg.includes(`https://github.com/${repo.name}/blob/${repo.commit}/${module.path}#L${module.line}`));
      for(const [other,ox,oy,ow,oh]of layout.nodes){
        if(id===other)continue;
        assert.ok(x+w<=ox||ox+ow<=x||y+h<=oy||oy+oh<=y,`Overlapping nodes ${repo.id}/${id}/${other}`);
      }
    }
    assert.equal((svg.match(/class="connection /g)??[]).length,layout.edges.length);
    for(const [from,to,points]of layout.edges){
      const edge=audit.architecture_edges.find(item=>item.from===from&&item.to===to);
      assert.ok(edge&&visible.has(from)&&visible.has(to),`Unverified SVG edge ${repo.id}/${from}/${to}`);
      const escaped=edge.label.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
      assert.ok(svg.includes(`data-from="${from}" data-to="${to}" data-edge-label="${escaped}"`));
      for(let index=1;index<points.length;index++){
        const [ax,ay]=points[index-1], [bx,by]=points[index];
        assert.ok(ax===bx||ay===by,`Non-orthogonal route ${repo.id}/${from}/${to}`);
        for(const [id,x,y,w,h]of layout.nodes){
          const crosses=ax===bx?ax>x&&ax<x+w&&Math.max(ay,by)>y&&Math.min(ay,by)<y+h:ay>y&&ay<y+h&&Math.max(ax,bx)>x&&Math.min(ax,bx)<x+w;
          assert.ok(!crosses,`Edge crosses node ${repo.id}/${from}→${to}/${id}`);
        }
      }
    }
    const chapter=fs.readFileSync(path.join(directory,'cases',`${repo.id}.md`),'utf8');
    const image=chapter.indexOf(`](../../../${repo.architecture_asset})`);
    assert.ok(image>=0&&image<chapter.indexOf('```mermaid'),`Missing early static preview ${repo.id}`);
    assert.ok(chapter.includes(`../implementation-atlas.html?repo=${repo.id}`));
    diagramNodes+=visible.size;diagramEdges+=layout.edges.length;
  }
  assert.ok(html.includes('id="architecture-frame"')&&html.includes('id="architecture-download"'));
  return {ok:true,repositories:6,modules,native_svg_diagrams:6,diagram_nodes:diagramNodes,diagram_edges:diagramEdges,source_flow_steps:flowSteps,source_anchors_checked:anchors,source_verified:Boolean(sourceRoot),paid_or_research_code_executed:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const i=process.argv.indexOf('--source-root');
  if(i>=0)assert.ok(process.argv[i+1],'--source-root requires a path');
  console.log(JSON.stringify(validateImplementations(i>=0?process.argv[i+1]:undefined)));
}
