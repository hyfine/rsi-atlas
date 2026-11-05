import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

export function chromePath(){
  return [process.env.CHROME_PATH,'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Chromium.app/Contents/MacOS/Chromium','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean).find(file=>fs.existsSync(file));
}
export async function connectBrowser(t,url,readyExpression){
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'rsi-atlas-browser-'));
  const chrome=spawn(chromePath(),['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
  const running=()=>chrome.exitCode===null&&chrome.signalCode===null;
  t.after(async()=>{
    if(running()){chrome.kill('SIGTERM');await Promise.race([once(chrome,'exit'),new Promise(resolve=>setTimeout(resolve,5000))]);}
    if(running()){chrome.kill('SIGKILL');await once(chrome,'exit');}
    fs.rmSync(profile,{recursive:true,force:true});
  });
  const endpoint=await new Promise((resolve,reject)=>{
    let output='';
    const timeout=setTimeout(()=>reject(new Error('Chrome debugging endpoint did not start')),20000);
    chrome.on('error',error=>{clearTimeout(timeout);reject(error);});
    chrome.on('exit',code=>{clearTimeout(timeout);reject(new Error(`Chrome exited before readiness (${code})`));});
    chrome.stderr.on('data',chunk=>{output+=chunk.toString();const match=output.match(/DevTools listening on (ws:\/\/\S+)/);if(match){clearTimeout(timeout);resolve(match[1]);}});
  });
  const socket=new WebSocket(endpoint);
  await once(socket,'open');
  t.after(()=>socket.close());
  let counter=0;
  const pending=new Map(),exceptions=[];
  socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id&&pending.has(message.id)){
      const request=pending.get(message.id);pending.delete(message.id);clearTimeout(request.timeout);
      if(message.error)request.reject(new Error(JSON.stringify(message.error)));else request.resolve(message.result);
    }else if(message.method==='Runtime.exceptionThrown')exceptions.push(message.params.exceptionDetails.text+': '+(message.params.exceptionDetails.exception?.description??''));
  });
  function call(method,params={},sessionId){
    return new Promise((resolve,reject)=>{
      const id=++counter;
      const timeout=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`));},15000);
      pending.set(id,{resolve,reject,timeout});
      socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
    });
  }
  const target=await call('Target.createTarget',{url:'about:blank'});
  const attached=await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
  await call('Target.activateTarget',{targetId:target.targetId});
  const page=(method,params)=>call(method,params,attached.sessionId);
  await page('Runtime.enable');await page('Page.enable');
  async function evaluate(expression){
    const result=await page('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description??result.exceptionDetails.text);
    return result.result.value;
  }
  async function waitFor(expression){
    const deadline=Date.now()+10000;
    while(Date.now()<deadline){if(await evaluate(expression))return;await new Promise(resolve=>setTimeout(resolve,50));}
    throw new Error(`Browser predicate timed out: ${expression}`);
  }
  await page('Page.navigate',{url});
  await waitFor(readyExpression);
  return {page,evaluate,waitFor,exceptions};
}
