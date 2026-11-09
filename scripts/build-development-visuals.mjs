import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
export function buildDevelopmentVisuals(atlas){
  const markup=fs.readFileSync(path.join(root,'scripts/growth-tree.html'),'utf8');
  const tree=markup.match(/<svg\b[^>]*\bid="grt-svg"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(tree,'Growth tree markup needs one complete standalone SVG');
  assert.ok(!/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-fA-F]+;)/.test(tree),'Growth tree export contains an unescaped XML entity');
  const viewBox=tree.match(/\bviewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number);
  assert.ok(viewBox?.length===4&&viewBox.every(Number.isFinite)&&viewBox[2]>0&&viewBox[3]>0,'Growth tree needs valid intrinsic image dimensions');
  const exported=tree.replace('<svg ',`<svg width="${viewBox[2]}" height="${viewBox[3]}" `);
  fs.writeFileSync(path.join(root,'pics/rsi-growth-tree.svg'),exported+'\n');
  const source=fs.readFileSync(path.join(root,'scripts/method-fan-drawing.js'),'utf8');
  const svg=vm.runInNewContext(source+'\ndrawMethodFan(records,families,"zh");',{records:atlas.methods,families:atlas.families},{timeout:1000});
  assert.ok(svg.startsWith('<svg')&&svg.includes('data-fan-sector="F"'));
  fs.writeFileSync(path.join(root,'pics/rsi-method-fan.svg'),svg+'\n');
  return {tree_export:'pics/rsi-growth-tree.svg',fan_sectors:6,fan_final_angle:180,offline_fallback:'pics/rsi-method-fan.svg'};
}
