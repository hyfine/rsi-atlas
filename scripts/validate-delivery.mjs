import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const dataNames = ['method-map.json', 'method-map.csv', 'atlas-methods.json', 'atlas-methods.csv', 'atlas-source-notes.json', 'dynamic-scenes.json', 'family-architectures.json', 'paper-figures.json', 'collection.json', 'research-updates.json', 'focus-methods.json', 'institutions.json', 'ui-translations.json', 'survey-guide.json', 'engineering-projects.json', 'primary-verification.json', 'delivery-audit.json'];
const scriptNames = ['build-atlas.mjs', 'build-repo-deepdives.mjs', 'build-family-diagrams.mjs', 'build-research-docs.mjs', 'build-project-presentation.mjs', 'build-engineering-guide.mjs', 'engineering-panel.html', 'engineering-panel.js', 'engineering.test.mjs', 'validate-delivery.mjs', 'validate-repo-deepdives.mjs', 'viewer.test.mjs', 'implementation.test.mjs', 'family.test.mjs', 'consolidation.test.mjs', 'timeline.test.mjs', 'math.test.mjs', 'survey.test.mjs', 'browser-test-utils.mjs', 'viewer.template.html', 'implementation.template.html', 'family.template.html', 'package.json', 'package-lock.json', 'CORPUS.md'];
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
scriptNames.push('build-development-visuals.mjs','growth-tree.html','growth-tree.js','method-fan.html','method-fan-drawing.js','method-fan.js','development.test.mjs');
dataNames.push('survey-fulltext-evidence.json');

export function publicationFiles() {
  return [
    ...['README.md', 'README.zh-CN.md', 'CONTRIBUTING.md', '.gitignore', '.nojekyll', 'THIRD_PARTY_NOTICES.md', 'index.html'].map(name => path.join(root, name)),
    ...(fs.existsSync(path.join(root,'.github'))?walk(path.join(root,'.github')):[]),
    ...['docs', 'catalog', 'licenses'].flatMap(name => walk(path.join(root, name))).filter(file => !file.endsWith('.DS_Store')),
    ...walk(path.join(root, 'pics')).filter(file => /\.(?:svg|html|architecture\.json)$/.test(file) && !file.includes('.visual-check.')),
    ...JSON.parse(fs.readFileSync(path.join(root,'data/paper-figures.json'),'utf8')).figures.map(figure=>{
      assert.match(figure.asset,/^pics\/papers\/[a-z0-9-]+\.png$/);
      return path.join(root,figure.asset);
    }),
    ...dataNames.map(name => path.join(root, 'data', name)).filter(file => fs.existsSync(file)),
    ...scriptNames.map(name => path.join(root, 'scripts', name)).filter(file => fs.existsSync(file)),
  ];
}

export function validateDelivery() {
  const atlas = JSON.parse(fs.readFileSync(path.join(root, 'data/atlas-methods.json'), 'utf8'));
  const verification = JSON.parse(fs.readFileSync(path.join(root, 'data/primary-verification.json'), 'utf8'));
  assert.ok(atlas.methods.length >= 60, 'Curated coverage regressed');
  assert.ok(atlas.methods.filter(method => method.in_recent_window).length >= 30, 'Recent-year coverage regressed');
  assert.equal(new Set(atlas.methods.map(method => method.id)).size, atlas.methods.length, 'Duplicate paper identity');
  assert.equal(atlas.dynamics.scenes.length, 10);
  assert.equal(new Set(atlas.dynamics.scenes.map(scene => scene.id)).size, 10);
  const ids = new Map(atlas.methods.map(method => [method.id, method]));
  for (const paper of verification.papers) {
    assert.ok(ids.has(paper.id), `Verified paper omitted: ${paper.id}`);
    assert.equal(ids.get(paper.id).date, paper.date, `Wrong first release: ${paper.id}`);
  }
  for (const method of atlas.methods) {
    assert.ok(method.mechanism && method.reading_scope && method.limitations.length, `Incomplete explanation: ${method.id}`);
    assert.ok(Array.isArray(method.limitations)&&method.limitations.every(value=>typeof value==='string'&&value.trim()),`Unrenderable limitations: ${method.id}`);
    assert.ok(['method', 'benchmark', 'framework', 'theory','survey','boundary','announcement'].includes(method.kind));
    assert.equal(method.in_recent_window, method.date >= atlas.window_start && method.date <= atlas.cutoff);
    assert.ok(fs.existsSync(path.join(root, method.chapter)), `Missing explanation: ${method.id}`);
  }
  for (const scene of atlas.dynamics.scenes) {
    assert.equal(scene.steps.length, 6);
    assert.ok(scene.object && scene.fixed && scene.note && scene.source);
    assert.ok(scene.steps.every(step => step.label && step.detail.length > 25), `Shallow scene ${scene.id}`);
  }
  assert.equal(atlas.family_architectures.length,6);
  assert.equal(atlas.paper_figures.length,6);
  for(const family of atlas.family_architectures){
    for(const kind of ['architecture','flow']){
      const svg=path.join(root,`pics/family-${family.id}-${kind}.svg`);
      const html=path.join(root,`pics/family-${family.id}-${kind}.html`);
      assert.ok(fs.existsSync(svg)&&fs.existsSync(html),`Missing family ${family.id} ${kind}`);
      const embedded=fs.readFileSync(html,'utf8').match(/<script type="application\/json" id="family-data">([\s\S]*?)<\/script>/);
      assert.ok(embedded);
      assert.deepEqual(JSON.parse(embedded[1]).family,family);
      assert.equal(JSON.parse(embedded[1]).default_view,kind);
    }
  }
  const files = publicationFiles();
  const published=new Set(files.map(file=>path.resolve(file)));
  assert.equal(atlas.source_overview_ids.length,35);
  for(const id of atlas.source_overview_ids)assert.ok(ids.has(id),`Original overview item missing: ${id}`);
  const institutionIds=new Set(atlas.institutions.map(entity=>entity.id));
  assert.equal(institutionIds.size,atlas.institutions.length);
  for(const method of atlas.methods)for(const id of method.institution_ids)assert.ok(institutionIds.has(id),`Unknown institution ID ${id}`);
  const errors = [];
  let localLinks = 0;
  function checkLink(file, target) {
    if (/^(?:https?:|mailto:|data:|#)/.test(target)) return;
    const clean = target.replace(/^<|>$/g, '').split('#')[0].split('?')[0];
    if (!clean) return;
    let decoded;
    try { decoded = decodeURIComponent(clean); } catch { errors.push(`${path.relative(root, file)}: invalid URI ${target}`); return; }
    const resolved = path.resolve(path.dirname(file), decoded);
    const relative = path.relative(root, resolved);
    localLinks++;
    if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.existsSync(resolved)) errors.push(`${path.relative(root, file)}: broken/nonportable link ${target}`);
    else if(relative==='.local'||relative.startsWith('.local/')||fs.statSync(resolved).isFile()&&!published.has(resolved))errors.push(`${path.relative(root,file)}: link targets unpublished local-only content ${target}`);
  }
  for (const file of files) {
    assert.ok(!fs.lstatSync(file).isSymbolicLink(),'Public export must not follow symlinks');
    if(file.endsWith('.png')){
      assert.equal(fs.readFileSync(file).subarray(0,8).toString('hex'),'89504e470d0a1a0a','Invalid licensed figure PNG');
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    if (/\/Users\/[A-Za-z0-9_-]+\//.test(text)) errors.push(`${path.relative(root, file)}: personal absolute path`);
    if (/\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{35,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(text)) errors.push(`${path.relative(root, file)}: credential-shaped content`);
    if (file.endsWith('.md')) {
      const content = text.replace(/```[\s\S]*?```/g, '');
      for (const match of content.matchAll(/\]\((<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g)) checkLink(file, match[1]);
    }
    if (file.endsWith('index.html') || file.endsWith('implementation-atlas.html') || /family-[a-f]-(architecture|flow)\.html$/.test(file)) {
      for (const match of text.split('<script type="application/json"')[0].matchAll(/(?:href|src)="([^"]+)"/g)) checkLink(file, match[1]);
      assert.ok(!/<script[^>]+src=|<link[^>]+(?:fonts|stylesheet)/i.test(text), 'Viewer has external script/style dependency');
      if(file.endsWith('index.html')){
        const match = text.match(/<script type="application\/json" id="atlas-data">([\s\S]*?)<\/script>/);
        assert.ok(match, 'Missing embedded offline data');
        assert.deepEqual(JSON.parse(match[1]), atlas, 'Embedded data differs from public method JSON');
      }
    }
  }
  assert.deepEqual(errors, [], errors.join('\n'));
  return { ok: true, publication_files: files.length, local_links_checked: localLinks, methods: atlas.methods.length, recent_methods: atlas.methods.filter(method => method.in_recent_window).length, dynamic_scenes: atlas.dynamics.scenes.length, primary_checks: verification.papers.length, warnings: 0 };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(validateDelivery()));
