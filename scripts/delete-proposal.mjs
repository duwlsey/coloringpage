import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

export function readCatalog(root){
  const ctx={};vm.createContext(ctx,{codeGeneration:{strings:false,wasm:false}});
  vm.runInContext(fs.readFileSync(path.join(root,'drawings.js'),'utf8'),ctx,{timeout:2000});
  const value=JSON.parse(JSON.stringify(ctx.COLORING_CATEGORIES));
  if(!Array.isArray(value)||!value.every(c=>typeof c.name==='string'&&Array.isArray(c.items)))throw Error('Invalid catalog');
  return value;
}
export function removeProposal(root,requestId,{dryRun=false}={}){
  if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(requestId||''))throw Error('Invalid request ID');
  const id='suggestion-'+requestId;
  const manifestPath=path.join(root,'deleted-proposals.json');
  const manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):[];
  if(!Array.isArray(manifest))throw Error('Invalid deletion manifest');
  const categories=readCatalog(root),before=JSON.stringify(categories);
  const hits=categories.flatMap(c=>c.items.filter(i=>i.id===id).map(item=>({category:c,item})));
  if(hits.length>1)throw Error('Duplicate drawing ID; refusing deletion');
  if(!hits.length){const old=manifest.find(entry=>entry.id===id);if(!old)throw Error('Selected proposal not found');return {id,changed:false,removedPaths:old.removedPaths};}
  const {category,item}=hits[0];if(category.name!=='제안')throw Error('Only proposal drawings can be deleted');
  const paths=[...new Set([item.image,item.thumbnail].filter(Boolean))];
  for(const file of paths){
    if(typeof file!=='string'||! /^(images|thumbnails)\/[a-zA-Z0-9_./-]+$/.test(file)||file.split('/').some(s=>!s||s==='.'||s==='..'))throw Error('Unsafe image path');
    if(categories.some(c=>c.items.some(i=>i!==item&&(i.image===file||i.thumbnail===file))))throw Error('Image shared by another drawing; refusing deletion');
    const absolute=path.resolve(root,file),base=path.resolve(root)+path.sep;
    if(!absolute.startsWith(base))throw Error('Path escapes repository');
    if(fs.existsSync(absolute)&&(!fs.lstatSync(absolute).isFile()||fs.realpathSync(absolute)!==absolute))throw Error('Symlink or non-file image rejected');
  }
  category.items=category.items.filter(i=>i.id!==id);
  const expected=JSON.parse(before);expected.find(c=>c.name==='제안').items=expected.find(c=>c.name==='제안').items.filter(i=>i.id!==id);
  if(JSON.stringify(categories)!==JSON.stringify(expected))throw Error('Unexpected catalog modification');
  if(!dryRun){
    // Data-only output keeps all other categories and fields semantically unchanged.
    const serialized=JSON.stringify(categories,null,2).replace(/"id": "(suggestion-[0-9a-f-]+)"/gi,"id:'$1'");
    fs.writeFileSync(path.join(root,'drawings.js'),'globalThis.COLORING_CATEGORIES='+serialized+';\n');
    for(const file of paths){const absolute=path.resolve(root,file);if(fs.existsSync(absolute))fs.unlinkSync(absolute);}
    if(!manifest.some(entry=>entry.id===id)){manifest.push({id,removedPaths:paths});fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');}
    if(JSON.stringify(readCatalog(root))!==JSON.stringify(expected))throw Error('Catalog verification failed');
  }
  return {id,changed:true,removedPaths:paths};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const result=removeProposal(root,process.env.REQUEST_ID,{dryRun:process.env.DRY_RUN==='true'});
  fs.writeFileSync(path.join(root,'.proposal-delete-result.json'),JSON.stringify(result));
  console.log(JSON.stringify({id:result.id,changed:result.changed,removedFileCount:result.removedPaths.length,dryRun:process.env.DRY_RUN==='true'}));
}
