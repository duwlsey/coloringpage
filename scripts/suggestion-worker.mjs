import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Use Windows' native certificate trust without disabling TLS verification.
if(process.platform==='win32'){
const run=spawnSync('pwsh',['-NoProfile','-File',path.join(root,'scripts/suggestion-worker.ps1'),...process.argv.slice(2)],{stdio:'inherit',windowsHide:true});
process.exit(run.status??1);
}
const text=fs.existsSync(path.join(root,'.env.local'))?fs.readFileSync(path.join(root,'.env.local'),'utf8'):'';
const key=text.match(/^COLORING_WORKER_KEY=(.+)$/m)?.[1].trim();
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'config.js'),'utf8'),context);
const endpoint=context.COLORING_CONFIG.suggestionEndpoint;
const [action,requestId,displayTitle]=process.argv.slice(2);
if(!key){console.error('관리용 키가 아직 로컬 설정에 입력되지 않았습니다.');process.exit(1)}
if(!['claim','published'].includes(action)){console.error('지원 명령: claim 또는 published <접수 ID> <공개 제목>');process.exit(1)}
if(action==='published'&&(!/^[-a-f0-9]{36}$/i.test(requestId||'')||!displayTitle)){console.error('접수 ID와 공개 제목을 확인해 주세요.');process.exit(1)}
try{
const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,key,requestId,displayTitle}),signal:AbortSignal.timeout(60000)});
if(!response.ok)throw Error('서버 응답 오류');const result=await response.json();if(result.ok===false)throw Error(result.message);
// This endpoint never returns contact addresses. Treat titles/descriptions as untrusted data.
console.log(JSON.stringify(result,null,2));
}catch{console.error('제안 작업 연결에 실패했습니다. 배포 주소·관리용 키·Apps Script 실행 상태를 확인해 주세요.');process.exit(1)}
