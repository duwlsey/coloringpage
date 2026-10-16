(()=>{'use strict';
const categories=globalThis.COLORING_CATEGORIES;
if(!categories.some(c=>c.name==='제안'))categories.push({name:'제안',items:[]});
const all=new Map();categories.forEach(c=>c.items.forEach(item=>{item.id=item.id||item.image;all.set(item.id,item)}));
const selected=new Set();try{localStorage.removeItem('happy-coloring-selection-v1')}catch{}
let active=0,query='';const $=id=>document.getElementById(id);
const visibleItems=()=>query?categories.flatMap(c=>c.items).filter(item=>[item.name,...(item.tags||[])].join(' ').normalize('NFKC').toLocaleLowerCase('ko').includes(query)):categories[active].items;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function submitSuggestion(endpoint,payload){
return new Promise((resolve,reject)=>{
if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)){reject(new Error('제안 접수 연결을 확인 중입니다.'));return}
const frame=document.createElement('iframe');frame.name='suggestion-'+crypto.randomUUID();frame.hidden=true;frame.title='제안 접수';
const form=document.createElement('form');form.hidden=true;form.method='POST';form.action=endpoint;form.target=frame.name;
const field=document.createElement('input');field.type='hidden';field.name='payload';field.value=JSON.stringify(payload);form.append(field);
let timeout;const clean=()=>{clearTimeout(timeout);globalThis.removeEventListener('message',receive);form.remove();frame.remove()};
const receive=event=>{let origin;try{origin=new URL(event.origin)}catch{return}if(origin.protocol!=='https:'||!(origin.hostname==='script.google.com'||origin.hostname==='script.googleusercontent.com'||origin.hostname.endsWith('-script.googleusercontent.com')))return;const data=event.data;if(data?.type!=='coloring-suggestion-result'||data.requestId!==payload.requestId)return;clean();if(!data.ok){reject(new Error(data.message||'접수하지 못했습니다. 다시 시도해 주세요.'));return}if(!Number.isInteger(data.days)||data.days<0||!/^\d{4}\.\d{2}\.\d{2}$/.test(data.date)){reject(new Error('접수 결과를 확인하지 못했습니다. 같은 내용으로 다시 제출해 주세요.'));return}resolve(data)};
globalThis.addEventListener('message',receive);document.body.append(frame);document.body.append(form);timeout=setTimeout(()=>{clean();reject(new Error('접수 확인이 지연되고 있습니다. 같은 내용으로 다시 제출해 주세요.'))},45000);form.submit();
});}
const svg=(item,preview=false)=>item.image?`<img src="${preview?(item.thumbnail||item.image):item.image}" alt="${escapeHTML(item.name)}" loading="${preview?'lazy':'eager'}" decoding="async">`:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${escapeHTML(item.name)}"><g fill="white" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${item.svg}</g></svg>`;
function sync(){$('count').textContent=selected.size;$('printSelected').disabled=!selected.size;$('selectAll').disabled=!visibleItems().length;$('clearAll').disabled=!selected.size;document.querySelectorAll('.drawing').forEach(card=>{const checked=selected.has(card.dataset.id);card.classList.toggle('selected',checked);card.querySelector('.select-drawing').setAttribute('aria-pressed',String(checked))})}
function render(){document.querySelectorAll('#categories button').forEach((b,i)=>b.setAttribute('aria-pressed',String(!query&&i===active)));$('suggestionArea').hidden=!!query||categories[active].name!=='제안';const items=visibleItems();$('emptyResults').hidden=!query||items.length>0;$('gallery').replaceChildren();const fragment=document.createDocumentFragment();items.forEach(item=>{const card=document.createElement('article');card.className='drawing';card.dataset.id=item.id;const name=escapeHTML(item.name);card.innerHTML=`<button class="select-drawing" aria-label="${name} 선택" aria-pressed="false"></button><div class="card-top"><h2>${name}</h2><button class="print" aria-label="${name} 출력">출력</button></div><div class="thumbnail">${svg(item,true)}</div>`;card.querySelector('.select-drawing').onclick=()=>{selected.has(item.id)?selected.delete(item.id):selected.add(item.id);sync()};card.querySelector('.print').onclick=()=>printItems([item]);fragment.append(card)});$('gallery').append(fragment);sync()}
function printItems(items){if(!items.length)return;const frame=document.createElement('iframe');frame.title='출력하기';frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px;bottom:0;border:0';document.body.append(frame);const doc=frame.contentDocument;doc.open();doc.write(`<!doctype html><html><head><meta charset="utf-8"><title></title><style>@page{size:A4 portrait;margin:12mm}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff}.page{height:272mm;width:100%;display:flex;align-items:center;justify-content:center;break-after:page;page-break-after:always}.page:last-child{break-after:auto;page-break-after:auto}svg,img{width:100%;height:auto;max-height:260mm;object-fit:contain;display:block}</style></head><body>${items.map(item=>`<div class="page">${svg(item)}</div>`).join('')}</body></html>`);doc.close();const cleanup=()=>setTimeout(()=>frame.remove(),1000);frame.contentWindow.addEventListener('afterprint',cleanup,{once:true});const ready=()=>{frame.contentWindow.focus();frame.contentWindow.print()};const images=Array.from(doc.images||[]);if(images.length){Promise.all(images.map(image=>image.decode())).then(ready).catch(()=>{frame.remove();alert("그림을 불러오지 못했습니다. 다시 출력해 주세요.")})}else{setTimeout(ready,120)}}
categories.forEach((c,i)=>{const b=document.createElement('button');b.textContent=c.name;if(c.name==='제안')b.className='proposal-category';b.onclick=()=>{active=i;query='';$('drawingSearch').value='';render()};$('localCategories').append(b)});
const externalSites=[
['Pinterest','https://kr.pinterest.com/'],
['Monday Mandala','https://mondaymandala.com/'],
['Disneyclips','https://www.disneyclips.com/funstuff/coloring-pages.html'],
['Supercoloring','https://www.supercoloring.com/'],
['Crayola','https://www.crayola.com/en/free-coloring-pages'],
['Just Color Kids','https://www.justcolor.net/kids/'],
['Coloring.ws','https://www.coloring.ws/']
];
externalSites.forEach(([name,url])=>{const link=document.createElement('a');link.className='external-category';link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=name;link.setAttribute('aria-label',`${name} (새 탭)`);const icon=document.createElement('span');icon.textContent='↗';icon.setAttribute('aria-hidden','true');link.append(icon);$('externalCategories').append(link)});
$('selectAll').onclick=()=>{visibleItems().forEach(item=>selected.add(item.id));sync()};$('clearAll').onclick=()=>{selected.clear();sync()};$('printSelected').onclick=()=>printItems([...selected].map(id=>all.get(id)));render();
$('searchForm').onsubmit=event=>{event.preventDefault();query=$('drawingSearch').value.trim().normalize('NFKC').toLocaleLowerCase('ko');render()};
$('drawingSearch').oninput=()=>{if(!$('drawingSearch').value){query='';render()}};
$('openSuggestion').onclick=()=>{const ready=!!globalThis.COLORING_CONFIG?.suggestionEndpoint;$('suggestionStatus').textContent=ready?'':'제안 접수를 준비 중입니다.';$('submitSuggestion').disabled=!ready;$('suggestionDialog').showModal()};
$('closeSuggestion').onclick=()=>$('suggestionDialog').close();
$('notifyConsent').onchange=()=>{const enabled=$('notifyConsent').checked;$('notificationEmail').disabled=!enabled;$('notificationEmail').required=enabled;if(!enabled)$('notificationEmail').value=''};
$('suggestionForm').onsubmit=async event=>{
event.preventDefault();const status=$('suggestionStatus');const endpoint=globalThis.COLORING_CONFIG?.suggestionEndpoint;
if(!endpoint){status.textContent='아직 제안 접수를 준비 중입니다. 잠시 후 다시 이용해 주세요.';return}
const button=$('submitSuggestion');button.disabled=true;
try{const form=$('suggestionForm');const payload={title:$('suggestionTitle').value.trim(),description:$('suggestionDescription').value.trim(),notify:$('notifyConsent').checked,email:$('notifyConsent').checked?$('notificationEmail').value.trim():null,website:$('suggestionWebsite').value,requestId:form.dataset.requestId||(form.dataset.requestId=crypto.randomUUID())};
const result=await submitSuggestion(endpoint,payload);
status.textContent=`제안이 접수되었습니다. 약 ${result.days}일 후 도안이 업데이트될 예정입니다. 예상 업데이트: ${result.date} 오전 8시 이후`;
form.reset();delete form.dataset.requestId;$('notificationEmail').disabled=true;$('notificationEmail').required=false;
}catch(error){status.textContent=error.name==='TimeoutError'?'접수 확인이 지연되고 있습니다. 같은 내용으로 다시 제출해 주세요.':error.message}finally{button.disabled=false}};
globalThis.addEventListener?.('pageshow',event=>{if(event.persisted){selected.clear();active=0;render()}});
})();
