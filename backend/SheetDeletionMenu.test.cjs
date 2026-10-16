const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
let rows=[['header'],[a,'','같은 제목','','완료','','','suggestion-'+a,'같은 제목'],[b,'','같은 제목','','완료','','','suggestion-'+b,'같은 제목']];
const contacts=[['header'],[a,'first@example.com'],[b,'second@example.com']];
const store={DELETE_BOOK_ID:'book'},calls=[];let selectionRow=3,selectionHeight=1,choice='YES',onConfirm=()=>{};
function sheet(name){const data=name==='제안'?rows:contacts;return {getName:()=>name,getLastRow:()=>data.length,getRange:(r,c,n=1,m=1)=>({getValues:()=>data.slice(r-1,r-1+n).map(x=>Array.from({length:m},(_,j)=>x[c-1+j]??'')),getValue:()=>data[r-1]?.[c-1],setValue(v){data[r-1][c-1]=v;return this},setNote(){return this},clearContent(){data[r-1][c-1]=''}})}}
const props={getProperty:k=>store[k],setProperty:(k,v)=>{store[k]=v},getProperties:()=>({...store}),deleteProperty:k=>delete store[k]};
const book={getId:()=> 'book',getSheetByName:sheet,getActiveRangeList:()=>({getRanges:()=>[{getNumRows:()=>selectionHeight,getRow:()=>selectionRow,getSheet:()=>sheet('제안')}]}),toast(){}};
const ui={ButtonSet:{YES_NO:'YES_NO'},Button:{YES:'YES'},alert(...args){if(args.length===3){onConfirm();return choice}}};
const ctx={console,Date,SpreadsheetApp:{getActiveSpreadsheet:()=>book,openById:()=>book,getUi:()=>ui},PropertiesService:{getScriptProperties:()=>props},LockService:{getScriptLock:()=>({waitLock(){},tryLock:()=>true,releaseLock(){}})},Utilities:{getUuid:()=> '33333333-3333-4333-8333-333333333333'},ScriptApp:{getProjectTriggers:()=>[],newTrigger:()=>({timeBased(){return this},everyMinutes(){return this},create(){}}),deleteTrigger(){}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/SheetDeletionMenu.gs','utf8'),ctx);
ctx.deletionGithub_=(method,suffix,payload)=>{calls.push({method,suffix,payload});return {workflow_runs:[{display_title:'Delete proposal '+b+' / 33333333-3333-4333-8333-333333333333',status:'completed',conclusion:'success',html_url:'https://github.com/duwlsey/coloringpage/actions/runs/test'}]}};
selectionHeight=2;ctx.deleteSelectedDrawing();assert.equal(calls.length,0);selectionHeight=1;
choice='NO';ctx.deleteSelectedDrawing();assert.equal(calls.length,0);choice='YES';
onConfirm=()=>{[rows[1],rows[2]]=[rows[2],rows[1]]};ctx.deleteSelectedDrawing();
assert.equal(calls[0].payload.inputs.request_id,b);assert.equal(rows[1][0],b);assert.equal(rows[1][4],'삭제 중');assert.equal(rows[2][4],'완료');
ctx.monitorDeletionJobs();assert.equal(rows[1][4],'삭제 완료');assert.equal(rows[2][4],'완료');assert.equal(contacts[2][1],'');assert.equal(contacts[1][1],'first@example.com');assert(!Object.keys(store).some(k=>k.startsWith('DELETE_JOB_')));
console.log('PASS: single-row selection, cancel, stable UUID after sorting, duplicate titles isolated, dispatch correlation and selected contact cleanup. No real deletion requested.');
