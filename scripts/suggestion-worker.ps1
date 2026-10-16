param(
  [Parameter(Mandatory=$true)][ValidateSet('claim','published')][string]$Action,
  [string]$RequestId,
  [string]$DisplayTitle
)
$ErrorActionPreference='Stop'
try {
  $repoRoot=Split-Path $PSScriptRoot -Parent
  $settings=Get-Content (Join-Path $repoRoot '.env.local') -Raw -Encoding utf8
  $workerKey=[regex]::Match($settings,'(?m)^COLORING_WORKER_KEY=(.+)$').Groups[1].Value.Trim()
  if(!$workerKey){throw 'missing credential'}
  $config=Get-Content (Join-Path $repoRoot 'config.js') -Raw -Encoding utf8
  $endpoint=[regex]::Match($config,"suggestionEndpoint:'(https://script\.google\.com/macros/s/[\w-]+/exec)'").Groups[1].Value
  if(!$endpoint){throw 'missing endpoint'}
  $payload=@{action=$Action;key=$workerKey}
  if($Action -eq 'published') {
    if($RequestId -notmatch '^[-a-f0-9]{36}$' -or !$DisplayTitle){throw 'invalid request'}
    $payload.requestId=$RequestId
    $payload.displayTitle=$DisplayTitle
  }
  $result=Invoke-RestMethod -Method Post -Uri $endpoint -ContentType 'text/plain;charset=utf-8' -Body ($payload|ConvertTo-Json -Compress) -TimeoutSec 60
  if($result.ok -eq $false){throw 'server rejected request'}
  if($Action -eq 'claim'){
    $items=@($result.items|Where-Object {$_}|ForEach-Object {@{requestId=$_.requestId;title=$_.title;description=$_.description;drawingId=$_.drawingId}})
    @{items=$items}|ConvertTo-Json -Depth 4
  }else{@{ok=$result.ok;mail=$result.mail}|ConvertTo-Json}
}catch {
  Write-Host '제안 작업 연결에 실패했습니다. 배포 주소·관리용 키·Apps Script 실행 상태를 확인해 주세요.'
  exit 1
}
