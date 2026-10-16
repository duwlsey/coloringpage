/* Deploy as owner; anonymous callers may only submit. Keep worker key in Script Properties. */
const SITE = 'https://duwlsey.github.io/coloringpage/';
const ORIGIN = 'https://duwlsey.github.io';
const HEADERS = ['접수 ID','접수 시각','신청 제목','설명','상태','예상 제작일','제작 시작일','도안 ID','공개 제목','배포 시각'];
const CONTACT_HEADERS = ['접수 ID','메일 주소','삭제 기한','발송 상태'];

function setup() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  if (!id) {
    const book = SpreadsheetApp.create('즐거운 색칠공부 — 비공개 제안 접수함');
    book.setSpreadsheetTimeZone('Asia/Seoul');
    book.getSheets()[0].setName('제안');
    book.insertSheet('알림');
    id = book.getId();
    props.setProperty('SHEET_ID', id);
  }
  const book = SpreadsheetApp.openById(id);
  [['제안', HEADERS], ['알림', CONTACT_HEADERS]].forEach(([name, headers]) => {
    const sheet = book.getSheetByName(name) || book.insertSheet(name);
    if (!sheet.getLastRow()) sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,headers.length).setBackground('#efe9de').setFontWeight('bold');
    sheet.setColumnWidths(1,headers.length,160);
  });
  if (!props.getProperty('WORKER_KEY')) props.setProperty('WORKER_KEY', Utilities.getUuid()+Utilities.getUuid());
  if (!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='deleteExpiredEmails')) {
    ScriptApp.newTrigger('deleteExpiredEmails').timeBased().everyHours(1).create();
  }
  console.log('접수함: '+book.getUrl()); // Never log addresses, request contents or keys.
}

function sheets_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('접수함을 준비 중입니다. 잠시 후 다시 이용해 주세요.');
  const book=SpreadsheetApp.openById(id);
  return {queue:book.getSheetByName('제안'), contacts:book.getSheetByName('알림')};
}
function rows_(sheet) { return sheet.getLastRow()<2?[]:sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues(); }
function text_(value,max) {
  if(typeof value!=='string') throw new Error('입력 내용을 확인해 주세요.');
  const valueClean=value.trim().normalize('NFC');
  if(!valueClean||valueClean.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(valueClean)) throw new Error('입력 내용을 확인해 주세요.');
  return valueClean;
}
// RAW Sheets writes prevent user strings beginning with '=' from becoming formulas.
function rawWrite_(sheet,row,values) {
  const range="'"+sheet.getName().replace(/'/g,"''")+"'!A"+row;
  Sheets.Spreadsheets.Values.update({values:[values]},sheet.getParent().getId(),range,{valueInputOption:'RAW'});
}
function day_(date) { return Utilities.formatDate(date,'Asia/Seoul','yyyy-MM-dd'); }
function nextRun_(now) {
  const today=day_(now);
  const atEight=new Date(today+'T08:00:00+09:00');
  return now<atEight?atEight:new Date(atEight.getTime()+86400000);
}
function estimate_(date,now) {
  const target=new Date(date+'T08:00:00+09:00');
  const days=Math.round((Date.parse(date+'T00:00:00+09:00')-Date.parse(day_(now)+'T00:00:00+09:00'))/86400000);
  return {days:Math.max(0,days),date:date.replace(/-/g,'.')};
}
function submit_(p) {
  const now=new Date();
  const title=text_(p.title,60),description=text_(p.description,1500);
  if(p.website||!/^[-a-f0-9]{36}$/i.test(p.requestId||'')) throw new Error('접수 정보를 확인해 주세요.');
  const notify=p.notify===true;
  const email=notify?text_(p.email,254):'';
  if(notify&&!/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email)) throw new Error('메일 주소를 확인해 주세요.');
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try {
    const {queue,contacts}=sheets_();const rows=rows_(queue);
    const old=rows.find(r=>r[0]===p.requestId);
    if(old) return estimate_(String(old[5]),now);
    if(rows.filter(r=>day_(new Date(r[1]))===day_(now)).length>=50) throw new Error('오늘 접수가 마감되었습니다. 내일 다시 제안해 주세요.');
    const pending=rows.filter(r=>r[4]==='대기'||r[4]==='제작 중').length;
    const scheduled=new Date(nextRun_(now).getTime()+Math.floor(pending/2)*86400000);
    const date=day_(scheduled);
    // Contact first: an interrupted queue write leaves only an expiring orphan, never a lost consent.
    if(notify&&!rows_(contacts).some(r=>r[0]===p.requestId)) rawWrite_(contacts,contacts.getLastRow()+1,[p.requestId,email,new Date(now.getTime()+90*86400000).toISOString(),'대기']);
    rawWrite_(queue,queue.getLastRow()+1,[p.requestId,now.toISOString(),title,description,'대기',date,'','','','']);
    return estimate_(date,now);
  } finally { lock.releaseLock(); }
}
function claim_() {
  const now=new Date(),today=day_(now);
  if(now<new Date(today+'T08:00:00+09:00')) return {items:[]};
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try {
    const {queue}=sheets_();const rows=rows_(queue);
    const used=rows.filter(r=>r[6]===today).length;
    // Resume incomplete work before claiming newer requests.
    const working=rows.filter(r=>r[4]==='제작 중');
    const slots=Math.max(0,2-used-working.filter(r=>r[6]!==today).length);
    rows.forEach((r,i)=>{if(working.length>=2)return;
      if(r[4]==='대기'&&working.filter(x=>x._new).length<slots){r[4]='제작 중';r[6]=today;rawWrite_(queue,i+2,r);r._new=true;working.push(r);}});
    return {items:working.slice(0,2).map(r=>({requestId:r[0],title:r[2],description:r[3],drawingId:'suggestion-'+r[0]}))};
  } finally {lock.releaseLock();}
}
function published_(p) {
  if(!/^[-a-f0-9]{36}$/i.test(p.requestId||'')) throw new Error('잘못된 접수 ID');
  // Verify the fixed public site, never a caller-supplied URL.
  const html=UrlFetchApp.fetch(SITE,{headers:{'Cache-Control':'no-cache'}}).getContentText();
  const match=html.match(/src="(drawings\.js\?v=[a-f0-9]+)"/);
  if(!match) throw new Error('배포 확인 실패');
  const source=UrlFetchApp.fetch(SITE+match[1]).getContentText();
  const drawingId='suggestion-'+p.requestId;
  const marker="id:'"+drawingId+"'";
  if(!source.includes(marker)) throw new Error('새 도안이 아직 공개되지 않았습니다.');
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try {
    const {queue}=sheets_(), rows=rows_(queue),index=rows.findIndex(r=>r[0]===p.requestId);
    if(index<0)throw new Error('접수를 찾지 못했습니다.');
    const r=rows[index];if(r[4]!=='제작 중'&&r[4]!=='완료')throw new Error('제작 중인 접수가 아닙니다.');
    if(r[4]!=='완료'){r[4]='완료';r[7]=drawingId;r[8]=text_(p.displayTitle,80);r[9]=new Date().toISOString();rawWrite_(queue,index+2,r);}
  } finally {lock.releaseLock();}
  return notify_(p.requestId);
}
function notify_(id) {
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try {
    const {queue,contacts}=sheets_();const request=rows_(queue).find(r=>r[0]===id&&r[4]==='완료');
    const list=rows_(contacts),index=list.findIndex(r=>r[0]===id);
    if(!request||index<0)return {ok:true,mail:'신청 없음 또는 삭제됨'};
    const r=list[index];if(!r[1]||['전송 중','발송 확인 필요'].includes(r[3]))return {ok:true,mail:'확인 필요 또는 삭제됨'};
    if(new Date(r[2])<=new Date()){contacts.getRange(index+2,2).clearContent();return {ok:true,mail:'보관 기한 만료'};}
    if(MailApp.getRemainingDailyQuota()<1)return {ok:true,mail:'발송 한도 대기'};
    // Persist before send. A crash leaves '전송 중' for manual review, never automatic duplicate send.
    r[3]='전송 중';rawWrite_(contacts,index+2,r);SpreadsheetApp.flush();
    try{MailApp.sendEmail({to:r[1],subject:'🎨즐거운 색칠공부🎨 신청하신 도안이 나왔습니다!',body:'안녕하세요? 제안해주신 "'+request[2]+'" 도안을 완성했습니다🧑‍🎨\n사이트로 이동하여 확인해보세요🌟\n'+SITE,name:'즐거운 색칠공부'});}
    catch(_){r[3]='발송 확인 필요';rawWrite_(contacts,index+2,r);return {ok:true,mail:'발송 확인 필요'};}
    // Never rewrite the address after sending.
    contacts.getRange(index+2,2).clearContent();contacts.getRange(index+2,4).setValue('발송 완료');
    return {ok:true,mail:'발송 완료'};
  } finally {lock.releaseLock();}
}
function deleteExpiredEmails() {
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{const {contacts}=sheets_();rows_(contacts).forEach((r,i)=>{if(r[1]&&new Date(r[2])<=new Date()){contacts.getRange(i+2,2).clearContent();contacts.getRange(i+2,4).setValue('기한 만료 삭제');}});}finally{lock.releaseLock();}
}
function doGet() {return HtmlService.createHtmlOutput('즐거운 색칠공부 제안 접수');}
function doPost(e) {
  let p={},result;
  try {
    const input=e.parameter.payload||e.postData.contents;
    if(input.length>8000)throw new Error('입력 내용이 너무 깁니다.');
    p=JSON.parse(input);
    if(p.action){
      const key=PropertiesService.getScriptProperties().getProperty('WORKER_KEY');
      if(!key||p.key!==key)throw new Error('인증 실패');
      if(p.action==='claim')result=claim_();
      else if(p.action==='published')result=published_(p);
      else throw new Error('지원하지 않는 작업');
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    result={ok:true,...submit_(p)};
  } catch(error) {
    result={ok:false,message:p.action?'서버 작업 실패':(error.message.includes('주세요')||error.message.includes('내일')?error.message:'접수하지 못했습니다. 잠시 후 다시 시도해 주세요.')};
    if(p.action)return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
  const body=JSON.stringify({type:'coloring-suggestion-result',requestId:p.requestId,...result}).replace(/</g,'\\u003c');
  // HtmlService runs inside a nested sandbox. Notify the top-level site with an exact target origin.
  return HtmlService.createHtmlOutput('<script>window.top.postMessage('+body+','+JSON.stringify(ORIGIN)+');</script>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
