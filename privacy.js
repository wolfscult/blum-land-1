'use strict';
// No external analytics script, tag, pixel or media is loaded before consent.
const CONSENT='blum_consent_v2';let enabled=false;
const panel=document.createElement('section');panel.id='privacy-choice';panel.setAttribute('aria-label','Настройки cookie');
panel.style.cssText='position:fixed;bottom:18px;left:16px;right:16px;z-index:10000;background:#fff;color:#333;padding:16px 18px;max-width:640px;margin:auto;border:1px solid #e1e1e1;border-radius:6px;box-shadow:0 3px 18px #00000012;font:13px/1.5 Arial,sans-serif';
panel.innerHTML='<p style="margin:0 0 12px">Мы используем файлы cookie для корректной работы сайта и аналитики. <a style="color:inherit;text-decoration:underline" href="/cookies">Подробнее</a></p><div style="display:flex;gap:8px"><button id="consent-yes" style="font:13px Arial,sans-serif;padding:8px 16px;border:1px solid #333;border-radius:4px;background:#333;color:#fff;cursor:pointer">Принять</button><button id="consent-no" style="font:13px Arial,sans-serif;padding:8px 16px;border:1px solid #d2d2d2;border-radius:4px;background:#fff;color:#333;cursor:pointer">Отклонить</button></div>';
document.body.append(panel);
window.blumHasConsent=()=>enabled;window.blumShowConsent=()=>panel.hidden=false;
function choice(value){document.cookie=CONSENT+'='+value+'; Max-Age=15552000; Path=/; Secure; SameSite=Lax';}
function enable(){if(enabled)return;enabled=true;const s=document.createElement('script');s.src='/tracker-bootstrap.js';document.head.append(s);document.querySelectorAll('[data-consent-src]').forEach(el=>el.src=el.dataset.consentSrc);}
function clearTracking(){for(const pair of document.cookie.split(';')){const key=pair.trim().split('=')[0];if(!/^(_ga|_gid|_gat|_gcl|_fbp|_fbc)/.test(key))continue;for(const domain of ['',location.hostname,'.'+location.hostname]){document.cookie=key+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'');}}}
panel.querySelector('#consent-yes').onclick=()=>{choice('yes');panel.hidden=true;enable();};
panel.querySelector('#consent-no').onclick=()=>{choice('no');clearTracking();panel.hidden=true;if(enabled)location.reload();};
const saved=document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(CONSENT+'='));
if(saved){panel.hidden=true;if(saved===CONSENT+'=yes')enable();else clearTracking();}
