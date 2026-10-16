import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const report=JSON.parse(fs.readFileSync(path.join(root,'.proposal-delete-result.json'),'utf8'));
const site='https://duwlsey.github.io/coloringpage/';
async function verify(){
 const html=await fetch(site+'?deletion='+Date.now(),{cache:'no-store'});if(!html.ok)throw Error('Site unavailable');
 const source=(await html.text()).match(/src="(drawings\.js\?v=[a-f0-9]+)"/);if(!source)throw Error('Missing catalog link');
 const data=await fetch(site+source[1],{cache:'no-store'});if(!data.ok||(await data.text()).includes(report.id))throw Error('Drawing still published');
 for(const file of report.removedPaths){const response=await fetch(site+file+'?deletion='+Date.now(),{cache:'no-store'});if(response.status!==404&&response.status!==410)throw Error('Deleted image still accessible');}
}
let lastError;
for(let attempt=0;attempt<24;attempt++){try{await verify();console.log('Verified: selected drawing and its original/thumbnail URLs removed from live site.');process.exit(0)}catch(error){lastError=error;await new Promise(r=>setTimeout(r,10000));}}
console.error(lastError?.message||'Live deletion verification failed');process.exit(1);
