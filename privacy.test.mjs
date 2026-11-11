import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');
const privacy=read('./privacy.js');
function fixture(saved=''){
 const scripts=[],buttons={},cookies=[];
 const element=()=>({style:{},setAttribute(){},querySelector(key){return buttons[key]||(buttons[key]={})}});
 const document={body:{append(){}},head:{append(el){scripts.push(el.src)}},createElement:element,querySelectorAll(){return []}};
 Object.defineProperty(document,'cookie',{get(){return saved},set(v){cookies.push(v);saved=v.split(';')[0]}});
 const ctx={document,window:{},location:{hostname:'profblum.org',reload(){ctx.reloaded=true}}};vm.runInNewContext(privacy,ctx);
 return {scripts,buttons,cookies,ctx};
}
test('nothing loads before physical consent; reject leaves trackers blocked',()=>{const f=fixture();assert.deepEqual(f.scripts,[]);f.buttons['#consent-no'].onclick();assert.deepEqual(f.scripts,[]);assert.equal(f.ctx.window.blumHasConsent(),false);});
test('accept loads tracking once and revoke reloads',()=>{const f=fixture();f.buttons['#consent-yes'].onclick();f.buttons['#consent-yes'].onclick();assert.deepEqual(f.scripts,['/tracker-bootstrap.js']);assert.equal(f.ctx.window.blumHasConsent(),true);f.buttons['#consent-no'].onclick();assert.equal(f.ctx.reloaded,true);});
test('old localStorage consent never enables trackers; saved refusal remains blocked',()=>{assert.deepEqual(fixture('blum_cookie=1').scripts,[]);assert.deepEqual(fixture('blum_consent_v2=no').scripts,[]);});
test('both forms contain only contacts, program, travel, channel, consent; no eager trackers',()=>{for(const file of ['index.html','connective.html']){const html=read(file);assert.ok(!/q-age|q-complaint|q-budget|data-val="Telegram"|ipapi\.co/.test(html));assert.ok(!/fbevents\.js|gtm\.js|gtag\/js|oaiq\.min\.js/.test(html));assert.ok(!/<noscript/.test(html));assert.ok(html.includes('name="program"'));assert.ok(html.includes('name="consent"'));assert.ok(!/<textarea/.test(html));assert.ok(!/\ssrc="https:\/\/img.youtube/.test(html));}});
test('disabled routes return 410 including html aliases and thank-you pages',async()=>{const {onRequest}=await import('data:text/javascript;base64,'+Buffer.from(read('./functions/_middleware.js')).toString('base64'));for(const path of ['/it','/it.html','/longevity','/connective-dynamic','/it-thank-you.html','/longevity-thank-you.html']){const r=await onRequest({request:new Request('https://profblum.org'+path),next(){throw Error('disabled route escaped')}});assert.equal(r.status,410);}for(const path of ['/','/connective','/privacy.js','/cookies','/cookies/','/thank-you','/thank-you.html','/connective-thank-you','/connective-thank-you.html'])assert.equal(await onRequest({request:new Request('https://profblum.org'+path),next(){return 'allowed'}}),'allowed');});

test('successful main/connective submissions navigate to their thank-you pages; failures stay on form',async()=>{
 for(const source of ['main','connective'])for(const success of [true,false]){
  let submit;const redirects=[],button={disabled:false},status={textContent:''};
  const values={name:'Test',phone:'+34600000000',email:'test@example.com',program:'Восстановительная программа на 10 дней',travel:'Да',channel:'Email'};
  const form={dataset:{source},reportValidity:()=>true,querySelector:()=>button,addEventListener(event,cb){submit=cb}};
  const document={addEventListener(){},getElementById(id){return id==='contact-form'?form:status}};
  const context={document,FormData:class{get(key){return values[key]}},location:{origin:'https://profblum.org',pathname:source==='main'?'/':'/connective'},window:{location:{assign(url){redirects.push(url)}}},fetch:async()=>({ok:success,json:async()=>({ok:success})})};
  vm.runInNewContext(read('./contact.js'),context);await submit({preventDefault(){},currentTarget:form});
  assert.deepEqual(redirects,success?[source==='main'?'/thank-you':'/connective-thank-you']:[]);
  if(!success){assert.equal(button.disabled,false);assert.ok(status.textContent.includes('Не удалось'));}
 }
});
test('consent copy is short and the floating settings button is absent',()=>{
 for(const name of ['index.html','connective.html']){const html=read(name);assert.ok(html.includes('Я согласен(на) на обработку персональных данных.'));assert.ok(!html.includes('на обработку контактов Cyberconnect'));}
 assert.ok(!privacy.includes("settings=document.createElement('button')"));
 assert.ok(privacy.includes('background:#fff'));
});
