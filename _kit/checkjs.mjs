import fs from 'fs';
import {execSync} from 'child_process';
const file=process.argv[2];
const h=fs.readFileSync(file,'utf8');
const m=h.match(/<script>([\s\S]*?)<\/script>/);
if(!m){console.log('no inline script in',file);process.exit(0);}
const tmp=file+'.checkjs.cjs';
fs.writeFileSync(tmp,m[1]);
try{execSync('node --check '+JSON.stringify(tmp),{stdio:'pipe'});console.log('JS OK',file);}
catch(e){console.log('JS ERR',file);console.log(e.stderr?.toString()||e.message);}
finally{fs.unlinkSync(tmp);}
