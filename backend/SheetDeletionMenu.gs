/* Install in the proposal spreadsheet's Extensions > Apps Script, NOT the public intake app. */
const DELETE_REPO='duwlsey/coloringpage';
const DELETE_WORKFLOW='delete-proposal.yml';

function onOpen(){
  SpreadsheetApp.getUi().createMenu('도안 관리')
    .addItem('선택한 도안 삭제','deleteSelectedDrawing')
    .addItem('삭제 처리 확인','checkDeletionProgress')
    .addSeparator().addItem('GitHub 연결 확인','setupDrawingDeletion').addToUi();
}
function setupDrawingDeletion(){
  const book=SpreadsheetApp.getActiveSpreadsheet();
  const sheet=book.getSheetByName('제안');
  if(!sheet||sheet.getRange('A1').getValue()!=='접수 ID'||sheet.getRange('H1').getValue()!=='도안 ID')throw new Error('색칠공부 접수함에서 설정해 주세요.');
  const props=PropertiesService.getScriptProperties();
  if(props.getProperty('DELETE_BOOK_ID')&&props.getProperty('DELETE_BOOK_ID')!==book.getId())throw new Error('다른 접수함으로 복사된 설정입니다.');
  deletionGithub_('get','/actions/workflows/'+DELETE_WORKFLOW);
  props.setProperty('DELETE_BOOK_ID',book.getId());onOpen();
  SpreadsheetApp.getUi().alert('연결되었습니다. 제안 탭에서 도안 행 하나를 선택한 뒤 도안 관리 → 선택한 도안 삭제를 누르세요.');
}
function deletionGithub_(method,suffix,payload){
  const token=PropertiesService.getScriptProperties().getProperty('GITHUB_DELETE_TOKEN');
  if(!token)throw new Error('스크립트 속성에 GITHUB_DELETE_TOKEN을 먼저 설정해 주세요.');
  const options={method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},muteHttpExceptions:true};
  if(payload){options.contentType='application/json';options.payload=JSON.stringify(payload);}
  const response=UrlFetchApp.fetch('https://api.github.com/repos/'+DELETE_REPO+suffix,options);
  if(response.getResponseCode()<200||response.getResponseCode()>=300)throw new Error('GitHub 연결 오류 (HTTP '+response.getResponseCode()+'). 토큰 권한과 만료일을 확인해 주세요.');
  return response.getContentText()?JSON.parse(response.getContentText()):{};
}
function deletionBook_(){
  const id=PropertiesService.getScriptProperties().getProperty('DELETE_BOOK_ID');
  if(!id)throw new Error('먼저 도안 관리 → GitHub 연결 확인을 실행해 주세요.');
  return SpreadsheetApp.openById(id);
}
function deletionRow_(book,id){
  const sheet=book.getSheetByName('제안');
  const rows=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,10).getValues():[];
  const hits=rows.map((values,i)=>({values,row:i+2})).filter(r=>r.values[0]===id);
  if(hits.length!==1||hits[0].values[7]!=='suggestion-'+id)throw new Error('해당 도안의 고유 ID를 확인하지 못했습니다.');
  return {sheet,...hits[0]};
}
function deleteSelectedDrawing(){
  const ui=SpreadsheetApp.getUi(),book=SpreadsheetApp.getActiveSpreadsheet();
  if(book.getId()!==deletionBook_().getId())throw new Error('설정된 접수함에서 실행해 주세요.');
  const selection=book.getActiveRangeList();const ranges=selection?selection.getRanges():[];
  if(ranges.length!==1||ranges[0].getNumRows()!==1||ranges[0].getRow()<2||ranges[0].getSheet().getName()!=='제안'){
    ui.alert('제안 탭에서 삭제할 도안의 행 하나만 선택해 주세요.');return;
  }
  const selected=book.getSheetByName('제안').getRange(ranges[0].getRow(),1,1,10).getValues()[0];
  const id=String(selected[0]);
  if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)||selected[7]!=='suggestion-'+id){ui.alert('공개된 제안 도안의 고유 ID가 있는 행을 선택해 주세요.');return;}
  if(!['완료','삭제 실패'].includes(selected[4])){ui.alert('공개 완료된 도안만 삭제할 수 있습니다. 현재 상태: '+selected[4]);return;}
  const title=selected[8]||selected[2];
  const choice=ui.alert('선택한 도안 삭제','도안: '+title+'\n고유 ID: '+selected[7]+'\n\n이 도안의 사이트 목록·원본·미리보기 파일을 삭제하고 배포합니다. 다른 도안은 유지합니다. GitHub 과거 기록과 이미 다운로드한 사본은 남을 수 있습니다.\n\n삭제할까요?',ui.ButtonSet.YES_NO);
  if(choice!==ui.Button.YES)return;
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    const fresh=deletionRow_(book,id); // Resolve by UUID again after confirmation, even if rows moved.
    if(!['완료','삭제 실패'].includes(fresh.values[4]))throw new Error('상태가 바뀌었습니다. 행을 다시 확인해 주세요.');
    const props=PropertiesService.getScriptProperties(),operation=Utilities.getUuid();
    props.setProperty('DELETE_JOB_'+id,JSON.stringify({id,operation,requestedAt:new Date().toISOString()}));
    fresh.sheet.getRange(fresh.row,5).setValue('삭제 중').setNote('선택한 도안만 삭제·배포하는 중입니다. 도안 관리 → 삭제 처리 확인에서 확인할 수 있습니다.');
    ensureDeletionMonitor_();
    try{deletionGithub_('post','/actions/workflows/'+DELETE_WORKFLOW+'/dispatches',{ref:'main',inputs:{request_id:id,operation_id:operation,dry_run:false}});}
    catch(error){fresh.sheet.getRange(fresh.row,5).setNote(error.message+'\n요청 수신 여부를 자동 확인 중입니다. 중복 클릭하지 마세요.');ui.alert('삭제 요청 결과를 확인 중입니다. 잠시 후 도안 관리 → 삭제 처리 확인을 눌러 주세요.');return;}
    book.toast('선택한 도안의 삭제·배포를 시작했습니다. 보통 수 분 정도 걸립니다.','도안 삭제',8);
  }finally{lock.releaseLock();}
}
function ensureDeletionMonitor_(){
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='monitorDeletionJobs'))ScriptApp.newTrigger('monitorDeletionJobs').timeBased().everyMinutes(1).create();
}
function monitorDeletionJobs(){
  const lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;
  try{
    const props=PropertiesService.getScriptProperties();const jobs=Object.entries(props.getProperties()).filter(([key])=>key.startsWith('DELETE_JOB_'));
    if(!jobs.length){ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='monitorDeletionJobs').forEach(t=>ScriptApp.deleteTrigger(t));return;}
    const book=deletionBook_();
    const runs=deletionGithub_('get','/actions/workflows/'+DELETE_WORKFLOW+'/runs?event=workflow_dispatch&per_page=100').workflow_runs||[];
    for(const [key,json] of jobs){
      const job=JSON.parse(json),target=deletionRow_(book,job.id);
      const run=runs.find(r=>r.display_title==='Delete proposal '+job.id+' / '+job.operation);
      if(run&&run.status==='completed'){
        if(run.conclusion==='success'){
          target.sheet.getRange(target.row,5).setValue('삭제 완료').setNote('실제 사이트와 이미지 URL의 삭제를 확인했습니다.\n'+run.html_url);
          const contacts=book.getSheetByName('알림');
          if(contacts&&contacts.getLastRow()>1){const ids=contacts.getRange(2,1,contacts.getLastRow()-1,1).getValues();ids.forEach((r,i)=>{if(r[0]===job.id)contacts.getRange(i+2,2).clearContent();});}
        }else target.sheet.getRange(target.row,5).setValue('삭제 실패').setNote('삭제 또는 배포 검증에 실패했습니다. 일부 삭제가 반영되었을 수 있습니다. 실패 원인을 확인한 뒤 같은 행으로 재시도할 수 있습니다.\n'+run.html_url);
        props.deleteProperty(key);
      }else if(Date.now()-new Date(job.requestedAt).getTime()>30*60000){
        target.sheet.getRange(target.row,5).setValue('삭제 실패').setNote('30분 이내 완료를 확인하지 못했습니다. GitHub Actions 상태를 확인한 뒤 재시도해 주세요.');props.deleteProperty(key);
      }
    }
  }finally{lock.releaseLock();}
}
function checkDeletionProgress(){monitorDeletionJobs();SpreadsheetApp.getActiveSpreadsheet().toast('제안 탭의 상태와 상태 셀 메모에서 확인하세요.','삭제 처리 확인',6);}
