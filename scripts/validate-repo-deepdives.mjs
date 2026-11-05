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
  return {ok:true,repositories:6,modules,source_flow_steps:flowSteps,source_anchors_checked:anchors,source_verified:Boolean(sourceRoot),paid_or_research_code_executed:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const i=process.argv.indexOf('--source-root');
  if(i>=0)assert.ok(process.argv[i+1],'--source-root requires a path');
  console.log(JSON.stringify(validateImplementations(i>=0?process.argv[i+1]:undefined)));
}
