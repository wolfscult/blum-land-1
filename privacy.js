'use strict';
// No external analytics script, tag, pixel or media is loaded before consent.
const CONSENT='blum_consent_v2';let enabled=false;
const panel=document.createElement('section');panel.id='privacy-choice';panel.setAttribute('aria-label','Настройки cookie');
panel.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;z-index:10000;background:#202020;color:white;padding:20px;max-width:760px;margin:auto;border:1px solid #aaa';
panel.innerHTML='<p>Обязательные cookie сохраняют ваш выбор. Аналитика, реклама и YouTube загружаются только с вашего согласия. <a style="color:white" href="/cookies.html">Список cookie</a></p><button id="consent-yes">Принять</button> <button id="consent-no">Отклонить</button>';
document.body.append(panel);
const settings=document.createElement('button');settings.textContent='Настройки cookie';settings.style.cssText='position:fixed;bottom:0;left:0;z-index:9999';settings.onclick=()=>panel.hidden=false;document.body.append(settings);
window.blumHasConsent=()=>enabled;window.blumShowConsent=()=>panel.hidden=false;
function choice(value){document.cookie=CONSENT+'='+value+'; Max-Age=15552000; Path=/; Secure; SameSite=Lax';}
function enable(){if(enabled)return;enabled=true;const s=document.createElement('script');s.src='/tracker-bootstrap.js';document.head.append(s);document.querySelectorAll('[data-consent-src]').forEach(el=>el.src=el.dataset.consentSrc);}
function clearTracking(){for(const pair of document.cookie.split(';')){const key=pair.trim().split('=')[0];if(!/^(_ga|_gid|_gat|_gcl|_fbp|_fbc)/.test(key))continue;for(const domain of ['',location.hostname,'.'+location.hostname]){document.cookie=key+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'');}}}
panel.querySelector('#consent-yes').onclick=()=>{choice('yes');panel.hidden=true;enable();};
panel.querySelector('#consent-no').onclick=()=>{choice('no');clearTracking();panel.hidden=true;if(enabled)location.reload();};
const saved=document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(CONSENT+'='));
if(saved){panel.hidden=true;if(saved===CONSENT+'=yes')enable();else clearTracking();}
