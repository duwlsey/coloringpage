import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {removeProposal,readCatalog} from './delete-proposal.mjs';
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'coloring-delete-test-'));
function fixture(items){fs.writeFileSync(path.join(root,'drawings.js'),'globalThis.COLORING_CATEGORIES='+JSON.stringify([{name:'상상',items:[{id:'basic',name:'기본 도형',svg:'<circle/>'}]},{name:'제안',items}])+';');fs.writeFileSync(path.join(root,'deleted-proposals.json'),'[]');}
try{
 for(const dir of ['images/proposals','thumbnails/proposals'])fs.mkdirSync(path.join(root,dir),{recursive:true});
 const first={id:'suggestion-'+a,name:'같은 제목',image:'images/proposals/first.png',thumbnail:'thumbnails/proposals/first.webp'};
 const second={id:'suggestion-'+b,name:'같은 제목',svg:'<rect/>'};
 for(const file of [first.image,first.thumbnail])fs.writeFileSync(path.join(root,file),'fixture');
 fixture([first,second]);const initial=fs.readFileSync(path.join(root,'drawings.js'),'utf8');
 assert.throws(()=>removeProposal(root,'../../file'),/Invalid/);
 assert.equal(removeProposal(root,a,{dryRun:true}).removedPaths.length,2);assert.equal(fs.readFileSync(path.join(root,'drawings.js'),'utf8'),initial);
 removeProposal(root,a);assert.equal(readCatalog(root)[1].items.length,1);assert.equal(readCatalog(root)[1].items[0].id,second.id);assert.equal(readCatalog(root)[0].items[0].id,'basic');
 assert(fs.readFileSync(path.join(root,'drawings.js'),'utf8').includes("id:'suggestion-"+b+"'"));
 assert(!fs.existsSync(path.join(root,first.image)));assert(!fs.existsSync(path.join(root,first.thumbnail)));
 assert.equal(removeProposal(root,a).changed,false);assert.equal(removeProposal(root,a).removedPaths.length,2);
 fixture([first,{...second,image:first.image}]);assert.throws(()=>removeProposal(root,a),/shared/);
 fixture([{...first,image:'images/../../outside.png'}]);assert.throws(()=>removeProposal(root,a),/Unsafe/);
 fixture([first,{...first}]);assert.throws(()=>removeProposal(root,a),/Duplicate/);
 fixture([second]);assert.throws(()=>removeProposal(root,a),/not found/);
 console.log('PASS: exact ID, duplicate titles preserved, originals/thumbnails removed, other categories unchanged, dry run, safe retry, shared/path/duplicate safeguards.');
}finally{const allowed=path.resolve(os.tmpdir())+path.sep+'coloring-delete-test-';if(!path.resolve(root).startsWith(allowed))throw Error('Unsafe cleanup path');fs.rmSync(root,{recursive:true,force:true});}
