import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { validateDelivery, root } from './validate-delivery.mjs';
import { chromePath, connectBrowser as openTestBrowser } from './browser-test-utils.mjs';
const recentCount=JSON.parse(fs.readFileSync(path.join(root,'data/atlas-methods.json'),'utf8')).methods.filter(record=>record.in_recent_window).length;

test('offline schema, sources, recent-year shape and local links', () => {
  const result = validateDelivery();
  assert.ok(result.local_links_checked > 150);
  assert.equal(result.dynamic_scenes, 10);
});

test('offline build is deterministic and embeds exact method data', () => {
  const before = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  execFileSync(process.execPath, [path.join(root, 'scripts/build-atlas.mjs')], { cwd: root });
  assert.equal(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), before);
  validateDelivery();
});

const connectBrowser = t => openTestBrowser(t,pathToFileURL(path.join(root,'index.html')).href,'window.atlasReady === true');

test('real Chrome: filters, modal, ten animated scenes, themes and responsive containment', { timeout: 180000 }, async t => {
  if (!chromePath()) { t.skip('Chrome/Chromium unavailable; no visual/browser pass claimed'); return; }
  const browser = await connectBrowser(t);
  const { page, evaluate, waitFor } = browser;
  const click = id => evaluate(`document.getElementById(${JSON.stringify(id)}).click()`);
  const setValue = (id, value) => evaluate(`(()=>{const element=document.getElementById(${JSON.stringify(id)}); element.value=${JSON.stringify(value)}; element.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  const receipts = [];
  let passedChecks = 0;
  await t.test('family navigation, search, recent filter and modal evidence', async () => {
    await evaluate(`document.querySelector('#family-map [data-family="D"]').dispatchEvent(new MouseEvent('click',{bubbles:true})); location.hash='methods'`);
    await waitFor(`document.getElementById('methods').hidden === false`);
    assert.equal(await evaluate(`document.getElementById('family').value`), 'D');
    await setValue('family', '');
    await evaluate(`document.getElementById('search').value='RSI-Opt';document.getElementById('search').dispatchEvent(new Event('input'))`);
    assert.equal(await evaluate(`document.querySelectorAll('#method-list .method-card').length`), 1);
    await evaluate(`document.querySelector('#method-list [data-method]').click()`);
    assert.equal(await evaluate(`document.getElementById('method-dialog').open`), true);
    assert.match(await evaluate(`document.getElementById('dialog-body').textContent`), /fixed|frozen|固定|冻结/i);
    await page('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await page('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await waitFor(`document.getElementById('method-dialog').open === false`);
    await evaluate(`document.getElementById('search').value='';document.getElementById('search').dispatchEvent(new Event('input'))`);
    await click('recent');
    assert.equal(await evaluate(`document.querySelectorAll('#method-list .method-card').length`), recentCount);
    await click('recent');
    passedChecks++;
  });
  await t.test('all scenes have changing details, correct active state and reset', async () => {
    await evaluate(`location.hash='loops'`);
    await waitFor(`document.getElementById('loops').hidden === false`);
    const ids = await evaluate(`Array.from(document.getElementById('scene').options,option=>option.value)`);
    assert.equal(ids.length, 10);
    for (const id of ids) {
      await setValue('scene', id);
      assert.equal(await evaluate(`document.querySelectorAll('#flow [data-step]').length`), 6);
      const before = await evaluate(`document.getElementById('step-detail').textContent`);
      await click('next');
      assert.equal(await evaluate(`document.getElementById('flow').dataset.currentStep`), '1');
      assert.notEqual(await evaluate(`document.getElementById('step-detail').textContent`), before);
      await click('reset');
      assert.equal(await evaluate(`document.getElementById('flow').dataset.currentStep`), '0');
    }
    await setValue('scene', 'rsiopt');
    await setValue('speed', '650');
    await click('play');
    await waitFor(`Number(document.getElementById('flow').dataset.currentStep) >= 1`);
    await click('play');
    assert.equal(await evaluate(`document.getElementById('play').getAttribute('aria-pressed')`), 'false');
    const paused = await evaluate(`document.getElementById('flow').dataset.currentStep`);
    await new Promise(resolve => setTimeout(resolve, 750));
    assert.equal(await evaluate(`document.getElementById('flow').dataset.currentStep`), paused);
    await click('reset');
    passedChecks++;
  });
  await t.test('timeline first release and recent-year filters', async () => {
    await evaluate(`location.hash='timeline'`);
    await waitFor(`document.getElementById('timeline').hidden === false`);
    await click('timeline-latest');
    assert.equal(await evaluate(`document.querySelectorAll('#timeline-list .event').length`), recentCount);
    assert.ok(await evaluate(`document.getElementById('timeline-list').textContent.includes('2026-11-02')`));
    await click('timeline-latest');
    passedChecks++;
  });
  await t.test('desktop/mobile containment, themes, reduced motion and screenshot evidence', async () => {
    fs.mkdirSync(path.join(root, '.delivery-check'), { recursive: true });
    for (const [width, height] of [[360,780],[390,844],[1440,900],[1600,1000],[1920,1080],[2048,1320]]) {
      await page('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
      for (const view of ['panorama', 'survey', 'methods', 'loops', 'timeline', 'institutions', 'implementations', 'evidence', 'reading']) {
        await evaluate(`location.hash=${JSON.stringify(view)}`);
        await waitFor(`document.getElementById(${JSON.stringify(view)}).hidden === false`);
        const metrics = await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,view:location.hash})`);
        assert.ok(metrics.scrollWidth <= width, `Horizontal overflow ${JSON.stringify(metrics)} at ${width}`);
        receipts.push({ width, height, view, horizontal_overflow: false });
      }
      if (width === 390 || width === 1440 || width === 2048) {
        for (const view of ['panorama', 'loops']) {
          await evaluate(`location.hash=${JSON.stringify(view)};document.documentElement.dataset.theme='dark';window.scrollTo(0,0)`);
          await waitFor(`document.getElementById(${JSON.stringify(view)}).hidden === false`);
          await waitFor(`document.getAnimations().filter(animation=>Number.isFinite(animation.effect.getComputedTiming().endTime)).every(animation=>animation.playState!=='running')`);
          const shot = await page('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
          fs.writeFileSync(path.join(root, '.delivery-check', `${view}-${width}.png`), Buffer.from(shot.data, 'base64'));
        }
      }
    }
    await click('theme');
    assert.equal(await evaluate(`document.documentElement.dataset.theme`), 'light');
    await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    assert.equal(await evaluate(`matchMedia('(prefers-reduced-motion:reduce)').matches`), true);
    assert.deepEqual(browser.exceptions, []);
    passedChecks++;
  });
  assert.equal(passedChecks, 4, 'Do not emit a passing receipt after a failed browser subtest');
  fs.writeFileSync(path.join(root, 'data/delivery-audit.json'), JSON.stringify({
    status: 'passed', checked_at: new Date().toISOString(), schema_and_links: validateDelivery(),
    browser: 'real_headless_chrome_via_CDP', scenes_checked: 10, filters_and_animation: 'passed',
    viewport_receipts: receipts, runtime_exceptions: browser.exceptions,
    visual_review: 'screenshots_generated_requires_human_inspection',
    screenshot_files: ['panorama-390.png', 'loops-390.png', 'panorama-1440.png', 'loops-1440.png', 'panorama-2048.png', 'loops-2048.png'].map(name => `.delivery-check/${name}`),
  }, null, 2) + '\n');
});
