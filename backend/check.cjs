const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const NativeDate=Date;let now='2026-10-16T06:00:00+09:00';
class Clock extends NativeDate{constructor(...args){super(...(args.length?args:[now]))}}
const tables={제안:[Array(10).fill('header')],알림:[Array(4).fill('header')]};
const sheet=name=>({getName:()=>name,getParent:()=>({getId:()=> 'test'}),getLastRow:()=>tables[name].length,getLastColumn:()=>tables[name][0].length,getRange:(r,c,n=1,m=1)=>({getValues:()=>{throw Error('Do not use SpreadsheetApp cached reads after RAW writes')},clearContent:()=>{tables[name][r-1][c-1]=''},setValue:v=>{tables[name][r-1][c-1]=v}})});
let sent=[],sendFails=false,liveId='';
const ctx={Date:Clock,console,PropertiesService:{getScriptProperties:()=>({getProperty:k=>({SHEET_ID:'test',WORKER_KEY:'worker-secret'}[k])})},SpreadsheetApp:{openById:()=>({getSheetByName:sheet}),flush(){}},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},Utilities:{formatDate:d=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)},Sheets:{Spreadsheets:{Values:{get:(_,range)=>({values:tables[range.match(/^'([^']+)'/)[1]].slice(1).map(row=>Array.from(row))}),update:({values},_,range)=>{const name=range.match(/^'([^']+)'/)[1],r=Number(range.match(/A(\d+)$/)[1]);tables[name][r-1]=Array.from(values[0]);}}}},MailApp:{getRemainingDailyQuota:()=>100,sendEmail:m=>{if(sendFails)throw Error('test');sent.push(m)}},UrlFetchApp:{fetch:url=>({getContentText:()=>url.endsWith('/coloringpage/')?'<script src="drawings.js?v=abc123">':"{id:'suggestion-"+liveId+"'}"})}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),ctx);
const request=i=>({requestId:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`,title:i===1?'=도안':'신청 '+i,description:'통통한 동물',notify:true,email:'test@example.com',website:''});
for(let i=1;i<=5;i++){const result=ctx.submit_(request(i));assert.equal(result.days,Math.floor((i-1)/2));}
assert.equal(tables.제안[1][2],'=도안');assert.equal(tables.제안.length,6);ctx.submit_(request(1));assert.equal(tables.제안.length,6);
assert.equal(ctx.claim_().items.length,0);now='2026-10-16T08:00:00+09:00';let batch=ctx.claim_();assert.equal(batch.items.length,2);assert(!JSON.stringify(batch).includes('test@example.com'));assert.equal(ctx.claim_().items[0].requestId,batch.items[0].requestId);
liveId=request(1).requestId;ctx.published_({requestId:liveId,displayTitle:'=도안'});assert(sent[0].body.includes('"=도안"'));assert.equal(sent[0].subject,'🎨즐거운 색칠공부🎨 신청하신 도안이 나왔습니다!');assert.equal(tables.알림[1][1],'');ctx.published_({requestId:liveId,displayTitle:'=도안'});assert.equal(sent.length,1);
liveId=request(2).requestId;ctx.published_({requestId:liveId,displayTitle:'신청 2'});assert.equal(ctx.claim_().items.length,0);
now='2026-10-17T08:00:00+09:00';batch=ctx.claim_();assert.equal(batch.items.length,2);assert.equal(batch.items[0].requestId,request(3).requestId);
liveId=request(3).requestId;sendFails=true;ctx.published_({requestId:liveId,displayTitle:'신청 3'});assert.equal(tables.알림[3][3],'발송 확인 필요');sendFails=false;ctx.published_({requestId:liveId,displayTitle:'신청 3'});assert.equal(sent.length,2);
now='2027-02-01T08:00:00+09:00';ctx.deleteExpiredEmails();assert(tables.알림.slice(1).every(r=>!r[1]));
console.log('PASS: before/after 08:00 queue, daily two-job cap, FIFO, retry deduplication, raw titles, dynamic mail, address deletion, ambiguous send isolation, expiration. No actual mail sent.');
