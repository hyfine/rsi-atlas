import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {root,publicationFiles,validateDelivery} from './validate-delivery.mjs';

const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const atlas=read('data/atlas-methods.json');
const updates=read('data/research-updates.json');
const institutions=read('data/institutions.json');
const byId=new Map(atlas.methods.map(record=>[record.id,record]));
function csvRows(text){
  const rows=[];
  let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(i===0&&c==='\ufeff')continue;
    if(c==='"'){
      if(quoted&&text[i+1]==='"'){field+='"';i++;}
      else quoted=!quoted;
    }else if(c===','&&!quoted){row.push(field);field='';}
    else if(c==='\n'&&!quoted){row.push(field);rows.push(row);row=[];field='';}
    else if(c!=='\r'||quoted)field+=c;
  }
  assert.equal(quoted,false,'Unterminated CSV field');
  if(field||row.length){row.push(field);rows.push(row);}
  const [header,...values]=rows;
  for(const cells of values)assert.equal(cells.length,header.length);
  return values.map(cells=>Object.fromEntries(header.map((name,index)=>[name,cells[index]])));
}

test('both CSV exports retain their exact JSON record sets and new timeline evidence fields',()=>{
  const base=read('data/method-map.json');
  const baseRows=csvRows(fs.readFileSync(path.join(root,'data/method-map.csv'),'utf8'));
  const mergedRows=csvRows(fs.readFileSync(path.join(root,'data/atlas-methods.csv'),'utf8'));
  assert.deepEqual(baseRows.map(record=>record.id),base.methods.map(record=>record.id));
  assert.deepEqual(mergedRows.map(record=>record.id),atlas.methods.map(record=>record.id));
  for(const record of atlas.methods){
    const row=mergedRows.find(item=>item.id===record.id);
    assert.equal(row.mechanism,record.mechanism);
    assert.equal(row.institution_ids,record.institution_ids.join(';'));
    assert.equal(row.date_basis,record.date_basis);
  }
  const flint=mergedRows.find(record=>record.id==='recursive:flint');
  assert.equal(flint.first_public_date,'');
  assert.equal(flint.date_warning_en,byId.get(flint.id).date_warning.en);
});

test('consolidation retains all original overview IDs, requested references and explicit uncertainties',()=>{
  assert.equal(atlas.source_overview_ids.length,35);
  for(const id of atlas.source_overview_ids)assert.ok(byId.has(id),`Missing overview item ${id}`);
  const unresolved=new Set(updates.unresolved_sources.map(source=>source.id));
  for(const id of updates.requested_ids)assert.ok(byId.has(id)||unresolved.has(id),`Unaccounted requested reference ${id}`);
  assert.equal(atlas.focus_ids.length,4);
  for(const id of atlas.focus_ids){
    const record=byId.get(id);
    assert.ok(record?.mechanism&&record.en.summary&&record.limitations.length);
    assert.equal(record.supervision_verification,'primary_method_sections_and_affiliations');
  }
  assert.equal(updates.article_access.used_as_evidence,false);
  assert.equal(updates.article_access.status,'access_challenge');
  for(const source of updates.unresolved_sources){
    assert.equal(source.confirmed_date,null);
    assert.ok(!byId.has(source.id),'An unresolved citation must not gain an invented timeline date');
  }
  const flint=byId.get('recursive:flint');
  assert.equal(flint.kind,'announcement');
  assert.equal(flint.first_public_date,null);
  assert.equal(flint.revision_date,null);
  assert.equal(flint.date_basis,'official_release_display_date_not_verified_first_availability');
  assert.match(flint.date_warning.en,/not datePublished/);
  assert.ok(flint.review_sources.some(source=>source.role==='site_publication_comment_not_article_datePublished'));
  const aflow=byId.get('arxiv:2410.10762');
  assert.equal(aflow.date,'2024-10-14');
  assert.equal(aflow.revision_date,'2025-04-15');
  assert.equal(aflow.in_recent_window,false);
});

test('affiliations are non-exclusive cited evidence, not model/vendor guesses or funding credits',()=>{
  const ids=new Set(institutions.institutions.map(entity=>entity.id));
  assert.equal(ids.size,institutions.institutions.length);
  for(const link of institutions.assignments){
    assert.ok(byId.has(link.record_id)&&ids.has(link.institution_id));
    assert.ok(['author_affiliation','publisher'].includes(link.relation));
    assert.ok(link.source_url.startsWith('https://')&&link.evidence.trim());
  }
  for(const review of institutions.attribution_reviews){
    const record=byId.get(review.record_id);
    assert.ok(record&&review.reading_scope.trim());
    if(review.affiliation_status==='unverified'){
      assert.equal(record.institution_ids.length,0);
      assert.ok(review.unresolved_reason?.trim());
    }else{
      assert.ok(record.institution_links.some(link=>link.relation===(review.affiliation_status==='publisher_verified'?'publisher':'author_affiliation')));
    }
  }
  assert.ok(!institutions.institutions.some(entity=>entity.name==='Canada CIFAR AI Chair'));
  const meta=byId.get('arxiv:2609.06396');
  assert.ok(meta.institution_links.some(link=>link.relation==='publisher'&&link.source_url==='https://cosmosmind.ai/research/metarsi-v1'));
  assert.ok(!meta.institution_links.some(link=>link.relation==='author_affiliation'));
  for(const record of atlas.methods){
    assert.equal(new Set(record.institution_ids).size,record.institution_ids.length);
    assert.deepEqual(new Set(record.institution_ids),new Set(record.institution_links.map(link=>link.institution_id)));
  }
});

test('public export builds without Git metadata, private files, packages or external notebook paths',()=>{
  const exported=fs.mkdtempSync(path.join(os.tmpdir(),'rsi-atlas-public-build-'));
  try{
    for(const file of publicationFiles()){
      const destination=path.join(exported,path.relative(root,file));
      fs.mkdirSync(path.dirname(destination),{recursive:true});
      fs.copyFileSync(file,destination);
    }
    const before=fs.readFileSync(path.join(exported,'index.html'),'utf8');
    execFileSync(process.execPath,['scripts/build-atlas.mjs'],{cwd:exported,stdio:'pipe'});
    assert.equal(fs.readFileSync(path.join(exported,'index.html'),'utf8'),before);
    const result=JSON.parse(execFileSync(process.execPath,['scripts/validate-delivery.mjs'],{cwd:exported,encoding:'utf8'}));
    assert.equal(result.ok,true);
    assert.equal(result.methods,atlas.methods.length);
    assert.equal(fs.existsSync(path.join(exported,'.local')),false);
    assert.equal(fs.existsSync(path.join(exported,'node_modules')),false);
  }finally{
    fs.rmSync(exported,{recursive:true,force:true});
  }
});

test('public tracked files are allowlisted and local-only material is ignored',t=>{
  if(!fs.existsSync(path.join(root,'.git'))){t.skip('No Git metadata in this export; public portability is checked separately');return;}
  const allowed=new Set(publicationFiles().map(file=>path.relative(root,file)));
  const tracked=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  assert.deepEqual(tracked.filter(file=>!allowed.has(file)),[]);
  assert.equal(execFileSync('git',['ls-files','--','.local'],{cwd:root,encoding:'utf8'}),'');
  execFileSync('git',['check-ignore','--quiet','.local/privacy-check'],{cwd:root});
  validateDelivery();
});

test('local migration preserves every original notebook hash and retires the former live path',t=>{
  const manifestFile=path.join(root,'.local/migration-manifest.json');
  if(!fs.existsSync(manifestFile)){t.skip('Local-only migration evidence is not published or required by public builds');return;}
  const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  const inventory=JSON.parse(fs.readFileSync(path.join(path.dirname(manifest.backup_receipt),'notes-inventory.json'),'utf8'));
  const files=inventory.filter(entry=>entry.type==='file');
  assert.equal(files.length,manifest.original_notes_files);
  assert.equal(files.reduce((sum,entry)=>sum+entry.bytes,0),manifest.original_notes_bytes);
  for(const entry of files){
    const bytes=fs.readFileSync(path.join(manifest.original_notes_archive,entry.path));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,`Changed historical file ${entry.path}`);
  }
  assert.equal(fs.existsSync(manifest.former_notes_root),false);
  assert.equal(path.resolve(manifest.canonical_repository),path.resolve(root));
  assert.ok(fs.statSync(manifest.active_private_case).isDirectory());
});
