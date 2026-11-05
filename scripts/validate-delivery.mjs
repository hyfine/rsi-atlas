import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const dataNames = ['method-map.json', 'method-map.csv', 'atlas-methods.json', 'atlas-methods.csv', 'atlas-source-notes.json', 'dynamic-scenes.json', 'primary-verification.json', 'delivery-audit.json'];
const scriptNames = ['build-atlas.mjs', 'build-repo-deepdives.mjs', 'validate-delivery.mjs', 'validate-repo-deepdives.mjs', 'viewer.test.mjs', 'implementation.test.mjs', 'browser-test-utils.mjs', 'viewer.template.html', 'implementation.template.html', 'package.json', 'package-lock.json', 'CORPUS.md'];
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);

export function publicationFiles() {
  return [
    ...['README.md', '.gitignore', '.nojekyll', 'THIRD_PARTY_NOTICES.md', 'index.html'].map(name => path.join(root, name)),
    ...['docs', 'catalog', 'licenses'].flatMap(name => walk(path.join(root, name))).filter(file => !file.endsWith('.DS_Store')),
    ...walk(path.join(root, 'pics')).filter(file => /\.(?:svg|html|architecture\.json)$/.test(file) && !file.includes('.visual-check.')),
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
    assert.ok(['method', 'benchmark', 'framework', 'theory'].includes(method.kind));
    assert.equal(method.in_recent_window, method.date >= atlas.window_start && method.date <= atlas.cutoff);
    assert.ok(fs.existsSync(path.join(root, method.chapter)), `Missing explanation: ${method.id}`);
  }
  for (const scene of atlas.dynamics.scenes) {
    assert.equal(scene.steps.length, 6);
    assert.ok(scene.object && scene.fixed && scene.note && scene.source);
    assert.ok(scene.steps.every(step => step.label && step.detail.length > 25), `Shallow scene ${scene.id}`);
  }
  const files = publicationFiles();
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
  }
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (/\/Users\/[A-Za-z0-9_-]+\//.test(text)) errors.push(`${path.relative(root, file)}: personal absolute path`);
    if (/\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{35,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(text)) errors.push(`${path.relative(root, file)}: credential-shaped content`);
    if (file.endsWith('.md')) {
      const content = text.replace(/```[\s\S]*?```/g, '');
      for (const match of content.matchAll(/\]\((<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g)) checkLink(file, match[1]);
    }
    if (file.endsWith('index.html') || file.endsWith('implementation-atlas.html')) {
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
