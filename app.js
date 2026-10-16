(()=>{'use strict';
const categories=globalThis.COLORING_CATEGORIES;
const all=new Map();categories.forEach(c=>c.items.forEach(item=>{item.id=item.id||item.image;all.set(item.id,item)}));
const legacy=new Map();['동물','음식','과일·채소','탈것','바다','공룡','자연','우리 집','놀이·운동','우주'].forEach((name,ci)=>{categories.find(c=>c.name===name)?.items.forEach((item,i)=>legacy.set(`${ci}-${i}`,item.id))});
const key='happy-coloring-selection-v1';let stored=[];try{stored=JSON.parse(localStorage.getItem(key)||'[]')}catch{}const selected=new Set(Array.isArray(stored)?stored.map(id=>legacy.get(id)||id).filter(id=>all.has(id)):[]);
let active=0;const $=id=>document.getElementById(id);
const svg=item=>item.image?`<img src="${item.image}" alt="${item.name}" decoding="async">`:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${item.name}"><g fill="white" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${item.svg}</g></svg>`;
function sync(){try{localStorage.setItem(key,JSON.stringify([...selected]))}catch{}$('count').textContent=selected.size;$('printSelected').disabled=!selected.size;$('selectAll').disabled=!categories[active].items.length;$('clearAll').disabled=!selected.size;document.querySelectorAll('.drawing').forEach(card=>{const checked=selected.has(card.dataset.id);card.classList.toggle('selected',checked);card.querySelector('.select-drawing').setAttribute('aria-pressed',String(checked))})}
function render(){document.querySelectorAll('#categories button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));$('gallery').replaceChildren();const fragment=document.createDocumentFragment();categories[active].items.forEach(item=>{const card=document.createElement('article');card.className='drawing';card.dataset.id=item.id;card.innerHTML=`<button class="select-drawing" aria-label="${item.name} 선택" aria-pressed="false"></button><div class="card-top"><h2>${item.name}</h2><button class="print" aria-label="${item.name} 출력">출력</button></div><div class="thumbnail">${svg(item)}</div>`;card.querySelector('.select-drawing').onclick=()=>{selected.has(item.id)?selected.delete(item.id):selected.add(item.id);sync()};card.querySelector('.print').onclick=()=>printItems([item]);fragment.append(card)});$('gallery').append(fragment);sync()}
function printItems(items){if(!items.length)return;const frame=document.createElement('iframe');frame.title='출력하기';frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px;bottom:0;border:0';document.body.append(frame);const doc=frame.contentDocument;doc.open();doc.write(`<!doctype html><html><head><meta charset="utf-8"><title></title><style>@page{size:A4 portrait;margin:12mm}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff}.page{height:272mm;width:100%;display:flex;align-items:center;justify-content:center;break-after:page;page-break-after:always}.page:last-child{break-after:auto;page-break-after:auto}svg,img{width:100%;height:auto;max-height:260mm;object-fit:contain;display:block}</style></head><body>${items.map(item=>`<div class="page">${svg(item)}</div>`).join('')}</body></html>`);doc.close();const cleanup=()=>setTimeout(()=>frame.remove(),1000);frame.contentWindow.addEventListener('afterprint',cleanup,{once:true});const ready=()=>{frame.contentWindow.focus();frame.contentWindow.print()};const images=Array.from(doc.images||[]);if(images.length){Promise.all(images.map(image=>image.decode())).then(ready).catch(()=>{frame.remove();alert("그림을 불러오지 못했습니다. 다시 출력해 주세요.")})}else{setTimeout(ready,120)}}
categories.forEach((c,i)=>{const b=document.createElement('button');b.textContent=c.name;b.onclick=()=>{active=i;render()};$('localCategories').append(b)});
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
$('selectAll').onclick=()=>{categories[active].items.forEach(item=>selected.add(item.id));sync()};$('clearAll').onclick=()=>{selected.clear();sync()};$('printSelected').onclick=()=>printItems([...selected].map(id=>all.get(id)));render();
})();



