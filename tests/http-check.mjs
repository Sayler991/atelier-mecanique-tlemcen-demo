import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url).pathname;const ctx={window:{}};vm.runInNewContext(fs.readFileSync(root+'config.js','utf8'),ctx);const c=ctx.window.ATELIER_CONFIG;
const results=[];async function check(name,path,method='GET',body){const r=await fetch(c.url+path,{method,headers:{apikey:c.key,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});let data;try{data=await r.json()}catch{data=null}results.push({name,status:r.status});return {r,data}}
const before=await check('anonymous public read','/rest/v1/'+c.table+'?id=eq.main&select=content,revision');assert.equal(before.r.status,200);assert.equal(before.data.length,1);assert.equal(before.data[0].content.phone,'+213549762446');
const update=await check('anonymous update rejected','/rest/v1/'+c.table+'?id=eq.main','PATCH',{revision:777});assert.ok([401,403].includes(update.r.status));
const insert=await check('anonymous insert rejected','/rest/v1/'+c.table,'POST',{id:'main',content:{}});assert.ok([401,403].includes(insert.r.status));
const del=await check('anonymous delete rejected','/rest/v1/'+c.table+'?id=eq.main','DELETE');assert.ok([401,403].includes(del.r.status));
const owners=await check('anonymous owner list rejected','/rest/v1/atelier_tlemcen_owners?select=user_id');assert.ok([401,403].includes(owners.r.status));
const escalation=await check('anonymous membership addition rejected','/rest/v1/atelier_tlemcen_owners','POST',{user_id:'11111111-1111-4111-8111-111111111111'});assert.ok([401,403].includes(escalation.r.status));
const after=await check('public reload confirms row intact','/rest/v1/'+c.table+'?id=eq.main&select=content,revision');assert.deepEqual(after.data,before.data);
const report={time:new Date().toISOString(),scope:'Real Supabase HTTP API, publishable key only; no signed-in credentials',results,passed:results.length};fs.writeFileSync(root+'tests/http-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
