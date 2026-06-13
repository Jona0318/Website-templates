import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const [,,fileUrl,outPath]=process.argv; const PORT=9344;
const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${PORT}`,'--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1','--force-prefers-reduced-motion','--window-size=1440,950','--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)); let id=0;
function send(ws,method,params={}){return new Promise(res=>{const i=++id;const on=ev=>{const m=JSON.parse(ev.data);if(m.id===i){ws.removeEventListener('message',on);res(m.result);}};ws.addEventListener('message',on);ws.send(JSON.stringify({id:i,method,params}));});}
try{
  for(let k=0;k<40;k++){try{await(await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();break;}catch{}await sleep(150);}
  const tab=await(await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(fileUrl)}`,{method:'PUT'})).json();
  const ws=new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r=>ws.addEventListener('open',r,{once:true}));
  await send(ws,'Page.enable'); await send(ws,'Runtime.enable'); await send(ws,'Page.navigate',{url:fileUrl}); await sleep(2500);
  const h=(await send(ws,'Runtime.evaluate',{expression:'document.body.scrollHeight'})).result.value;
  for(let i=0;i<=16;i++){await send(ws,'Runtime.evaluate',{expression:`window.scrollTo(0,${Math.round(h*i/16)})`});await sleep(140);}
  await send(ws,'Runtime.evaluate',{expression:'window.scrollTo(0,0)'}); await sleep(600);
  const shot=await send(ws,'Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
  writeFileSync(outPath,Buffer.from(shot.data,'base64')); console.log('wrote',outPath);
  ws.close();
}catch(e){console.error('ERR',e.message);}finally{chrome.kill();setTimeout(()=>process.exit(0),300);}
