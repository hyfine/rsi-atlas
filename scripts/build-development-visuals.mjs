import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
export function buildDevelopmentVisuals(atlas){
  const source=fs.readFileSync(path.join(root,'scripts/method-fan-drawing.js'),'utf8');
  const svg=vm.runInNewContext(source+'\ndrawMethodFan(records,families,"zh");',{records:atlas.methods,families:atlas.families},{timeout:1000});
  assert.ok(svg.startsWith('<svg')&&svg.includes('data-fan-sector="F"'));
  fs.writeFileSync(path.join(root,'pics/rsi-method-fan.svg'),svg+'\n');
  return {fan_sectors:6,fan_final_angle:180,offline_fallback:'pics/rsi-method-fan.svg'};
}
