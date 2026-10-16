import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const file of ['style.css','drawings.js','app.js','font-ready.js','config.js']){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
  const escaped=file.replaceAll('.','\\.');
  const pattern=new RegExp('(src|href)="'+escaped+'(?:\\?v=[^"]*)?"','g');
  html=html.replace(pattern,`$1="${file}?v=${hash}"`);
}
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('Updated asset versions.');
